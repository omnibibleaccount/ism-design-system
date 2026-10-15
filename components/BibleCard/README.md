# BibleCard
A black-leather Bible cover with a gold tooled border that presents one language's Bible: native name, dot.bible address, Read / Listen / Order / Get the app tiles and a QR share, plus a compact row for lists.

## When to use
- Use the full card `.sx-bible` as the hero of a dot.bible language page or the featured language in the homepage directory.
- Use the compact row `.sx-bible sx-bible-row` in a short list of featured languages.
- Do not use for long language lists (hundreds of rows); use LanguageRow.
- Do not use the leather surface for anything that is not a Bible.

## Anatomy & markup
Leather surface → head (native name + URL) → four action tiles → gold rule → QR share.

```html
<article class="sx-bible" aria-live="polite">
  <div class="sx-bible-head">
    <p class="sx-bible-native" lang="am">አማርኛ</p>
    <p class="sx-bible-url">dot.bible/amharic</p>
  </div>
  <div class="sx-bible-actions" role="group" aria-label="Ways to get the Amharic Bible">
    <a class="sx-bible-act sx-bible-act-primary" href="/amharic/read"><svg …aria-hidden="true">…</svg><span>Read</span></a>
    <a class="sx-bible-act" href="/amharic/listen"><svg …>…</svg><span>Listen</span></a>
    <a class="sx-bible-act" href="/amharic/order"><svg …>…</svg><span>Order</span></a>
    <a class="sx-bible-act" href="/app"><svg …>…</svg><span>Get the app</span></a>
  </div>
  <div class="sx-bible-rule" aria-hidden="true"></div>
  <div class="sx-bible-share">
    <div class="sx-qr"><svg role="img" aria-label="QR code for dot.bible/amharic">…</svg></div>
    <div class="sx-bible-share-text">
      <p class="sx-bible-share-title">Share with someone nearby</p>
      <p class="small sx-bible-share-copy">Point a phone camera at the code to open the Amharic Bible instantly.</p>
      <div class="sx-btnrow">
        <button type="button" class="btn btn-outline-light btn-sm">Copy link</button>
        <button type="button" class="btn btn-outline-light btn-sm">Share…</button>
      </div>
      <p class="small" role="status"></p>
    </div>
  </div>
</article>
```

Compact row:

```html
<article class="sx-bible sx-bible-row">
  <div>
    <p class="sx-bible-native" lang="am">አማርኛ</p>
    <p class="sx-bible-url">Amharic · dot.bible/amharic</p>
  </div>
  <div class="sx-bible-row-acts">
    <a class="sx-bible-mini p" href="…" aria-label="Read the Amharic Bible">…</a>
    <a class="sx-bible-mini" href="…" aria-label="Listen to the Amharic Bible">…</a>
    <a class="sx-bible-go" href="…" aria-label="Open the Amharic language page">↗</a>
  </div>
</article>
```

The leather texture comes from `--sx-leather` (default `url("../assets/imagery/leather-black.jpg")`, falls back to `#121212`). Set `--sx-leather` on a parent if the asset path differs.

## Variants & states
- Full card: four tiles in a row; under 480px a 2 × 2 grid with icon beside label (72px), and the QR beside stacked full-width Copy link / Share.
- Compact row `.sx-bible-row`: native name 24px, two 44px `.sx-bible-mini` tiles and a gold ↗.
- Action tile `.sx-bible-act` (88px tall, white): default, hover (`--gray-200`), focus (2px `--leather-gold` outline). Primary `.sx-bible-act-primary` is Horizon Blue.
- Share status: after Copy link, the status line reads "Link copied: dot.bible/amharic" in `--leather-gold`.

## Rules
- Exactly one Horizon Blue tile per card: Read (`.sx-bible-act-primary` or `.sx-bible-mini.p`).
- Keep the cover shape: square spine corner on the left (10px dark spine), 32px radius on the right, gold double border inset 12px.
- Gold (`--leather-gold`) for eyebrow, rule, status and the ↗; focus rings on leather are gold, not blue.
- Native name first and largest (`--font-sans` 600, 32–44px); English name and URL below in `--text-secondary-dark`.
- Tiles go to other pages, so the compact row ends with ↗.
- Share buttons are `.btn-outline-light btn-sm`; never a second blue button.
- All tiles and buttons meet the 44px tap target.

## Accessibility
- Set `lang` (and `dir="rtl"` where needed) on the native name.
- Name the tile group: `aria-label="Ways to get the Amharic Bible"`.
- Icon-only compact tiles carry full labels ("Read the Amharic Bible").
- The QR is `role="img"` with an `aria-label` that names the address; always offer Copy link beside it.
- The copy confirmation sits in `role="status"` so it is announced.

## Content
- Native script name only in the title (አማርኛ, မြန်မာဘာသာ); English in the URL line for the row ("Amharic · dot.bible/amharic").
- Tile labels: Read, Listen, Order, Get the app.
- Share copy: "Share with someone nearby" / "Point a phone camera at the code to open the Amharic Bible instantly."
