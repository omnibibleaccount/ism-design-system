# Logos
The ISM and dot.Bible logos, marks and brand patterns, with the rules for placing them on light and dark surfaces.

## When to use
- Use the **ISM full logo** in the site header, footer, print covers and email headers.
- Use the **ISM mark** where space is tight: favicons, avatars, app tiles for ISM itself, social profile images.
- Use the **dot.Bible full logo** wherever the dot.Bible app is the subject (app banners, store pages, app promos). Use the **dot.Bible icon** for the app tile and small placements.
- Use the **patterns** (Circle-symbol-1, Dots 1–5) as quiet background texture on campaign, print and hero art. Never behind body text.
- Do not redraw, recolour, stretch, outline or add effects to any logo.

## Anatomy & markup
All logo files are drawn in black ink. On dark surfaces invert them with a filter; do not use the "White" files (they render black).

```html
<!-- light surface -->
<img class="lg-logo" src="assets/logos/Full%20Logo%20Black.svg" alt="International Scripture Ministries" height="32">
<!-- dark surface -->
<img class="lg-logo" style="filter:brightness(0) invert(1)" src="assets/logos/Full%20Logo%20Black.svg" alt="International Scripture Ministries" height="32">
```

CSS custom properties for the files ship in `tokens/logos.css`: `--logo-full-black`, `--logo-mark-black`, `--logo-dotbible-full-black`, `--logo-dotbible-mark-black` (use with `background-image` / `mask-image`).

| File | Use |
|---|---|
| `assets/logos/Full Logo Black.svg` | ISM full logo |
| `assets/logos/Logo Black.svg` | ISM mark |
| `assets/logos/dot.bible Full Logo Black.svg` | dot.Bible full logo |
| `assets/logos/dot.bible Icon Black.svg` | dot.Bible icon |
| `assets/patterns/*` | brand patterns |

## Variants & states
- **Ink:** black on `--white` / `--off-white` / `--gray-100`; white (inverted) on `--black`, `--charcoal-900` and on dark photography or `--gradient-signature`.
- **Size:** full logo 28–40px tall in headers, 24–32px in footers; mark at least 24px; dot.Bible icon at least 32px.
- **Patterns:** Circle-symbol-1 (ring; Circle-symbol-2 is an identical copy) at 6–20% opacity on dark, 4–10% on light; Dots 1–5 (PNG) as a corner or edge texture on light surfaces.
- `Pattern1.svg`, `Pattern2.svg` and `Circle-symbol-3.svg` were exported without their styles and render as solid shapes. Do not use them until they are re-exported; build the ring motif from Circle-symbol-1 or inline SVG circles.

## Rules
- Clear space around every logo = the height of the mark's inner circle (about a quarter of the logo height). No text, buttons or edges inside it.
- One logo per view. Never place ISM and dot.Bible full logos side by side except on a "from ISM" endorsement line, where the ISM logo is smaller.
- Never place a logo on a busy photo without a dark overlay (`--black` at 40%+).
- Never colour a logo Horizon Blue or a gradient. Logos are black or white only.
- Patterns are decoration: `aria-hidden="true"`, `alt=""`, `pointer-events:none`.
- In app tiles, the dot.Bible icon sits on a white tile with `--radius-md`.

## Accessibility
- Logo images get meaningful `alt` ("International Scripture Ministries", "dot.Bible"). When the logo is a home link, the link's accessible name is "ISM home".
- Decorative patterns get `alt=""`.

## Content
- Write the names as **International Scripture Ministries** (or **ISM** after first use) and **dot.Bible** (lowercase d, capital B).
