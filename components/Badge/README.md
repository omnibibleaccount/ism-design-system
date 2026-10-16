# Badge
Small pill labels: the React `Badge` section tag in an outlined pill, `.badge` status badges, removable `.cr-tag` filters and the `.count` number dot.

## When to use
- React `Badge`: tag a section or promo in the app ("YOU'RE ALMOST DONE!", "GET A SNEAK PEEK", "Trending").
- `.badge`: show a status beside data (Draft, New, Live, Pending, Failed, Partner).
- `.cr-tag`: show an applied filter the user can remove.
- `.count`: unread or pending numbers on a tab, nav item or icon.
- Do not use a badge as a button; badges are labels. Use Chip for toggles.
- On website sections, use Eyebrow (`.eyebrow`) to label a section, not a badge.

## Anatomy & markup
### React
`import { Badge, StatusBadge, Tag, Count } from '@ism/ui'`.

`Badge` is the app section tag: small uppercase, wide-tracked label inside a thin outlined pill ("YOU'RE ALMOST DONE!", "GET A SNEAK PEEK").

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `"outlineDark" \| "outlineLight" \| "solidBlue" \| "accentText"` | `"outlineDark"` | `outlineDark` on dark, `outlineLight` on light, `solidBlue` filled, `accentText` blue text, no border |
| `children` | `ReactNode` | — | The label; rendered uppercase |
| …rest | `HTMLAttributes<HTMLSpanElement>` | | `style` is merged last. |

The other exports render the HTML classes below:
- `StatusBadge` (`.badge`): `tone` `"neutral" | "info" | "success" | "warning" | "error" | "gold"` (default `"neutral"`), `solid` (default `false`), `size` `"sm" | "md"` (omit for 24px), `dot`, `live` (adds `.live-dot`).
- `Tag` (`.cr-tag`): `children` (string, required), `onRemove`, `removeLabel` (default "Remove <label>"), `active`, `disabled`, `removeButtonProps`.
- `Count` (`.count`): `children`, `hiddenLabel` (visually hidden context, such as "unread").

```jsx
<Badge tone="outlineDark">Trending</Badge>
<Badge tone="accentText">You're almost done!</Badge>

<StatusBadge tone="success" live>Live</StatusBadge>
<StatusBadge tone="error" solid>Failed</StatusBadge>
<Tag active onRemove={() => removeFilter('hd')}>HD Radio</Tag>
<a className="navlink" href="/inbox">Messages <Count>3</Count></a>
```

### HTML / CSS
```html
<span class="badge badge-success">Live</span>
<span class="badge cr-badge-md badge-info"><span class="cr-badge-dot"></span>New</span>
<span class="badge cr-solid-error">Failed</span>

<span class="cr-tag cr-tag-active">HD Radio
  <button type="button" class="cr-tag-x" aria-label="Remove HD Radio">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
  </button>
</span>

<a class="navlink" href="/inbox">Messages <span class="count">3</span></a>
```

## Variants & states
| Tone | Subtle | Solid |
|---|---|---|
| Neutral | `.cr-badge-neutral` | `.cr-solid-neutral` |
| Info | `.badge-info` | `.cr-solid-info` |
| Success | `.badge-success` | `.cr-solid-success` |
| Warning | `.badge-warning .cr-badge-warning` | `.cr-solid-warning` |
| Error | `.badge-error` | `.cr-solid-error` |
| Brand / partner | `.cr-badge-gold` (or `.badge-brand`, `.badge-partner`) | `.cr-solid-gold` |

- Sizes: 24px (`.cr-badge-sm` for 12px text as on data tables), `.cr-badge-md` 28px. Add `.cr-badge-dot` for a leading dot.
- Tags: 32px; the 24px × has a 44px invisible hit area. States: hover ×, focus ×, disabled (`.cr-tag-off` + `disabled`), applied (`.cr-tag-active`, info tint).
- Live: `.live-dot` (`--live`) inside a badge for on-air (React `StatusBadge live`).
- React: `StatusBadge` `tone` picks the row, `solid` the column; `size`, `dot`, `active` and `disabled` map to the classes above.

## Rules
- Always pair colour with a word. Never colour alone.
- Use status colours only for status: `--success`, `--error`, `--warning`, `--info` with their `-bg`.
- Counts and notification dots are Horizon Blue (`.count`), never red.
- `solidBlue` / `.cr-solid-info` are rare; do not place them next to a blue primary button.
- Live / on-air is the only use of `--live`.
- Keep badges to one line, no wrapping (`white-space:nowrap`).

## Accessibility
- A status badge is text; screen readers read it as-is. Do not add `role="status"` unless it updates live.
- `.count` needs context: put it inside the labelled link, or add visually hidden text ("3 unread").
- Every tag remove button has `aria-label="Remove <name>"`; after removing, move focus to the next tag or the field.

## Content
- One word for status: Draft, New, Live, Pending, Failed, Partner.
- React Badge copy is short and warm: "Trending", "You're almost done!", "Get a sneak peek", "500+ languages".
- Tags show the item name as the user chose it: "Amharic", "dot.Bible app".
