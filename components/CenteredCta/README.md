# CenteredCta
Light, centred call to action (eyebrow, headline, two buttons) in a white card, plus a compact inline banner card for one question and one action.

## When to use
- Centred CTA `.dp-ccta`: the end of an inner page that should lead somewhere (Become a partner, Talk to our team, Download the app).
- Inline banner `.card.card-flat.dp-banner`: a quiet prompt after content, such as "Still have a question?" on FAQ and Our Team pages.
- Use CtaBand for the bold dark closing band on the home page.
- Do not stack two CTAs back to back; one per page end.

## Anatomy & markup
```html
<section class="dp-ccta" aria-labelledby="partner-h">
  <span class="eyebrow">Become a partner</span>
  <h2 class="h2 dp-ccta-title" id="partner-h">Own a station? Help us reach your <span class="em">city</span>.</h2>
  <div class="dp-ccta-actions">
    <a class="btn btn-primary" href="/partner">Become a partner</a>
    <a class="btn btn-secondary" href="/contact">Talk to our team</a>
  </div>
</section>

<aside class="card card-flat dp-banner" aria-labelledby="ask-h">
  <div class="dp-banner-text">
    <h2 class="h3" id="ask-h">Still have a question?</h2>
    <p class="muted small">Our team replies personally.</p>
  </div>
  <a class="btn btn-primary" href="/contact">Contact us</a>
</aside>
```

## Variants & states
- Centred CTA: white, `--gray-200` border, `--radius-lg`, 48px × 32px padding, 20px gap; headline 32px (`.dp-ccta-title`).
- Inline banner: `.card-flat` laid out as a row (`.dp-banner`), text left, one button right, 28px padding; wraps to a column on narrow screens.
- Static; buttons own their hover and focus states.

## Rules
- One Horizon Blue `.btn-primary` per CTA; the second action is `.btn-secondary`. Never two blue buttons.
- The banner has exactly one button.
- One `.em` word in the centred headline; none in the banner.
- Headlines are short (about 8 words); the banner's supporting line is one short sentence.
- Place on `--off-white` page backgrounds so the white card reads as a surface.
- ↗ only when the button leaves the site.

## Accessibility
- Label each block with its heading through `aria-labelledby`; use `<aside>` for the banner.
- Buttons say what happens ("Contact us", not "Click here").
- Keep heading levels in page order; the banner title can be an `h2` styled `.h3`.

## Content
- Centred: eyebrow "Become a partner"; "Own a station? Help us reach your city."; "Become a partner" / "Talk to our team".
- Banner: "Still have a question?" / "Our team replies personally." / "Contact us".
