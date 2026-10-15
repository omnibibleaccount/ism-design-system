# VerseBlock
A single Bible verse set in Lora with its reference and Share, Copy and Bookmark tools, plus a dark Verse of the Day hero and an inline citation link.

## When to use
- Use `.sx-verse` to feature one verse or a short passage inside a page, article or app screen.
- Use `.sx-votd` for the Verse of the Day on the homepage or the dot.Bible app home, on a dark section.
- Use `.sx-cite` for a Bible reference inside running text that links to the passage.
- Do not use VerseBlock for a whole chapter; use ReadingView.
- Do not use it for a testimony or a quote from a person; use Quote.

## Anatomy & markup
Verse card: serif verse text, then a footer with the reference on the left and 44px icon tools on the right.

```html
<article class="sx-verse">
  <p class="sx-verse-text">“For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.”</p>
  <div class="sx-verse-foot">
    <span class="sx-ref">John 3:16 · BSB</span>
    <div class="sx-verse-tools">
      <button type="button" class="sx-ibtn" aria-label="Share verse"><svg …aria-hidden="true">…</svg></button>
      <button type="button" class="sx-ibtn" aria-label="Copy verse"><svg …>…</svg></button>
      <button type="button" class="sx-ibtn" aria-label="Bookmark verse" aria-pressed="false"><svg …>…</svg></button>
    </div>
  </div>
</article>
```

Verse of the day (dark):

```html
<section class="sx-votd" aria-labelledby="votd">
  <span class="eyebrow sx-eyebrow-gold" id="votd">Verse of the day</span>
  <div class="sx-gold-rule" aria-hidden="true"></div>
  <p class="sx-votd-text">“Your word is a lamp to my feet and a light to my path.”</p>
  <div class="sx-verse-foot">
    <span class="sx-votd-ref">Psalm 119:105 · BSB</span>
    <div class="sx-verse-tools">
      <button type="button" class="sx-ibtn sx-ibtn-dark" aria-label="Share verse">…</button>
    </div>
  </div>
  <p class="sx-votd-more">Read the whole chapter in the dot.Bible app <a class="sx-cite sx-cite-dark" href="/psalm-119">Psalm 119 ↗</a></p>
</section>
```

Inline citation: `<a class="sx-cite" href="/john-3#3">John 3:3</a>`.

## Variants & states
| Variant | Classes | Background |
|---|---|---|
| Verse card | `.sx-verse` + `.sx-verse-text` + `.sx-ref` | white card on `--off-white` |
| Verse of the day | `.sx-votd` + `.sx-votd-text` + `.sx-votd-ref` | `--black` with blue and gold glows |
| Inline citation | `.sx-cite` (light), `.sx-cite sx-cite-dark` (dark) | running text |

Tool button (`.sx-ibtn`) states: default, hover (`--gray-100` fill), focus (2px Horizon Blue outline + `--shadow-focus`), saved (`aria-pressed="true"`: `--blue-tint` fill, filled icon). On dark, `.sx-ibtn-dark` is transparent with a white 22% border; saved turns `--leather-gold`.
Citation states: default (dotted underline, `--horizon-blue-dim`), hover (solid `--horizon-blue` underline).

## Rules
- Set verse text in `--font-serif` only: 21px / 1.6 in the card, 34px / 1.4 in Verse of the day (19px and 26px under 768px).
- Reference after the verse, sans 600, format "Book chapter:verse · TRANSLATION" (`John 3:16 · BSB`).
- Wrap the verse in curly quotes (“ ”). Never italicise the verse.
- Tools are `.sx-ibtn` 44px circles, in the order Share, Copy, Bookmark. Three tools at most.
- Verse of the day uses gold accents (`.sx-eyebrow-gold`, `.sx-gold-rule`, `--leather-gold` reference), not Horizon Blue. No filled blue button inside it.
- Card: `--radius-lg`, `--shadow-card-light`, 1px `--border-hairline-light`. Hero: `--radius-lg`, padding `--space-7`.
- A citation that opens the reader on another page ends with ↗; a citation inside the reader that scrolls to a verse has no icon.

## Accessibility
- Every icon tool has an `aria-label` ("Share verse", "Copy verse", "Bookmark verse"); icons are `aria-hidden="true"`.
- Bookmark is a toggle: `aria-pressed` and swap the label to "Remove bookmark" when saved.
- Give Verse of the day a landmark name via `aria-labelledby` pointing at its eyebrow.
- Copy and Share confirm with a Toast ("Verse copied"), never only by changing the icon.
- Set `lang` on verse text that is not in the page language.

## Content
- Quote the translation exactly; always name it (BSB, KJV, or the local translation).
- Short lead-ins only: "Read the whole chapter in the dot.Bible app".
- No added commentary inside the verse block. No exclamation marks, no emoji.
