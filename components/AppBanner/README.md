# AppBanner
Promotes the dot.Bible app in three sizes: a dismissible "Open in app" smart banner on mobile, an inline promo card with QR and store badges on desktop, and a slim strip at the end of an article.

## When to use
- Smart banner `.mn-sbanner`: top of mobile pages on dot.bible and ism.bible, once per visit.
- Promo card `.mn-promo`: inside a page section about the app or Scripture access.
- Slim strip `.mn-strip`: end of an article or reading page.
- Do not stack more than one app promotion in a view.
- Do not use for giving or newsletter asks; use DonationWidget or NewsletterCard.

## Anatomy & markup
Every variant starts with the app tile `.mn-apptile`: the dot.Bible icon in white on black with a 3px `--gradient-line` underline.

Smart banner (above the site header):

```html
<div class="mn-sbanner" role="region" aria-label="Get the dot.Bible app">
  <button class="mn-sb-x" type="button" aria-label="Dismiss"><svg …aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
  <span class="mn-apptile"><img src="../../assets/logos/dot.bible%20Icon%20Black.svg" alt=""></span>
  <span class="mn-sb-text"><span class="mn-sb-name">dot.Bible</span><span class="mn-sb-sub">Read offline in 500+ languages</span></span>
  <a class="btn btn-primary btn-sm mn-sb-open" href="…">Open</a>
</div>
```

Promo card:

```html
<div class="card card-lg card-flat mn-promo">
  <div class="mn-promo-body">
    <div class="mn-promo-brand"><span class="mn-apptile mn-apptile-md"><img src="…/dot.bible%20Icon%20Black.svg" alt=""></span>dot.Bible · free</div>
    <h3 class="h3">Take the Bible with you, even offline.</h3>
    <p class="muted">Read and listen in 500+ languages. Download a book once and keep reading where there is no signal.</p>
    <div class="mn-promo-get">
      <div class="mn-qr mn-qr-sm"><svg width="72" height="72" role="img" aria-label="QR code to download dot.Bible">…</svg></div>
      <div class="mn-promo-badges"><a class="mn-store mn-store-sm" …>…</a><a class="mn-store mn-store-sm" …>…</a></div>
    </div>
  </div>
  <div class="media mn-promo-media"><img class="photo" src="…/deck-photo-tap-hand.png" alt="A hand holding a phone"></div>
</div>
```

Slim strip:

```html
<div class="mn-strip">
  <span class="mn-apptile mn-apptile-sm"><img src="…" alt=""></span>
  <p><b>Keep reading in the dot.Bible app.</b> Free, offline, 500+ languages.</p>
  <a class="btn btn-ghost btn-sm" href="…">Get the app <span class="arrow" aria-hidden="true">↗</span></a>
</div>
```

## Variants & states
| Variant | Classes | Tile |
|---|---|---|
| Smart banner | `.mn-sbanner` (white, bottom hairline) | `.mn-apptile` 52px |
| Promo card | `.card card-lg card-flat mn-promo` (two columns; stacks under 768px, QR hidden, photo 220px) | `.mn-apptile-md` 44px |
| Slim strip | `.mn-strip` (`--blue-tint`, `--radius-md`) | `.mn-apptile-sm` 40px |

Dismiss `.mn-sb-x`: default (`--gray-600`), hover (`--gray-100` fill, black icon), focus ring.

## Rules
- The smart banner's Open is the one Horizon Blue button on screen at that moment; the header Give pill stays `.btn-light`.
- Always offer dismiss on the smart banner; remember the choice for the visit and do not show it again after dismiss.
- Dismiss and Open are at least 44px / 40px tall; the X is a 44px circle.
- The promo card uses StoreBadges `.mn-store-sm`, never blue buttons, to install the app. Hide the QR on phones.
- The strip's link goes to the app page, so it ends with ↗ and uses `.btn-ghost`.
- The app icon is the black logo file rendered white (`filter: brightness(0) invert(1)`).
- Use real product facts only: free, offline, 500+ languages.

## Accessibility
- The smart banner is a named region (`aria-label="Get the dot.Bible app"`).
- Dismiss has `aria-label="Dismiss"`; after dismissing, move focus to the page's first heading or skip link.
- App tile images are decorative (`alt=""`); the name beside them carries meaning.
- Promo photo has real alt text ("A hand holding a phone").
- Do not animate the banner in once the page has been read; it renders on load only.

## Content
- Banner: "dot.Bible" / "Read offline in 500+ languages" / "Open".
- Card: "Take the Bible with you, even offline."
- Strip: "**Keep reading in the dot.Bible app.** Free, offline, 500+ languages." + "Get the app ↗".
