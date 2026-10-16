# IconButton
A round, icon-only button (`.iconbtn`) for compact actions such as menu, search, close, share and play.

## When to use
- Use when the icon alone is universally understood: menu, close, search, play/pause, previous/next, share.
- Use in headers, drawers, players and toolbars where space is tight.
- Do not use when a word would be clearer; use Button with a label.
- Do not use for the main call to action of a section.

## Anatomy & markup
A 44px circle, 1px hairline ring, transparent fill, one 20px line icon centred.

### React
`import { IconButton } from '@ism/ui'`. For labelled pills use `Button`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `aria-label` | `string` | — | Required. Names the action. |
| `children` | `ReactNode` | — | The icon, normally `<UiIcon name="menu" />`. |
| `tone` | `"dark" \| "light" \| "solid"` | `"dark"` | `.cr-iconbtn-dark`, `.cr-iconbtn-light`, `.cr-iconbtn-solid`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | `sm` 36px with a 44px hit area, `lg` 52px. |
| `pressed` | `boolean` | — | For toggles; sets `aria-pressed`. Omit for plain actions. |
| …rest | `ButtonHTMLAttributes` | | `type` defaults to `"button"`; `onClick`, `disabled`, `aria-expanded`. |

```jsx
<IconButton tone="light" aria-label="Next chapter"><UiIcon name="chevron-right" /></IconButton>
```

### HTML / CSS
```html
<!-- on dark (header, drawer) -->
<button class="iconbtn" type="button" aria-label="Open menu">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>

<!-- on light -->
<button class="iconbtn cr-iconbtn-light" type="button" aria-label="Share">…</button>
```

## Variants & states
| Class | Result |
|---|---|
| `.iconbtn` | Base, styled for dark: white icon, `rgba(255,255,255,.3)` ring. Add `.cr-iconbtn-dark` for the hover tint. |
| `.cr-iconbtn-light` | On light: black icon, `rgba(0,0,0,.22)` ring, white fill; hover `--gray-100`. |
| `.cr-iconbtn-solid` | Filled Horizon Blue (a player's Play). Counts as the group's one primary. |
| `.cr-iconbtn-sm` | 36px visual, hit area extended to 44px. |
| `.cr-iconbtn-lg` | 52px. |
| `.cr-iconbtn-focus` | Static focus ring for specimens; real focus uses `:focus-visible`. |
| `disabled` | 45% opacity, not-allowed cursor. |

## Rules
- Always 44px tap target (`--tap-target`); `.cr-iconbtn-sm` keeps it with an invisible hit area.
- Icons are inline SVG, 24 viewBox, `stroke="currentColor"`, stroke-width 1.8, round caps.
- Icon meaning: ⌄ opens here, ↗ goes to another page, › drills into an app screen.
- Only one solid blue icon button per group, and never next to a blue `.btn-primary`.
- Focus: `outline: 2px solid var(--horizon-blue); outline-offset: 2px; box-shadow: var(--shadow-focus)`.

## Accessibility
- Every icon button needs an `aria-label` that names the action ("Open menu", "Close", "Play ISM Radio").
- Mark the SVG `aria-hidden="true"`.
- Toggles (play/pause, bookmark) use `aria-pressed`; a menu button uses `aria-expanded` and `aria-controls`.

## Content
- Labels are short verbs: "Search", "Close", "Share verse", "Next chapter".
