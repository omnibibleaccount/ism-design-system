# PhoneInput
One 48px field that joins a country-code button and a number input, with a searchable country list that opens 6px below.

## When to use
- Any phone number field: partner applications, church contact details, prayer line call-backs.
- Use it wherever numbers may come from outside the US; ISM partners and listeners call from many countries.
- Do not use for SMS one-time codes (use a plain `.input` with `inputmode="numeric"`) or for typing a country alone (use Combobox).

## Anatomy & markup
```html
<div class="field">
  <label class="label" for="phone">Phone <span class="opt">(optional)</span></label>
  <div class="fm-phone">
    <button class="fm-cc" type="button" aria-haspopup="listbox" aria-expanded="false"
      aria-label="Country code: United States +1">
      <span class="fm-flag" aria-hidden="true">US</span><span>+1</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <input class="fm-num" id="phone" type="tel" autocomplete="tel-national" placeholder="(555) 123-4567">
  </div>
</div>

<div class="fm-menu fm-menu-float" role="listbox" aria-label="Country code">
  <div class="fm-menu-search"><input class="input" type="search" placeholder="Search countries" aria-label="Search countries"></div>
  <div class="fm-menu-head">Suggested</div>
  <button class="fm-o" type="button" role="option" aria-selected="true">
    <span class="fm-tick"><svg …tick…/></span><span class="fm-flag" aria-hidden="true">PH</span>Philippines<span class="fm-dial">+63</span>
  </button>
</div>
```
- `.fm-phone` is the field shell: white, 1px `rgba(0,0,0,.22)` border, `--radius-md`; it carries the hover, focus and error borders for both parts.
- `.fm-cc`: country button with a `.fm-flag` code tile, dial code and caret, divided from the number by a 1px `--gray-200` rule.
- `.fm-num`: borderless number input that fills the rest.
- List: the shared `.fm-menu` panel with `.fm-menu-search`, `.fm-menu-head` and `.fm-o` rows; `.fm-dial` sits right-aligned in `--gray-600`.

## Variants & states
- Default: country set from the site language or location, number empty with a placeholder.
- Focus: `:focus-within` (or `.fm-focus` in static specs) gives the whole group the `--horizon-blue` border and `--shadow-focus`.
- Error: `.fm-err` on the group (`--error` border on `--error-field-bg`), `aria-invalid="true"` on the number and one `.err` line.
- List open: `aria-expanded="true"` tints the country button `--blue-tint` and turns the caret 180°.
- Option hover / keyboard-active: `--blue-tint`. Selected: `--horizon-blue-dim` semibold with a blue tick in `.fm-tick`.

## Rules
- The caret ⌄ means the list opens here; it rotates when open.
- Never leave the country blank; default it and let people change it.
- Show the flag as a two-letter code tile (`.fm-flag`), not an emoji or image, so it renders on every device.
- Put the search field first when the list is longer than about 10 countries; pin a short "Suggested" group above "All countries".
- Accept spaces, dashes and brackets while typing; store E.164 (+251911234567).
- Keep the whole group 48px tall and the options 44px.
- On phones, open the list as a full-height sheet with the search field focused.

## Accessibility
- The country button's name includes country and code: "Country code: Ethiopia +251". Flag tiles are `aria-hidden`.
- Button: `aria-haspopup="listbox"`, `aria-expanded`. List: `role="listbox"`, rows `role="option"` with `aria-selected`.
- Keys on the list: type to search, Up / Down to move, Enter picks and returns focus to the number, Esc closes.
- Use `type="tel"` and `autocomplete="tel-national"` on the number (the country button sets the code).
- Link errors with `aria-describedby`.

## Content
- Label: "Phone", with "(optional)" when it is.
- Placeholder: a local example, "(555) 123-4567" for +1.
- Search: "Search countries". Groups: "Suggested", "All countries".
- Error: "This number looks too short." / "Enter a phone number, or leave it blank."
- Numbers in examples are samples.
