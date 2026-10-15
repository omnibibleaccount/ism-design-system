# Multilingual and right-to-left

ISM publishes in many languages and scripts. Inter and Lora cover Latin, Cyrillic and Greek only. For every other script the browser falls through the font stack character by character, so spacing and line-height must be set per script.

## Font fallbacks

```
--font-sans:  "Inter", "Noto Sans Ethiopic", "Noto Sans Myanmar", "Noto Naskh Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif
--font-serif: "Lora",  "Noto Sans Ethiopic", "Noto Sans Myanmar", "Noto Naskh Arabic", Georgia, serif
```

Always set `lang` (and `dir` for RTL) on `<html>` or on the content block, so `:lang()` rules and screen readers work. The Noto families are loaded from Google Fonts in `tokens.css`; self-host them for the dot.Bible apps and for offline use.

## Line-height and typography per script

| Script | Languages | Body | Heading | Direction | Status |
|---|---|---|---|---|---|
| Latin | en, es, fr, pt, sw … | 1.5 | 1.12 | ltr | shipped |
| Ethiopic | am, ti | 1.65 | 1.25 | ltr | recommended; native-reader review pending |
| Myanmar | my | 1.9 | 1.5 | ltr | recommended; native-reader review pending |
| Arabic script | ar, fa, ur | 1.9 | 1.4 | rtl | recommended; native-reader review pending |

Urdu is conventionally set in Nastaliq. The Naskh fallback is acceptable for UI but a font decision is open: ask a native reader before shipping Urdu reading views.

Implemented in `packages/web/css/scripts.css` and exposed as `--lh-body-<script>` and `--lh-heading-<script>` custom properties, and as `lineHeightFor(lang, kind)` in `@ism/tokens/script`.

Rules for Ethiopic, Myanmar and Arabic-script text:

1. Letter-spacing is `0`. Tracking breaks joining (Arabic) and stacking (Myanmar).
2. No `text-transform: uppercase`, and no italics. Emphasise with weight or colour.
3. Burmese uses `line-break: strict`; never truncate mid-syllable.
4. Headings use the heading line-height above, never Latin 1.12.
5. Expect text to run 20–40% longer than English in some pairs. Do not fix widths on buttons, tabs or labels; allow wrapping.
6. Test with real strings. The preview files in each component folder use English; always check a long Amharic and a long Arabic string.

## Right-to-left

Applies to `ar`, `fa`, `ur` (and `he`). Set `dir="rtl"` and load `ism.rtl.css` after `ism.css`.

`css/rtl.css` is generated from the component CSS by postcss-rtlcss, so every `left`, `right`, `margin-left`, `padding-right`, `border-left`, `text-align`, `translateX` and `background-position` is mirrored automatically. `css/rtl-extra.css` hand-flips the glyph icons that CSS cannot detect. In new CSS, prefer logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`) which need no override.

### Mirror

- Layout order and alignment; text alignment (use `start`/`end`)
- Chevrons that mean next, back, previous or drill-in (› becomes ‹), back and forward arrows, → used for continue
- Pagination arrows, breadcrumb separators, list-row trailing chevrons
- Drawers (slide in from the right), tab order, carousels
- Progress bars and sliders (fill from the right)
- List bullets and numbering side

### Do not mirror

- ↗ (it means "goes to another page", not a direction) and the down caret ⌄ (it means "opens")
- Media transport: play, pause, skip, scrub position (time always runs left to right in the control)
- Logos and wordmarks, QR codes, photographs
- Phone numbers, verse references, URLs, email addresses, numerals in code: wrap them in `.ism-ltr` or `dir="ltr"`
- Clocks, checkmarks, close ×, magnifier

### Utilities

| Class | Use |
|---|---|
| `.ism-no-flip` | Exempt an element from mirroring |
| `.ism-ltr` | Isolate an LTR run inside RTL text |
| `.ism-dir-icon` | Mark an inline icon that must flip in RTL |

### Platforms

- React: components read `dir` from context (`DirectionProvider`) or from `document.dir`; they do not hard-code left or right.
- React Native: use `I18nManager.isRTL` and `start`/`end` style props; flip arrows with `transform: [{ scaleX: -1 }]` only when `isRTL`.
- SwiftUI and Compose mirror layout automatically; mark directional icons with `.flipsForRightToLeftLayoutDirection(true)` (SwiftUI) or `autoMirrored` icons (Compose).
