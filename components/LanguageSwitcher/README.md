# LanguageSwitcher
Lets people read ism.bible in their own language: a globe "EN ⌄" button in the header opens a searchable list of language names in their own script, with a full-screen sheet on phones and an inline row in the footer.

## When to use
- Use the header button on every ism.bible page, left of Give.
- Use the footer inline row in the footer legal area to repeat the main languages.
- Use the mobile sheet below 1024px; the header globe opens it.
- Do not use it to pick a Bible translation or reading language. That is the dot.Bible app (link to it from the menu foot).

## Anatomy & markup
```html
<span class="nv-lang-wrap">
  <button type="button" class="nv-langbtn" aria-expanded="false" aria-haspopup="dialog" aria-controls="lang-menu" aria-label="Language: English">
    <svg class="nv-ico" …globe/>EN<svg class="nv-caret" …><path d="M6 9l6 6 6-6"/></svg>
  </button>
  <div class="nv-langmenu" id="lang-menu" role="dialog" aria-label="Choose a language" hidden>
    <div class="nv-lsearch"><svg …search/><input class="input" type="search" placeholder="Search languages" aria-label="Search languages"></div>
    <div class="overline nv-lhead">Site language</div>
    <div class="nv-llist" role="listbox" aria-label="Languages">
      <a class="nv-lopt" role="option" aria-selected="true" lang="en" href="/en/"><span><span class="nv-nm">English</span><span class="nv-en">English</span></span><svg class="nv-check" …/></a>
      <a class="nv-lopt" role="option" aria-selected="false" lang="am" href="/am/"><span><span class="nv-nm">አማርኛ</span><span class="nv-en">Amharic</span></span></a>
      <a class="nv-lopt" role="option" aria-selected="false" lang="ur" dir="rtl" href="/ur/"><span><span class="nv-nm">اردو</span><span class="nv-en" dir="ltr" lang="en">Urdu</span></span></a>
    </div>
    <p class="nv-lempty" role="status" hidden></p>
    <div class="nv-lfoot"><span>Scripture in 500+ languages</span><a href="https://dot.bible">dot.Bible ↗</a></div>
  </div>
</span>
```

Mobile: `.nv-sheet` (with `.nv-sheet-grip`, `.nv-sheet-head`, `.nv-sheet-title`, `.nv-sheet-close`, `.nv-lsearch`, `.nv-sheet-row`). Footer: `nav.nv-finline` with links and a `.nv-finline-more` "More ⌄".

## Variants & states
- **Button:** 44px pill, 1px `rgba(255,255,255,.3)` border, white 14px/600 code. Hover `rgba(255,255,255,.08)`; focus blue ring + `var(--shadow-focus)`; open `aria-expanded="true"`, white border, caret flips 180°. After a change it shows the new code ("AM").
- **Menu (`.nv-langmenu`):** 320px white panel, `var(--radius-ml)`, `var(--shadow-overlay)`, 14px below the bar, right-aligned.
- **Option (`.nv-lopt`):** 52px rows; own name 16px/500, English name 12px `var(--gray-600)` below. Hover/arrow-key active `var(--blue-tint)`. Current: `aria-selected="true"`, name `var(--horizon-blue-dim)` 600 and a `.nv-check`.
- **RTL rows:** `dir="rtl"` right-aligns; Naskh at 18px (19px in the sheet). The English name keeps `dir="ltr"`.
- **Empty search (`.nv-lempty`):** "This site isn't in Oromo yet." plus a dot.Bible ↗ link. The input keeps its focus ring (`.nv-active` for docs).
- **Mobile sheet:** full width, 20px top corners, 60px rows, 48px search. Tapping a row switches straight away; no confirm button.
- **Footer inline (`.nv-finline`):** 13px `var(--text-tertiary-dark)` links; current is white 600 with `aria-current="true"`.

## Rules
- Write every language in its own script: English, Español, አማርኛ, Tiếng Việt, Kiswahili, اردو, မြန်မာ. Never use flags.
- The button shows the 2-letter code only. The caret ⌄ means the menu opens here; dot.Bible links use ↗ because they leave the site.
- Show search when there are more than 8 languages. Match own name or English name ("amh" finds አማርኛ).
- Sort: current first, then by readers on the site, not alphabetically.
- Picking a language goes to the same page in that language and sets `html lang` and `dir`.
- Never use Horizon Blue fill here; blue is only for the current name and the check.
- Keep rows at 52px (menu) and 60px (sheet); line-height 1.35+ for Ethiopic and Myanmar scripts.

## Accessibility
- Put `lang` on every name so screen readers pronounce it; RTL rows also carry `dir="rtl"`.
- The button has `aria-expanded`, `aria-controls` and an `aria-label` with the current language ("Language: English").
- In the menu, focus starts in search. ↑ ↓ move, Enter picks, Esc closes and returns focus to the button.
- The mobile sheet is `role="dialog" aria-modal="true"`; trap focus and close on Esc, the close button or a swipe down.
- Announce the empty search with `role="status"`.

## Content
- Menu head: "Site language". Menu foot: "Scripture in 500+ languages · dot.Bible ↗".
- Sheet title: "Choose a language". Sheet note: "Reading the Bible in another language? Open the dot.Bible app ↗".
- Empty: "This site isn't in {language} yet. Read the Bible in {own name} on dot.Bible ↗".
