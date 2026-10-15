# Chip
A pill toggle (`.chip` with `aria-pressed`) for filtering a list or picking a preset value such as a gift amount.

## When to use
- Use to filter content in place: resources by topic, languages, programs.
- Use for amount presets on Give ($25, $50, $100, Other).
- Do not use for actions that go somewhere; use Button or Link.
- Do not use for status labels; use Badge. For a removable applied filter, use the tag in Badge.

## Anatomy & markup
A 44px pill with a 1px `rgba(0,0,0,.28)` border and a 15px semibold label. Pressed = solid black with white text.

### React
There is no dedicated React component. Render a `<button className="chip">` and drive `aria-pressed` from state.
```js
React.createElement('button', { type: 'button', className: 'chip', 'aria-pressed': on ? 'true' : 'false', onClick: toggle }, 'Amharic')
```

### HTML / CSS
```html
<div role="group" aria-label="Filter resources">
  <button type="button" class="chip" aria-pressed="true">All</button>
  <button type="button" class="chip" aria-pressed="false">About ISM</button>
  <button type="button" class="chip" aria-pressed="false">Apps</button>
  <button type="button" class="chip" aria-pressed="false">Giving</button>
</div>
```
Lay chips out with `display:flex; flex-wrap:wrap; gap:8px` (`--space-2`).

## Variants & states
- Default: white fill, `rgba(0,0,0,.28)` border.
- Hover: border goes black.
- Pressed (`aria-pressed="true"`): black fill, white text.
- Focus: shared focus ring (2px Horizon Blue + `--shadow-focus`).
- Single-choice group (filters with "All", amount presets): pressing one releases the others.
- Multi-choice group (languages): each chip toggles on its own.

## Rules
- Pressed chips are black, never Horizon Blue; blue stays reserved for the one primary button.
- Keep chips 44px tall (`--tap-target`).
- A single-choice filter always starts with "All" pressed.
- Amount presets: three amounts plus "Other", with the middle amount pressed by default; "Other" reveals the amount field (see Input).
- Keep chips text only: no icons, flags or emoji.

## Accessibility
- Use `<button type="button">` with `aria-pressed`; wrap the set in `role="group"` with an `aria-label`.
- Filter results must update a live region or the visible count so screen-reader users hear the change.
- Colour is not the only signal: pressed chips invert fill and text.

## Content
- One or two words, sentence case: "All", "About ISM", "Apps", "Giving", "HD Radio".
- Amounts show the currency symbol and no decimals: "$50". Amounts shown are samples.
