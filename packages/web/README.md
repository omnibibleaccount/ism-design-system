# @ism/web

Plain HTML and CSS.

- `css/ism.css`: tokens, components, interaction states, per-script typography (one file). Fonts resolve from `../assets/fonts/`.
- `css/rtl.css`: generated `[dir="rtl"]` overrides. Load after `ism.css` and set `dir="rtl"` for Arabic, Urdu, Farsi.
- Individual layers: `tokens.css`, `bundle.css`, `states.css`, `scripts.css`, `rtl-extra.css`.
- `assets/`: fonts (variable and static), ministry icons, UI line icons, logos, patterns, imagery.

Class names and markup for each component are in `components/<Name>/README.md` and `spec.json`. Build with `npm run build --workspace @ism/web`.
