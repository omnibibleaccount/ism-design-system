# Checkbox
A 20px checkbox with 6px corners for single yes/no choices, and full-width `.check` row cards for choosing several options from a short list.

## When to use
- Single inline checkbox (`.fm-inline` + `.fm-check`): consent and one-off choices ("I agree to the Terms", "Send me prayer updates").
- Check rows (`.check`): pick any number from 2–7 options that each need a line of explanation (partnership types, newsletter topics).
- 8 or more options, or a searchable list: use MultiSelect.
- Only one may be picked: use Radio. A setting that takes effect at once: use Switch.

## Anatomy & markup
```html
<!-- single inline -->
<label class="fm-inline">
  <input class="fm-check" type="checkbox">
  <span>I agree to the <a href="/terms">Terms</a></span>
</label>

<!-- check rows -->
<fieldset class="fm-fieldset">
  <legend class="fm-legend">How would you like to partner with ISM?</legend>
  <label class="check">
    <input type="checkbox" checked>
    <span class="fm-check-body">
      <span class="fm-check-t">Church partner</span>
      <span class="hint">Equip your congregation and community</span>
    </span>
  </label>
</fieldset>
```
- `.fm-inline`: the whole label is the 44px target; the box sits 12px from the text.
- `.check` (base class): white card, hairline border, `--radius-md`; turns `--horizon-blue` border on `--blue-tint` when checked.

## Variants & states
- Unchecked: 1.5px `rgba(0,0,0,.4)` border on white; hover darkens to black.
- Checked: `--horizon-blue` fill with a white tick.
- Indeterminate: blue fill with a white dash. Set `el.indeterminate = true` in script (or `.fm-mixed` for static specs) and `aria-checked="mixed"`.
- Disabled: `--gray-100` fill, `--gray-300` border; label in `--gray-600` via `.fm-inline.fm-disabled`. Checked-disabled fills `--gray-300`.
- Error: `aria-invalid="true"` gives an `--error` border on `--error-bg`; add one `.err` line under it, linked with `aria-describedby`.
- Focus: 2px `--horizon-blue` outline, 2px offset, plus `--shadow-focus`.
- `.check.fm-disabled`: `--off-white` card, title in `--gray-600`.

## Rules
- Always wrap the box and its text in one `<label>`, so the text is clickable.
- Use a real `<input type="checkbox">`; never a styled div.
- Do not pre-check consent or marketing boxes.
- Group related check rows in a `<fieldset>` with a `.fm-legend` question.
- Mark optional boxes "(optional)" in `.hint` style; required consent gets an error if left unticked on submit.
- Checked state is Horizon Blue only; never use green for "checked".
- Keep rows at least 44px tall; do not shrink the box below 20px.

## Accessibility
- Native checkbox semantics; Space toggles.
- Error text is linked with `aria-describedby` and repeated in the form's validation summary.
- Indeterminate state must also set `aria-checked="mixed"` and say what it summarises ("3 of 12").
- Links inside the label (Terms) stay focusable and keep their underline.

## Content
- Consent: "I agree to the Terms and Privacy Policy".
- Opt-in: "Send me partner news and prayer updates (optional)".
- Row titles are short nouns ("Broadcast partner"); the hint says what it means in one line ("Carry scripture on your HD channel").
- Error: "Please accept the Terms to continue."
