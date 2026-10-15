# BookPicker
The book, chapter and verse chooser that opens from the reader's "John 3 ⌄" button: a two-pane panel on desktop and a bottom sheet with steps on mobile.

## When to use
- Use to move around Scripture inside ReadingView and the dot.Bible app.
- Do not use to choose a language; use LanguageRow or a Combobox.
- Do not use as a page-level table of contents for ISM content.

## Anatomy & markup
Desktop panel: header (testament segmented control + breadcrumb), then books list on the left and chapter grid on the right.

```html
<div class="sx-picker" role="dialog" aria-label="Choose a book and chapter">
  <div class="sx-picker-head">
    <div class="sx-seg" role="tablist" aria-label="Testament">
      <button type="button" role="tab" aria-selected="false">Old Testament</button>
      <button type="button" role="tab" aria-selected="true">New Testament</button>
    </div>
    <div class="sx-crumb" aria-label="Current selection"><b>John</b><span aria-hidden="true">›</span><b>3</b><span aria-hidden="true">›</span><span>Verse</span></div>
  </div>
  <div class="sx-picker-body">
    <div class="sx-books" role="listbox" aria-label="Books">
      <button type="button" class="sx-book" role="option" aria-selected="true"><span>John</span><span class="n">21</span></button>
    </div>
    <div class="sx-chapters">
      <span class="sx-lbl">John · 21 chapters</span>
      <div class="sx-grid" role="group" aria-label="Chapters">
        <button type="button" class="sx-num is-read" aria-label="John chapter 1">1</button>
        <button type="button" class="sx-num" aria-current="true" aria-label="John chapter 3">3</button>
      </div>
      <div class="sx-legend"><span><i class="k-on"></i>Current</span><span><i class="k-hover"></i>Hover</span><span><i class="k-read"></i>Read</span></div>
    </div>
  </div>
</div>
```

Mobile sheet (verse step):

```html
<div class="sx-sheet" role="dialog" aria-label="Choose a verse">
  <div class="sx-handle" aria-hidden="true"></div>
  <div class="sx-sheet-head">
    <button type="button" class="sx-ibtn" aria-label="Back to chapters">…</button>
    <span>John 3</span>
    <button type="button" class="sx-ibtn" aria-label="Close">…</button>
  </div>
  <div class="sx-seg sx-seg-full" role="tablist" aria-label="Step">
    <button type="button" role="tab" aria-selected="false">Book</button>
    <button type="button" role="tab" aria-selected="false">Chapter</button>
    <button type="button" role="tab" aria-selected="true">Verse</button>
  </div>
  <div class="sx-grid" role="group" aria-label="Verses">
    <button type="button" class="sx-num" aria-pressed="true" aria-label="Verse 16">16</button>
  </div>
  <button type="button" class="btn btn-primary">Go to John 3:16</button>
</div>
```

## Variants & states
- Desktop panel `.sx-picker` (white, `--radius-lg`, `--shadow-overlay`); books column 240px, scrolls at 384px.
- Mobile sheet `.sx-sheet` over a `.sx-scrim`, with grab handle and a three-step `.sx-seg-full`.
- Book row `.sx-book`: default, hover (`--gray-100`), selected (`aria-selected="true"`: `--blue-tint`, `--horizon-blue-dim`, 600).
- Number cell `.sx-num` (48px tall, 6 per row): default, hover, read (`.is-read`, `--off-white`, muted), current/picked (`aria-current="true"` or `aria-pressed="true"`: solid Horizon Blue, white text).
- Testament and step tabs (`.sx-seg`): selected tab is `--charcoal-900` with white text.
- Under 768px the panel stacks: books above chapters, books list 220px tall.

## Rules
- The trigger is a `.sx-sel` in the reader bar with a caret ⌄, because the picker opens here.
- The breadcrumb uses › between steps, because each step drills into the next screen.
- Show the chapter count beside each book (`.n`) and above the grid ("John · 21 chapters").
- Picking a book loads its chapters; picking a chapter goes to the text (verse step is optional). On mobile, the verse step ends with one full-width `.btn-primary` "Go to John 3:16".
- Only the current chapter or picked verse is Horizon Blue. Read chapters are quiet, never coloured.
- Esc, the Close button or a click outside closes without changing the text.
- Every row and cell is at least 44px tall.

## Accessibility
- The panel and sheet are `role="dialog"` with an `aria-label`; move focus into them on open and back to the trigger on close.
- Books are a `listbox` of `option`s with `aria-selected`; testament and step switches are `tablist`/`tab`.
- Number cells have full labels ("John chapter 3", "Verse 16"); mark the current one with `aria-current="true"`.
- The legend explains colour; never rely on colour alone (current is also bold).
- The sheet's handle is `aria-hidden`; the Back and Close buttons carry the actions.

## Content
- Book names in the reader's language, full form ("1 Corinthians", not "1 Cor").
- Tab labels: "Old Testament" / "New Testament"; steps "Book", "Chapter", "Verse".
- Confirm button names the destination: "Go to John 3:16".
