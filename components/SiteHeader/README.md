# SiteHeader
The site-wide black header bar for ism.bible: ISM mark, five main links (three open submenus), a white Give pill and a menu button that opens the mobile drawer.

## When to use
- Use it once, at the top of every ism.bible page and every page built from the website kit.
- Do not use it inside apps (dot.Bible app screens have their own top bar) or in email.
- Do not add a second header for a section. Section navigation belongs in Tabs or AnchorNav under the hero.

## Anatomy & markup
Two parts: the bar (`header.hdr`) and the drawer (`.drawer` with `.drawer-scrim`). The bar is fixed, 72px tall, `var(--black)`.

### React
The bundle exposes `window.ISMDesignSystem_106e83.SiteHeader`. It takes no props (`SiteHeaderProps` is empty) and draws a static bar: logo, link row, Give pill, menu icon.

```jsx
<SiteHeader />
```

The React component still shows an older link set (it includes "Download App", "Stories of Impact" and "Bible") and its logo points at `Logo White.svg`. Use it for quick mock-ups only. For production pages use the HTML below, which matches the current website.

### HTML / CSS
```html
<a class="skip nv-skip" href="#main">Skip to content</a>
<header class="hdr">
  <div class="nv-hdr-in">
    <a class="nv-logo" href="/" aria-label="International Scripture Ministries home"><img src="assets/logos/Logo%20Black.svg" alt="ISM"></a>
    <nav class="nv-links ism-desk" aria-label="Main">
      <span class="nv-sub-wrap">
        <button class="navlink nv-has-sub" type="button" aria-expanded="false" aria-controls="sub-about">About ISM<svg class="nv-caret" …><path d="M6 9l6 6 6-6"/></svg></button>
        <div class="nv-subpanel" id="sub-about" hidden>
          <a class="nv-subitem nv-overview" href="/about"><span class="nv-subitem-txt"><span class="nv-subitem-t">About ISM overview</span><span class="nv-subitem-d">Who we are and why</span></span><span class="nv-subitem-go" aria-hidden="true">↗</span></a>
          <a class="nv-subitem" href="/mission">…</a>
        </div>
      </span>
      <!-- Resources ⌄ · Global Network · Join The Mission ⌄ · Contact -->
      <a class="navlink" href="/global-network">Global Network</a>
    </nav>
    <div class="nv-actions">
      <a class="btn btn-light btn-sm nv-give" href="/give"><svg …heart/>Give</a>
      <button class="iconbtn nv-burger ism-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="ism-drawer"><svg …/></button>
    </div>
  </div>
</header>

<!-- mobile drawer (rendered when open) -->
<div class="drawer-scrim"></div>
<div class="drawer" id="ism-drawer" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="nv-dtop"><img src="assets/logos/Logo%20Black.svg" alt=""><button class="iconbtn" aria-label="Close menu">…</button></div>
  <a class="dlink" href="/"><span>Home</span><span class="nv-dgo" aria-hidden="true">↗</span></a>
  <button class="nv-dparent" type="button" aria-expanded="true" aria-controls="d-about"><span>About ISM</span><svg class="nv-caret" …/></button>
  <div class="nv-dsub" id="d-about"><a href="/about"><span>About ISM overview</span><span aria-hidden="true">↗</span></a> …</div>
  <div class="nv-dcta"><a class="btn btn-primary btn-lg" href="/give">Give online</a><a class="btn btn-outline-light btn-lg" href="/partner">Partner with us</a></div>
</div>
```

Current main links, in order: About ISM ⌄, Resources ⌄, Global Network, Join The Mission ⌄, Contact. "Download App" was removed from the bar; the app lives under Resources.

## Variants & states
- **Top of page:** `.hdr` with a transparent bottom border.
- **Scrolled (>8px):** add `.is-scrolled` for the shadow and white hairline.
- **Current section:** `aria-current="page"` on the link or caret button shows the gradient underline.
- **Submenu open:** caret button `aria-expanded="true"`, caret rotates 180°, `.nv-subpanel` drops 14px below the bar. Row hover is `rgba(255,255,255,.07)`.
- **Below 1024px:** `.ism-desk` hides the links; the menu button opens the drawer. Caret rows (`.nv-dparent`) expand in place, one at a time; open row turns `var(--blue-on-dark)`.
- **Static preview:** add `.nv-static` to `.hdr` or `.drawer` to drop fixed positioning (docs and boards only).

## Rules
- Keep the bar `var(--black)` with the white logo (`filter: brightness(0) invert(1)`). Never put the header on white.
- Use the icon rule: caret ⌄ = opens a submenu here; ↗ = goes to another page; › = drills into an app screen (never in the website header).
- The first row of every submenu links to the section's own page (`.nv-overview`).
- Give is the only button in the bar and stays `.btn-light` (white pill). In the drawer, the one Horizon Blue primary is "Give online"; "Partner with us" is `.btn-outline-light`.
- Max five main links. Add new pages to a submenu, not to the bar.
- Every tap target is at least 44px (`.navlink`, `.iconbtn`, `.nv-dsub a`).
- Submenu panel: `var(--charcoal-900)`, `var(--radius-ml)`, 340px wide.

## Accessibility
- Make the skip link the first focusable element.
- Caret items are `<button>`s with `aria-expanded` and `aria-controls`; plain items are links.
- Open submenus on click and on hover; close on Esc and on click outside, and return focus to the caret button.
- The drawer is `role="dialog" aria-modal="true"`; trap focus inside, close on Esc and scrim click, and return focus to the menu button.
- The heart icon is `aria-hidden`; the visible "Give" text is the label.

## Content
- Link labels are short nouns in Title Case: "About ISM", "Join The Mission".
- Submenu rows have a title and a one-line description: "dot.Bible App · Free Bible apps in 500+ languages", "HD Radio Broadcast · Scripture on the airwaves".
- The Give pill always says "Give". Drawer buttons say "Give online" and "Partner with us".
