#!/usr/bin/env python3
"""Regenerate references/catalog.md from the fonts.zander.wtf font data.

Usage:
  python3 build_catalog.py                       # fetch https://fonts.zander.wtf/fonts.json
  python3 build_catalog.py http://127.0.0.1:4683 # fetch from a local dev server
  python3 build_catalog.py path/to/fonts.json    # read a local JSON file
"""

import json
import sys
import urllib.request
from pathlib import Path

CATEGORY_ORDER = ["sans-serif", "serif", "mono", "pixel", "display"]
CATEGORY_INTRO = {
    "sans-serif": "Workhorse and character sans faces. First stop for UI, product, and marketing body text.",
    "serif": "Text and display serifs. First stop for editorial, long-form, and refined branding.",
    "mono": "Monospaced faces for code, terminals, tabular data, and technical branding.",
    "pixel": "Bitmap/pixel faces for retro, game, terminal, and lo-fi aesthetics. Display use only — not for body text.",
    "display": "Headline and personality faces. Pair with a quieter text face; avoid for body copy.",
}


def load(source: str):
    if source.startswith("http"):
        url = source.rstrip("/") + "/fonts.json" if not source.endswith(".json") else source
        with urllib.request.urlopen(url) as res:
            return json.load(res)
    return json.loads(Path(source).read_text())


def font_entry(f):
    lines = [f"### {f['name']}"]
    meta = []
    if f.get("variable"):
        axes = ", ".join(f.get("axes", []))
        meta.append(f"variable ({axes})" if axes else "variable")
    else:
        weights = f.get("weights", [])
        meta.append(
            f"static (weights {', '.join(map(str, weights))})" if len(weights) > 1 else "static"
        )
    meta.append(f"licence: {f['licence']}")
    if f.get("googleFonts"):
        # googleFonts may carry a css2 axis spec after a colon — strip it for the family name
        meta.append(f"Google Fonts: \"{f['googleFonts'].split(':')[0]}\"")
    else:
        meta.append("self-host only")
    if f.get("fontsource"):
        meta.append(f"Fontsource: `{f['fontsource']}`")
    lines.append(f"*{' · '.join(meta)}*")
    lines.append("")
    lines.append(f["description"])
    spec = f.get("googleFontsSpec") or f.get("googleFonts")
    if spec:
        lines.append("")
        lines.append(f"css2 spec: `{spec}`")
    if f.get("features"):
        feats = ", ".join(f"{feat['label']} (`{feat['tag']}`)" for feat in f["features"])
        lines.append("")
        lines.append(f"OpenType feature toggles: {feats}.")
    designer = f.get("designer", "")
    foundry = f.get("foundry")
    credit = f"Designed by {designer}" + (f" ({foundry})" if foundry and foundry not in designer else "")
    lines.append("")
    lines.append(f"{credit}. [Specimen]({f['url']}) · [Website]({f['website']})")
    if f.get("notes"):
        lines.append("")
        lines.append(f["notes"])
    return "\n".join(lines)


def main():
    source = sys.argv[1] if len(sys.argv) > 1 else "https://fonts.zander.wtf/fonts.json"
    fonts = load(source)
    out = [
        "# Font catalog — fonts.zander.wtf",
        "",
        f"{len(fonts)} hand-picked free fonts, grouped by category. "
        "Live data: https://fonts.zander.wtf/fonts.json — each font also has a specimen page for visual preview.",
        "",
        "Entry metadata: `css2 spec` is the exact Google Fonts css2 `family=` value covering "
        "every weight/axis range; `Fontsource` is the npm package name. "
        "OpenType feature toggles are stripped from Google Fonts and Fontsource builds — "
        "self-host the original files to use them.",
        "",
    ]
    for cat in CATEGORY_ORDER:
        group = sorted((f for f in fonts if f["category"] == cat), key=lambda f: f["name"])
        if not group:
            continue
        out.append(f"## {cat} ({len(group)})")
        out.append("")
        out.append(CATEGORY_INTRO[cat])
        out.append("")
        for f in group:
            out.append(font_entry(f))
            out.append("")
    dest = Path(__file__).resolve().parent.parent / "references" / "catalog.md"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text("\n".join(out))
    print(f"Wrote {dest} ({len(fonts)} fonts)")


if __name__ == "__main__":
    main()
