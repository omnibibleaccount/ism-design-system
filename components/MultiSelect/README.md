# MultiSelect
A tag input that grows from 48px, holds removable chips for each pick, and opens a type-to-filter list with checkboxes that stays open while picking.

## When to use
- Picking several values from a long list: languages a church serves, countries a broadcast partner covers, newsletter topics.
- 8 or more options. For fewer, use `.check` rows (Checkbox).
- Only one value: use Select or Combobox.

## Anatomy & markup
```html
<div class="field">
  <label class="label" for="langs">Languages your church serves</label>
  <div class="fm-tags">
    <span class="fm-tag">Amharic<button class="fm-tag-x" type="button" aria-label="Remove Amharic">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span>
    <input class="fm-ti" id="langs" type="text" role="combobox" aria-expanded="false"
      aria-controls="langs-list" aria-autocomplete="list" placeholder="Add more">
    <button class="fm-tags-caret" type="button" aria-label="Show all languages" tabindex="-1">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
  </div>
  <p class="hint">3 selected · Bibles in 500+ languages on dot.Bible</p>
</div>

<div class="fm-menu fm-menu-float" id="langs-list" role="listbox" aria-multiselectable="true" aria-label="Languages">
  <div class="fm-menu-head">4 matches</div>
  <button class="fm-o" type="button" role="option" aria-selected="true">
    <span class="fm-mbox"><svg …tick…/></span>Spanish<span class="fm-dial">Español</span></button>
</div>
```
- `.fm-tags`: field shell (white, 1px `rgba(0,0,0,.22)` border, `--radius-md`), min 48px, wraps chips onto new lines; 48px right padding keeps clear of the caret.
- `.fm-tag`: 34px pill on `--blue-tint` with `--horizon-blue-dim` semibold text and a 30px round `.fm-tag-x` remove button.
- `.fm-ti`: borderless input that takes the remaining space (min 80px).
- List rows reuse `.fm-o` with a 20px `.fm-mbox` checkbox; the native name sits right in `.fm-dial`.

## Variants & states
- Empty: placeholder "Choose languages".
- Filled: chips in the order they were added, then the input with "Add more" and a count in the `.hint`.
- Focus: `:focus-within` (or `.fm-focus`) gives the `--horizon-blue` border and `--shadow-focus`.
- Open (`.fm-open`): caret rotates 180°; the list filters as you type and the head shows the match count.
- Option selected: `aria-selected="true"` fills `.fm-mbox` `--horizon-blue` with a white tick, text `--horizon-blue-dim`.
- Option hover / keyboard-active (`.fm-active`): `--blue-tint`.
- Error: `.fm-err` on the shell (`--error` border on `--error-field-bg`), `aria-invalid="true"` on the input and one `.err` line ("Choose at least one language.").

## Rules
- Picking toggles: selected options keep their place in the list and show a filled box. Do not move them to the top.
- Keep the list open while picking; close on Esc, Tab or click outside.
- Chips wrap onto new lines; never scroll sideways.
- Backspace in the empty input removes the last chip.
- The caret ⌄ means the list opens here.
- Use chips only for picked values; never as filters or links.
- Every remove button is a real 30px button inside the 34px chip; the chip row itself stays 44px+ tall with the field.

## Accessibility
- Input: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete="list"`.
- List: `role="listbox"` with `aria-multiselectable="true"`; rows `role="option"` with `aria-selected`.
- Each × is named "Remove Amharic". After removal, move focus to the input.
- Announce changes politely ("Swahili added, 4 selected").
- Native names (Español, Kiswahili) carry a `lang` attribute when rendered in their script.

## Content
- Label: "Languages your church serves". Placeholder: "Choose languages" when empty, "Add more" once filled.
- Hint: "3 selected · Bibles in 500+ languages on dot.Bible".
- List head: "4 matches"; empty: "No languages match. Try the English or native name."
- Show the English name first and the native name on the right: Swahili · Kiswahili.
