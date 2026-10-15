# SearchResults
The in-app search screen: focused field with Cancel, recent searches, results grouped by type with highlighted matches, and a helpful no-results state.

## When to use
- Use when the reader taps search in the AppBar of dot.Bible or another ISM app.
- Use groups (Languages, Verses, Pages) whenever results come from more than one source.
- Do not use for filtering a short list already on screen; filter in place.

## Anatomy & markup
Search bar (`.ap-bar.ap-bar-search`), then `.ap-res-h` group headers and `.ap-res` rows.

```html
<div class="ap-bar ap-bar-search" role="search">
  <div class="ap-field ap-is-focus">…<input type="search" aria-label="Search" value="swa">
    <button class="ap-clear" type="button" aria-label="Clear search">…</button></div>
  <button class="ap-cancel" type="button">Cancel</button>
</div>
<div class="ap-res-h"><span>Languages</span><span class="count">2</span></div>
<a class="ap-res" href="#">
  <i class="ap-lt" aria-hidden="true">SW</i>
  <span class="ap-tt"><span class="ap-t"><mark class="ap-hl">Swa</mark>hili</span><span class="ap-s">Kiswahili · Bible + audio</span></span>
  <span class="ap-chv">…</span>
</a>
```

## Variants & states
| State | Pieces |
|---|---|
| Focused, empty | Recent list (`.ap-res` with clock icon + `.ap-rm` remove), `.ap-res-action` Clear, "Try" `.ap-chips` |
| Results | Grouped `.ap-res-h` + `.count`; tiles `.ap-lt` (language), `.ap-lt-verse` (verse), `.ap-lt-page` (web page) |
| No results | `.ap-empty` with `.ap-empty-ic`, title, hint and one `.btn-secondary.btn-sm` |

## Rules
- Highlight the matched characters with `mark.ap-hl` (blue tint, `--horizon-blue-dim`, 600). Highlight only the match, never the whole row.
- In-app results end with › (drills into an app screen). Results that open the website end with ↗.
- Result rows are at least 56px; remove buttons are 44px.
- Group order: Languages, Verses, Pages. Counts use `.count` in Horizon Blue, never red.
- Show at most five rows per group, then a "See all" `.ap-res-action`.
- Recent searches: newest first, five at most, each removable, plus Clear for all.
- The no-results state offers one secondary action. No blue primary on this screen.

## Accessibility
- `role="search"` on the bar; the input has an accessible name.
- Announce result counts in a polite live region ("2 languages, 14 verses, 1 page").
- `mark` is fine for screen readers; do not split words with extra elements.
- ↗ rows need text that says they open the website (`aria-label` on the ↗ or in the row name).
- Cancel returns focus to the search trigger.

## Content
- Placeholder: "Search languages, verses".
- Language results show the English name, the native name and what is available: "Kiswahili · Bible + audio".
- Verse results show the reference and a short snippet with ellipses.
- No results: "No results for “xqz”" + "Check the spelling, or try a book name like “John” or a language like “Amharic”." + "Browse all languages".
