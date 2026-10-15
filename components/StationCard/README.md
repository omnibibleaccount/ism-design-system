# StationCard
A partner radio station card: photo, call sign and frequency, an On air or Off air pill, city and languages, what is playing now, and one action.

## When to use
- Use on ISM Radio and Global Bible Network pages to list partner and HD Radio stations.
- Use in a grid of 2–4 cards, or one card beside a NetworkMap selection.
- Do not use for audio Bible chapters; use AudioPlayer.
- Do not use for a partner organisation without a station; use PartnerCard.

## Anatomy & markup
Image (150px) → body: head (name, frequency, status pill) → meta rows → now line → action.

```html
<article class="card card-flat mn-station">
  <div class="mn-station-img"><img class="photo" src="../../assets/imagery/deck-photo-headphones.jpg" alt="A listener wearing headphones"></div>
  <div class="mn-station-body">
    <div class="mn-station-head">
      <div><p class="mn-station-name">KISM</p><p class="mn-station-freq">98.7 FM · HD2</p></div>
      <span class="mn-live"><i aria-hidden="true"></i>On air</span>
    </div>
    <div class="mn-meta">
      <span><svg width="16" height="16" …aria-hidden="true">…</svg>Nairobi, Kenya</span>
      <span><svg width="16" height="16" …aria-hidden="true">…</svg>Swahili · English</span>
    </div>
    <p class="mn-station-now">Now: <span>The Gospel of John, read aloud</span></p>
    <a class="btn btn-primary" href="…"><svg width="16" height="16" fill="currentColor" aria-hidden="true">…</svg>Listen live</a>
  </div>
</article>
```

## Variants & states
| State | Pill | Image | Action |
|---|---|---|---|
| On air | `.mn-live` (pulsing `--live` dot) | full colour | `.btn btn-primary` "Listen live" |
| Off air | `.mn-offair` (grey dot) | `.mn-station-img mn-is-off` (greyscale, 85%) | `.btn btn-secondary` "Past broadcasts ↗" |

The card itself uses the `.card` hover and focus from the base layer.

## Rules
- Live is the `--live` red dot only. Never colour the card, the name or the button red.
- The pulse stops under `prefers-reduced-motion`.
- Only on-air cards get the Horizon Blue "Listen live" button. In a grid of several on-air cards, keep it to the one featured station and use `.btn-secondary` for the rest.
- Name 24px 600; frequency in tabular numbers ("98.7 FM · HD2").
- Meta rows: location, then languages separated by " · ". Two rows at most.
- Off-air cards say when the station returns, in local time.
- Past broadcasts open another page, so they carry ↗.
- Card padding 22px 24px 24px; image 150px tall, `object-fit: cover`.

## Accessibility
- The status pill has visible text ("On air" / "Off air"); the dot is `aria-hidden`.
- The station photo has real alt text; meta icons are `aria-hidden="true"`.
- "Listen live" starts audio only on press; never autoplay.
- Each card is an `<article>`; if the grid has a heading, make card names part of the outline as needed.

## Content
- Call sign or station name as the station uses it ("KISM", "Radio Vida").
- Now line: "Now: The Gospel of John, read aloud".
- Off air: "Back on air at 6:00 am local time".
- Station names, frequencies and schedules shown in the preview are samples.
