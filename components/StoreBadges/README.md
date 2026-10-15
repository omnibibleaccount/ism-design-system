# StoreBadges
Black App Store and Google Play download badges for the dot.Bible app, in two sizes, for light and dark sections, with an optional QR for desktop.

## When to use
- Use wherever the reader can install the dot.Bible app: app pages, AppBanner, footers, language pages.
- Use the QR + badges combo on desktop, where the reader is not on a phone.
- Do not use for links to the web reader; use a Button ("Read online").
- Do not restyle the badges as Horizon Blue buttons.

## Anatomy & markup
Store icon + two-line label ("Download on the" / "App Store").

```html
<div class="mn-stores">
  <a class="mn-store" href="https://apps.apple.com/…" aria-label="Download dot.Bible on the App Store">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">…</svg>
    <span><span class="mn-s1">Download on the</span><span class="mn-s2">App Store</span></span>
  </a>
  <a class="mn-store" href="https://play.google.com/…" aria-label="Get dot.Bible on Google Play">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">…</svg>
    <span><span class="mn-s1">Get it on</span><span class="mn-s2">Google Play</span></span>
  </a>
</div>
```

QR combo (desktop):

```html
<div class="mn-qrcombo">
  <div class="mn-qr"><svg width="112" height="112" role="img" aria-label="QR code to download dot.Bible">…</svg></div>
  <div>
    <p>Scan to get dot.Bible on your phone</p>
    <div class="mn-stores">
      <a class="mn-store mn-store-sm" href="…" aria-label="Download dot.Bible on the App Store">…</a>
      <a class="mn-store mn-store-sm" href="…" aria-label="Get dot.Bible on Google Play">…</a>
    </div>
  </div>
</div>
```

## Variants & states
| Variant | Classes | Size |
|---|---|---|
| Default | `.mn-store` | 52px tall, min 172px, `--radius-md` |
| Small | `.mn-store mn-store-sm` | 44px tall, min 150px, `--radius-sm` |
| On dark | inside `.mn-panel-dark`, `.on-dark` or `.sec-ink` | adds a 1px white 40% border |
| QR combo | `.mn-qrcombo` + `.mn-qr` | QR 112px on a white tile |

States: default (`--black`), hover (`--charcoal-800`; on dark the border brightens to white 70%), focus (2px Horizon Blue outline + `--shadow-focus`).

## Rules
- Badges are always black with white text, on light and dark. On dark sections add the white 40% border (automatic in `.mn-panel-dark`, `.on-dark`, `.sec-ink`).
- App Store first, Google Play second; group them in `.mn-stores` with `--space-3` gap.
- Use the same size for both badges in a pair. Never go below `.mn-store-sm` (44px).
- Show the QR only on desktop; hide it on phones.
- These open a store outside ISM, but do not add ↗; the badge shape already says it.
- Do not use the official Apple or Google artwork files here; this system draws its own black badges.

## Accessibility
- Each badge is a link with a full `aria-label` ("Download dot.Bible on the App Store").
- Store icons are `aria-hidden="true"`.
- The QR is `role="img"` with `aria-label="QR code to download dot.Bible"`; the badges beside it are the accessible path.

## Content
- Fixed labels: "Download on the / App Store", "Get it on / Google Play".
- QR prompt: "Scan to get dot.Bible on your phone".
