# Icons and links

## The glyph vocabulary

| Glyph | Means | RTL |
|---|---|---|
| ⌄ caret | Opens something on this page: a menu, dropdown, accordion, select, language switcher. Rotates 180° when open | do not mirror |
| ↗ | Goes to another page or another site. The only glyph for off-page navigation | do not mirror |
| › | Drills into a deeper screen or level: app list rows, breadcrumb separator | mirror to ‹ |
| → | Primary continue in a flow. One per group, on the primary button only | mirror |
| ← | Back | mirror |
| + and − | Adds or expands a disclosure that adds content (accordion) | no mirror |
| × | Dismisses or clears. Always a `<button>` with an accessible name | no mirror |

Do not use ↗ for in-page actions, ⌄ for navigation, or → for secondary actions. Do not combine glyphs (no "→ ↗").

## Links

1. Links in body copy are underlined. Links in navigation are not underlined but change colour or underline on hover and always show the focus ring.
2. Colour: `--horizon-blue` on light, `--blue-on-dark` on dark. Hover `--horizon-blue-dim`. Visited links are not restyled.
3. A link that leaves the site shows ↗, uses `target="_blank" rel="noopener"`, and includes visually hidden text "(opens in a new tab)".
4. Buttons do things, links go places. A control that submits or changes state is a `<button>`; a control that navigates is an `<a>`. Do not style one as the other without matching the role.
5. Link text says the destination or action, never "click here" or a bare URL. Use the same text for the same destination everywhere.

## Icons

1. Style: 1.8px stroke (`--icon-stroke`), round caps and joins, `currentColor`, 24px grid. Do not mix filled and outline in one group.
2. Sizes: 16 (`--icon-sm`), 20 (`--icon-md`), 24 (`--icon-lg`). A control containing an icon is still at least 44px.
3. Decorative: `aria-hidden="true"`. Meaningful with no text: put the name on the button (`aria-label`), not the svg.
4. Icons never replace text for primary actions. Icon-only buttons need a tooltip on pointer devices.
5. Counts and notification dots are blue. Red is for errors only. The live/on-air dot is `--live` and used only for on-air.
6. The 40 shipped icons are in `packages/web/assets/icons`; the React, React Native, Swift and Compose packages expose the same set by the same names. Do not draw new ones inline; add them to the set.

## Logos

Black ink on light. On dark backgrounds invert with `filter: brightness(0) invert(1)`. Never recolour, rotate, stretch or add effects. Keep clear space equal to the height of the dot.
