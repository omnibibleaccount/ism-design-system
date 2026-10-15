# Layout, elevation and motion

All values are tokens. Do not use raw numbers.

## Breakpoints

| Name | Width | Notes |
|---|---|---|
| compact | ≤480px | Tighter padding, stacked button groups |
| mobile | ≤767px | Single column, mobile navigation, section padding 72/56 |
| tablet | 768–1023px | Two columns where useful |
| desktop | ≥1024px | Full layout, section padding 112/80 |

Mobile-first: base styles are mobile; widen with `min-width`. The shipped CSS uses `max-width: 767px` blocks for mobile overrides; keep to the two breakpoint tokens (`--breakpoint-mobile`, `--breakpoint-desktop`) plus `--breakpoint-compact`.

## Containers and grid

| Token | Value | Use |
|---|---|---|
| `--frame-max` | 1280px | Full-bleed frame cap (heroes, bands) |
| `--container-max` | 1200px | `.wrap` content width |
| `--gutter` | 24px | `.wrap` side padding and grid gap |
| `--measure-reading` | 760px | Long-form text (`.narrow`) |
| `--measure-scripture` | 680px | Scripture reading view |

Grid (recommended, not enforced by CSS): 4 columns mobile, 8 tablet, 12 desktop, gap `--gutter`. Use flex or CSS grid inside `.wrap`. Vertical rhythm between page sections uses `.sec` (112 desktop, 72 mobile) and `.sec-sm` (80, 56).

Spacing scale: `--space-1` … `--space-10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. No other spacing values.

## Z-index scale

| Token | Value | Layer |
|---|---|---|
| `--z-behind` | -1 | Decorative backgrounds |
| `--z-raised` | 2 | Slightly lifted items |
| `--z-dropdown` | 20 | Menus, popovers, comboboxes |
| `--z-sticky` | 40 | Sticky sub-navigation, anchor nav |
| `--z-header` | 50 | Site header |
| `--z-scrim` | 60 | Scrim behind drawers and sheets |
| `--z-drawer` | 61 | Drawers and bottom sheets |
| `--z-cookie` | 70 | Cookie banner |
| `--z-float` | 72 | Back-to-top, floating action |
| `--z-modal` | 90 | Modal dialogs |
| `--z-toast` | 95 | Toasts (above modals so a failure inside a modal is seen) |
| `--z-tooltip` | 96 | Tooltips |
| `--z-skip` | 100 | Skip link, always on top |

Values 3 to 9 may be used for local stacking inside one component. Never go above `--z-skip`.

## Elevation

| Level | Token | Use |
|---|---|---|
| 0 flat | none | Page surfaces |
| 1 card | `--shadow-card-light`, `--shadow-card-dark` | Cards at rest |
| 2 lift | `--shadow-lift` | Hovered interactive card |
| 3 overlay | `--shadow-overlay` | Menus, sheets, modals, toasts, floating buttons |
| focus | `--shadow-focus` | A ring around focused controls (not elevation) |

On dark surfaces use `--border-hairline-dark` instead of a shadow.

## Motion

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 150ms | Colour, border, opacity on hover and press |
| `--duration-base` | 200ms | Shadows, small reveals |
| `--duration-drawer` | 260ms | Drawers, sheets, menus |
| `--duration-slow` | 300ms | Accordions, larger reveals |
| `--duration-enter` | 400ms | Page content entrance |
| `--duration-media` | 500ms | Image and media transitions |
| `--duration-spin` | 800ms | Spinners |
| `--duration-pulse` | 1600ms | The live indicator only |

| Easing | Value | Use |
|---|---|---|
| `--ease-standard` | ease | Default |
| `--ease-drawer` | cubic-bezier(.2,.8,.2,1) | Drawers, sheets, menus |
| `--ease-rise` | cubic-bezier(.2,.7,.2,1) | Entrance (rise 20px at most) |
| `--ease-linear` | linear | Spinners, progress |

Rules:

1. Animate `transform` and `opacity`, not layout properties on large areas.
2. Respect `prefers-reduced-motion: reduce`: remove translate and scale, keep opacity fades under 150ms, slow spinners down.
3. Motion explains change (something appeared, moved, finished). It is never decoration. No looping animation except spinners, skeleton shimmer and the live pulse.
4. Do not animate scripture text.

## Scrims and overlays

| Token | Value | Use |
|---|---|---|
| `--scrim-peek` | .28 | Light dim behind peeking elements |
| `--scrim-sheet` | .42 | Behind bottom sheets |
| `--scrim-drawer` | .55 | Behind drawers |
| `--scrim-modal` | rgba(22,24,25,.6) | Behind modals |
| `--overlay-photo` | .4 | Darkening photos under text |
