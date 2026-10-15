# Accordion
The FAQ accordion: rounded, bordered rows built on native `<details>`/`<summary>` that open in place with a plus that turns to a cross.

## When to use
- Use for FAQs and other sets of short, independent answers people scan by question.
- Use on the FAQ page, at the foot of product pages (dot.Bible app, NFC cards, HD Radio) and in giving help.
- Do not hide content everyone needs (prices, key steps, legal terms people must read); show it.
- Do not nest accordions or put forms inside one.

## Anatomy & markup
```html
<div class="acc dp-acc-panel">   <!-- drop .dp-acc-panel to sit straight on the page -->
  <details open>
    <summary>What does ISM do?</summary>
    <div class="ans"><p>We make scripture accessible through apps, radio, publishing and NFC share cards.</p></div>
  </details>
  <details>
    <summary>Are your Bible apps free?</summary>
    <div class="ans"><p>Yes. Every app in the dot.Bible directory is free to download.</p></div>
  </details>
</div>
```
The row styles (`.acc`, `details`, `summary`, `.ans`) come from the base layer; `.dp-acc-panel` adds the optional `--gray-100` panel.

## Variants & states
- Closed: white row, `--border-hairline-light` border, `--radius-ml` corners, 30px circular plus on the right.
- Open: border turns to 45% Horizon Blue, the plus rotates 45° into a cross, answer shows below in `--gray-700` 16px.
- Hover: pointer cursor on the summary; no colour change.
- Focus: `summary:focus-visible` gets the Horizon Blue outline and `--shadow-focus`.
- Panel: `.dp-acc-panel` places the rows on a `--gray-100` card with `--radius-lg` and 24px padding.

## Rules
- The caret/plus means "opens here". Never use ↗ or › on an accordion row.
- Open the first item by default on the FAQ page only; elsewhere start all closed.
- Several rows may be open at once; do not force exclusive opening.
- Keep 12px between rows (`.acc` gap). Summary row is at least 44px tall.
- Put links inside answers in `--horizon-blue`; links to another page end in ↗.
- Do not add icons or numbers before the question.

## Accessibility
- Native `<details>`/`<summary>` give keyboard and screen-reader support for free: Enter/Space toggles, state is announced.
- Do not replace `summary` with a `div` or add `role="button"`.
- Write questions as full questions so they make sense out of context in a screen-reader list.
- Respect reduced motion: the base layer turns off the plus rotation transition.

## Content
- Questions in the reader's words, ending with "?": "Are your Bible apps free?"
- Answers start with the answer ("Yes.", "No.", "Within 5 days.") then one or two plain sentences.
- Keep each answer under about 60 words; link out for more.
