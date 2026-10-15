# DonationWidget
The giving module: one-time or monthly switch, preset amount chips with Other, a live impact line, one Give button and a secure note, plus compact and goal-progress versions.

## When to use
- Full widget `.mn-give`: the Give page and giving sections on ism.bible.
- Compact `.mn-compact`: sidebars and the end of articles.
- Goal progress `.mn-bar`: campaigns with a real target (year-end Bible drive).
- Do not use for partner sign-up or newsletter; use PartnerCard or NewsletterCard.
- Do not show more than one giving module in a view.

## Anatomy & markup
Heading → frequency switch → amount chips → impact line → Give button → secure note.

```html
<div class="card card-lg card-flat mn-give">
  <div class="mn-give-head">
    <h3 class="h4">Give to the mission</h3>
    <p class="muted">Your gift puts Scripture in the hands of people still waiting for it.</p>
  </div>
  <div class="mn-seg" role="group" aria-label="Gift frequency">
    <button type="button" aria-pressed="false">One-time</button>
    <button type="button" aria-pressed="true">Monthly</button>
  </div>
  <div class="field">
    <span class="label" id="amt-l">Amount (USD)</span>
    <div class="mn-amts" role="group" aria-labelledby="amt-l">
      <button class="chip" type="button" aria-pressed="false">$25</button>
      <button class="chip" type="button" aria-pressed="true">$50</button>
      <button class="chip" type="button" aria-pressed="false">$100</button>
      <button class="chip" type="button" aria-pressed="false">$250</button>
      <button class="chip" type="button" aria-pressed="false">Other</button>
    </div>
  </div>
  <p class="mn-impact" aria-live="polite"><svg …aria-hidden="true">…</svg><span><b>$50 places 10 Bibles</b> with new readers every month.</span></p>
  <a class="btn btn-primary btn-lg" href="/give" style="width:100%">Give $50 monthly</a>
  <p class="mn-secure"><svg …aria-hidden="true">…</svg>Secure, encrypted payment · cancel monthly gifts anytime</p>
</div>
```

Other amount: `<div class="mn-other"><span aria-hidden="true">$</span><input class="input" type="text" inputmode="decimal" aria-label="Other amount"></div>`.

Goal progress:

```html
<div class="mn-goal-row"><p class="mn-goal-title">Year-end Bible drive</p><p class="mn-goal-meta">18 days left</p></div>
<div class="mn-bar" role="progressbar" aria-valuemin="0" aria-valuemax="25000" aria-valuenow="18400" aria-label="Raised toward goal"><span style="width:74%"></span></div>
<p class="mn-goal-sum"><b>$18,400</b> of $25,000 raised · 74%</p>
```

## Variants & states
| Variant | Classes |
|---|---|
| Full | `.card card-lg card-flat mn-give` |
| Compact | `.mn-compact mn-amts-sm` (three chips + Give button) + `.mn-impact-text` |
| Goal, light | `.mn-goal-row` + `.mn-bar` + `.mn-goal-sum` on white |
| Goal, dark | same inside `.mn-panel-dark`; track turns white 14%, `.btn-light` Give now |

Amount chip states: default, hover (black border), focus (Horizon Blue ring), selected (`aria-pressed="true"`: black fill, white text), disabled (45% opacity).
Frequency switch: selected segment is white with a light shadow.
Other: chip opens `.mn-other` input with a `$` prefix; focus is a Horizon Blue border + `--shadow-focus`.
Submitting: Give button shows `.spin` + "Processing…" and is disabled.

## Rules
- One Horizon Blue button per widget: Give. The selected chip is black, not blue.
- The Give label always repeats amount and frequency ("Give $50 monthly"); update it and the impact line on every change.
- Default to Monthly and the second chip ($50).
- Chips and segments are at least 44px tall; chips at least 76px wide (64px compact).
- Progress fill uses `--gradient-line`, never Horizon Blue; track `--gray-100`, 10px, pill.
- Impact line on `--blue-tint` with `--horizon-blue-dim` text; one sentence, bold the number.
- Always show the secure-payment note under the button.
- Impact rates and goal figures are samples until finance confirms them; say so on the page.

## Accessibility
- Frequency and amounts are `role="group"` with names; each option is a toggle with `aria-pressed`.
- The impact line is `aria-live="polite"` so changes are announced.
- The Other input has `aria-label="Other amount"` and `inputmode="decimal"`; the `$` prefix is `aria-hidden`.
- The goal bar is `role="progressbar"` with min, max, now and a label; the text sum repeats the numbers.
- Keep the loading button's width and set `aria-busy="true"`.

## Content
- Heading: "Give to the mission". Lead: "Your gift puts Scripture in the hands of people still waiting for it."
- Impact: "**$50 places 10 Bibles** with new readers every month." For Other: "**Every $5 places a Bible** with a new reader."
- Goal: "**$18,400** of $25,000 raised · 74%", "18 days left".
- No guilt, no urgency tricks, no exclamation marks.
