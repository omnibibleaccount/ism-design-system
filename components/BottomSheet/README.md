# BottomSheet
A panel that slides up from the bottom of an app screen for sharing and quick options, plus the iOS-style action sheet for a short list of commands with Cancel.

## When to use
- Use the bottom sheet for a focused task tied to what is on screen: share a verse, pick a translation, write to an NFC card.
- Use the peek height for a few options; let people drag to expanded (96px from the top) for more.
- Use the action sheet for 2–5 commands on one item (a highlight, a note), especially when one is destructive.
- Do not use a sheet for long forms or reading; push a new screen.
- Do not stack sheets.

## Anatomy & markup
Scrim + sheet. Grab handle, header with a 36px close button, then content.

```html
<div class="ap-scrim ap-scrim-peek"></div>
<div class="ap-sheet" role="dialog" aria-labelledby="sh1">
  <span class="ap-grab" aria-hidden="true"></span>
  <div class="ap-sheet-h"><h3 id="sh1">Share this verse</h3>
    <button class="ap-tb ap-tb-sm" type="button" aria-label="Close">…</button></div>
  <p class="ap-sheet-sub">John 3:16 · Berean Standard Bible</p>
  <div class="ap-share-row"><button class="ap-share-opt" type="button"><i>…</i>Copy</button>…</div>
</div>
```

Action sheet:

```html
<div class="ap-as" role="dialog" aria-modal="true" aria-labelledby="as1">
  <div class="ap-as-grp">
    <div class="ap-as-head"><b id="as1">John 3:16</b><span>Highlighted in gold</span></div>
    <button class="ap-as-row" type="button">…<span>Copy verse</span></button>
    <button class="ap-as-row ap-as-danger" type="button">…<span>Remove highlight</span></button>
  </div>
  <button class="ap-as-cancel" type="button">Cancel</button>
</div>
```

## Variants & states
| Variant | Classes |
|---|---|
| Peek | `.ap-sheet` + `.ap-scrim.ap-scrim-peek` (28% black) |
| Expanded | `.ap-sheet.ap-sheet-full` (top 96px) + `.ap-scrim` (42% black); add `.ap-verse` preview and `.ap-sheet-list` rows |
| List row | `.ap-lrow`; value `.ap-val`, drill-in `.ap-chv` (›) |
| Action sheet | `.ap-as` > `.ap-as-grp` + separate `.ap-as-cancel` |
| Destructive | `.ap-as-danger` (`--error`, 600), always last in the group |

## Rules
- Sheet: white, `--radius-xl` top corners, grab handle 40×5 `--gray-300`.
- Share options are 56px tiles in `--blue-tint` with Horizon Blue icons, four per row.
- Rows that open another screen end with ›; rows that act immediately have no trailing icon.
- Action sheet: inset 10px, `--radius-lg` cards, `--shadow-overlay`. Cancel sits in its own card in Horizon Blue 600.
- Only one destructive row, last in the group. Never make Cancel red.
- Tapping the scrim or dragging down closes the sheet; the close X does the same.
- All rows are at least 52px (action rows 56px).

## Accessibility
- `role="dialog"` with `aria-labelledby` on the title; expanded sheets and action sheets are `aria-modal="true"` and trap focus.
- Move focus to the sheet title on open and back to the trigger on close. Escape closes.
- The grab handle is decorative; always offer the visible Close button or Cancel.
- Respect reduced motion: fade instead of slide.

## Content
- Titles say the task: "Share this verse". Sub-line names the source: "John 3:16 · Berean Standard Bible".
- Commands are verb first: "Copy verse", "Add a note", "Remove highlight".
- Cancel is always "Cancel".
