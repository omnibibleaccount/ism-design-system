# NumberedList
Ordered content in two forms: large numbered rows (01, 02) for programmes and beliefs, and compact numbered steps (1, 2) for how-it-works instructions.

## When to use
- Numbered rows `.dp-numlist`: Mission & Vision, Statement of Faith, Publishing programmes, anything where each item has a title and one line of explanation.
- Numbered steps `.dp-steps`: short sequences the reader follows, like the NFC card "How it works" or getting started with the dot.Bible app.
- Do not number items that have no order or rank; use ListRow or a Card grid.
- Do not use for more than about six items; split into sections.

## Anatomy & markup
```html
<ol class="dp-numlist">
  <li class="dp-numlist-item">
    <span class="dp-numlist-n" aria-hidden="true">01</span>
    <div class="dp-numlist-body">
      <h3 class="h3">Digital — the dot.Bible app directory</h3>
      <p class="muted">Free Bible apps, searchable by language.</p>
    </div>
  </li>
</ol>

<ol class="dp-steps">
  <li class="dp-step">
    <span class="dp-step-n" aria-hidden="true">1</span>
    <div class="dp-step-body">
      <h3 class="h4">Unlock the phone</h3>
      <p class="muted">NFC reading is on by default on most phones.</p>
    </div>
  </li>
</ol>
```

## Variants & states
- Numbered rows: white card, `--gray-200` border, `--radius-lg`, 32px × 40px padding; hairlines between rows; 32px `--horizon-blue-dim` numerals, two digits.
- Numbered steps: `--gray-100` panel, 20px gap; 32px `--charcoal-900` circles with white numerals.
- Mobile: both reduce padding to 24px; row numerals wrap above the text when space runs out.
- Static content; no interactive states.

## Rules
- Use a real `<ol>` and hide the visual numeral from assistive tech (`aria-hidden="true"`); the list provides the number.
- Rows use two-digit numerals (01, 02); steps use single digits (1, 2).
- Numerals in rows are `--horizon-blue-dim` text, never a Horizon Blue fill.
- One title and at most two short sentences per item.
- Do not put buttons inside items; put one action after the list.

## Accessibility
- The `<ol>` announces "list, 3 items" and each position, so the hidden numeral is not read twice.
- Item titles are headings at the right level for the page (usually `h3`).
- Keep text contrast: `.muted` (`--gray-700`) on white and on `--gray-100` both pass AA.

## Content
- Rows: "Digital — the dot.Bible app directory" / "Free Bible apps, searchable by language."; "Audio — HD radio broadcasts" / "Scripture readings on the airwaves."
- Steps start with a verb: "Unlock the phone", "Tap the card", "Open the link".
