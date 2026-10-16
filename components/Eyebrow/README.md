# Eyebrow
Small uppercase section labels: the `.eyebrow` in a thin blue rectangle that introduces a headline, and the quieter `.overline` that heads a list, menu or table.

## When to use
- `.eyebrow`: once above a section headline or a card title, to name the topic ("About ISM", "Statement of Faith", "Broadcast").
- `.overline`: above a group of rows, a menu, a table or a form group ("Reading", "More from ISM", "All languages · 32").
- The rule: eyebrow introduces a headline; overline organises a list. If there is no headline right after it, use an overline.
- Do not use either as a button, a status or a tag; use Button or Badge.

## Anatomy & markup
### React
`import { Eyebrow, Overline } from '@ism/ui'`. `Eyebrow` renders `<span class="eyebrow">` and `Overline` renders `<span class="overline">`; both pass other props (`id`, `className`) through.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `ReactNode` | — | Required. Normal case ("About ISM"); CSS uppercases it. |

```jsx
<Eyebrow>About ISM</Eyebrow>
<h2 className="h2">Scripture for every heart language</h2>

<Overline id="grp-reading">Reading</Overline>
```

In the app, the outlined-pill section tag is `Badge` (see Badge), not `Eyebrow`.

### HTML / CSS
```html
<span class="eyebrow">About ISM</span>
<h2 class="h2">Scripture for every heart language</h2>

<section class="sec-ink">
  <span class="eyebrow">Join the Mission</span>  <!-- on-dark colours automatically -->
</section>

<span class="overline">Reading</span>
<div class="cr-inset-grp">…rows…</div>
```

## Variants & states
| | `.eyebrow` | `.overline` |
|---|---|---|
| Size | 12px, 600, tracking .2em (`--eyebrow-tracking`) | 12px, 600, tracking .06em (`--overline-tracking`) |
| Frame | 1px `rgba(4,109,227,.55)` rectangle, square corners, 7px × 12px padding | none |
| Colour light | `--horizon-blue-dim` | `--gray-600` |
| Colour dark (`.sec-ink`/`.on-dark`) | `--blue-on-dark`, faint white fill | `--text-tertiary-dark` |

Static labels; no hover or focus states.

## Rules
- One eyebrow per section or card. Never stack two.
- Eyebrow sits 16px (`--space-4`) above its headline; overline sits 8px (`--space-2`) above its list.
- Keep the eyebrow square-cornered; the rounded pill is the app's Badge, not the website eyebrow.
- Do not recolour eyebrows to gold, violet or status colours.
- Inside dark sections, wrap in `.sec-ink` or `.on-dark` rather than overriding colours.

## Accessibility
- An eyebrow is decorative context; the headline must make sense without it.
- Write it in normal case in the HTML ("About ISM"); CSS uppercases it, so screen readers do not spell it out.
- Do not use an eyebrow or overline in place of a real heading element.

## Content
- One to three words: "About ISM", "Our mission", "Broadcast", "Updates", "Network".
- Overlines name the group plainly: "Reading", "More from ISM", "All languages · 32".
