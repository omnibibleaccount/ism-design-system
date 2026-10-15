# DatePicker
A text field with a calendar button inside it that opens a 352px month popover for picking a single future date.

## When to use
- Scheduling: a partner call, an event sign-up, the start of a report range.
- Typed entry is always allowed; the calendar is a helper, not the only way in.
- Birthdays and dates far in the past: use three plain fields (month, day, year), not a calendar.
- Picking a time slot from a short fixed list: use Select or Radio.

## Anatomy & markup
```html
<div class="field">
  <label class="label" for="call-date">Preferred call date</label>
  <div class="fm-adorn">
    <input class="input" id="call-date" type="text" inputmode="numeric"
      placeholder="MM / DD / YYYY" aria-describedby="call-date-hint">
    <button class="fm-calbtn" type="button" aria-label="Choose date" aria-haspopup="dialog" aria-expanded="false">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>
    </button>
  </div>
  <p class="hint" id="call-date-hint">Type a date or pick one from the calendar.</p>
</div>

<div class="fm-pop" role="dialog" aria-label="Choose date">
  <div class="fm-pop-head">
    <button class="fm-nav" type="button" aria-label="Previous month" disabled>…</button>
    <span class="fm-pop-month" aria-live="polite">October 2026</span>
    <button class="fm-nav" type="button" aria-label="Next month">…</button>
  </div>
  <div class="fm-grid" role="grid" aria-label="October 2026">
    <span class="fm-wd" aria-hidden="true">Su</span> …
    <button class="fm-day" type="button" disabled>13</button>
    <button class="fm-day fm-today" type="button" aria-current="date" aria-label="Today, October 14">14</button>
    <button class="fm-day" type="button" aria-selected="true" aria-label="October 18, selected">18</button>
  </div>
  <div class="fm-pop-foot">
    <button class="btn btn-ghost btn-sm" type="button">Today</button>
    <span class="fm-pop-actions">
      <button class="btn btn-secondary btn-sm" type="button">Cancel</button>
      <button class="btn btn-primary btn-sm" type="button">Done</button>
    </span>
  </div>
</div>
```
- `.fm-adorn` wraps the base `.input` and reserves 48px on the right; `.fm-calbtn` is a 36px round icon button inside the field.
- `.fm-pop`: 352px, white, `--gray-200` border, `--radius-lg`, `--shadow-overlay`, 16px padding, 6px below the field.
- `.fm-grid` is seven columns; `.fm-day` cells are 44px tall pills; `.fm-wd` weekday letters are 12px `--gray-600`.

## Variants & states
- Empty: placeholder "MM / DD / YYYY" and a `.hint` line.
- Filled: the date written out in full ("Sunday, October 18, 2026"); button label becomes "Change date, October 18, 2026".
- Error: `aria-invalid="true"` on the input and one `.err` line ("Choose today or a later date.").
- Open: field shows the focus ring (`.fm-focus` in static specs) and the button gets `.fm-on` (`--blue-tint` fill, `--horizon-blue` icon).
- Day hover: `--blue-tint`. Today: 1.5px inset `--horizon-blue` ring, `--horizon-blue-dim` text (`.fm-today`).
- Selected: `aria-selected="true"`, `--horizon-blue` fill, white semibold number.
- Disabled (past or unavailable): `disabled`, `--gray-300` text, no hover.
- Previous-month arrow is disabled when the earlier month has no open dates.

## Rules
- Always let people type the date; parse common formats and rewrite to the long form on blur.
- Disable past dates for scheduling; never hide them, so the grid keeps its shape.
- Mark today with the ring and the selection with the fill; they can sit on the same day.
- The popover footer holds exactly one Horizon Blue primary (Done); Cancel is `.btn-secondary`, Today is `.btn-ghost`.
- Week starts on Sunday for US English; follow the locale elsewhere.
- Keep every day cell and nav arrow at least 44px; never shrink the grid below 320px.
- On phones, open the calendar as a bottom sheet with the same grid.

## Accessibility
- Calendar button: `aria-label` ("Choose date" or "Change date, October 18, 2026"), `aria-haspopup="dialog"`, `aria-expanded`.
- Popover: `role="dialog"` with `aria-label`; month name in a polite live region.
- Days: today gets `aria-current="date"`; the selected day `aria-selected="true"` and a full label ("October 18, selected").
- Keys: arrows move a day / a week, PgUp / PgDn change month, Home / End go to week start / end, Enter picks, Esc closes and returns focus to the calendar button.
- Errors are linked with `aria-describedby` and repeated in the form's validation summary.

## Content
- Label: "Preferred call date". Hint: "Type a date or pick one from the calendar."
- Filled value: "Sunday, October 18, 2026" (day, month and year spelled out).
- Errors: "Choose today or a later date." / "Enter a date like 10 / 18 / 2026."
- Footer: Today, Cancel, Done.
