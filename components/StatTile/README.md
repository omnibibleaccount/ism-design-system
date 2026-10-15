# StatTile
A metric tile with one big number, a short label, an optional up or down change and an optional sparkline, on light or dark.

## When to use
- Use for ministry reach on landing pages (languages, stations, partners) and for KPI rows in staff dashboards.
- Use four tiles in a row on desktop, two on tablet, one or two on mobile.
- Do not use for a single sentence-sized fact inside body copy; write it in the sentence.
- Do not use when the number cannot be sourced; say "sample" until it is.

## Anatomy & markup
```html
<div class="dp-stat">
  <span class="dp-stat-n">38</span>
  <span class="dp-stat-l">HD Radio stations</span>
  <div class="dp-stat-row">
    <span class="dp-delta dp-delta-up"><svg aria-hidden="true">…up arrow…</svg>+3 <span class="dp-delta-vs">this quarter</span></span>
    <svg class="dp-spark" width="88" height="32" viewBox="0 0 120 36" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <polyline points="2,26 34,22 66,20 98,16 116,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="116" cy="10" r="3" fill="currentColor"/>
    </svg>
  </div>
</div>
<!-- dark: wrap the row in .dp-dk, or place tiles inside .sec-ink -->
<div class="dp-dk"> …tiles… </div>
```

## Variants & states
- Light: white tile, `--gray-200` border, `--radius-lg`, 24px padding.
- Dark: inside `.dp-dk` (black panel with the blue/gold glow) or `.sec-ink`; tile goes to 4% white with a 14% white border.
- Delta up: `.dp-delta-up` (`--success`, on dark `--success-on-dark`). Down: `.dp-delta-down` (`--error`, on dark `--error-on-dark`).
- Sparkline: `.dp-spark` in `--horizon-blue` (on dark `--blue-on-dark`); `.dp-spark-flat` grey for flat or falling series.
- Without delta or sparkline: number and label only.

## Rules
- Number: 44px, weight 600, tracking -0.03em, tabular figures. Label: 15px `--gray-700`.
- Use vertical arrows only (↑ ↓). The ↗ arrow is reserved for links to another page.
- Always give the period after the delta ("this quarter", "vs last year").
- Sparkline is 88×32, 2px stroke, last point marked with a 3px dot. No axes, no labels.
- Keep tiles in a row the same height; do not mix light and dark tiles in one row.
- Mark invented figures as samples with `.dp-sample` or in the label.

## Accessibility
- The sparkline is decorative (`aria-hidden="true"`); the delta text carries the meaning.
- Do not rely on green or red alone: the arrow and the sign (+ / −) state direction.
- Write the delta so it reads well aloud: "up 3 this quarter". Add a `.dp-vh` phrase if the visual is terse.
- Text contrast meets AA on both themes with the token colours above.

## Content
- Lead with what matters to people: "500+ Bible languages", "38 HD Radio stations".
- Keep labels to three or four words. Abbreviate large numbers (1.2M), not small ones.
- Only "500+ languages" is an ISM public figure; the rest in the preview are samples.
