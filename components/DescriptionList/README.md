# DescriptionList
Key-value rows for order and giving details, plus a stacked definition list for glossaries.

## When to use
- Key-value `.dp-kv`: order confirmations, giving receipts, station details, account summaries.
- Definition list `.dp-dl`: glossaries and "what this means" panels (HD Radio, NFC, BSB).
- Do not use for many records side by side; use Table.
- Do not use for editable settings; use form fields or list rows with switches.

## Anatomy & markup
```html
<div class="card card-flat">
  <div class="dp-kv-head"><h3 class="h4">Order details</h3><span class="badge badge-success"><span class="dp-dot"></span>Shipped</span></div>
  <dl class="dp-kv">
    <dt>Order number</dt><dd class="dp-num">ISM-24817</dd>
    <dt>Item</dt><dd>NFC Bible cards × 50</dd>
    <dt>Subtotal</dt><dd class="dp-num">$45.00</dd>
    <dt class="dp-kv-tot">Total</dt><dd class="dp-kv-tot dp-num">$51.50</dd>
  </dl>
</div>

<dl class="dp-dl">
  <div><dt>HD Radio</dt><dd>Digital radio that carries extra channels on one FM signal.</dd></div>
</dl>
```

## Variants & states
- Key-value: two columns (key up to 180px, value fills), 14px row padding, `--gray-100` hairlines between rows, none above the first.
- Total row: `.dp-kv-tot` on both `dt` and `dd`; 18px/600 black with a stronger `--gray-300` rule above.
- Value can hold a badge or a small link; the row stays one line where possible.
- Definition list: term 16px/600 black over definition 15px `--gray-700`, 20px between pairs.

## Rules
- Keys are `--gray-600`, values `--charcoal-900` at weight 500 and right-aligned.
- Put money and IDs in `.dp-num` so digits line up.
- Keep the total last. Never colour the total; the weight and rule do the work.
- Sit a key-value list inside `.card.card-flat` with a `.h4` title row (`.dp-kv-head`); the status badge goes on the right.
- In `.dp-dl`, wrap each `dt`/`dd` pair in a `div`.
- Links inside a value use `--horizon-blue`; one that leaves the page ends in ↗.

## Accessibility
- Use real `<dl>`, `<dt>`, `<dd>` so screen readers announce pairs.
- Status in a value is a word in a badge, never colour alone.
- On narrow screens, values may wrap; do not truncate amounts or order numbers.

## Content
- Keys are short nouns in sentence case: Order number, Placed, Item, Language, Shipping, Total.
- Dates written out: 14 October 2026. Currency with symbol and two decimals.
- Definitions are one or two plain sentences; no jargon inside the definition.
- Mark sample orders and prices as samples in mock-ups.
