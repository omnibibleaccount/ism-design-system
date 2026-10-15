# AppHomeScreen
The composed dot.Bible home screen, built only from App UI parts: app bar with the dot.Bible mark, search, continue-reading card, grouped language rows, mini player and tab bar.

## When to use
- Use as the reference layout for the dot.Bible Home tab and as the pattern for other ISM app home screens.
- Copy its order and spacing; swap the content blocks for the app in question.
- Do not add a hero image or marketing banner above Continue reading.

## Anatomy & markup
Top to bottom inside `.ap-screen`:
1. `.ap-sb` status bar + `.ap-bar` with `.ap-wm` (dot.Bible icon + wordmark), notifications `.ap-tb`, account `.ap-avatar`.
2. Search field `.ap-px` > `.ap-field` ("Search 500+ languages"), opens SearchResults.
3. Continue card `.ap-cont`: `.ap-kicker.ap-kicker-blue`, `.ap-cont-t`, progress `.ap-ring-sm`, Lora preview `.ap-cont-v`, `.ap-cont-acts`.
4. `.ap-res-h` "Your languages" + See all ›, then `.ap-grp` rows with `.ap-lt` tiles and › or `.ap-dl`.
5. Mini player `.ap-mini` with `.ap-mini-line` progress.
6. `.ap-tabbar`, Home active.

```html
<div class="ap-bar">
  <span class="ap-wm"><img src="assets/logos/dot.bible%20Icon%20Black.svg" alt=""><span>dot<b>.</b>Bible</span></span>
  <span style="flex:1"></span>
  <button class="ap-tb" type="button" aria-label="Notifications">…</button>
  <button class="ap-avatar" type="button" aria-label="Account">M</button>
</div>
<div class="ap-cont">
  <div class="ap-cont-top"><div><span class="ap-kicker ap-kicker-blue">Continue reading · BSB</span><p class="ap-cont-t">John 3</p></div>
    <span class="ap-ring-sm" role="img" aria-label="42 percent read">42%</span></div>
  <p class="ap-cont-v"><sup class="ap-vn">16</sup>For God so loved the world…</p>
  <div class="ap-cont-acts"><button class="btn btn-primary btn-sm">Continue</button><button class="btn btn-secondary btn-sm">Listen</button></div>
</div>
```

## Variants & states
- First run (no reading yet): replace the continue card with "Start reading" (Genesis 1 or John 1) and keep one primary.
- No languages downloaded: rows show `.ap-dl-idle` buttons and sizes.
- Nothing playing: drop `.ap-mini`; content scrolls straight under the tab bar.
- Dark mode: use `.ap-screen.ap-dark` and `.ap-tabbar.ap-dark`; the mark gets `filter: brightness(0) invert(1)`.

## Rules
- One Horizon Blue primary on the screen: Continue. Everything else is secondary, ghost or a row.
- The dot in the wordmark is Horizon Blue; the icon renders black (inverted on dark).
- Downloaded languages show ›; languages not on the phone show the download button, so people see what works offline.
- Mini player: `--charcoal-900`, `--radius-md`, 8px above the tab bar, `--gradient-line` progress on top.
- Notification and update dots are Horizon Blue, never red.
- Keep 16px side margins throughout; cards `--radius-lg`, rows `--radius-md`.

## Accessibility
- Screen title is "Home" for assistive tech even though the wordmark is shown (a visually hidden `h1` or the tab name).
- Progress ring and mini-player line have text equivalents ("42 percent read", "2:14 of 5:40").
- Reading order follows the visual order; the mini player comes before the tab bar.
- All tap targets are 44px or more.

## Content
- Search: "Search 500+ languages".
- Kicker: "Continue reading · BSB"; title is the chapter, preview is the next verse in Lora.
- Language rows: English name + native script, then "Bible + audio · Downloaded" or size.
- Mini player: "John 3 · Amharic" / "2:14 / 5:40".
