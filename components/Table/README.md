# Table
A data table for admin and report screens, with sortable headers, row selection, status badges, a row menu, zebra and dense variants, and a stacked-card layout on mobile.

## When to use
- Use for records people compare across columns: HD Radio stations, partner reports, NFC card orders, giving history.
- Use the dense variant only in staff tools where many rows matter more than comfort.
- Do not use for marketing content, single records (use DescriptionList) or fewer than about four rows (use a list).
- Do not use a table for layout.

## Anatomy & markup
```html
<div class="dp-tbl-wrap">
  <table class="dp-tbl">
    <thead><tr>
      <th class="dp-w-chk"><input class="dp-cbx" type="checkbox" aria-label="Select all stations"></th>
      <th aria-sort="ascending"><button class="dp-sort" type="button">Station <svg aria-hidden="true">…up arrow…</svg></button></th>
      <th>Status</th>
      <th class="dp-w-act"><span class="dp-vh">Actions</span></th>
    </tr></thead>
    <tbody>
      <tr aria-selected="true">
        <td class="dp-w-chk"><input class="dp-cbx" type="checkbox" checked aria-label="Select Radio Hope"></td>
        <td><span class="dp-strong">Radio Hope</span><span class="dp-sub">ISM-ET-01</span></td>
        <td><span class="badge badge-success"><span class="dp-dot"></span>On air</span></td>
        <td class="dp-w-act">
          <button class="dp-dots" type="button" aria-haspopup="menu" aria-expanded="true" aria-label="Actions for Radio Hope">…</button>
          <div class="dp-rmenu" role="menu">
            <button class="dp-rmenu-item" role="menuitem">Edit details</button>
            <button class="dp-rmenu-item" role="menuitem">Listen live <span class="dp-rmenu-ic">↗</span></button>
            <hr class="dp-rmenu-sep">
            <button class="dp-rmenu-item dp-rmenu-danger" role="menuitem">Remove station</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="dp-tbl-foot"><span>1 of 38 stations selected</span><span class="dp-tbl-foot-nav">…Previous / Next…</span></div>
</div>
```
Mobile cards (show under 768px, hide the table with `.dp-hide-mobile`, show cards with `.dp-show-mobile`):
```html
<div class="dp-tcards dp-show-mobile">
  <div class="dp-tcard" aria-selected="true">
    <div class="dp-tcard-top"><div><div class="dp-tcard-t">Radio Hope</div><div class="dp-tcard-m">Addis Ababa · Amharic</div></div><span class="badge badge-success">On air</span></div>
    <div class="dp-tcard-bot"><span class="dp-num">98.7 FM · HD2</span><button class="dp-dots" aria-label="Actions for Radio Hope">…</button></div>
  </div>
</div>
```

## Variants & states
- Default: 48px header on `--off-white`, 60px rows with `--gray-100` hairlines, panel radius `--radius-lg`.
- `.dp-tbl-zebra`: even rows on `--off-white`. `.dp-tbl-sm`: 40px header, 44px rows, 14px text.
- Add `.dp-tbl-clip` to the wrap when no row menu can overflow it.
- Sorted column: `aria-sort` on the `th`; label turns black, arrow turns `--horizon-blue`. Unsorted columns show a grey up/down arrow.
- Hover: row on `--off-white`. Selected: `aria-selected="true"`, row on `--blue-tint` with a 3px `--horizon-blue` left edge.
- Row menu: ⋯ button `.dp-dots`; open state `aria-expanded="true"` with a `--gray-200` circle; menu `.dp-rmenu` uses `--shadow-overlay`, items 44px.
- Mobile: `.dp-tcard` stacks name, meta, badge and the key figure; selected card gets a `--horizon-blue` border.

## Rules
- Use base `.badge` + `.badge-success/-info/-warning/-error` for status, always with a word. Add `.dp-dot` for a leading dot.
- Right-align nothing except the action column; set numbers in `.dp-num` (tabular figures).
- Put the row's main name in `.dp-strong` with the ID in `.dp-sub` beneath.
- Menu items that leave the page end in ↗; destructive items use `.dp-rmenu-danger` and sit last, after `.dp-rmenu-sep`.
- Keep one Horizon Blue primary per group; pagination uses `.btn-secondary .btn-sm`.
- Every interactive control is at least 44px tall (`.dp-sort` and the mobile `.dp-dots` hit 44px; the table ⋯ is 40px plus a hit-area pad).
- Do not colour whole rows by status.

## Accessibility
- Use a real `<table>` with `<thead>`/`<th>`. Give the table a caption or an `aria-label` naming its contents.
- Put the sort control in a `<button>` inside the `th`; set `aria-sort` on the `th` only for the sorted column.
- Every checkbox and ⋯ button needs an `aria-label` naming the row ("Actions for Radio Hope").
- The row menu uses `role="menu"` / `role="menuitem"`, opens on Enter/Space, closes on Escape and returns focus to ⋯.
- Focus ring: `outline: 2px solid var(--horizon-blue)` with `--shadow-focus`.
- Announce selection count in the footer ("1 of 38 stations selected").

## Content
- Column labels are one or two words in sentence case: Station, City, Language, Frequency, Status.
- Status words: On air, Scheduled, Maintenance, Offline. No codes on their own.
- Mark invented figures as samples in mock-ups.
