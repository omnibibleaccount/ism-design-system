# Progress
Bars and rings that show how far along a task is, from a file download to day 15 of a reading plan to step 1 of 2 in a sign-up.

## When to use
- Use a determinate bar when you know the total: downloads, uploads, a giving goal.
- Use the indeterminate bar for work of unknown length that runs longer than about 2 seconds, at the top of a panel or page.
- Use the circular ring for compact spots: an upload thumbnail, a reading plan in a list.
- Use step progress at the top of a multi-step form (partner sign-up, giving).
- Use a Loader spinner for short waits with no measurable progress.

## Anatomy & markup
Track + fill, with an optional label row (name left, percent right) and a hint line below.

```html
<div class="fb-prog">
  <div class="fb-prog-head">
    <span class="fb-prog-name" id="dl-label">Downloading Amharic audio Bible</span>
    <span class="fb-prog-val">68%</span>
  </div>
  <div class="fb-track fb-track-lg" role="progressbar" aria-labelledby="dl-label"
       aria-valuenow="68" aria-valuemin="0" aria-valuemax="100">
    <span class="fb-fill" style="width:68%"></span>
  </div>
  <span class="hint">412 MB of 600 MB · about 2 minutes left</span>
</div>

<div class="fb-steps">
  <span class="fb-steps-label" id="step">Step 1 of 2</span>
  <span class="fb-track" role="progressbar" aria-labelledby="step" aria-valuenow="1" aria-valuemin="0" aria-valuemax="2"><span class="fb-fill" style="width:50%"></span></span>
</div>
```

## Variants & states
| Variant | Classes | Notes |
|---|---|---|
| Linear determinate | `.fb-track` > `.fb-fill` | 4px |
| Linear with label | `.fb-prog` + `.fb-prog-head` + `.fb-track-lg` | 8px track, percent in tabular numerals |
| Indeterminate | `.fb-track` > `.fb-indet` | 35% bar loops every 1.4s; omit `aria-valuenow` |
| Circular 64px | `.fb-ring` + SVG (`.fb-ring-track`, `.fb-ring-bar`) + `.fb-ring-val` | 6px stroke, r 28, dasharray 175.9 |
| Circular inline 24px | `.fb-ring-inline` + SVG | 3px stroke, r 9.5, dasharray 59.7; text beside it |
| Step progress | `.fb-steps` + `.fb-steps-label` + `.fb-track` | fills by completed step |

Ring fill: `stroke-dashoffset = dasharray × (1 − value/100)`.

## Rules
- Track `--gray-200`, fill `--horizon-blue`, radius `--radius-xs`. Never use status colours for normal progress.
- 4px by default; 8px (`.fb-track-lg`) only when a label sits above it.
- Rings start at 12 o’clock (the SVG is rotated −90°) with round caps.
- Animate width changes (0.3s); never jump backwards except on a restart.
- Show the percent only when it is accurate. Add a hint line with size and time left when known.
- Step progress: label left ("Step 1 of 2"), bar fills one share per step. Use it only for two to five steps.
- When the task finishes, replace the bar with a success Toast or the next screen. When it fails, show an Alert or Toast with Retry.

## Accessibility
- Every bar and ring has `role="progressbar"` and an accessible name (`aria-label` or `aria-labelledby`).
- Determinate: set `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax`. Indeterminate: leave out `aria-valuenow`.
- Step progress uses step numbers for the values (`aria-valuenow="1" aria-valuemax="2"`) and the visible label as its name.
- Do not announce every percent change. Announce start and finish through a polite live region.
- SVG rings are `aria-hidden="true"`; the wrapper carries the role and values.
- Reduced motion: the indeterminate bar stops; keep the label so the state is still clear.

## Content
- Name the task with a verb and the object: "Downloading Amharic audio Bible", "Uploading photo".
- Hint line: amount and time, plain. "412 MB of 600 MB · about 2 minutes left" (sample figures).
- Reading plans: "Reading plan · day 15 of 30".
- Steps: "Step 1 of 2". Do not add step names to the bar; put them in the page heading.
