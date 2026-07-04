import { getCollection } from "astro:content";

export async function GET() {
  const fonts = await getCollection("fonts");
  const payload = fonts
    .map((font) => ({
      slug: font.id,
      url: `https://fonts.zander.wtf/fonts/${font.id}/`,
      ...font.data,
      notes: font.body?.trim() || undefined,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return new Response(JSON.stringify(payload, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
}
