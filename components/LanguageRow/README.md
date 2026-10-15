# LanguageRow
A language entry in the dot.bible directory: native-script name first, English name second, format badges (Read, Listen, Print, App) and a ↗, as a list row or as a card.

## When to use
- Use `.sx-lang` rows inside `.sx-langlist` for the full directory of 500+ languages and search results.
- Use `.sx-lcard` cards for a small set of featured or nearby languages.
- Do not use for the hero of a single language page; use BibleCard.
- Do not use as a language switcher for the site UI; use Select or Combobox.

## Anatomy & markup
Each row is one link: name block, badges, ↗.

```html
<div class="sx-langlist">
  <a class="sx-lang" href="/amharic">
    <div class="sx-lang-name"><span class="sx-native" lang="am">አማርኛ</span><span class="sx-eng">Amharic</span></div>
    <div class="sx-badges">
      <span class="sx-badge"><svg width="14" height="14" …aria-hidden="true">…</svg>Read</span>
      <span class="sx-badge"><svg …>…</svg>Listen</span>
      <span class="sx-badge"><svg …>…</svg>Print</span>
      <span class="sx-badge"><svg …>…</svg>App</span>
    </div>
    <span class="sx-go" aria-hidden="true">↗</span>
  </a>
  <a class="sx-lang" href="/urdu">
    <div class="sx-lang-name"><span class="sx-native" lang="ur" dir="rtl">اردو</span><span class="sx-eng">Urdu</span></div>
    …
  </a>
</div>
```

Card:

```html
<a class="sx-lcard" href="/amharic">
  <div class="sx-lcard-top"><span class="sx-native" lang="am">አማርኛ</span><span class="sx-go" aria-hidden="true">↗</span></div>
  <span class="sx-eng">Amharic · Ethiopia · 57M speakers (sample)</span>
  <div class="sx-badges">…</div>
</a>
```

## Variants & states
| Variant | Classes | Notes |
|---|---|---|
| Row | `.sx-lang` in `.sx-langlist` | 72px min, native name 22px, hairline between rows |
| Card | `.sx-lcard` | native name 32px (Burmese 28px), `--shadow-card-light` |
| Right-to-left | `dir="rtl"` on `.sx-native` | name renders RTL inside an LTR row |

Row states: default; hover (`.is-hover` in the preview): `--blue-tint` background, badges turn white, ↗ turns Horizon Blue; focus ring.
Card states: hover lifts to `--shadow-lift` and ↗ turns Horizon Blue; focus ring.
Under 768px rows wrap: badges drop under the name, ↗ spans both lines.

## Rules
- Native-script name first, in `--font-sans` 600; English name after it in 14px `--gray-600`. Never show only the English name.
- Give scripts with tall marks more line-height (Burmese 1.6, Urdu 1.5); the CSS does this through `:lang(my)` and `:lang(ur)`.
- Show only the formats that exist for that language, in the order Read, Listen, Print, App.
- Badges are neutral `--gray-100` pills with a 14px icon; never colour-code formats.
- The whole row is one link to the language page, so it ends with ↗. Do not nest other links or buttons inside.
- Row and card minimum height respects the 44px tap target (rows are 72px).
- Speaker counts are samples until confirmed; label them "(sample)".

## Accessibility
- Always set `lang` on `.sx-native`, and `dir="rtl"` for Arabic-script and Hebrew names, so screen readers and fonts pick the right voice and shaping.
- The ↗ is `aria-hidden`; the link's text (native + English name + formats) is its accessible name.
- Badge icons are `aria-hidden="true"`; the word carries the meaning.
- Keep list order stable when filtering so keyboard users do not lose their place.

## Content
- English name exactly as in the directory ("Burmese", not "Myanmar language").
- Card meta: "Language · Country · speakers (sample)".
- Badge words: Read, Listen, Print, App. No other labels.
