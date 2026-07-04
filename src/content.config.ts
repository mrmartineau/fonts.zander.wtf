import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const fonts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/fonts" }),
  schema: z.object({
    name: z.string(),
    category: z.enum(["sans-serif", "serif", "mono", "pixel", "display"]),
    style: z.string(),
    variable: z.boolean(),
    axes: z.array(z.string()).default([]),
    description: z.string(),
    designer: z.string(),
    foundry: z.string().optional(),
    licence: z.string(),
    website: z.string().url(),
    googleFonts: z.string().optional(),
    previewFont: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  }),
});

export const collections = { fonts };
