# Select
A field-styled dropdown button with a caret that opens a short listbox of fixed options 6px below the field.

## When to use
- Pick one value from 2–10 fixed options (contact topic, gift fund, country of a short list).
- 2–5 options that should all stay visible: use Radio instead.
- Long or searchable lists (languages, countries): use Combobox.
- Picking several: use MultiSelect or `.check` rows.

## Anatomy & markup
```html
<div class="field">
  <span class="label" id="topic-label">Topic</span>
  <div class="fm-sel">
    <button type="button" class="input fm-sel-btn" id="topic" aria-haspopup="listbox"
      aria-expanded="false" aria-labelledby="topic-label topic">
      <span class="fm-ph">Choose a topic</span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <div class="fm-menu fm-menu-float" role="listbox" aria-labelledby="topic-label" hidden>
      <button type="button" class="fm-opt" role="option" aria-selected="true">
        <span>Partnership</span>
        <svg class="fm-opt-tick" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>
      </button>
      <button type="button" class="fm-opt" role="option" aria-selected="false"><span>Prayer request</span></button>
    </div>
  </div>
</div>
```
- The trigger is the base `.input` plus `.fm-sel-btn`: same 48px height and `--radius-md` corners as text fields.
- `.fm-menu` is the shared listbox panel: white, `--gray-200` border, `--radius-md`, `--shadow-overlay`, max 264px tall then scrolls.
- `.fm-menu-float` positions it 6px under the field; `.fm-menu-static` draws it in flow for specs.

## Variants & states
- Empty: placeholder text in `.fm-ph` (`--gray-placeholder`).
- Filled: plain text value.
- Open: `aria-expanded="true"` gives the blue border and focus ring and rotates the caret 180°.
- Option hover / keyboard-active (`.fm-active`): `--blue-tint` row.
- Selected option: `aria-selected="true"`, semibold `--horizon-blue-dim` text and a blue tick on the right.
- Error: `aria-invalid="true"` on the button and an `.err` line below.

## Rules
- The caret ⌄ means "opens here". Never use ↗ or › on a select.
- Options are 44px rows with 8px (`--radius-sm`) corners inside 6px panel padding.
- Show exactly one check, on the selected option only.
- Close the list on pick, on Esc and on blur; keep focus on the trigger.
- Use the native `<select class="input">` when you need no custom styling inside the list, e.g. inside the dot.Bible app on low-end devices.
- Do not put links or actions inside the list.

## Accessibility
- Trigger: `aria-haspopup="listbox"` and `aria-expanded`. Name it with `aria-labelledby` pointing at the label and itself, so the current value is read.
- List: `role="listbox"`, options `role="option"` with `aria-selected`.
- Keys: Enter / Space / Alt+Down opens; Up/Down moves; Enter picks; Esc closes.

## Content
- Label: "Topic". Placeholder: "Choose a topic".
- Options: General question, Partnership, Broadcast partner, Publishing or NFC order, Prayer request.
- Use sentence case; keep options to a few words.
