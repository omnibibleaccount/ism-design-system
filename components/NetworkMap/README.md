# NetworkMap
An abstract dot map of the Global Bible Network with a legend, gold partner-hub pins and a tooltip, beside a selectable list of regions with partner counts.

## When to use
- Use on the Global Bible Network and About pages to show where ISM works with partners and stations.
- Use the region list as the main control; the map illustrates it.
- Do not use for directions or exact locations; it is abstract on purpose.
- Do not use for a single station; use StationCard.

## Anatomy & markup
Two cards in `.mn-netmap`: the map card (spans 2 of 3 columns) and the regions card.

```html
<div class="mn-netmap">
  <div class="card card-flat mn-netmap-map">
    <div class="mn-map-head">
      <p class="mn-map-title">Global Bible Network</p>
      <div class="mn-legend">
        <span><i class="mn-c-sel"></i>Selected</span>
        <span><i class="mn-c-on"></i>Network region</span>
        <span><i class="mn-c-off"></i>Not yet active</span>
        <span><i class="mn-c-pin"></i>Partner hub</span>
      </div>
    </div>
    <div class="mn-map">
      <svg viewBox="0 12 720 292" role="img" aria-label="Abstract world map with Africa selected and partner hubs in Africa, Asia, Latin America and the Middle East">
        <g fill="none" stroke-linecap="round" stroke-width="5.2">
          <path class="mn-map-off" d="…"/><path class="mn-map-on" d="…"/><path class="mn-map-sel" d="…"/>
        </g>
        <circle class="mn-map-halo" cx="434" cy="182" r="14"/>
        <g class="mn-map-pins" stroke-width="2.4"><circle cx="434" cy="182" r="7"/>…</g>
        <g class="mn-map-tip"><rect x="448" y="170" width="138" height="26" rx="8"/><text x="458" y="187">Nairobi · 14 partners</text></g>
      </svg>
    </div>
    <p class="mn-map-note">Choose a region or a pin to see its stations, partners and languages.</p>
  </div>
  <div class="card card-flat mn-regions">
    <div class="mn-regions-head"><span class="mn-st">Regions</span><span>Partners</span></div>
    <button class="mn-rrow" type="button" aria-pressed="true"><span class="mn-rrow-dot mn-c-sel"></span><span class="mn-rrow-nm">Africa</span><span class="mn-rrow-ct">142</span></button>
    <button class="mn-rrow" type="button" aria-pressed="false"><span class="mn-rrow-dot mn-c-on"></span><span class="mn-rrow-nm">Asia</span><span class="mn-rrow-ct">118</span></button>
    <button class="mn-rrow mn-rrow-soon" type="button" aria-pressed="false" aria-disabled="true"><span class="mn-rrow-dot mn-c-off"></span><span class="mn-rrow-nm">Oceania <span class="mn-rrow-u">· coming soon</span></span><span class="mn-rrow-ct">0</span></button>
    <div class="mn-regions-foot"><p><b>383</b> partners in 61 countries</p><a class="btn btn-ghost btn-sm" href="/partners">Join <span class="arrow" aria-hidden="true">↗</span></a></div>
  </div>
</div>
```

## Variants & states
- Map dots: not active `.mn-map-off` (`--gray-200`), network region `.mn-map-on` (`--blue-on-dark`), selected region `.mn-map-sel` (`--horizon-blue`).
- Pins `.mn-map-pins`: `--gradient-gold` with a white ring; the active pin is larger with a `.mn-map-halo`; its tooltip `.mn-map-tip` is `--charcoal-900` with white 12px text.
- Region row `.mn-rrow` (52px): default, hover (`--off-white`), selected (`aria-pressed="true"`, `--blue-tint`, dot `.mn-c-sel`), focus ring, coming soon (`.mn-rrow-soon`, `aria-disabled="true"`, grey).
- Under 768px the two cards stack, map first.

## Rules
- Selecting a row recolours its dot and the map region; only one region is selected at a time.
- Horizon Blue marks only the selected region. Partner hubs are gold, never blue or red.
- Keep the legend visible above the map; it explains every colour used.
- Counts are tabular numbers, right-aligned. Mark the map as abstract and counts as samples until confirmed.
- The footer link goes to the partner page, so it uses ↗.
- Rows are at least 44px (52px here).

## Accessibility
- The SVG is one `role="img"` with an `aria-label` that states the selection and where hubs are.
- The region list is the keyboard path: real `<button>`s with `aria-pressed`. Do not make map dots the only control.
- Coming-soon rows use `aria-disabled="true"` and ignore clicks.
- Colour dots are paired with names and the legend; never rely on colour alone.

## Content
- Title: "Global Bible Network".
- Note: "Choose a region or a pin to see its stations, partners and languages."
- Tooltip: "City · N partners" ("Nairobi · 14 partners").
- Footer: "**383** partners in 61 countries" (sample) + "Join ↗".
