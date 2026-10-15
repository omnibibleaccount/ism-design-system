# CookieBanner
A small charcoal card at the bottom-left of ism.bible that asks for cookie consent on the first visit, with Accept All and Reject Non-Essential.

## When to use
- Show it on the first visit to any ism.bible page, and again after the stored choice expires (365 days).
- Reopen it from "Cookie settings" in the Footer legal row.
- Do not use it for news, newsletter or app prompts. Use an alert, Toast or AppBanner for those.
- Do not show it inside the dot.Bible app or in email.

## Anatomy & markup
The card is the shared `.cookie` class (fixed, bottom-left, `var(--charcoal-900)`, 20px radius). Add a heading, one paragraph with a Learn more link, and two buttons.

```html
<div class="cookie" role="region" aria-labelledby="cookie-h">
  <p class="nv-cookie-h" id="cookie-h">A note on cookies</p>
  <p>We use cookies to enhance your experience and analyze traffic. By clicking ‘Accept All’, you consent to our use of cookies. <a href="/cookies">Learn more</a></p>
  <div class="nv-cookie-actions">
    <button class="btn btn-primary" type="button">Accept All</button>
    <button class="btn btn-outline-light" type="button">Reject Non-Essential</button>
  </div>
</div>
```

For docs and static boards add `.nv-static` (`.cookie.nv-static`) to drop fixed positioning and the rise animation.

## Variants & states
- **Desktop:** fixed 24px from the bottom-left, `width:min(440px, 100vw - 32px)`, rises in over 400ms.
- **Mobile (below 768px):** 16px inset; the buttons wrap and stack full width.
- **After a choice:** hide the card, store the choice for 365 days, and load analytics only on Accept All.
- **Reopened:** "Cookie settings" in the footer shows the same card with the current choice; the buttons act the same.
- Buttons use the standard `.btn` hover and focus states.

## Rules
- Accept All is the one Horizon Blue primary (`.btn-primary`). Reject Non-Essential is `.btn-outline-light`, same size, never a text link, so both choices are equally easy.
- Keep it bottom-left. BackToTop sits bottom-right above it (z-index 72 vs 70); they never overlap.
- Never block the page with a scrim or modal. Content stays readable and scrollable.
- Keep the card `var(--charcoal-900)` on every page, light or dark.
- Links in the card use `var(--blue-on-dark)`.
- Remember the choice for 365 days; do not ask again before then unless the policy changes.
- Buttons are at least 44px tall (`.btn` default).

## Accessibility
- Use `role="region"` with `aria-labelledby` pointing to the heading, so it is listed as a landmark.
- Do not steal focus on load. Place it early in the DOM after the skip link so keyboard users reach it quickly.
- After a choice, move focus back to where it was (or to `main`), not to the top of the page.
- Respect `prefers-reduced-motion`: show it without the rise animation.

## Content
- Heading: "A note on cookies".
- Body: "We use cookies to enhance your experience and analyze traffic. By clicking ‘Accept All’, you consent to our use of cookies. Learn more".
- Buttons: "Accept All" and "Reject Non-Essential". Keep this exact casing.
- "Learn more" goes to the Cookie Policy page.
