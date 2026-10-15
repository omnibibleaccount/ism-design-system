# SearchField
A 48px search input with a magnifier on the left and a round clear button that appears once there is text.

## When to use
- Site search, FAQ filters, filtering a list already on the page.
- Not for picking one value from a list: use Combobox (search + dropdown) or Select.
- Not for the homepage Bible directory: use the hero Combobox.

## Anatomy & markup
```html
<form class="field" role="search">
  <label class="label" for="q">Search</label>
  <div class="fm-sf">
    <svg class="fm-sf-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
    <input class="input" id="q" type="search" placeholder="Search programs, FAQs, pages" autocomplete="off">
    <button type="button" class="fm-sf-clear" aria-label="Clear search" hidden>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <p class="hint">Press Enter to see results.</p>
</form>
```
- `.fm-sf` wraps the input and positions the icon (16px from the left) and the clear button (8px from the right).
- The input is the base `.input` (48px, `--radius-md`), padded to 46px on the left.

## Variants & states
- Empty: placeholder in `--gray-placeholder`, no clear button.
- Filled: `.fm-sf-clear` visible (32px circle on `--gray-100`, hover `--gray-200`).
- Focus: base `.input` focus, `--horizon-blue` border plus `--shadow-focus`. Use `.fm-focus` only to draw it static in specs.
- Error: rare; use `aria-invalid="true"` and an `.err` line under the field.

## Rules
- Always give the field a visible `.label`. The placeholder is an example, not the label.
- Show the clear button only when the field has text; hide it with `hidden`.
- Hide the browser's own cancel button; `.fm-sf` already does this.
- Wrap in `<form role="search">` so Enter submits.
- Keep the field 48px tall. On dark sections, place it on a white card; do not invert it.
- The clear button is 32px visually; keep the whole field row at least 44px for touch.

## Accessibility
- `type="search"` inside `role="search"` landmark.
- Clear button: `aria-label="Clear search"`; after clearing, return focus to the input.
- Esc clears the field. Enter submits.
- Icon is decorative: `aria-hidden="true"`.

## Content
- Label: "Search". Placeholder: "Search programs, FAQs, pages".
- Hint: "Press Enter to see results."
- No results: "No pages match “tap card”. Try a shorter word."
