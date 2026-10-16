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
`import { ListRow, List, ListGroup, ListItem } from '@ism/ui'` (source: `packages/react/src/components/ListRow.tsx`).

`ListRow` is the audio row, styled inline: icon tile, title, a 3px progress line (`role="progressbar"`, named by the title), duration and a 44px play button.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `icon` | `ReactNode` | — | Shown in a 40px round tile; decorative. |
| `title` | `string` | — | Chapter or teaching name; also names the progress bar. |
| `meta` | `string` | — | Duration, e.g. "9:12". |
| `progress` | `number` | `0.15` | 0–1 listened fraction. |
| `dark` | `boolean` | `true` | Set `false` on light surfaces. |
| `onPlay` | `() => void` | — | Called when the play button is pressed. |
| `playLabel` | `string` | `"Play"` | Accessible name of the play button; override to translate. |
| `playIcon` | `ReactNode` | `"▶"` | Glyph inside the play button. |

```jsx
<ListRow icon={<UiIcon name="headphones" />} title="John 3:17-4:54" meta="9:12" progress={0.3} onPlay={() => play('jhn-3')} />
```

The `.cr-lr` rows:

| Component | Props | Renders |
|---|---|---|
| `List` | `div` attributes | `.cr-list.cr-list-div` |
| `ListGroup` | `title` (required) | `.cr-list-inset` with an `.overline` heading and a `.cr-inset-grp` `role="group"` labelled by it |
| `ListItem` | `title` (required), `meta`, `twoLine`, `icon`, `iconGold`, `avatar`, `noIcon`, `value`, `end` (`"drill"` › or `"out"` ↗), `href`, `external`, `newTabLabel` (default `"(opens in a new tab)"`), `disabled`, `checked`, `onCheckedChange` | `.cr-lr`. With `href` it is one `<a>`; `external` adds `target="_blank"`, `rel="noopener"` and the hidden new-tab text. With `onCheckedChange` it is a `<label>` with a `.cr-sw` switch (`role="switch"`, labelled by the title) and the whole row toggles. Otherwise a `div`. `disabled` adds `.cr-lr-off`. |

```jsx
<List>
  <ListItem icon={<UiIcon name="globe" />} title="Language" value="Amharic" end="drill" href="/app/language" />
  <ListItem avatar={<span className="cr-av">MS</span>} title="Maria Santos" meta="Partner · Lima, Peru" value="2d ago" />
</List>
<ListGroup title="Reading">
  <ListItem icon={<UiIcon name="sun" />} title="Daily verse" meta="7:00 each morning" checked={daily} onCheckedChange={setDaily} />
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
| Audio row | React `ListRow`, dark or light (`dark={false}`) |

States: default, hover (`--off-white`; `.cr-is-hover` for docs), focus (inset 2px Horizon Blue ring), disabled (`.cr-lr-off`, 45%).

## Rules
- Rows are at least 56px tall with 20px side padding; the whole row is the tap target (well over 44px).
- Icons in the end slot: › = drills into an app screen, ↗ = goes to another page, ⌄ = opens here. Never mix › and ↗ in one group without reason.
- A row with › or ↗ is one `<a>`; never nest another link or button inside it.
- A row with a switch toggles from anywhere on the row; the switch is the only control.
- The switch uses Horizon Blue (`--horizon-blue`) when on; keep primary buttons out of list groups.
- Use `--gradient-violet` avatars and `--blue-tint` icon tiles; keep one leading style per group.
- Keep titles to one line. Only `.cr-lr-two` rows may wrap their meta.
- The React audio row draws its progress in solid Horizon Blue as built. When you build an audio row in HTML, use AccentBar (`.cr-accentbar`, gradient) for the progress line instead.

## Accessibility
- Leading icons and avatars are decorative (`aria-hidden="true"`); the title names the row.
- Switches use `role="switch"` + `aria-checked` and are labelled by the row title.
- Label inset groups with their `.overline` heading through `aria-labelledby`.
- For ↗ rows that open a new tab, add visually hidden "(opens in a new tab)". React `ListItem` with `external` adds it (`newTabLabel` to translate).
- The React audio row's play button is named by `playLabel` (default "Play"); translate it, and keep it when you replace the ▶ with `playIcon`.

## Content
- Titles are short nouns: "Language", "Downloaded Bibles", "Daily verse", "dot.Bible directory".
- Meta adds one fact: "7:00 each morning", "500+ languages", "Partner · Lima, Peru".
- End values show the current setting ("Amharic", "3"), not instructions.
