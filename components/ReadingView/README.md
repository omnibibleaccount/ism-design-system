# ReadingView
The chapter reader: a sticky bar with book and translation pickers, text size and listen, over a single serif column with verse numbers, section headings, highlights and footnotes.

## When to use
- Use for reading a whole chapter of Scripture on dot.bible language pages and in the dot.Bible app.
- Do not use for a single verse or a short quote; use VerseBlock.
- Do not use for articles or long-form ISM stories; they use the normal page type.

## Anatomy & markup
`.sx-reader` frame → `.sx-rbar` (sticky, 68px) → `.sx-col` (max `--measure-scripture`, about 70 characters).

```html
<article class="sx-reader" aria-label="John 3, Berean Standard Bible">
  <div class="sx-rbar">
    <div class="sx-rbar-group">
      <button type="button" class="sx-sel" aria-haspopup="dialog" aria-expanded="false">John 3<svg …aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>
      <button type="button" class="sx-sel" aria-haspopup="listbox" aria-expanded="false" aria-label="Translation: BSB">BSB<svg …>…</svg></button>
    </div>
    <div class="sx-rbar-group">
      <button type="button" class="sx-ibtn sx-aa-btn" aria-label="Text size">Aa</button>
      <button type="button" class="sx-play-sm" aria-label="Listen to John 3"><svg …>…</svg></button>
    </div>
  </div>
  <div class="sx-col">
    <p class="overline sx-col-book">The Gospel of John</p>
    <h1 class="sx-ch">John 3</h1>
    <h2 class="sx-sh">Jesus and Nicodemus</h2>
    <p class="sx-body"><sup class="sx-v">1</sup>Now there was a man of the Pharisees named Nicodemus… <sup class="sx-v">3</sup><mark class="sx-hl">Jesus replied, “Truly, truly, I tell you, no one can see the kingdom of God unless he is born again.”</mark><a class="sx-fn" href="#fn-a" aria-label="Footnote a">a</a></p>
    <p class="sx-fnote" id="fn-a"><span class="sx-fnote-mark">a</span><span><b>3:3</b> Or <i>born from above</i>; also in verse 7</span></p>
  </div>
</article>
```

Text size control (opens from Aa):

```html
<div class="sx-aa" role="radiogroup" aria-label="Text size">
  <button type="button" role="radio" aria-checked="false">17</button>
  <button type="button" role="radio" aria-checked="true">19</button>
  <button type="button" role="radio" aria-checked="false">22</button>
  <button type="button" role="radio" aria-checked="false">25</button>
</div>
```
Set the chosen size on `.sx-body` through `--sx-text` (`style="--sx-text:22px"`).

## Variants & states
- Picker buttons (`.sx-sel`): default, hover (`--gray-100`), open (`aria-expanded="true"`: Horizon Blue border, caret rotates 180°), focus ring.
- Text size: four steps, 17 / 19 (default) / 22 / 25px. The selected step is white with a light shadow.
- Highlight: `.sx-hl` peach wash (`--gradient-peach` 70%), wraps cleanly across lines.
- Footnote: `.sx-fn` superscript letter in `--horizon-blue`, note in `.sx-fnote` below a `--gray-200` rule.
- Mobile (under 768px): chapter title 32px, column padding `--space-5`.

## Rules
- Body text `--font-serif`, line-height 1.7 at every size step. Never justify.
- Column never exceeds `--measure-scripture`; center it with generous side padding (40px desktop).
- Verse numbers `.sx-v`: sans 12px 600, `--horizon-blue-dim`, superscript. Never bold the verse text.
- Section headings `.sx-sh` are sans 19px 600; chapter title `.sx-ch` is sans 40px 600.
- The pickers open here, so they carry a caret ⌄ (the chevron SVG). The bar is sticky and translucent (`--blur-glass`).
- The listen button `.sx-play-sm` is the one Horizon Blue control in the bar. It opens the AudioPlayer mini player.
- All bar controls are 44px (`--tap-target`).

## Accessibility
- Name the article with book, chapter and translation (`aria-label="John 3, Berean Standard Bible"`).
- One `h1` per chapter; section headings are `h2`.
- `.sx-sel` uses `aria-haspopup` (`dialog` for BookPicker, `listbox` for translations) and `aria-expanded`.
- The translation button reads its full meaning: `aria-label="Translation: BSB"`.
- Footnote markers are links with `aria-label="Footnote a"` pointing at the note's `id`.
- Text size is a `radiogroup`; each step is a `radio` with `aria-checked`.
- Set `lang` and `dir` on the reader for non-English and right-to-left text.

## Content
- Use the translation's own section headings; do not invent them.
- Book label in `.overline`: "The Gospel of John".
- Footnotes: verse reference bold, then the note ("**3:3** Or *born from above*; also in verse 7").
