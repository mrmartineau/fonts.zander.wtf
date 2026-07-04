// @ts-check
import { defineConfig } from "astro/config";

// Fully static build deployed as Cloudflare Workers static assets
// (see wrangler.jsonc). Add @astrojs/cloudflare adapter if SSR is ever needed.
// https://astro.build/config
export default defineConfig({
  site: "https://fonts.zander.wtf",
});
