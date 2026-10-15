# Alert
Inline status banners (info, success, warning, error) that sit in the page flow, plus the dismissible dark announcement bar that sits above the header.

## When to use
- Use an inline alert to report the state of the thing right below it: a form result, a gift that failed, a card about to expire.
- Use the announcement bar for one site-wide message, such as a launch or a broadcast milestone.
- Do not use an alert for a passing confirmation after an action; use a Toast.
- Do not use an alert to ask a question or block the page; use a Modal.
- Do not stack more than two alerts. Merge the messages or fix the cause.

## Anatomy & markup
Status icon + bold title + one sentence + optional link. Classes `.alert` and `.alert-*` come from the base layer; `.fb-alert` adds the titled layout.

```html
<div class="alert alert-err fb-alert" role="alert">
  <svg class="fb-alert-ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16v.01"/></svg>
  <div>
    <strong class="fb-alert-title">We couldn’t process your gift</strong>
    Your card wasn’t charged. Please check the details and try again.
  </div>
</div>

<div class="fb-announce fb-announce-flush" role="region" aria-label="Announcement">
  <span>The Global Bible Network now reaches 500+ languages.</span>
  <a class="fb-announce-link" href="/global-bible-network">See where we broadcast ↗</a>
  <button class="fb-x" type="button" aria-label="Dismiss announcement">…x icon…</button>
</div>
```

## Variants & states
| Variant | Classes | Colours |
|---|---|---|
| Info | `.alert .alert-info .fb-alert` | `--info` on `--info-bg`, border `--info-line` |
| Success | `.alert .alert-ok .fb-alert` | `--success` on `--success-bg`, `--success-line` |
| Warning | `.alert .alert-warn .fb-alert` | `--warning` on `--warning-bg`, `--warning-line` |
| Error | `.alert .alert-err .fb-alert` | `--error` on `--error-bg`, `--error-line` |
| Compact | `.alert .alert-* .small`, no title | one line, e.g. a draft notice |
| Announcement | `.fb-announce` (`.fb-announce-flush` when full-bleed) | `--charcoal-900`, link `--blue-on-dark`, `--gradient-line` hairline at the bottom |

## Rules
- Radius `--radius-md` (12px), padding 16px 18px, 1px status `-line` border. Never restyle colours per page; use the four status variants.
- Text 15px, title 16px/600 (`.fb-alert-title`). Links use `.fb-alert-link`: inherit the status colour, weight 600.
- Put the alert directly above the content it describes. After a form submit, move it to the top of the form.
- Icon: 20px inline SVG, stroke currentColor, 1.8 width, round caps. Info = circle-i, success = circle-check, warning = triangle, error = circle-!.
- Do not put buttons inside an inline alert. One text link at most.
- Link icons: ↗ when the link goes to another page; no icon when it only scrolls or edits here.
- The announcement bar is 48px min-height, 15px text, dark `--charcoal-900`. Show one at a time. Full-bleed above the header uses `.fb-announce-flush` (square corners).
- The bar's close is `.fb-x`, a 44px round button. Remember the dismissal for the visit (sessionStorage); do not show it again on the next page.
- Never use red for anything except errors. Counts and new-item dots are Horizon Blue.

## Accessibility
- Errors use `role="alert"` so they are announced at once. Info, success and warning use `role="status"`.
- Insert the alert into the DOM when the event happens; a pre-rendered hidden alert is not announced.
- The colour is never the only signal: always include the title text and the icon.
- Icons are `aria-hidden="true"`.
- The announcement bar is `role="region"` with `aria-label="Announcement"`. Its close button has `aria-label="Dismiss announcement"` and the base focus ring (`--shadow-focus`).
- All status text pairs pass 4.5:1 on their backgrounds.

## Content
- Title says what happened in plain words; the sentence says what to do next. Never blame the reader.
- Good: "We couldn’t process your gift. Your card wasn’t charged. Please check the details and try again."
- Good: "Gifts are tax-deductible. You’ll get a receipt by email after each gift."
- Good: "Message sent. We’ll reply within two business days."
- Announcement: one short fact plus one link. "The Global Bible Network now reaches 500+ languages. See where we broadcast ↗"
- No exclamation marks, no emoji, no all-caps.
