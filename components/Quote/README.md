# Quote
Three quotation blocks: a large Lora pull quote, a testimonial card with avatar, and a scripture quote with a gold rule, verse numbers and a full reference.

## When to use
- Pull quote: one powerful listener or partner story inside a long page or between sections.
- Testimonial card: partner and listener voices in a grid of two or three.
- Scripture quote: any Bible verse shown on a page, light or dark.
- Do not use Lora anywhere else: Lora is for scripture and quotes only.
- Do not put more than one pull quote on a screen.

## Anatomy & markup
```html
<!-- pull quote -->
<figure class="dp-pullfig">
  <span class="dp-qmark" aria-hidden="true">“</span>
  <blockquote class="dp-pull">When my grandmother heard the Gospel of John in Amharic on the radio, she wept.</blockquote>
  <div class="thread dp-pull-thread" aria-hidden="true"></div>
  <figcaption class="dp-cite"><strong>Dawit Alemu</strong> · Radio Hope listener, Addis Ababa</figcaption>
</figure>

<!-- testimonial -->
<figure class="card dp-testi">
  <blockquote class="dp-testi-q">“Our church hands out the NFC Bible cards after every service.”</blockquote>
  <figcaption class="dp-testi-by">
    <span class="dp-av dp-av-56"><img src="…" alt=""></span>
    <span class="dp-testi-who"><span class="dp-testi-name">Maria Santos</span><span class="dp-testi-role">Partner pastor · Lima, Peru</span></span>
  </figcaption>
</figure>

<!-- scripture (add .dp-scripfig-dark on dark) -->
<figure class="dp-scripfig">
  <span class="dp-scrip-rule" aria-hidden="true"></span>
  <div class="dp-scrip-body">
    <blockquote class="dp-scrip"><sup class="dp-sv">16</sup>For God so loved the world…</blockquote>
    <figcaption class="dp-scrip-ref">John 3:16 <span>· BSB</span></figcaption>
  </div>
</figure>
```

## Variants & states
- Pull quote: Lora 34px, gold “ mark (`--gradient-gold`), 64px `.thread` gradient rule, Inter caption.
- Testimonial: base `.card` (20px radius, `--shadow-card-light`), 18px Inter quote, `.dp-av-56` avatar, name 16px/600, role · place 14px `--gray-600`.
- Scripture light: white panel, `--gray-200` border, 3px `--gradient-gold` rule, Lora 22px, verse numbers `--horizon-blue-dim`.
- Scripture dark `.dp-scripfig-dark`: `--charcoal-900` panel, `--leather-gold` rule, white text, verse numbers `--blue-on-dark`.

## Rules
- Use `--font-serif` (Lora) for pull and scripture text only; captions and references stay in Inter.
- Give the reference in full (book, chapter:verse) and the translation abbreviation (BSB).
- Verse numbers are superscript `.dp-sv`, Inter 600, never Lora.
- Quote a real person with consent; give name, role and place. Never invent a testimonial and present it as genuine.
- Keep a pull quote under about 35 words; trim with an ellipsis rather than shrinking the type.
- Do not italicise scripture; Lora regular is the house style.

## Accessibility
- Use `<figure>`, `<blockquote>` and `<figcaption>` so the source is tied to the quote.
- The quote mark, gold rule and thread are decorative: `aria-hidden="true"`.
- Avatar beside the visible name uses `alt=""`.
- Set `lang` on the blockquote when it is not in the page language (`lang="am"` for Amharic).

## Content
- Warm, first-person, specific: who heard, where, in which language.
- Scripture defaults to the Berean Standard Bible (BSB), free to share.
