# CtaBand
Dark `.sec-ink` closing band with a centred eyebrow, headline and two buttons above three numbered columns of ways to take part.

## When to use
- Use once near the end of the home page and Join the Mission, to turn interest into action (pray, give, share).
- Use it as the dark beat in the light/dark rhythm of a page.
- Do not use more than once per page or directly next to the Hero or Footer without a light section between.
- Use CenteredCta for a lighter, single-message call to action.

## Anatomy & markup
```html
<section class="sec-ink dp-ctaband" aria-labelledby="join-h">
  <div class="dp-ctaband-head">
    <span class="eyebrow">Join the Mission</span>
    <h2 class="h2" id="join-h">Put scripture in someone’s hands <span class="em">today</span>.</h2>
    <div class="dp-ctaband-actions">
      <a class="btn btn-light btn-lg" href="/give">Give online</a>
      <a class="btn btn-outline-light btn-lg" href="/partner">Become a partner</a>
    </div>
  </div>
  <ol class="dp-ctaband-cols">
    <li class="dp-ctaband-col">
      <span class="dp-ctaband-n" aria-hidden="true">01</span>
      <h3 class="h3">Pray with us</h3>
      <p class="dp-ctaband-text">Join a community praying for translators and listeners.</p>
    </li>
    <!-- 02 .dp-ctaband-n-gold, 03 .dp-ctaband-n-violet -->
  </ol>
</section>
```
Reset list styles on the `<ol>` if your page CSS does not (`list-style:none;margin:0;padding-left:0`).

## Variants & states
- Inset (default): `--radius-lg` corners, 64px × 48px padding, inside the page frame.
- Full-bleed: drop the radius when the band spans the viewport.
- Column numerals cycle `--sky-blue` → `.dp-ctaband-n-gold` → `.dp-ctaband-n-violet`.
- Columns sit under a 14% white hairline. Under 768px they stack and padding drops to 48px × 24px.
- Static; buttons carry their own hover and focus states.

## Rules
- Always pair with `.sec-ink` so the background glow, `.em`, `.eyebrow` and headings switch to dark styles.
- Buttons: `.btn-light` for the main action and `.btn-outline-light` for the second, both `.btn-lg`. Do not add a Horizon Blue button here if the page already has its primary elsewhere; never two blues.
- Exactly three columns, each a title and one sentence. No links inside the columns.
- One `.em` word in the headline.
- Numerals are text in brand colours, not blue fills or badges.

## Accessibility
- Label the band with its `h2` via `aria-labelledby`.
- Use an `<ol>` for the three columns and hide the numerals from screen readers.
- Text on `.sec-ink` uses white and 72% white (`.dp-ctaband-text`), both AA on black.
- Keep visible focus rings on the light buttons.

## Content
- Eyebrow "Join the Mission"; headline "Put scripture in someone’s hands today."
- Columns: "Pray with us" / "Join a community praying for translators and listeners."; "Give with purpose" / "Fund apps, airtime and printed Bibles."; "Share the Word" / "Hand out NFC cards and recommend the app."
