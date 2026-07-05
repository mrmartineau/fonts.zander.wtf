---
name: "Inter"
category: "sans-serif"
style: "Variable (wght, opsz, slnt)"
variable: true
axes:
  - "wght"
  - "opsz"
  - "slnt"
description: "Workhorse UI typeface with a tall x-height, legible from small text to signage."
designer: "Rasmus Andersson"
licence: "OFL"
website: "https://rsms.me/inter/"
googleFonts: "Inter"
# Google's pipeline strips OpenType features — detail page loads the full
# InterVariable build from rsms.me instead (homepage still uses Google 400)
previewFont: "https://rsms.me/inter/font-files/InterVariable.woff2?v=4.1"
links:
  - label: "Google Fonts"
    url: "https://fonts.google.com/specimen/Inter"
  - label: "Source"
    url: "https://github.com/rsms/inter"
features:
  - { tag: "tnum", label: "Tabular numbers" }
  - { tag: "zero", label: "Slashed zero" }
  - { tag: "ss01", label: "Open digits" }
  - { tag: "dlig", label: "Discretionary ligatures" }
  - { tag: "frac", label: "Fractions" }
  - { tag: "case", label: "Uppercase punctuation" }
weights: [100, 200, 300, 400, 500, 600, 700, 800, 900]
axesRanges:
  [
    { tag: "opsz", min: 14, max: 32, default: 14 },
    { tag: "wght", min: 100, max: 900, default: 400 },
  ]
googleFontsSpec: "Inter:opsz,wght@14..32,100..900"
---
