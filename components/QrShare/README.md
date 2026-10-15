# QrShare
A QR code beside a short prompt with Copy link and Share buttons, so someone can pass a dot.bible link to a person standing next to them.

## When to use
- Use on language pages, TAP/NFC card pages and event screens where people share in person.
- Use the dark variant on dark sections and kiosks.
- Do not use as the only way to reach a link; the Copy link button is required.
- Inside a BibleCard, use the card's built-in share block (same `.sx-qr`).

## Anatomy & markup
`.sx-qr` (128px, white, 6px padding) + text column (title, copy, buttons, status).

```html
<div class="sx-share">
  <div class="sx-qr sx-qr-line"><svg viewBox="-1 -1 27 27" role="img" aria-label="QR code for dot.bible/burmese" shape-rendering="crispEdges">…</svg></div>
  <div class="sx-share-text">
    <p class="sx-share-title">Share with someone nearby</p>
    <p class="small sx-share-copy">Point a phone camera at the code to open the Burmese Bible on dot.bible.</p>
    <div class="sx-btnrow">
      <button type="button" class="btn btn-secondary btn-sm"><svg width="16" height="16" …aria-hidden="true">…</svg><span>Copy link</span></button>
      <button type="button" class="btn btn-secondary btn-sm"><svg …>…</svg>Share…</button>
    </div>
    <p class="sx-share-status" role="status"></p>
  </div>
</div>
```

## Variants & states
| Variant | Classes | Buttons |
|---|---|---|
| On light | `.sx-share` + `.sx-qr sx-qr-line` (1px `--gray-200` frame) | `.btn btn-secondary btn-sm` |
| On dark | `.sx-share sx-share-dark` (`--charcoal-900`) + `.sx-qr` | `.btn btn-outline-light btn-sm` |

States: default (empty status line); copied (Copy link swaps its icon to a check and its label to "Copied"; status reads "Link copied: dot.bible/urdu" in `--horizon-blue-dim`, or `--blue-on-dark` on dark).
Under 480px the block stacks: QR above the text, padding `--space-5`.

## Rules
- QR is always black on a white tile, even on dark sections, with a quiet zone (the 6px padding plus the code's own margin).
- Keep the QR at least 128px on screen; never below 120px.
- Two buttons only, both secondary: Copy link, then Share…. No Horizon Blue button here.
- Share… opens the system share sheet where available; the ellipsis signals a further step.
- The status line keeps its height (`min-height:1.5em`) so the layout does not jump.
- Card: `--radius-lg`, 1px `--border-hairline-light`, padding 28px.
- Buttons meet the 44px tap target on touch screens; `.btn-sm` is acceptable on desktop only.

## Accessibility
- The QR is `role="img"` with an `aria-label` that names the address it opens.
- The copy confirmation is in `role="status"` so screen readers announce it.
- Button icons are `aria-hidden="true"`; the text names the action.
- After copying, keep focus on the button.
- Write the short URL visibly in the copy or status so people can type it.

## Content
- Title: "Share with someone nearby".
- Copy: "Point a phone camera at the code to open the Burmese Bible on dot.bible."
- Status: "Link copied: dot.bible/burmese". Short addresses only, no https://.
