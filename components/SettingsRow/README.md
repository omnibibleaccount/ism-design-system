# SettingsRow
Grouped inset settings for ISM apps: section headers, inset cards of 52px rows with toggles, values with ›, radio choices, a separate Sign out card and helper text.

## When to use
- Use on Settings and preference screens in dot.Bible and other ISM apps.
- Use a toggle row for an on/off setting that applies at once.
- Use a value row with › when the choice opens another screen (Language, Translation).
- Use radio rows for picking one of two to five options in place (Default Bible).
- Do not use these rows for content lists such as search results or episodes; use SearchResults or ListRow.

## Anatomy & markup
Header `.ap-grp-h` above an inset card `.ap-grp` of `.ap-row`s, optional footer `.ap-grp-f`.

```html
<p class="ap-grp-h" id="g1">Reading</p>
<div class="ap-grp" role="group" aria-labelledby="g1">
  <button class="ap-row" type="button"><i class="ap-ri">…</i><span>Language</span><span class="ap-val">English</span><span class="ap-chv">…</span></button>
  <div class="ap-row"><i class="ap-ri">…</i><span id="t1">Verse numbers</span>
    <button class="ap-tog" type="button" role="switch" aria-checked="true" aria-labelledby="t1"></button></div>
</div>
<p class="ap-grp-f">Downloaded Bibles work offline and stay on this phone after you sign out.</p>
<div class="ap-grp ap-grp-gap"><button class="ap-row ap-row-danger" type="button">…<span>Sign out</span></button></div>
```

## Variants & states
| Row | Classes |
|---|---|
| Toggle | `.ap-row` + `.ap-tog` (51×31; on = Horizon Blue) |
| Value › | `button.ap-row` + `.ap-val` + `.ap-chv` |
| Radio | `button.ap-row[role=radio][aria-checked]` + `.ap-rad` |
| Two-line | `.ap-tt` > `.ap-t` + `.ap-s` |
| Destructive | `.ap-row-danger` in its own `.ap-grp.ap-grp-gap` card |
| Pressed / focus / disabled | `:active` / `:focus-visible` / `aria-disabled="true"`; `.ap-is-pressed` `.ap-is-focus` `.ap-is-disabled` for specimens |

## Rules
- Cards inset 16px, `--radius-md`, white with a `--gray-200` hairline; dividers start 16px in.
- Rows are at least 52px; two-line rows 64px (`.ap-row-tall`).
- Leading icon tiles `.ap-ri` are 30px, `--blue-tint` with Horizon Blue icons. Use them on every row in a card or on none.
- › means the row drills into another app screen. Never use › on a toggle or radio row; never use ↗ inside settings unless the row leaves the app.
- Values are `--gray-600`, short, and match the next screen's selected option.
- Section headers: 12/600 caps, `--overline-tracking`, `--gray-600`. Footers: 13px `--gray-600`, under the card.
- Sign out sits alone at the end in `--error`. No confirmation colour elsewhere.
- Toggles take effect immediately; never pair them with a Save button.

## Accessibility
- Toggles are `role="switch"` with `aria-checked` and a label via `aria-labelledby`.
- Radio groups use `role="radiogroup"` with a label; arrow keys move the selection.
- Value rows announce both parts: "Language, English, button".
- Disabled rows keep their text readable and say why ("Needs Wi‑Fi").
- Focus ring: 2px Horizon Blue, inset on rows.

## Content
- Labels are short nouns: "Language", "Verse numbers", "Wi‑Fi only", "Daily verse reminder".
- Footers explain consequences in one sentence: "Downloaded Bibles work offline and stay on this phone after you sign out."
- Translation names in full plus abbreviation: "Berean Standard Bible BSB".
