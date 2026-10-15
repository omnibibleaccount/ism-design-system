# Switch
A 46 × 28px toggle switch for settings that take effect at once, shown in a 44px row with a title and a one-line description.

## When to use
- App and account settings that apply immediately: Verse of the day, Download on Wi-Fi only, Play audio automatically.
- Not inside a form that has a Save or Submit button: use Checkbox there.
- Not for choosing between two named options (one-time / monthly): use SegmentedControl.

## Anatomy & markup
```html
<div class="fm-settings">
  <div class="fm-swrow">
    <span class="fm-sw-text">
      <span class="fm-sw-t" id="votd">Verse of the day</span>
      <span class="fm-sw-d">Get one verse each morning at 7:00</span>
    </span>
    <button class="fm-switch" type="button" role="switch" aria-checked="true" aria-labelledby="votd"></button>
  </div>
</div>
```
- `.fm-switch`: 46 × 28px pill track with a 22px white knob that slides 18px.
- `.fm-swrow`: text left, switch right, 20px gap, min 44px tall. The whole row toggles the switch.
- `.fm-settings`: white panel, `--gray-200` border, `--radius-lg`; rows 18px padded with `--gray-100` dividers.

## Variants & states
- Off: `--gray-300` track; hover `--gray-500`.
- On: `aria-checked="true"`, `--horizon-blue` track; hover `--horizon-blue-dim`.
- Focus: 2px `--horizon-blue` outline, 2px offset, `--shadow-focus` (`.fm-focus` for static specs).
- Disabled: `disabled` on the button (45% opacity); add `.fm-disabled` to the row so the title turns `--gray-600`, and say why in the description ("Turn on notifications first").

## Rules
- A switch acts at once. Never pair it with a Save button; if the change can fail, revert the switch and show an `.alert-err` or toast.
- Put the switch on the right, after its label, in every row.
- Label says what is on, not the action: "Verse of the day", not "Turn on verse of the day".
- On is always Horizon Blue; never green, never red for off.
- Make the whole row the 44px tap target.
- Use `.fm-settings` to group related settings; keep groups to about 3–6 rows.

## Accessibility
- `<button role="switch" aria-checked>`; Space and Enter toggle.
- Name with `aria-labelledby` pointing at the title; add the description with `aria-describedby` when it matters.
- Do not rely on the knob position alone: the track colour changes too.
- Announce failures (e.g. could not save) in a polite live region.

## Content
- Titles: "Verse of the day", "Download on Wi-Fi only", "Play audio automatically".
- Descriptions: one plain line on what happens ("Save mobile data when adding languages").
