# SkipLink
The first focusable element on every page: an off-screen "Skip to content" link that appears as a white pill over the header on the first Tab press and jumps keyboard users past the navigation.

## When to use
- Use it on every ism.bible page and every page built from the website kit, as the first element in `body`.
- Use it in web apps with a repeated header or side navigation.
- Do not hide it permanently or remove it because "nobody sees it". Keyboard and screen reader users rely on it.

## Anatomy & markup
```html
<body>
  <a class="skip nv-skip" href="#main">Skip to content</a>
  <header class="hdr">…</header>
  <main id="main" tabindex="-1">…</main>
</body>
```

`.skip` (shared layer) keeps it off-screen at `left:-9999px`. `.nv-skip` sets the website look: 15px/600 black text on a white pill, 12px from the top. On focus it moves to `left:16px` and shows the focus ring.

## Variants & states
- **Hidden (page load):** off-screen, still first in the tab order.
- **Focused (first Tab):** white pill at top-left 16px over the black header, 2px `var(--horizon-blue)` outline, 2px offset, `var(--shadow-focus)`. `.nv-shown` forces this for docs.
- **Activated:** the page scrolls to `main`, and focus moves to `main[tabindex="-1"]`. The link hides again when it loses focus.

## Rules
- Make it the very first focusable element, before the header, cookie banner and any app banner.
- Point it at `#main` and give `main` `tabindex="-1"` so focus actually moves.
- Keep it above everything (`z-index:100`) so it is never hidden under the fixed header.
- Hide it with off-screen positioning, never with `display:none` or `visibility:hidden` (that removes it from the tab order).
- Keep the white pill on the black header; never colour it Horizon Blue.
- One skip link per page. Add a second ("Skip to search") only in apps with a large side navigation.
- Keep its height at least 44px including padding on touch devices.

## Accessibility
- It is a real link (`<a href="#main">`), not a button.
- The visible text is the accessible name; do not add `aria-label`.
- BackToTop also returns focus to the same `main` target, so both land the reader in the same place.
- Test it: load the page, press Tab once, press Enter, and check that the next Tab lands inside the content.

## Content
- Text: "Skip to content". In other site languages, translate it (for example "Saltar al contenido").
