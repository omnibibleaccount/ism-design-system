# Accessibility

Standard: WCAG 2.2 AA. These are the minimums; exceed them where easy.

## Contrast

| Content | Minimum |
|---|---|
| Body and UI text | 4.5:1 |
| Large text (≥24px, or ≥18.66px bold) | 3:1 |
| Icons, borders of controls, focus ring, graphics that carry meaning | 3:1 |

`rules.json` lists 31 foreground and background pairs that are approved and tests them on every CI run. The important ones:

| Pair | Ratio | Use |
|---|---|---|
| black on off-white | 19.6 | Body |
| gray-700 on off-white | 7.6 | Secondary body |
| gray-600 on white | 6.1 | Captions, disabled text |
| gray-placeholder on white | 5.1 | Placeholder |
| white on horizon-blue | 4.9 | Primary button |
| horizon-blue on white | 4.9 | Links on cards |
| horizon-blue on off-white | 4.6 | Links on page |
| blue-on-dark on black | 8.7 | Links on dark |
| text-tertiary-dark on black | 5.3 | Tertiary on dark |

Forbidden:

- `--gray-500` and lighter for text (4.0 on white, 3.75 on off-white). Non-text only.
- `--horizon-blue` as text on black or charcoal (4.30). Use `--blue-on-dark`.
- `--horizon-blue` small text on `--blue-tint` (4.43). Large text or UI only.
- Colour as the only signal of state, error or meaning.

## Focus

- Every interactive element shows a visible focus ring: 2px `--horizon-blue` outline, 2px offset, plus `--shadow-focus`. On blue backgrounds use white; on dark backgrounds use `--blue-on-dark`.
- Use `:focus-visible`, so mouse clicks do not show the ring.
- Focus order follows visual order. Never use positive `tabindex`.
- Modals trap focus, return it to the trigger on close, and close on Esc. Drawers and bottom sheets do the same.
- A skip link is the first focusable element on every page.

## Targets

- Minimum 44×44px (`--tap-target`, `--control-md`) on every platform. The small button (36px) is allowed only in dense desktop toolbars, never on touch layouts.
- 8px minimum between adjacent targets.

## Text

- Body text 16px minimum (18px on the web base). Reading views 18–20px.
- Support 200% zoom and text-size changes with no loss of content; no fixed-height text containers.
- Line length 45–75 characters, capped by `--measure-reading` (760) and `--measure-scripture` (680).
- Do not justify text. Do not use all-caps for sentences.

## Images and media

| Kind | Rule |
|---|---|
| Informative image | `alt` describes content and purpose in one sentence, in the page language, no "image of" |
| Decorative image or pattern | `alt=""`, and `role="presentation"` for inline svg |
| Logo as a link | `alt` is the destination ("International Scripture Ministries home") |
| QR code | `alt` says what it does and encodes; the URL is also given as text |
| Photos of people | Describe what they are doing. Never guess ethnicity, nationality or age |
| Text in images | Avoid. If unavoidable, `alt` carries the exact text |
| Audio and video | Captions or transcript, keyboard-operable controls, no autoplay with sound |

## Semantics

1. Use native elements first: `button`, `a`, `input`, `select`, `details`, `dialog`, `nav`, `main`.
2. One `h1` per page; headings do not skip levels.
3. Label landmarks when there is more than one of a kind (`<nav aria-label="Footer">`).
4. Form fields have a visible label, `id`/`for`, `aria-describedby` for hint and error, `aria-invalid` on error, and `autocomplete` where it applies.
5. Toasts: `role="status"` for success and info; `role="alert"` only for errors.
6. Mark language changes with `lang`. Mark direction with `dir`.
7. Tabs, accordions, comboboxes and menus follow the WAI-ARIA Authoring Practices patterns; each component README lists the exact keys.
8. Touch gestures (swipe, long-press, pinch) always have a single-tap alternative.

## Testing checklist

Keyboard-only walkthrough; screen reader (VoiceOver, TalkBack, NVDA); 200% zoom; reduced motion; dark and light; one RTL language; one non-Latin script at its recommended line-height.
