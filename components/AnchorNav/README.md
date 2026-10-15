# AnchorNav
In-page links for long pages: a sticky "On this page" list beside the content on desktop, and a horizontal sticky anchor bar under the header for product pages and phones.

## When to use
- Use the side list (`.nv-otp`) on long reading pages with 4+ sections: Statement of Faith, Privacy, Terms, Cookie Policy.
- Use the anchor bar (`.nv-abar`) on product pages (dot.Bible App, ISM Radio, NFC Cards) and on every long page below 1024px.
- Do not use it on short pages with fewer than 4 sections.
- Do not use it to switch content in place; that is Tabs. Anchor links scroll to sections that are all on the page.

## Anatomy & markup
```html
<!-- side list -->
<div class="nv-otp-wrap">
  <nav aria-label="On this page">
    <p class="overline nv-otp-h">On this page</p>
    <ul class="nv-otp">
      <li><a href="#scriptures">The Scriptures</a></li>
      <li><a href="#jesus" aria-current="true">Jesus Christ</a></li>
    </ul>
  </nav>
</div>

<!-- horizontal bar, directly under the header -->
<div class="nv-abar">
  <span class="nv-abar-title">dot.Bible App</span>
  <nav class="nv-abar-links" aria-label="On this page">
    <a class="nv-alink" href="#overview">Overview</a>
    <a class="nv-alink" href="#features" aria-current="true">Features</a>
  </nav>
  <a class="btn btn-primary btn-sm" href="#get">Get the app</a>
</div>
```

Lay the side list out in a two-column grid: `240px` list, `minmax(0,1fr)` content, 64px gap.

## Variants & states
- **Side list item:** 40px rows, 15px `var(--gray-700)` on a 2px `var(--gray-200)` rail.
  - Hover: text `var(--black)`.
  - Active (the section in view): `aria-current="true"`, `var(--horizon-blue-dim)` 600 and a `var(--horizon-blue)` rail segment.
  - Focus: blue outline + `var(--shadow-focus)`.
- **Side list position:** `.nv-otp-wrap` is `position:sticky; top:96px` (72px header + 24px).
- **Anchor bar:** 60px white bar, `position:sticky; top:72px`, `var(--gray-200)` bottom hairline. Links 15px/500; active is 600 with a 2px `var(--horizon-blue)` underline. Add `.nv-stuck` once it sticks to show the soft shadow.
- **Anchor bar action:** optional single `.btn-primary .btn-sm` on the right ("Get the app").
- **Below 1024px:** hide the side list; use the bar. Links scroll sideways, never wrap.

## Rules
- Set the active item from scroll position (IntersectionObserver), not on click alone.
- Only one item is active at a time.
- Keep labels identical to the section headings they point to.
- The bar's button is the one Horizon Blue primary in that view. Leave it out when the page hero already has a blue primary in view.
- Give every section `scroll-margin-top` of 96px (side list) or 140px (bar) so headings are not hidden under the sticky header.
- Never use ↗ or › in anchor links; they stay on this page.
- Max 8 items in either form.

## Accessibility
- Wrap each form in `nav aria-label="On this page"`.
- Use `aria-current="true"` (not `"page"`) for the section in view.
- On click, move focus to the target heading (`tabindex="-1"`) so keyboard and screen reader users land there.
- Respect `prefers-reduced-motion`: jump instead of smooth-scrolling.
- Links keep at least 40px height in the list and the full 60px bar height in the bar.

## Content
- Use the section headings: "The Scriptures", "God", "Jesus Christ", "The Holy Spirit", "Salvation", "The Church", "Last Things".
- Product bars: "Overview / Features / Languages / Offline reading / FAQ".
- Bar title is the product name: "dot.Bible App", "ISM Radio".
