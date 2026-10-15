# Combobox
A search field joined to a dropdown list: type to filter a long list, or press the caret to see every option, in a 48px form size and a 64px homepage hero size.

## When to use
- Long lists people know by name: Bible languages, countries, stations.
- 48px (`.fm-combo`): inside forms, e.g. "Language" on a partner form.
- Hero (`.fm-dir`): the homepage Bible directory search, one per page, where picking a row opens that Bible on dot.Bible.
- Fewer than 10 fixed options: use Select. Picking several: use MultiSelect. Free-text site search: use SearchField.

## Anatomy & markup
48px form combobox:
```html
<div class="field">
  <label class="label" for="lang">Language</label>
  <div class="fm-sf fm-combo">
    <svg class="fm-sf-icon" …magnifier…></svg>
    <input class="input" id="lang" type="search" role="combobox" aria-expanded="false"
      aria-controls="lang-list" aria-autocomplete="list" autocomplete="off" placeholder="Search or choose a language">
    <button type="button" class="fm-combo-caret" aria-label="Show all languages" aria-expanded="false" aria-controls="lang-list">…caret…</button>
  </div>
  <div class="fm-combo-anchor">
    <div class="fm-menu fm-menu-float" id="lang-list" role="listbox" aria-label="Languages">
      <div class="fm-menu-head" aria-hidden="true">All languages · 12</div>
      <button type="button" class="fm-opt" role="option" aria-selected="false">
        <span class="fm-opt-two"><span>Tiếng Việt</span><span class="fm-opt-sub">Vietnamese</span></span>
      </button>
    </div>
  </div>
</div>
```
Hero combobox:
```html
<form class="fm-dir" role="search" aria-label="Search Bible languages">
  <label class="label" for="dir">Search for your language</label>
  <div class="fm-dir-box">
    <svg class="fm-dir-icon" width="22" height="22" …magnifier…></svg>
    <input id="dir" class="input fm-dir-input" type="search" role="combobox" aria-expanded="false" aria-controls="dir-list" aria-autocomplete="list" placeholder="Try “Español”, “Swahili” or “हिन्दी”">
    <button type="button" class="fm-dir-caret" aria-label="Show all languages" aria-expanded="false" aria-controls="dir-list">…caret…</button>
  </div>
  <div id="dir-list" class="fm-dir-results" role="listbox" aria-label="Matching languages">
    <div class="fm-dir-head" aria-hidden="true">All languages · 12</div>
    <button type="button" class="fm-dir-option" role="option" aria-selected="false">
      <span class="fm-dir-name"><span class="fm-dir-native">አማርኛ</span><span class="fm-dir-eng">Amharic</span></span>
      <span class="fm-dir-go">Open ↗</span>
    </button>
  </div>
</form>
```

## Variants & states
- 48px: base `.input`, 36px round caret button inside the right edge, list `.fm-menu` 6px below (max 264px, scrolls).
- Hero: 64px pill (`--radius-pill`, `--gray-300` border, soft shadow), 56px on phones; 44px caret; results panel `.fm-dir-results` with `--radius-lg` corners and `--shadow-card-dark`, 8px below, max 380px.
- Closed / open: caret rotates 180° when `aria-expanded="true"`.
- Filtering: the head reads "All languages · 12", then "3 matches" / "1 match".
- Active row (`.fm-active`) and hover: `--blue-tint`.
- Selected (48px only): `aria-selected="true"`, semibold `--horizon-blue-dim` and a blue tick.
- Empty: `.fm-menu-empty` "No language matches “xyz”." Hero: `.fm-dir-empty` with a link "Browse every language on dot.Bible ↗".

## Rules
- Caret ⌄ means the list opens here. Hero rows end in "Open ↗" because picking leaves for another page.
- Match on both the native name and the English name, ignoring accents and case.
- Show the native name first and larger; English under it in `--gray-600`.
- Focus or typing opens the list; Enter picks the first match; Esc closes.
- Keep the caret button from stealing focus (prevent mousedown default) so typing continues.
- One hero combobox per page. Do not shrink the hero below 56px.
- On the 48px version, show the current choice as the placeholder ("አማርኛ · Amharic") and clear the typed text on pick.

## Accessibility
- Input `role="combobox"` with `aria-expanded`, `aria-controls` and `aria-autocomplete="list"`.
- Caret: `aria-label="Show all languages"`, mirrors `aria-expanded`.
- List `role="listbox"`; rows `role="option"`. Head is `aria-hidden`; announce the match count in a polite live region.
- Up/Down move the active row (`aria-activedescendant`), Enter picks, Esc closes and keeps focus in the input.
- Mark native names with `lang` (e.g. `lang="am"`) where possible.

## Content
- Labels: "Language", "Search for your language".
- Placeholder: "Try “Español”, “Swahili” or “हिन्दी”".
- Head: "All languages · 12" (sample count). Empty: "No match for “xyz”. Browse every language on dot.Bible ↗".
