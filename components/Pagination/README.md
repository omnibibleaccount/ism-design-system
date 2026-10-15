# Pagination
Moves through a long list split into pages (news, resources, partner lists): numbered pages with Previous / Next, a compact "Page 3 of 12" form, or a Load more button.

## When to use
- Use numbered pagination for lists people browse and return to, where the URL should hold the page: news, stories, the resource library.
- Use compact pagination on phones and in tight spaces such as cards and side panels.
- Use Load more for feeds people scan once, such as partner stories or radio episodes.
- Do not paginate lists under about 12 items; show them all.

## Anatomy & markup
```html
<nav class="nv-pg" aria-label="Pagination">
  <a class="nv-pg-nav" href="?page=4"><svg class="nv-ico" …><path d="M19 12H5M12 19l-7-7 7-7"/></svg>Previous</a>
  <span class="nv-pg-space"></span>
  <a class="nv-pg-btn" href="?page=1">1</a>
  <span class="nv-pg-gap" aria-hidden="true">…</span>
  <a class="nv-pg-btn" href="?page=4">4</a>
  <a class="nv-pg-btn" href="?page=5" aria-current="page">5</a>
  <a class="nv-pg-btn" href="?page=6">6</a>
  <span class="nv-pg-gap" aria-hidden="true">…</span>
  <a class="nv-pg-btn" href="?page=12">12</a>
  <span class="nv-pg-space"></span>
  <a class="nv-pg-nav" href="?page=6">Next<svg class="nv-ico" …><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
</nav>

<!-- compact -->
<nav class="nv-pg-compact" aria-label="Pagination">
  <a class="nv-pg-round" href="?page=2" aria-label="Previous page">…</a>
  <span class="nv-pg-status" aria-live="polite">Page <b>3</b> of 12</span>
  <a class="nv-pg-round" href="?page=4" aria-label="Next page">…</a>
</nav>

<!-- load more -->
<div class="nv-more">
  <span class="small muted">Showing 12 of 48</span>
  <div class="nv-bar"><span style="width:25%"></span></div>
  <button class="btn btn-secondary" type="button">Load more</button>
</div>
```

## Variants & states
- **Page button (`.nv-pg-btn`):** 44px round, 15px/500 `var(--charcoal-900)`. Hover `var(--gray-100)`. Focus: blue outline + `var(--shadow-focus)`. Current: filled `var(--charcoal-900)`, white 600, `aria-current="page"`.
- **Gap (`.nv-pg-gap`):** an `…` that is not clickable.
- **Previous / Next (`.nv-pg-nav`):** outlined 44px pills with arrows. At the ends: `aria-disabled="true"` (opacity .45, not clickable).
- **First page:** Previous disabled; show 1 2 3 … 12.
- **Compact (`.nv-pg-compact`):** 44px round arrow buttons (`.nv-pg-round`) either side of "Page 3 of 12".
- **Load more:** default `.btn-secondary`; loading adds `aria-busy="true"` and a `.nv-spin-dark` spinner with "Loading"; all loaded swaps the button for `.nv-done` "You've seen them all". The `.nv-bar` uses `var(--gradient-line)` to show progress.

## Rules
- Show first, last, current ±1, and `…` for gaps. Never show more than 7 page numbers.
- The current page is filled charcoal, not Horizon Blue. Pagination never takes the group's blue primary.
- Keep every target at 44px (`.nv-pg-btn`, `.nv-pg-nav`, `.nv-pg-round`).
- Keep Previous and Next in place at the ends; disable them, never hide them, so the row does not jump.
- Use real links with `?page=` URLs for numbered pagination so pages can be shared.
- Use `→`-style arrows only (inline SVG). Never use ↗ or › here.
- Load more: always say how many are shown ("Showing 12 of 48"), and append in place without moving scroll.
- Centre numbered pagination under the list, 40–48px below the last item.

## Accessibility
- Wrap in `nav aria-label="Pagination"`.
- Mark the current page with `aria-current="page"`; give arrow-only buttons `aria-label="Previous page"` / `"Next page"`.
- Hide `…` gaps with `aria-hidden="true"`.
- Compact status uses `aria-live="polite"` so the new page is announced.
- After Load more, move focus to the first new item and announce "12 more stories loaded".

## Content
- Labels: "Previous", "Next", "Load more", "Loading", "You've seen them all".
- Counts are real ("Showing 12 of 48" in the preview is a sample).
- Status: "Page 3 of 12", with the current number in bold.
