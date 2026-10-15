# Footer
The site-wide black footer for ism.bible: a gradient-bordered giving banner, the full ISM logo with tagline and socials, three link columns and a legal line.

## When to use
- Use it once, at the bottom of every ism.bible page and every page built from the website kit.
- Do not use it in apps or email (email has its own footer).
- Do not add page-specific links here. Put them in the page body or in a sitemap link list.

## Anatomy & markup
Top to bottom: glow layer, CTA banner, brand column + three nav columns, hairline, legal row.

### React
The bundle exposes `window.ISMDesignSystem_106e83.Footer`.

| Prop | Type | Default |
| --- | --- | --- |
| `ctaText` | `string` (optional) | "Help deliver the Bible beyond every barrier." |
| `ctaLabel` | `string` (optional) | "Support Bible Access" |

```jsx
<Footer ctaText="Help deliver the Bible beyond every barrier." ctaLabel="Support Bible Access" />
```

The React footer is a static picture: its links are plain text, the Platforms column has no Global Bible Network, there is no Newsletter or Cookie settings, and its glow comes from a remote image. Use it for mock-ups. For production pages use the HTML below.

### HTML / CSS
```html
<footer class="nv-foot">
  <div class="nv-foot-glow" aria-hidden="true"></div>
  <div class="nv-foot-in">
    <div class="nv-fcta">
      <h2 class="nv-fcta-h">Help deliver the Bible beyond every barrier.</h2>
      <a class="btn btn-outline-light nv-fcta-btn" href="/give">Support Bible Access <span class="arrow" aria-hidden="true">↗</span></a>
    </div>
  </div>
  <div class="nv-foot-in nv-foot-body">
    <div class="nv-fmain">
      <div class="nv-fbrand">
        <a class="nv-flogo" href="/" aria-label="International Scripture Ministries home"><img src="assets/logos/Full%20Logo%20Black.svg" alt="International Scripture Ministries"></a>
        <p class="nv-ftag">Delivering unhindered access to the Bible until everyone can engage with Scripture in their own language, without barriers.</p>
        <div class="nv-socials"><a class="nv-soc" href="…" aria-label="Instagram"><svg viewBox="0 0 32 32" aria-hidden="true">…</svg></a> <!-- Facebook, X, LinkedIn --></div>
      </div>
      <nav class="nv-fnav" aria-label="Footer">
        <div class="nv-fcol"><h2 class="nv-fcol-h">About</h2><a class="lnk" href="/about">About ISM</a> …</div>
        <div class="nv-fcol"><h2 class="nv-fcol-h">Platforms</h2> …</div>
        <div class="nv-fcol"><h2 class="nv-fcol-h">Get Involved</h2> …</div>
      </nav>
    </div>
    <div class="nv-frule"></div>
    <div class="nv-flegal">
      <div><p>© 2026 – International Scripture Ministries Inc</p><p>ISM is a 501(c)(3) nonprofit organization. All donations are tax-deductible.</p></div>
      <div class="nv-flegal-links"><a class="lnk" href="/cookies">Cookie Policy</a><a class="lnk" href="/terms">Terms</a><a class="lnk" href="/privacy">Privacy</a><button type="button" class="lnk">Cookie settings</button></div>
    </div>
  </div>
</footer>
```

## Variants & states
- **Desktop:** 1100px max content width; brand column (max 390px) beside the three columns; legal row splits left/right.
- **Mobile (below 768px, or `.nv-foot-sm`):** banner stacks with a full-width button, columns become a 2-up grid, legal links sit above the copyright.
- **Link hover:** `.lnk` draws a 1px underline from the left.
- **Social hover:** ring brightens to `rgba(255,255,255,.55)`.
- **Cookie settings:** re-opens the CookieBanner.

## Rules
- Keep the footer `var(--black)` with the blue/peach glow; never put it on a light background.
- The banner border is always `var(--gradient-line)` on a 1px transparent border, `var(--radius-ml)`. Do not fill it.
- The banner button is `.btn-outline-light` with a white border and ↗ (it goes to another page). Never use a Horizon Blue primary here; the header already carries Give.
- Column heads: 11px, 700, uppercase, `.13em` tracking, `var(--text-tertiary-dark)`. Links: 13px, 600, white.
- Social links are 44px rings. Logo is white (`filter: brightness(0) invert(1)`), 285px wide max.
- Legal text is 12px `var(--text-tertiary-dark)`; legal links and Cookie settings keep 44px tap height.
- Only use ↗ on links that leave the page's context (the banner button); plain footer links get no icon.

## Accessibility
- Wrap the columns in `<nav aria-label="Footer">`. Column heads are headings so screen-reader users can jump between them.
- Social icons are `aria-hidden`; each link has `aria-label` with the network's name.
- "Cookie settings" is a `<button>`, not a link, because it opens a dialog.
- White on black and 50% white on black both pass AA at the sizes used.

## Content
- Banner: one plain sentence about the mission plus a short action. Example: "Help deliver the Bible beyond every barrier." / "Support Bible Access ↗".
- Tagline stays as written: "Delivering unhindered access to the Bible until everyone can engage with Scripture in their own language, without barriers."
- Columns: About (About ISM, Our Mission, Our Team, Statement of Faith, FAQ's), Platforms (dot.Bible App, ISM Radio, ISM Publishing, TAP Cards, Global Bible Network), Get Involved (Give Online, Join The Mission, Partner With Us, Newsletter, Contact).
