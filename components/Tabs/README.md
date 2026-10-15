# Tabs
Switches between panels of related content on the same page without a page load: underline tabs with counts, pill segmented tabs, vertical tabs and a scrollable mobile row.

## When to use
- Use underline tabs to filter one collection into kinds: Resources page "All / Apps / Radio / Publishing / NFC Cards".
- Use segmented (`.nv-seg`) for 2–4 short, equal options: gift frequency, Listen / Read.
- Use vertical tabs (`.nv-vtabs`) for a settings-style page with a side list: "Ways to partner".
- Do not use tabs to go to another page. Use links, Breadcrumbs or AnchorNav for that.
- Do not use tabs for more than about 6 options on desktop; use a select or filter chips (`.chip[aria-pressed]`).

## Anatomy & markup
```html
<div class="nv-tabs" role="tablist" aria-label="Resource types">
  <button class="nv-tab" role="tab" id="t-all" aria-selected="true" aria-controls="p-all">All resources <span class="nv-cnt">24</span></button>
  <button class="nv-tab" role="tab" id="t-apps" aria-selected="false" aria-controls="p-apps" tabindex="-1">Apps <span class="nv-cnt">6</span></button>
</div>
<div role="tabpanel" id="p-all" aria-labelledby="t-all">…</div>

<!-- segmented -->
<div class="nv-seg" role="tablist" aria-label="Gift frequency">
  <button role="tab" aria-selected="false">One-time</button>
  <button role="tab" aria-selected="true">Monthly</button>
</div>

<!-- vertical -->
<div class="nv-vtabs" role="tablist" aria-orientation="vertical" aria-label="Ways to partner">
  <button class="nv-vtab" role="tab" aria-selected="true">Pray</button>
</div>

<!-- mobile scroll row -->
<div class="nv-tabs-scroll"><div class="nv-tabs" role="tablist">…</div></div>
```

## Variants & states
- **Underline tab (`.nv-tab`):** 48px tall, 15px/500 `var(--gray-700)`, 28px apart on a `var(--gray-200)` hairline.
  - Hover: text `var(--black)`, grey `var(--gray-300)` underline.
  - Focus: 2px `var(--horizon-blue)` outline + `var(--shadow-focus)`, 6px radius.
  - Selected: `aria-selected="true"`, 600 weight, 2px `var(--horizon-blue)` underline; count turns `var(--blue-tint)` / `var(--horizon-blue-dim)`.
  - Disabled: `aria-disabled="true"`, `var(--gray-300)`, no underline.
- **Count (`.nv-cnt`):** 22px pill, 12px/600, `var(--gray-100)`.
- **Segmented (`.nv-seg`):** `var(--gray-100)` pill track with 4px padding; 44px buttons; selected is a white pill with a soft shadow. On dark add `.nv-seg-dark` (track `rgba(255,255,255,.08)`).
- **Vertical (`.nv-vtab`):** 48px rows, `var(--radius-md)`; hover `var(--off-white)`; selected `var(--blue-tint)` with a 3px inset `var(--horizon-blue)` edge.
- **Mobile scroll row (`.nv-tabs-scroll`):** no wrap, `overflow-x:auto`, 16px gutter, 22px gaps, white fade on the right hints more.

## Rules
- Tabs swap panels in place. Never make a tab navigate to a new URL.
- Only the selected underline is Horizon Blue. Never colour unselected tabs blue.
- Counts are neutral grey, or blue-tint when selected. Never red.
- Keep all tabs at least 44px tall (48px for underline and vertical tabs).
- Keep labels on one line (`white-space:nowrap`); on phones scroll the row, never wrap it.
- Segmented tabs: 2–4 options of similar length. Vertical tabs: max 7.
- Show a disabled tab only when its absence would confuse ("Archive 0"); otherwise hide it.

## Accessibility
- Use `role="tablist"`, `role="tab"` and `role="tabpanel"`, linked by `aria-controls` / `aria-labelledby`.
- Roving tabindex: only the selected tab has `tabindex="0"`. ← → move between tabs (↑ ↓ for vertical), Home/End jump to the ends.
- Mark selection with `aria-selected`, never with colour alone (weight and underline also change).
- Give the tablist an `aria-label` that names the set: "Resource types", "Gift frequency".

## Content
- Short nouns in sentence case: "All resources", "Apps", "Radio", "Publishing", "NFC Cards".
- Counts are real totals of the items in each panel (preview numbers are samples).
- Segmented: "One-time / Monthly / Yearly", "Listen / Read".
- Vertical: "Pray / Give / Volunteer / Churches / Events".
