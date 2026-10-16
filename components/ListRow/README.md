# ListRow
A 56px row of icon or avatar, title, meta and an end slot, grouped as a divided list or inset card, plus the React `ListRow` audio row with progress and play.

## When to use
- Use for settings, menus, people, languages, downloads and links in app screens and account pages.
- Use the React `ListRow` for audio Bible chapters and teachings: title, progress, duration and play.
- Use `.cr-list.cr-list-div` (hairline between rows) on web pages; use `.cr-list-inset` (grouped cards with a group heading) in app screens and settings.
- Do not use for data with several comparable columns; use Table. Do not use for marketing content with images; use Card.

## Anatomy & markup
Leading slot (`.cr-lr-ic` icon tile or `.cr-av` avatar, optional) › text (`.cr-lr-t` title, `.cr-lr-m` meta) › end slot (`.cr-lr-end`: value, ›, ↗ or switch).

### React
`import { ListRow, List, ListGroup, ListItem } from '@ism/ui'`.

`ListRow` is the audio row: icon, title, progress line, duration and play button.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `ReactNode` | — | Shown in a 40px round tile; decorative. |
| `title` | `string` | — | Chapter or teaching name; also names the progress line. |
| `meta` | `string` | — | Duration, e.g. "9:12". |
| `progress` | `number` | `0.15` | 0–1 listened fraction. |
| `dark` | `boolean` | `true` | Set `false` on light surfaces. |
| `onPlay` | `() => void` | — | Called when the play button is pressed. |
| `playLabel` | `string` | `"Play"` | Accessible name of the play button; override to translate. |
| `playIcon` | `ReactNode` | `"▶"` | Glyph inside the 44px play button. |

```jsx
<ListRow icon={<UiIcon name="headphones" />} title="John 3:17–4:54" meta="9:12" progress={0.3} onPlay={play} />
```

The `.cr-lr` rows:
- `List` renders `.cr-list.cr-list-div`. `ListGroup` renders `.cr-list-inset` with `title` as the `.overline`, tied to the group with `aria-labelledby`.
- `ListItem` renders one `.cr-lr`: `title` (required), `meta`, `icon` (`iconGold` for the gold tile), `avatar`, `value`, `end` `"drill" | "out"` (› or ↗), `twoLine`, `noIcon`, `disabled`.
- With `href` the row is one `<a>`; add `external` to open a new tab with hidden "(opens in a new tab)" text (`newTabLabel`). With `onCheckedChange` (and `checked`) it is a switch row and the whole row toggles.

```jsx
<ListGroup title="Reading">
  <ListItem icon={<UiIcon name="globe" />} title="Language" value="Amharic" end="drill" href="/app/language" />
  <ListItem icon={<UiIcon name="sun" />} title="Daily verse" checked={daily} onCheckedChange={setDaily} />
</ListGroup>
```

### HTML / CSS
```html
<div class="cr-list cr-list-div">
  <a class="cr-lr" href="/app/language">
    <span class="cr-lr-ic" aria-hidden="true"><svg>…</svg></span>
    <span class="cr-lr-tx"><span class="cr-lr-t">Language</span></span>
    <span class="cr-lr-end">Amharic <svg>›</svg></span>
  </a>
  <div class="cr-lr">
    <span class="cr-av" aria-hidden="true">MS</span>
    <span class="cr-lr-tx"><span class="cr-lr-t">Maria Santos</span><span class="cr-lr-m">Partner · Lima, Peru</span></span>
    <span class="cr-lr-end">2d ago</span>
  </div>
</div>

<div class="cr-list-inset">
  <span class="overline" id="grp-reading">Reading</span>
  <div class="cr-inset-grp" role="group" aria-labelledby="grp-reading">
    <div class="cr-lr">…
      <button class="cr-sw" type="button" role="switch" aria-checked="true" aria-labelledby="dv"></button>
    </div>
  </div>
</div>
```

## Variants & states
| Variant | Class |
|---|---|
| Simple | `.cr-lr` with text only |
| Leading icon | `.cr-lr-ic` (blue tint), `.cr-lr-ic-gold` |
| Avatar + meta | `.cr-av` + `.cr-lr-m` |
| Drill in › | `.cr-lr-end` with a chevron; the row is an `<a>` |
| Leaves ↗ | `.cr-lr-end.cr-lr-out` with ↗; the row is an `<a>` |
| Toggle | `.cr-sw` switch in the end slot; the whole row toggles |
| Two-line | `.cr-lr-two`: meta wraps to two lines, then ellipsis |
| Divided list | `.cr-list.cr-list-div` |
| Inset group | `.cr-list-inset` › `.overline` + `.cr-inset-grp` (divider inset past the icon; add `.cr-lr-noic` to rows with no icon) |
| Audio row | React `ListRow`, dark or light |

States: default, hover (`--off-white`; `.cr-is-hover` for docs), focus (inset 2px Horizon Blue ring), disabled (`.cr-lr-off`, 45%).

## Rules
- Rows are at least 56px tall with 20px side padding; the whole row is the tap target (well over 44px).
- Icons in the end slot: › = drills into an app screen, ↗ = goes to another page, ⌄ = opens here. Never mix › and ↗ in one group without reason.
- A row with › or ↗ is one `<a>`; never nest another link or button inside it.
- A row with a switch toggles from anywhere on the row; the switch is the only control.
- The switch uses Horizon Blue (`--horizon-blue`) when on; keep primary buttons out of list groups.
- Use `--gradient-violet` avatars and `--blue-tint` icon tiles; keep one leading style per group.
- Keep titles to one line. Only `.cr-lr-two` rows may wrap their meta.
- Fill an audio row's progress line with the signature gradient: in HTML use AccentBar (`.cr-accentbar`); the React `ListRow` draws it with `--gradient-line`.

## Accessibility
- Leading icons and avatars are decorative (`aria-hidden="true"`); the title names the row.
- Switches use `role="switch"` + `aria-checked` and are labelled by the row title.
- Label inset groups with their `.overline` heading through `aria-labelledby`.
- For ↗ rows that open a new tab, add visually hidden "(opens in a new tab)".
- The React audio row names its play button with `playLabel` (default "Play"); translate it with the page. Its progress line has `role="progressbar"` named by the title.

## Content
- Titles are short nouns: "Language", "Downloaded Bibles", "Daily verse", "dot.Bible directory".
- Meta adds one fact: "7:00 each morning", "500+ languages", "Partner · Lima, Peru".
- End values show the current setting ("Amharic", "3"), not instructions.
