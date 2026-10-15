# Breadcrumbs
A one-line trail under the hero of interior ism.bible pages that shows where the page sits and links back up each level.

## When to use
- Use it on interior pages two or more levels deep: "Home / About ISM / Statement of Faith".
- Do not use it on the home page or on top-level section pages (the header already shows the section).
- Do not use it as primary navigation or inside app screens. Section switching on one page belongs in Tabs.

## Anatomy & markup
A `nav[aria-label="Breadcrumb"]` holding an `ol.nv-bc`. Each level is an `li` with a link and a `/` separator; the last item is a `span[aria-current="page"]`, not a link.

```html
<nav aria-label="Breadcrumb">
  <ol class="nv-bc">
    <li><a href="/">Home</a><span class="nv-bc-sep" aria-hidden="true">/</span></li>
    <li><a href="/about">About ISM</a><span class="nv-bc-sep" aria-hidden="true">/</span></li>
    <li><span aria-current="page">Statement of Faith</span></li>
  </ol>
</nav>
```

Truncated trail (more than four levels):

```html
<li>
  <button type="button" class="nv-bc-more" aria-expanded="false" aria-controls="bc-more" aria-label="Show 2 more levels">…</button>
  <span class="nv-bc-sep" aria-hidden="true">/</span>
  <div class="nv-bc-menu" id="bc-more" hidden>
    <a href="/resources">Resources</a>
    <a href="/resources/publishing">ISM Publishing</a>
  </div>
</li>
```

On dark heroes add `.nv-bc-dark` to the `ol`.

## Variants & states
- **Default:** links `var(--gray-700)`, separators `var(--gray-300)`, current page `var(--black)` 600.
- **Hover:** link turns `var(--black)` with an underline (offset 3px). `.nv-hover` forces it for docs.
- **Focus:** 2px `var(--horizon-blue)` outline, 2px offset, `var(--shadow-focus)`.
- **Truncated:** keep the first item and the last two; fold the middle into `.nv-bc-more` (a 32x28 `var(--gray-100)` chip). Open: `aria-expanded="true"`, the chip gets the blue outline and `.nv-bc-menu` drops below (220px, `var(--radius-md)`, `var(--shadow-overlay)`). Menu rows are 44px; hover is `var(--blue-tint)`.
- **On dark (`.nv-bc-dark`):** links `rgba(255,255,255,.7)`, hover and current `var(--white)`, separators `rgba(255,255,255,.35)`. Use on `var(--black)` or `var(--charcoal-900)` heroes.

## Rules
- Use `/` as the separator. Never use › (that means "drills into an app screen") or ↗.
- Make the last item plain text with `aria-current="page"`. Never link the current page.
- Keep links at 44px tap height (`.nv-bc a` has `min-height:44px`).
- Set it at 14px under the hero, aligned to the page `.wrap`, above the page title.
- Use the page's real titles, matching the header submenus ("About ISM", "Resources").
- Over four levels: show first + last two and fold the rest into the … menu.
- Wrap on narrow screens; never truncate a label with an ellipsis mid-word.

## Accessibility
- Wrap the list in `nav aria-label="Breadcrumb"` and use an ordered list.
- Hide separators from screen readers with `aria-hidden="true"`.
- The … button names what it hides: `aria-label="Show 2 more levels"`, plus `aria-expanded` and `aria-controls`.
- Close the … menu on Esc and on click outside; return focus to the button.

## Content
- Labels are the page names in Title Case, as in the header: "Home / Resources / HD Radio Broadcast".
- Start with "Home", never "ISM" or the logo.
- Keep each label short; drop words like "Page" or "Overview".
