# Radio
A 20px radio button with a 6px Horizon Blue ring when selected, used in a fieldset group where exactly one option can be picked.

## When to use
- 2–5 options, only one can be picked, and all should stay visible (gift frequency, "How did you hear about ISM?").
- Card-style rows (`.check` + `.fm-radio`) when each option needs a one-line description (partnership type).
- More than 5 options: use Select. Several can be picked: use Checkbox. Two options that switch a view or price (one-time / monthly): use SegmentedControl.

## Anatomy & markup
```html
<fieldset class="fm-fieldset">
  <legend class="fm-legend">How often would you like to give?</legend>
  <label class="fm-row"><input class="fm-radio" type="radio" name="freq">One-time</label>
  <label class="fm-row"><input class="fm-radio" type="radio" name="freq" checked>Monthly</label>
  <label class="fm-row fm-disabled"><input class="fm-radio" type="radio" name="freq" disabled>Annually <span class="hint">(coming soon)</span></label>
</fieldset>

<!-- card rows -->
<label class="check">
  <input class="fm-radio" type="radio" name="partner" checked>
  <span class="fm-check-body">
    <span class="fm-check-t">Church partner</span>
    <span class="hint">Equip your congregation and community</span>
  </span>
</label>
```
- `.fm-fieldset` resets the browser fieldset; `.fm-legend` is the group question (14px semibold, like `.label`).
- `.fm-row` is a 44px row; the whole label is clickable.

## Variants & states
- Default: 1.5px `rgba(0,0,0,.4)` ring on white; hover turns it black.
- Selected: 6px `--horizon-blue` border, white centre.
- Focus: 2px `--horizon-blue` outline, 2px offset, `--shadow-focus` (`.fm-focus` draws it statically).
- Disabled: `--gray-100` fill, `--gray-300` ring, label `--gray-600` (`.fm-row.fm-disabled`).
- Error: `aria-invalid="true"` on every radio in the group, `--error` ring on `--error-bg`; one `.err` under the group.
- Card row: `.check` turns `--horizon-blue` border on `--blue-tint` when its radio is checked; `.check.fm-disabled` greys out.

## Rules
- Always wrap a group in `<fieldset>` + `<legend>`; the legend asks the question.
- Pre-select the most common safe choice (e.g. Monthly) only when it is not a commitment the person did not choose; never pre-select in surveys.
- Stack options vertically; go horizontal (`.fm-radios`, 3 columns) only for short labels inside FormLayout.
- Keep the 44px row height; do not shrink the circle below 20px.
- Explain disabled options in a hint ("coming soon", "Opens in 2027").
- One error message per group, not per radio.

## Accessibility
- Same `name` on every radio in a group. Arrow keys move and select; Tab enters and leaves the group.
- Link the group error with `aria-describedby` on the fieldset.
- Do not rely on colour alone: the selected ring is thicker as well as blue.

## Content
- Legend as a question: "How often would you like to give?", "How did you hear about ISM?".
- Options short and parallel: "HD Radio broadcast", "The dot.Bible app", "A friend or church".
- Error: "Please choose one option."
