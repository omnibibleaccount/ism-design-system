# Card
Rounded content containers: the React `Card` (a large, image-led tile) and the website `.card` family for programs, text, values, people, contact, books, steps and statements.

## When to use
- React `Card`: immersive topic or testament tiles in the dot.Bible app and on dark marketing sections.
- `.card`: any grouped, linkable block of content on the website.
- Do not nest cards in cards. Do not use a card for a single line of text; use a ListRow.

## Anatomy & markup
### React
`import { Card, ContentCard, CardMedia, CardBody, CardCta } from '@ism/ui'`.

`Card` is the large, immersive, image-led tile: full-bleed photo, dark gradient overlay for legibility, rounded corners, thin border, a white "Explore ↗" pill top-right, and title/eyebrow bottom-left. Used for testament/topic tiles across the dot.Bible app and marketing site.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `image` | `string` | — | Photo URL; without it the card is `--charcoal-900` |
| `imageAlt` | `string` | `""` | Alt text for the photo; empty because the title names the card |
| `eyebrow` | `string` | — | Small uppercase label above the title |
| `title` | `string` | — | 24px semibold, white |
| `subtitle` | `string` | — | 15px, 70% white |
| `cta` | `string` | `"Explore"` | CTA pill label shown top-right, rendered "<Label> ↗"; pass `""` to hide it |
| `height` | `number` | `360` | px |
| `onClick` | `MouseEventHandler` | — | Makes the card clickable: `role="link"`, `tabIndex={0}`, Enter and Space activate it |

```jsx
<Card image="/assets/imagery/old-testament.jpg" eyebrow="Explore" title="The Old Testament" />
```

The website `.card` family:
- `ContentCard` renders `.card`; `variant` is `"default" | "flush" | "clip" | "tight" | "dark" | "roomy" | "flat" | "pad"` (default `"default"`). With `href` the whole card is one `<a>`.
- `CardMedia` renders `.media`: `src`, `alt` (default `""`), `ratio` `"1610" | "top"`. Without `src` or children it shows the `.ph` placeholder.
- `CardBody` renders `.cr-card-body`. `CardCta` renders `.cr-card-cta` with a trailing `arrow` (default `↗`).

```jsx
<ContentCard variant="flush" href="/radio">
  <CardMedia src="…" alt="…" ratio="1610" />
  <CardBody>
    <Eyebrow>Broadcast</Eyebrow>
    <h3 className="h3">HD Radio Broadcast</h3>
    <p className="small muted">Scripture readings on the air, wherever listeners tune in.</p>
    <CardCta>Learn more</CardCta>
  </CardBody>
</ContentCard>
```

### HTML / CSS
```html
<a class="card cr-card-flush" href="/radio">
  <div class="media cr-media-1610"><img class="photo" src="…" alt="…"></div>
  <div class="cr-card-body">
    <span class="eyebrow">Broadcast</span>
    <h3 class="h3">HD Radio Broadcast</h3>
    <p class="small muted">Scripture readings on the air, wherever listeners tune in.</p>
    <span class="cr-card-cta">Learn more <span class="arrow" aria-hidden="true">↗</span></span>
  </div>
</a>
```
Base: `.card` (white, 1px `--border-hairline-light`, 20px radius `--radius-lg`, 24px padding, `--shadow-card-light`, hover `--shadow-lift`). Photos sit in `.media` and zoom 3% on hover.

## Variants & states
| Variant | Classes |
|---|---|
| Program, image-led | `.card.cr-card-clip` + `.media.cr-card-media-top` + `.icon.cr-card-medal` overlapping the photo |
| Masonry program | `.card.cr-card-flush` + `.media` + `.cr-card-body` |
| Text, light / dark | `.card.cr-card-tight` (+ `.cr-card-dark`, text in `.cr-card-text`) |
| Value | `.card.card-lg.cr-card-roomy` + `.icon` medallion + `.cr-card-list` |
| Team member | `.card.cr-card-flush` + photo + `.h4` + `.cr-card-role` |
| Contact method | `.card` + `.icon` + `.h4` + detail |
| Book | `.card` + `.media.cr-book` > `.cr-book-cover` |
| Numbered step | `.card.card-flat.cr-card-pad` + `.cr-step-num` |
| Statement | `.card.card-flat.cr-card-pad` + `.eyebrow` + `.cr-statement` |

`.card-flat` keeps the resting shadow on hover (for cards that are not links). Inside `.sec-ink`, cards turn translucent automatically.

## Rules
- Radius 20px (`--radius-lg`) for every card; media inside a flush card has square corners.
- The whole card is the link (`<a class="card">`); do not add a second button inside a linked card.
- Card CTAs are text with ↗ when they go to another page. The React CTA pill always reads "<Label> ↗".
- Never use solid Horizon Blue inside a card except the book cover sample; blue stays for the page's primary button.
- Use only real photography with people or the product; use `.ph` placeholders until a real photo exists.
- Keep card grids to 3 columns on desktop, 1 on mobile, 24px gap (`--space-5`).

## Accessibility
- Linked cards contain one heading; the link's accessible name comes from it. Keep CTA text short so the name stays readable.
- Every photo has meaningful `alt`, or `alt=""` if decorative. Medallion icons are `aria-hidden`.
- React `Card` with `onClick` is a `div` with `role="link"`, `tabIndex={0}` and Enter/Space handling built in. Without `onClick` it is not focusable; for real navigation prefer `ContentCard` with `href`.
- Text on the React Card always sits on the dark gradient overlay for contrast.

## Content
- Titles name the thing: "dot.Bible App", "HD Radio Broadcast", "Global Bible Network", "The Old Testament".
- One sentence of body copy, warm and plain: "Scripture readings on the air, wherever listeners tune in."
- CTA: "Learn more ↗", "Subscribe ↗", "Explore ↗".
