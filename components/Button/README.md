# Button
Pill-shaped call-to-action button used across ISM's app, site, and print/email creative, available as the React `Button` and as `.btn` classes.

## When to use
- Use for actions: give, sign up, download, submit, open a section.
- Use `primary` / `.btn-primary` for the ONE main action in a group. Everything else in that group is secondary, light, outline or ghost.
- Do not use a button for plain navigation inside running text; use a link (see Link).
- Do not use a button for a filter or toggle; use Chip.

## Anatomy & markup
A pill with a label and an optional trailing icon. No shadow; hover darkens one step; no scale.

### React
`import { Button } from` the bundle (`window.ISMDesignSystem_106e83.Button`).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"primary" \| "outlineDark" \| "outlineLight" \| "solidWhite" \| "ghost"` | `"primary"` | `primary` (solid Horizon Blue) is reserved for the ONE primary action in a group, never pair two blue buttons together. `outlineDark`/`outlineLight`/`solidWhite` are secondary actions, matched to the section behind them. `ghost` is a text-only inline link-button. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | |
| `disabled` | `boolean` | `false` | Fades to 45% and blocks the pointer. |
| `icon` | `ReactNode` | — | Optional trailing icon element (e.g. an arrow glyph). |
| `style` | `CSSProperties` | — | Merged last. |
| …rest | `ButtonHTMLAttributes` | | `type`, `onClick`, `aria-*`. |

```jsx
<Button variant="primary">Get Started</Button>
<Button variant="outlineDark" icon={<ArrowIcon/>}>Download the App</Button>
```

### HTML / CSS
```html
<a class="btn btn-primary" href="/give">Give online <span class="arrow" aria-hidden="true">↗</span></a>
<a class="btn btn-secondary" href="/about">Learn about ISM</a>
<a class="btn btn-ghost" href="/faith">Our statement of faith <span class="arrow" aria-hidden="true">↗</span></a>

<button class="btn btn-primary" type="button" disabled aria-busy="true">
  <span class="spin" aria-hidden="true"></span>Sending…
</button>
```
Classes: `.btn` + one colour class (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-light`, `.btn-outline-light`) + optional size (`.btn-sm` 36px, default 44px, `.btn-lg` 52px). `.cr-btn-block` makes it full width. `.arrow` nudges up-right on hover. `.spin` is the loading spinner.

## Variants & states
| React `variant` | HTML class | Use on |
|---|---|---|
| `primary` | `.btn-primary` | light or dark, the one main action |
| `outlineLight` | `.btn-secondary` | light sections |
| `outlineDark` | `.btn-outline-light` | dark sections |
| `solidWhite` | `.btn-light` | dark sections (also the header Give pill) |
| `ghost` | `.btn-ghost` | inline "See all ↗", "Browse All" |

States: default, hover (one step darker), focus (2px Horizon Blue outline + `--shadow-focus`), disabled (`disabled` or `aria-disabled="true"`, 45% opacity), loading (`.spin` + "Sending…", keep it disabled).

## Rules
- One Horizon Blue (`--horizon-blue`) button per group. Never two blues side by side.
- Never use blue for other accents (progress lines, borders, dividers); use the gradient, gold, white or black (see Divider, AccentBar).
- Keep every button at least 44px tall (`--tap-target`). `.btn-sm` (36px) is for dense desktop toolbars only.
- Icons: ↗ = goes to another page, ⌄ = opens here, › = drills into an app screen. Put the icon after the label; a leading icon is fine for download or give.
- Inside `.sec-ink`, `.btn-secondary` and `.btn-ghost` switch to their on-dark colours automatically.
- Use `<a>` for navigation and `<button type="button">` for actions.

## Accessibility
- The label must say what happens ("Give online", not "Click here").
- Mark decorative icons and `.arrow` with `aria-hidden="true"`.
- A loading button keeps its width, gets `aria-busy="true"` and `disabled`.
- Focus ring is always visible on keyboard focus; do not remove it.

## Content
- Verb first, two to four words, sentence case: "Give online", "Download the app", "Become a partner", "Join the Mission".
- No exclamation marks, no emoji.
