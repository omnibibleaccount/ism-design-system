# Hero
The dark, centred home-page hero: gradient photo under a dark overlay, eyebrow, H1 with one emphasised word, lead, two buttons and language chips.

## When to use
- Use once, at the top of the home page and major campaign landing pages (Join the Mission, dot.Bible app).
- Use PageIntro for inner pages instead.
- Do not stack two heroes or put a hero lower on the page.
- Do not use on forms, account or app screens.

## Anatomy & markup
```html
<section class="dp-hero on-dark" aria-labelledby="hero-h">
  <img class="dp-hero-bg" src="assets/imagery/deck-bg-gradient-dark.jpg" alt="">
  <span class="eyebrow">International Scripture Ministries</span>
  <h1 class="h1 dp-hero-title" id="hero-h">God’s Word, within reach of <span class="em">every</span> language on earth.</h1>
  <p class="lead dp-hero-lead">We make scripture accessible to anyone, anywhere.</p>
  <div class="dp-hero-actions">
    <a class="btn btn-primary btn-lg" href="/join">Join the Mission ↗</a>
    <a class="btn btn-outline-light btn-lg" href="#programs">Explore our programs</a>
  </div>
  <div class="dp-langs" aria-label="Read in another language">
    <a class="dp-lang" href="/es" lang="es"><span class="dp-lang-dot"></span>Español</a>
    <a class="dp-lang" href="/sw" lang="sw"><span class="dp-lang-dot dp-lang-gold"></span>Kiswahili</a>
    <a class="dp-lang" href="/ko" lang="ko"><span class="dp-lang-dot dp-lang-violet"></span>한국어</a>
  </div>
</section>
```

## Variants & states
- Full-bleed (default): no radius, 88px top/bottom padding, 64px on mobile.
- Inset `.dp-hero-inset`: `--radius-lg` corners, for a hero placed inside the page frame.
- Overlay: black gradient 62% → 50% → 70% over the photo so white text keeps contrast on any image.
- Language chips: pill, 6% white fill, 18% white border, coloured dot (`--sky-blue`, `.dp-lang-gold`, `.dp-lang-violet`). As links they are 44px tall and lighten on hover. On desktop they may float around the hero.
- On dark, `.em` renders as gradient-clipped type and `.eyebrow` switches to `--blue-on-dark`.

## Rules
- Add `.on-dark` so eyebrow, `.em`, `.lead` and headings switch to their dark styles.
- One `.em` word per headline, never more.
- One Horizon Blue primary (`.btn-primary`); the second action is `.btn-outline-light`. Never two blue buttons.
- ↗ on a button means it goes to another page; omit it for an in-page jump.
- Use `.btn-lg` (52px) in the hero. Keep both buttons on one line on desktop; they wrap and centre on mobile.
- Background is `deck-bg-gradient-dark.jpg` or another dark brand photo; always keep the overlay.
- Headline at most about 12 words; lead one sentence.

## Accessibility
- One `<h1>` per page, and it lives here. Label the section with `aria-labelledby`.
- The background image is decorative: `alt=""`.
- Each language chip sets `lang` on the link so screen readers pronounce the name correctly.
- White on the overlay meets AA; do not lighten the overlay.
- Respect reduced motion; do not animate the background.

## Content
- Eyebrow: the organisation or programme name in caps ("International Scripture Ministries").
- Headline: the promise, plain and warm: "God’s Word, within reach of every language on earth."
- Lead: "We make scripture accessible to anyone, anywhere."
- Chips show language names in their own script (Español, Kiswahili, 한국어, አማርኛ).
