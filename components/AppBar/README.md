# AppBar
The top bar of a mobile app screen: status bar, a 56px row with back, title and icon actions, and an optional large title or search field.

## When to use
- Use at the top of every screen in ISM apps such as dot.Bible.
- Use the large title on root screens (Bible, Saved, Settings); collapse it to the centred 17px title once the content scrolls.
- Use the back ‹ variant on any screen reached by drilling in (a chapter, a setting).
- Use search mode when the reader taps the search field; it replaces the whole bar until Cancel.
- Do not use it on websites; use SiteHeader there.

## Anatomy & markup
Status bar `.ap-sb` (40px) + `.ap-bar` row (56px). Inside a phone frame use `.ap-screen`; for isolated specimens use `.ap-iso`.

```html
<div class="ap-sb"><span>9:41</span>…</div>
<div class="ap-bar">
  <button class="ap-back" type="button"><svg …><path d="M15 18l-6-6 6-6"/></svg><span>Books</span></button>
  <span class="ap-bar-title">John 3</span>
  <button class="ap-tb" type="button" aria-label="Share">…</button>
  <button class="ap-tb" type="button" aria-label="More">…</button>
</div>
```

Large title: `.ap-bar.ap-bar-end` (actions only) + `<h1 class="ap-large">Bible</h1>` + `.ap-px` wrapping an `.ap-field` search field.

## Variants & states
| Variant | Classes |
|---|---|
| Large title | `.ap-bar-end` + `.ap-large` (32/600) |
| Collapsed | wrap status bar and bar in `.ap-bar-scrolled` (glass white + hairline); balance the title with `.ap-tb-ghost` |
| Back + actions | `.ap-back` (Horizon Blue, `--blue-on-dark` on dark) + up to three `.ap-tb` |
| Search mode | `.ap-bar.ap-bar-search` + `.ap-field.ap-is-focus` + `.ap-clear` + `.ap-cancel` |
| Dark reader | parent `.ap-dark`; back turns `--blue-on-dark`, reader text white 88% |
| Over imagery | `.ap-iso.ap-dark.ap-over` + `.ap-img` + `.ap-img-scrim`; icons `.ap-tb-glass` |

## Rules
- Every icon button is a 44×44 `.ap-tb`. Never shrink tap targets to fit more icons; move extras into More (⋯).
- At most three trailing actions. Order: primary action first (Share), More last.
- Back shows ‹ plus the parent screen name, never "Back".
- The hairline and glass appear only after scroll. A root screen at rest has no border.
- Over imagery, always add `.ap-img-scrim` and glass buttons; never put bare white icons on a photo.
- Titles are one line and ellipsize; keep them under 20 characters.
- Search field: 48px, `--radius-md`, `--gray-100` at rest, white with the Horizon Blue focus ring when active.

## Accessibility
- Make the title the screen's heading (`h1` for large titles; announce screen changes).
- Give every icon-only `.ap-tb` an `aria-label` ("Share", "More", "Search").
- Back must be a real button with its visible label; screen readers read "Books, button".
- Put `role="search"` on the search bar; Clear has `aria-label="Clear search"`.
- Keep the status bar decorative (`aria-hidden` icons).

## Content
- Titles name the place: "Bible", "John 3", "Settings", "Saved".
- Search placeholder says what can be found: "Search books and verses", "Search 500+ languages".
- Over-image kicker + title: "Reading plan" / "7 days in the Psalms".
