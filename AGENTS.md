# fonts.zander.wtf — Free Fonts

A curated showcase of free, high-quality typefaces at https://fonts.zander.wtf. Static Astro site styled with ZUI, deployed to Cloudflare Workers via GitHub Actions.

## Stack

- **Astro 7** — fully static output (no adapter, no SSR)
- **ZUI** (`@mrmartineau/zui`) — CSS-first UI library, Astro component wrappers
- **Vite+** (`vp`) — formatting, linting, type checking
- **pnpm** — package manager
- **Cloudflare Workers** — static assets deploy, config in `wrangler.jsonc`

## Commands

```sh
pnpm dev        # dev server (portless run astro dev)
pnpm build      # astro build → dist/
vp check        # format + lint + type check (--fix to auto-fix)
pnpm deploy     # build + wrangler deploy (needs Cloudflare auth)
```

CI: `.github/workflows/deploy.yml` deploys on push to `main` (needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` repo secrets); `security.yml` runs the Aikido safe-chain scan on every branch.

## Architecture

- `src/content/fonts/*.md` — one file per typeface (62 fonts). Schema in `src/content.config.ts`:
  - `category`: `sans-serif | serif | mono | pixel | display`
  - `googleFonts`: family name when hosted on Google Fonts (drives live previews)
  - `previewFont`: path to a self-hosted file in `public/fonts/<slug>/` for fonts NOT on Google Fonts
  - plus `name`, `style`, `variable`, `axes`, `description`, `designer`, `foundry`, `licence`, `website`, `links`
- `src/pages/index.astro` — homepage: full-width cards per category, each showing the font name rendered in the font itself; contenteditable shared preview text (edit one card → all update); fuzzy filter (type anywhere); floating reset X.
- `src/pages/fonts/[slug].astro` — detail page: editable centred preview hero with size slider, waterfall/character-set/paragraph specimen, details list, prev/next within category.
- `src/layouts/Layout.astro` — head, shared footer.
- `src/styles/global.css` — token overrides only (neutral theme, `--radius-scale`); ZUI owns reset/base layers.
- `public/fonts/<slug>/` — self-hosted font files for the ~20 fonts not on Google Fonts.
- `Free Fonts showcase.md` — original source document the content collection was generated from. Content files are now hand-maintained; edit them directly, not the source doc.

## Font preview loading

- Homepage loads ALL preview fonts upfront: one combined Google Fonts `css2` request (40 families, regular 400 only) + inline `@font-face` rules for self-hosted files.
- Detail pages load only their own font. Self-hosted fonts get the family name `"<Name> Preview"`.
- Google Sans (proprietary) and Analog Mono (itch.io checkout only) have no preview.

## Gotchas

- **ZUI barrel import is broken** in the published package (`src/core/` not shipped; Menu/Tabs reference it). Always deep-import: `import Card from "@mrmartineau/zui/astro/Card.astro"` — never `from "@mrmartineau/zui/astro"`.
- **`hidden` attribute vs ZUI display rules**: ZUI components set `display` (e.g. `.zui-button { display: inline-flex }`), which beats the UA `[hidden]` rule. Any element you toggle with `hidden` needs an explicit `[hidden] { display: none }` override. This has bitten three times (font cards, both reset buttons).
- **Styling**: override ZUI CSS custom properties/tokens (`--zui-card-radius`, `--color-theme`, …), don't hard-code values or fight the cascade.
- `vp check --fix` reformats aggressively (including markdown) — run it before committing.

## Documentation

- Astro: https://docs.astro.build (routing, content collections, components)
- ZUI usage: the `using-zui` skill / ZUI docs
- Vite+: `node_modules/vite-plus/docs` or https://viteplus.dev/guide/

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
