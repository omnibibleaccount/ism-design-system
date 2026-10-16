# Link
Text links for navigation: plain inline links in copy, the `.lnk` underline-reveal link, and the ghost "see all" link with ↗.

## When to use
- Inline `<a>`: a link inside a sentence ("Read our privacy policy").
- `.lnk`: a standalone text link in a list, footer or card ("Get prayer updates ↗").
- Ghost link (`.btn-ghost`, React `Link variant="ghost"`): a "See all" / "Browse All" link after a section or row of cards.
- Do not use a link for an action that changes data (submit, give, delete); use Button.

## Anatomy & markup
### React
`import { Link } from '@ism/ui'`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"inline" \| "reveal" \| "ghost" \| "onDark" \| "ink"` | `"inline"` | `inline` plain `<a>`, `reveal` `.lnk`, `ghost` `.btn.btn-ghost`, `onDark` `.cr-link-dark`, `ink` `.lnk.cr-link-ink`. |
| `arrow` | `boolean \| ReactNode` | — | `true` adds ↗ in `.arrow` (hidden from assistive tech); pass a node for another glyph. |
| `external` | `boolean` | `false` | Adds `target="_blank"`, `rel="noopener"` and hidden "(opens in a new tab)". |
| `newTabLabel` | `string` | `"(opens in a new tab)"` | Override to translate. |
| …rest | `AnchorHTMLAttributes` | | `href`, `className`. |

```jsx
<p>Read our <Link href="/privacy">privacy policy</Link> for details.</p>
<Link variant="reveal" href="/prayer" arrow>Get prayer updates</Link>
<Link variant="ghost" href="https://dot.bible" arrow>Browse the directory</Link>
```

### HTML / CSS
```html
<p>Read our <a href="/privacy">privacy policy</a> for details.</p>

<a class="lnk" href="/prayer">Get prayer updates ↗</a>

<a class="btn btn-ghost" href="https://dot.bible">Browse the directory <span class="arrow" aria-hidden="true">↗</span></a>

<!-- on dark -->
<a class="cr-link-dark" href="/cookies">cookie policy</a>
```

## Variants & states
| Kind | Class | Look |
|---|---|---|
| Inline | `a` | `--horizon-blue`, hover `--horizon-blue-dim`, browser underline |
| Underline reveal | `.lnk` | inherits colour; 1px underline grows from the left on hover |
| Ghost | `.btn-ghost` | Horizon Blue, semibold, 44px hit area; `.arrow` nudges up-right on hover |
| On dark | `.cr-link-dark` | `--blue-on-dark`, hover white |
| Nav | `.navlink` | header links with the gradient underline (see SiteHeader) |

`.cr-link-ink` sets `.lnk` to black at content width on light backgrounds.

## Rules
- The ↗ rule: put ↗ after the label when the link goes to another page or site. Use ⌄ when it opens something here, and › when it drills into an app screen. Do not mix them.
- Links are `--horizon-blue` on light and `--blue-on-dark` on dark. Never pure blue on black.
- Keep standalone links at least 44px tall to tap; `.btn-ghost` does this for you.
- Inline links stay underlined so they are visible without colour.
- External links open in the same tab unless leaving would lose form input.

## Accessibility
- Link text must make sense out of context: "Read the statement of faith", not "here".
- Mark the ↗ glyph inside `.arrow` with `aria-hidden="true"`; if the link opens a new tab, add "(opens in a new tab)" as visually hidden text.
- Focus uses the shared ring: 2px Horizon Blue outline + `--shadow-focus`.

## Content
- Short and specific: "Our statement of faith ↗", "Browse the directory ↗", "See all", "Get prayer updates ↗".
- Sentence case. No "Click here".
