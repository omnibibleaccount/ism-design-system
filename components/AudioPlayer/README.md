# AudioPlayer
The audio Bible player: a full player with cover, seek bar, speed and transport controls, and a docked mini player in light and dark.

## When to use
- Use the full player `.sx-player` on a listen page or when the reader taps Listen in ReadingView.
- Use the mini player `.sx-mini` docked at the bottom of the screen while audio keeps playing as the reader moves around.
- Do not use for ISM Radio live streams; use StationCard and its live player.
- Do not use for video; use VideoPlayer.

## Anatomy & markup
Full player: square cover (240px) beside the title, seek track, times and controls.

```html
<section class="sx-player" aria-label="Audio player">
  <div class="sx-cover"><img src="…/deck-photo-headphones.jpg" alt=""></div>
  <div class="sx-player-main">
    <div>
      <span class="sx-lbl">Now playing · dot.Bible Audio</span>
      <p class="sx-player-title">John 3 · Amharic</p>
      <p class="sx-player-sub"><span lang="am">ዮሐንስ 3</span> · Narrated Bible</p>
    </div>
    <div class="sx-track" tabindex="0" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="352" aria-valuenow="134" aria-valuetext="2 minutes 14 seconds"><i style="width:38%"></i><b style="left:38%"></b></div>
    <div class="sx-time"><span>2:14</span><span>−3:38</span></div>
    <div class="sx-controls">
      <button type="button" class="sx-speed" aria-label="Playback speed, 1x">1x</button>
      <div class="sx-transport">
        <button type="button" class="sx-ctrl" aria-label="Previous chapter">…</button>
        <button type="button" class="sx-ctrl" aria-label="Back 15 seconds">…<small aria-hidden="true">15</small></button>
        <button type="button" class="sx-big" aria-label="Pause">…</button>
        <button type="button" class="sx-ctrl" aria-label="Forward 15 seconds">…<small aria-hidden="true">15</small></button>
        <button type="button" class="sx-ctrl" aria-label="Next chapter">…</button>
      </div>
      <button type="button" class="sx-ibtn" aria-label="Chapter list">…</button>
    </div>
  </div>
</section>
```

Mini player:

```html
<div class="sx-mini" style="--sx-progress:38%">
  <img src="…/deck-photo-headphones.jpg" alt="">
  <div class="sx-mini-text"><span class="sx-mini-title">John 3 · Amharic</span><span class="sx-mini-meta">2:14 / 5:52</span></div>
  <button type="button" class="sx-ctrl" aria-label="Back 15 seconds">…<small aria-hidden="true">15</small></button>
  <button type="button" class="sx-big sx-big-sm" aria-label="Pause">…</button>
</div>
```

## Variants & states
| Variant | Classes |
|---|---|
| Full player | `.sx-player` (stacks under 768px, cover goes full width square) |
| Mini, light | `.sx-mini` (72px, `--shadow-overlay`, 3px progress line on top via `--sx-progress`) |
| Mini, dark | `.sx-mini sx-mini-dark` (`--charcoal-900`; play button turns white with black icon; progress `--blue-on-dark`) |

Play button `.sx-big` (68px; `.sx-big-md` 52px, `.sx-big-sm` 44px): playing (pause icon), paused (play icon), hover (`--horizon-blue-dim`), loading (`.spin` inside, `role="img" aria-label="Loading"`).
Speed `.sx-speed` cycles 1x → 1.25x → 1.5x → 0.75x. Paused mini player swaps the skip button for "Close player".

## Rules
- One Horizon Blue control: the play/pause button. Everything else is quiet (`.sx-ctrl` transparent, `.sx-ibtn` outlined).
- Seek track is 6px, fill `--horizon-blue`, 18px white knob with a blue ring.
- Show elapsed on the left and remaining (with −) on the right, in tabular numbers.
- Skip buttons jump 15 seconds and show "15" inside the icon.
- Transport buttons are 48px; mini player controls are 44px. Never smaller.
- Cover radius `--radius-ml`; player card `--radius-lg` with `--shadow-card-light`.
- The chapter list button drills into a list, so it uses the list icon, not a caret.

## Accessibility
- Name the region (`aria-label="Audio player"`).
- The seek track is a focusable `role="slider"` with min, max, now and a spoken `aria-valuetext` ("2 minutes 14 seconds"); arrow keys move 5 seconds.
- Swap the play button's `aria-label` between "Play" and "Pause" with its icon.
- The speed button's label includes the value ("Playback speed, 1.25x").
- Cover images are decorative (`alt=""`); the title carries the meaning.
- Mark the native-script subtitle with `lang` (`lang="am"`).
- Never autoplay.

## Content
- Title: "Book chapter · Language" ("John 3 · Amharic"). Subtitle: native name, then "Narrated Bible".
- Overline: "Now playing · dot.Bible Audio".
- Mini meta: "2:14 / 5:52", or "Paused · 2:14 / 5:52".
