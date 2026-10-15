# EventCard
Two sibling cards for what is happening at ISM: an event card with a date tile, type badge, time and place, and a news card with a photo, category badge, date and Read the story link.

## When to use
- Event `.mn-event`: prayer nights, launches, webinars and conferences with a date to register for.
- News `.mn-news`: field stories, announcements and press items.
- Use them side by side in a "What's happening" grid; give cards in a row equal height.
- Do not use for giving campaigns; use DonationWidget with goal progress.

## Anatomy & markup
Event:

```html
<article class="card card-flat mn-event">
  <div class="mn-event-head">
    <span class="mn-datetile" aria-hidden="true"><span class="mn-datetile-m">NOV</span><span class="mn-datetile-d">12</span></span>
    <span class="badge badge-info">Online event</span>
  </div>
  <h3 class="h4">Global prayer night for Bible translation</h3>
  <div class="mn-meta">
    <span><svg width="16" height="16" …aria-hidden="true">…</svg><time datetime="2026-11-12T19:00-05:00">Thursday, Nov 12 · 7:00 pm ET · 90 min</time></span>
    <span><svg width="16" height="16" …aria-hidden="true">…</svg>Online · link sent after you register</span>
  </div>
  <p class="muted">Pray with partners from 40 countries for the languages still waiting for Scripture.</p>
  <div class="mn-event-foot">
    <a class="btn btn-secondary btn-sm" href="…">Register <span class="arrow" aria-hidden="true">↗</span></a>
    <span>212 going (sample)</span>
  </div>
</article>
```

News:

```html
<article class="card card-flat mn-news">
  <div class="mn-news-img"><img class="photo" src="../../assets/imagery/print-photo-listener.jpg" alt="A woman listening to Scripture on her phone"></div>
  <div class="mn-news-body">
    <div class="mn-news-meta"><span class="badge badge-brand">Field story</span><time datetime="2026-10-02">Oct 2, 2026</time></div>
    <h3 class="h4">An audio Bible in Amharic reaches 40 radio stations</h3>
    <p class="muted">Listeners across Ethiopia now hear Scripture read aloud each morning in their heart language.</p>
    <a class="btn btn-ghost btn-sm mn-news-link" href="…">Read the story <span class="arrow" aria-hidden="true">↗</span></a>
  </div>
</article>
```

## Variants & states
- Event: 64 × 68px `.mn-datetile` (month 12px 700 in `--horizon-blue`, day 26px 600); type badge `.badge-info` (Online event) or another base badge for in-person.
- News: 180px photo, `.badge-brand` category, date in 13px `--gray-600`.
- Footers sit at the bottom (`margin-top:auto`) so a row of cards lines up.
- Cards use base `.card` hover and focus.

## Rules
- Both actions go to another page, so both end with ↗: `.btn-secondary btn-sm` "Register" on events, `.btn-ghost btn-sm` "Read the story" on news.
- No Horizon Blue filled button inside these cards; the page's primary action lives elsewhere.
- Event meta rows: time first (day, date, time with zone, length), then place. Always include the time zone.
- One badge per card. One-sentence summary, two lines at most.
- Mark invented counts as samples ("212 going (sample)").
- Use only system imagery; news photos need real alt text.

## Accessibility
- Use `<time datetime>` for every date and time.
- The date tile is `aria-hidden="true"`; the meta row carries the full date for screen readers.
- Each card is an `<article>` with an `h3` title; meta icons are `aria-hidden="true"`.
- Link text names the action; add the title as visually hidden text when several cards say "Read the story".

## Content
- Event title names the gathering: "Global prayer night for Bible translation".
- Time: "Thursday, Nov 12 · 7:00 pm ET · 90 min". Place: "Online · link sent after you register".
- News title is a plain headline in sentence case: "An audio Bible in Amharic reaches 40 radio stations".
