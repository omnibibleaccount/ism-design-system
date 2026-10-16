# AccentBar
A thin 3px progress line filled with the signature gradient, available as the React `AccentBar` and as `.cr-accentbar` classes.

## When to use
- Use for quiet, passive progress: how far through a chapter, an audio teaching, a reading plan or an onboarding carousel.
- Use on dark surfaces by default (app player, `.sec-ink` bands); use `.cr-accentbar-light` on white or `--off-white`.
- Do not use for uploads, form steps or anything the user waits on; use Progress for that.
- Do not use as a decorative rule; use Divider (`.thread`).

## Anatomy & markup
A track (18% white on dark, 12% black on light) with a gradient fill from the left. No labels, no handle.

### React
`import { AccentBar } from '@ism/ui'` (source: `packages/react/src/components/AccentBar.tsx`). Renders the same `.cr-accentbar` markup as the HTML below and forwards its ref and any other `div` attributes.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `progress` | `number` | `0.4` | 0–1 fraction filled; clamped and rounded to a whole percent. |
| `width` | `number \| string` | `200` | Track width in px, or any CSS width such as `"100%"`. |
| `light` | `boolean` | `false` | Light track (`.cr-accentbar-light`) for white or `--off-white` surfaces. The default track is for dark surfaces. |
| `label` | `string` | — | Accessible name ("John 3 read"). When given, the track gets `role="progressbar"` with `aria-valuemin`, `aria-valuemax` and `aria-valuenow`. Without it the bar is plain markup. |
| …rest | `HTMLAttributes<HTMLDivElement>` | | `className`, `style`, `aria-*`. No `children`. |

```jsx
<AccentBar progress={0.6} label="John 3 read" />
<AccentBar progress={0.25} width="100%" light label="Reading plan: Gospel of John" />
```

### HTML / CSS
```html
<div class="cr-accentbar" role="progressbar" aria-label="John 3 read"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="60">
  <span class="cr-accentbar-fill" style="width:60%"></span>
</div>

<!-- on a light surface -->
<div class="cr-accentbar cr-accentbar-light" role="progressbar" aria-label="Reading plan"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="25">
  <span class="cr-accentbar-fill" style="width:25%"></span>
</div>
```
The HTML bar fills its parent's width; set a width on the parent, not on the bar.

## Variants & states
| Variant | Class / prop | Track |
|---|---|---|
| Dark (default) | `.cr-accentbar`, React `AccentBar` | `rgba(255,255,255,.18)` |
| Light | `.cr-accentbar-light`, React `light` | `rgba(0,0,0,.12)` |

States: empty (0%), partial, complete (100%). The fill is always `--gradient-signature`; it never changes colour for "done".

## Rules
- Fill with `--gradient-signature` only. Never solid Horizon Blue (`--horizon-blue`); blue is reserved for the one primary button.
- Keep it 3px tall with a 2px radius. Do not thicken it into a progress bar.
- One AccentBar per item. In a list of teachings, each row gets its own (see ListRow).
- Pair it with a nearby text value when the number matters ("9:12 left", "Day 4 of 21").
- Do not animate it on load; update it as real progress changes.

## Accessibility
- In HTML, give the track `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and an `aria-label` naming what is progressing.
- In React, pass `label` to get the progressbar role and value attributes. Without `label` the bar has no role; show the value in text beside it.
- A 3px line alone is hard to see; never make it the only place progress is reported.

## Content
- Labels name the thing, not the percentage: "John 3 read", "Reading plan: Gospel of John", "Audio teaching progress".
- Visible companions are short: "60% read", "Day 4 of 21", "9:12 left".
