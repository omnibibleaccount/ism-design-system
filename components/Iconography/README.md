# Iconography
Two icon sets: filled ministry icons for features and illustrations, and a thin line set for interface controls, plus the direction rule for carets and arrows.

## When to use
- **Ministry icons** (`assets/icons/*.svg`, filled, 24dp Material-style): feature lists, stat tiles, "how it works" steps, partner and outreach content. Examples: bible, radio, satellite, translate, folded-hands, church, handshake, qr-code.
- **UI line icons** (inline SVG): buttons, fields, navigation, app bars, list rows, toasts. Search, close, menu, chevrons, arrows, play, share, download, check.
- Do not mix the two sets inside one control or one row of features.

## Anatomy & markup
Ministry icon as an image (renders black; invert on dark):

```html
<img class="icon" src="assets/icons/translate.svg" width="32" height="32" alt="">
<img class="icon" src="assets/icons/translate.svg" width="32" height="32" alt="" style="filter:brightness(0) invert(1)">
```

UI line icon, inline:

```html
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M6 9l6 6 6-6"/>
</svg>
```

## Variants & states
- **Sizes:** UI icons 16 (inline with small text), 20 (buttons, fields, nav), 24 (app bars, tab bars). Ministry icons 24, 32, 48.
- **Colour:** UI icons inherit `currentColor`. Ministry icons are black on light and inverted on dark. Inside a tinted tile, place the icon on `--blue-tint` with the tile at `--radius-md`.
- **Interactive:** an icon-only control is an IconButton: 44px tap target, visible focus ring.

## Rules
- **Direction rule (always):**
  - Down caret ⌄ means it **opens or expands here** (menus, selects, accordions, sub-navigation).
  - Diagonal arrow ↗ means it **goes to another page** or site.
  - Right chevron › means it **drills into a screen inside an app** (list rows, settings).
  - A plain right arrow → is for a primary "continue" action only.
- UI line icons: 24 viewBox, `stroke="currentColor"`, stroke-width 1.8 (1.6–2.2), round caps and joins, no fill.
- Never colour icons with status colours unless the icon IS the status (alert, toast, field error).
- Notification dots and counts on icons are Horizon Blue (`.count`, `--horizon-blue`), never red.
- No emoji as icons.

## Accessibility
- Decorative icons: `aria-hidden="true"` or `alt=""`.
- Icon-only buttons need an `aria-label` ("Search", "Close", "Open menu").
- Never use an icon as the only signal of state; pair it with text.

## Content
- Pair ministry icons with short labels: "500+ languages", "HD Radio", "Offline audio", "Share with a TAP card".
