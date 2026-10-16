# Divider
Separates content: the React `Divider` gradient accent, the `.thread` signature line, and quiet `.cr-rule` hairlines (strong, labelled "or", vertical).

## When to use
- Use a hairline `.cr-rule` between groups inside a card, form or panel.
- Use `.cr-rule-or` between two alternative ways to do one thing ("Sign in with email" or "Continue with phone").
- Use `.cr-rule-v` between short inline facts in a toolbar or meta line (98.7 FM | Amharic | Addis Ababa).
- Use `.thread` (or React `Divider`) as a brand accent under a heading or above a footer, at most once per section.
- Do not use a divider where spacing alone already separates things; prefer the spacing scale (16 inside cards, 24 card padding, 48 between blocks, 64 between sections).
- Do not use list hairlines here; ListRow and Table own their own row borders.

## Anatomy & markup

### React
`import { Divider, Rule, OrDivider, VerticalRule, Thread } from '@ism/ui'`.

`Divider` is a pill-ended accent bar painted with `--gradient-signature`, rendered with `aria-hidden="true"`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | |
| `length` | `number` | `72` | px along the main axis. |
| `thickness` | `number` | `2` | px across. |

The other exports render the HTML classes below:
- `Rule`: `<hr class="cr-rule">`; `tone` `"hairline" | "strong" | "dark"` (default `"hairline"`).
- `OrDivider`: `.cr-rule-or` with `role="separator"`; `children` is the word (default `"or"`).
- `VerticalRule`: `.cr-rule-v`, decorative. `Thread`: `.thread`, decorative.

```jsx
<Divider />
<Divider orientation="vertical" length={200} />
<Rule tone="strong" />
<OrDivider />
```

### HTML / CSS
```html
<hr class="cr-rule">                         <!-- hairline, --gray-200 -->
<hr class="cr-rule cr-rule-strong">          <!-- 1px --charcoal-900 -->
<hr class="cr-rule cr-rule-dark">            <!-- on dark, --border-hairline-dark -->

<div class="cr-rule-or" role="separator" aria-label="or">or</div>

<p style="display:flex;align-items:center;gap:16px">98.7 FM <span class="cr-rule-v" aria-hidden="true"></span> Amharic</p>

<div class="thread" aria-hidden="true"></div>  <!-- 2px gradient line -->
```

## Variants & states
| Variant | Class / prop | Look |
|---|---|---|
| Hairline | `.cr-rule` | 1px `--gray-200` |
| Strong | `.cr-rule-strong` | 1px `--charcoal-900`, for a total row or a page-end rule |
| On dark | `.cr-rule-dark` | 1px `--border-hairline-dark` |
| Labelled | `.cr-rule-or` | two hairlines with 13px `--gray-600` text between |
| Vertical | `.cr-rule-v` | 1px × 24px `--gray-300`, centred in a flex row |
| Thread | `.thread` | 2px brand gradient line, full width of its box |
| Accent | React `Divider` | 72 × 2px `--gradient-signature`, horizontal or vertical |

React: `Rule tone="strong" | "dark"`, `OrDivider`, `VerticalRule` and `Thread` render the classes above.

Dividers have no interactive states.

## Rules
- Never colour a divider solid Horizon Blue (`--horizon-blue`); blue is for the one primary button. Accents use the gradient.
- Use `.thread` or React `Divider` at most once per section, and never as a list separator.
- Keep `.cr-rule` margins at 0 and space it with the parent's `gap` from the spacing scale.
- On `.sec-ink` or other dark surfaces use `.cr-rule-dark`; the gradient thread works on both.
- `.cr-rule-v` lives inside a flex row with a 16px gap; do not use it to split columns of a layout.

## Accessibility
- A plain `<hr>` is announced as a separator. Use it only where the break is meaningful.
- Decorative lines (`.thread`, React `Divider`, `.cr-rule-v`) get `aria-hidden="true"` or are empty `<div>`s. React `Divider`, `Thread` and `VerticalRule` set it for you.
- The labelled divider uses `role="separator"`; its word is read as part of the flow.
- Do not rely on a divider alone to show grouping; pair it with a heading or a gap.

## Content
- The labelled divider says one lowercase word: "or". Do not write "OR" or "— or —".
- Vertical dividers separate two to four short facts: "98.7 FM | Amharic | Addis Ababa".
