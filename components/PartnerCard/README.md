# PartnerCard
A linked card for one ISM partner: an initials tile, name, location, partner-type badges and a ↗ that fills black on hover.

## When to use
- Use in partner directories and on Global Bible Network region pages.
- Use in grids of three or four, all with the same parts.
- Do not use for radio stations with live status; use StationCard.
- Do not use for people or staff profiles.

## Anatomy & markup
The whole card is one link: head (initials + ↗), name and location, badges.

```html
<a class="card card-flat mn-partner" href="/partners/grace-community-church">
  <div class="mn-partner-head"><span class="mn-initials" aria-hidden="true">GC</span><span class="mn-go" aria-hidden="true">↗</span></div>
  <div>
    <p class="mn-partner-name">Grace Community Church</p>
    <p class="mn-meta mn-meta-sm"><span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>Lagos, Nigeria</span></p>
  </div>
  <div class="mn-partner-badges"><span class="badge badge-partner">Church partner</span></div>
</a>
```

## Variants & states
Initials tile (56px, `--radius-md`), rotate colours so neighbours differ:

| Class | Colours |
|---|---|
| `.mn-initials` | `--charcoal-900` / white |
| `.mn-initials mn-initials-blue` | `--blue-tint` / `--horizon-blue-dim` |
| `.mn-initials mn-initials-violet` | `--violet-tint` / `--violet-ink` |

States: default; hover (`--shadow-lift`, darker border, `.mn-go` fills black with a white ↗); focus (2px Horizon Blue outline + `--shadow-focus`).
Badges: one or two `.badge badge-partner` (Church partner, Translation partner, Radio partner).

## Rules
- The card opens the partner's page, so it always shows ↗ in the 36px `.mn-go` circle. The whole card is the tap target.
- Use initials (two letters) unless the partner supplied a logo cleared for use.
- Name 18px 600; location 14px with a pin icon. One location line only.
- Two badges at most; use `.badge-partner`, never status colours.
- No buttons or extra links inside the card.
- No Horizon Blue fill on the card; blue is used only for the focus ring and the blue initials variant.

## Accessibility
- The link's accessible name is the card text (name, location, badges); the initials and ↗ are `aria-hidden="true"`.
- If the link opens an external partner site, add "(opens partner site)" as visually hidden text.
- Pin icons are `aria-hidden="true"`.
- Keep focus visible on the whole card.

## Content
- Partner's official name, no abbreviations ("Hope Translation Society").
- Location: "City, Country".
- Partner names in the preview are samples.
