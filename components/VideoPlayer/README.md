# VideoPlayer
A 16:9 video frame: a poster with a large white play button, caption and duration chips, and while playing a bottom control bar with seek, time, captions, settings and full screen.

## When to use
- Use for ISM stories, field reports and dot.Bible app explainers on ism.bible.
- Use one featured video per section, with a title and summary under it.
- Do not use for audio-only Scripture; use AudioPlayer.
- Do not use as a decorative background loop.

## Anatomy & markup
Poster state:

```html
<div class="mn-vid">
  <img src="../../assets/imagery/photo-friends.jpg" alt="">
  <div class="mn-scrim"></div>
  <button class="mn-playbtn" type="button" aria-label="Play video: Reading John together, across three countries, 4 minutes 12 seconds"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg></button>
  <span class="mn-vchip mn-vchip-l"><span class="mn-cc">CC</span>12 languages</span>
  <span class="mn-vchip mn-vchip-r">4:12</span>
</div>
<h3 class="h4">Reading John together, across three countries</h3>
```

Playing state:

```html
<div class="mn-vid">
  <img src="…" alt="">
  <div class="mn-scrim mn-scrim-play"></div>
  <div class="mn-caption">For God so loved the world…</div>
  <div class="mn-vctrl">
    <div class="mn-vtrack" role="slider" tabindex="0" aria-label="Seek" aria-valuemin="0" aria-valuemax="252" aria-valuenow="84" aria-valuetext="1:24 of 4:12"><span class="mn-buf"></span><span class="mn-fill"></span><span class="mn-knob"></span></div>
    <div class="mn-vrow">
      <button class="mn-vbtn" type="button" aria-label="Pause">…</button>
      <button class="mn-vbtn" type="button" aria-label="Mute">…</button>
      <span class="mn-vtime">1:24 / 4:12</span>
      <span class="mn-vspacer"></span>
      <button class="mn-vbtn" type="button" aria-label="Captions" aria-pressed="true"><span class="mn-cc">CC</span></button>
      <button class="mn-vbtn" type="button" aria-label="Settings">…</button>
      <button class="mn-vbtn" type="button" aria-label="Full screen">…</button>
    </div>
  </div>
</div>
```

## Variants & states
- Poster: `.mn-scrim` (light bottom fade), centered `.mn-playbtn` (76px white circle), chips bottom-left (captions) and bottom-right (duration).
- Playing: `.mn-scrim-play` (stronger fade), `.mn-caption` above the bar, `.mn-vctrl` controls. Controls show on hover, tap or focus and hide after a few seconds of play.
- Play button: default (white, black icon), hover (Horizon Blue, white icon), focus (Horizon Blue ring). `.mn-playbtn-static` is a 56px specimen for spec sheets.
- Control buttons `.mn-vbtn` (44px): hover white 14% fill; captions on (`aria-pressed="true"`) shows a `--blue-on-dark` underline; focus `--blue-on-dark` outline.
- Seek: track white 30%, buffered white 35%, played `--gradient-line`, 14px white knob.

## Rules
- Frame is 16:9, `--radius-lg`, `--charcoal-900` behind the poster.
- The play button is white at rest; it turns Horizon Blue only on hover. No other blue in the frame.
- Show the duration chip and a captions chip on every poster; captions are on by default when available.
- Played progress uses `--gradient-line`, not Horizon Blue.
- All controls are 44px. Keep them in one row: play, mute, time, spacer, captions, settings, full screen.
- Never autoplay with sound. Load the video only after the play press.
- Always pair the player with a visible title (`.h4`) and one-line summary.

## Accessibility
- The play button's label includes the title and duration.
- The seek bar is a focusable slider with `aria-valuetext` ("1:24 of 4:12").
- Captions and Mute are toggles with `aria-pressed`; swap Play/Pause labels with the icon.
- Provide captions for every video, and a transcript link for longer ones.
- The poster image is decorative (`alt=""`); the title names the video.
- Controls stay visible while any of them has keyboard focus.

## Content
- Title states who and what: "Reading John together, across three countries".
- Summary one sentence: "Friends in Kenya, Peru and the Philippines meet on a video call to read John 3 in their own languages."
- Captions chip: "CC 12 languages".
