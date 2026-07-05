// Enrich font frontmatter with Google Fonts metadata: weights, axesRanges,
// and googleFontsSpec (the detail-page css2 request). Idempotent — run it
// after adding new fonts: node scripts/enrich-google-fonts.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "../src/content/fonts");

// css2 axis order: lowercase alphabetical first, then uppercase alphabetical
const cmpAxes = (a, b) => {
  const aLower = a.tag === a.tag.toLowerCase();
  const bLower = b.tag === b.tag.toLowerCase();
  if (aLower !== bLower) return aLower ? -1 : 1;
  return a.tag < b.tag ? -1 : 1;
};

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
  const path = join(DIR, file);
  let src = readFileSync(path, "utf8");
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) continue;
  const fm = match[1];
  const gf = fm.match(/^googleFonts:\s*["']?([^"'\n]+)["']?\s*$/m);
  if (!gf) continue;
  const family = gf[1].split(":")[0].trim();

  const res = await fetch(`https://fonts.google.com/metadata/fonts/${encodeURIComponent(family)}`);
  if (!res.ok) {
    console.error(`SKIP ${file}: HTTP ${res.status} for "${family}"`);
    continue;
  }
  const meta = JSON.parse((await res.text()).replace(/^\)\]\}'/, ""));
  const axes = (meta.axes ?? []).slice().sort(cmpAxes);
  const weights = [
    ...new Set(
      Object.keys(meta.fonts ?? {})
        .filter((k) => !k.endsWith("i"))
        .map((k) => Number.parseInt(k, 10)),
    ),
  ].sort((a, b) => a - b);

  const lines = [];
  if (weights.length) lines.push(`weights: [${weights.join(", ")}]`);
  if (axes.length) {
    lines.push(
      `axesRanges: [${axes
        .map((a) => `{ tag: "${a.tag}", min: ${a.min}, max: ${a.max}, default: ${a.defaultValue} }`)
        .join(", ")}]`,
    );
  }
  let spec;
  if (axes.length) {
    spec = `${family}:${axes.map((a) => a.tag).join(",")}@${axes
      .map((a) => `${a.min}..${a.max}`)
      .join(",")}`;
  } else if (weights.length > 1 || (weights.length === 1 && weights[0] !== 400)) {
    spec = `${family}:wght@${weights.join(";")}`;
  }
  if (spec) lines.push(`googleFontsSpec: "${spec}"`);

  // Strip previous runs' fields (including formatter-wrapped axesRanges
  // continuation lines), then insert fresh ones before the closing ---
  const kept = [];
  let skipping = false;
  for (const line of fm.split("\n")) {
    if (/^(weights|axesRanges|googleFontsSpec):/.test(line)) {
      skipping = true;
      continue;
    }
    if (skipping && /^\s/.test(line)) continue;
    skipping = false;
    kept.push(line);
  }
  src = src.replace(match[0], `---\n${kept.join("\n")}\n${lines.join("\n")}\n---`);
  writeFileSync(path, src);
  console.log(`${file}: ${lines.join(" | ") || "no extras"}`);
}
