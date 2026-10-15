# SegmentedControl
A pill-shaped two-option toggle, like One-time / Monthly on Give Online, where the chosen half fills charcoal (white on dark).

## When to use
- Switching between two or three equal, mutually exclusive modes that change what is shown below: gift frequency, Listen / Read, Radio / Podcasts.
- Not for settings that apply on their own: use Switch.
- Not for 4+ options or options that need explanation: use Radio or Select.
- Not for navigation between pages: use tabs or links.

## Anatomy & markup
```html
<div class="fm-seg" role="group" aria-label="Gift frequency">
  <button type="button" class="chip" aria-pressed="false">One-time</button>
  <button type="button" class="chip" aria-pressed="true">Monthly</button>
</div>

<!-- on dark sections -->
<div class="fm-seg fm-seg-dark" role="group" aria-label="Gift frequency">…</div>
```
- Track `.fm-seg`: `--gray-100` pill, 4px padding, 8px gap, two equal columns, max 420px wide.
- Segments are the base `.chip` (44px tall pill, 15px semibold) with transparent border and background.

## Variants & states
- Light: selected segment `--charcoal-900` fill, white text; unselected `--charcoal-900` text on the track.
- Dark (`.fm-seg-dark`, inside `.on-dark` / `.sec-ink` or on `--black`): track `rgba(255,255,255,.1)`; selected segment white with black text; unselected white text.
- Hover: base `.chip` border darkens on the unselected segment.
- Focus: base `.chip:focus-visible` ring (2px `--horizon-blue`, 2px offset).

## Rules
- Exactly one segment is pressed at all times; pre-select the default (Monthly on Give Online).
- Selection is charcoal, not Horizon Blue: the blue primary belongs to the Give button below it.
- Keep labels to one or two words, same length where possible.
- Use two segments; three at most. Equal widths always.
- Changing the segment updates content right away; it never submits a form.
- Do not add icons or counts inside segments.

## Accessibility
- Use `role="group"` with an `aria-label`, and `aria-pressed` on each button. For a true single-choice form value, a radio group styled the same way is also fine.
- Each segment is at least 44px tall.
- Announce the effect if content below changes a lot (e.g. the amount options) in a polite live region.

## Content
- "One-time" / "Monthly". "Listen" / "Read".
- Follow-up line under the control: "Monthly gifts help plan HD Radio and app work a year ahead."
