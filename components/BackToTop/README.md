# BackToTop
A 48px round button fixed at the bottom-right of long pages that scrolls back to the top and returns focus to the start of the content.

## When to use
- Use it on long pages: articles, stories, the Statement of Faith, policy pages, the resource library.
- Show it only after the reader has scrolled about two screen heights.
- Do not use it on short pages or inside app screens and modals.

## Anatomy & markup
```html
<button class="nv-btt nv-btt-fixed" type="button" aria-label="Back to top" hidden>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
</button>
```

One icon-only button: an up arrow in a white circle with a hairline and `var(--shadow-overlay)`. `.nv-btt-fixed` pins it 24px from the bottom-right corner (16px below 768px).

## Variants & states
- **Default:** `var(--white)`, 1px `rgba(0,0,0,.14)` border, `var(--black)` arrow.
- **Hover:** `var(--gray-100)` fill. `.nv-hover` forces it for docs.
- **Focus:** 2px `var(--horizon-blue)` outline, 2px offset, `var(--shadow-focus)` plus the overlay shadow.
- **On dark (`.nv-btt-dark`):** `var(--charcoal-900)` fill, `rgba(255,255,255,.22)` border, white arrow; hover `var(--charcoal-800)`. Switch to it while the button sits over black sections (footer, dark heroes).
- **Hidden:** `hidden` until the reader passes two screens; fade in over 150ms.

## Rules
- Keep it 48x48 (above the 44px minimum), round, bottom-right.
- Use the up arrow only. Never use ⌄, ↗ or ›, and never add a text label beside it.
- Never colour it Horizon Blue; it is a utility, not a primary action.
- Stack it above the cookie banner (`z-index:72` vs `.cookie` 70) and keep clear of it: the banner is bottom-left, this is bottom-right.
- Keep it clear of sticky app banners and chat widgets; move it up by their height if they share the corner.
- One per page.

## Accessibility
- It is a `<button>` with `aria-label="Back to top"`; the SVG is `aria-hidden`.
- On click, scroll to the top and move focus to `main[tabindex="-1"]` (the skip link target), so keyboard users restart at the content.
- Respect `prefers-reduced-motion`: jump instead of smooth-scrolling.
- When hidden use the `hidden` attribute, so it is not in the tab order.

## Content
- Accessible name: "Back to top". No visible text.
