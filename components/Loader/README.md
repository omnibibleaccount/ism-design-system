# Loader
Spinners for short waits, a busy state for buttons, and shimmering skeletons that hold the shape of content while it loads.

## When to use
- Use a spinner for a wait under about 2 seconds inside a control or a small area: sending a form, loading a menu.
- Use the button loading state after a submit: Give, Send, Save.
- Use skeletons when a page or list of content is loading: cards, list rows, a chapter of text.
- Use Progress instead when you know how far along the work is (downloads, uploads, steps).
- Do not show a full-page spinner. Show the page frame and skeletons for the parts still loading.

## Anatomy & markup
```html
<!-- spinner -->
<span class="fb-spin fb-spin-m" role="status" aria-label="Loading"></span>

<!-- button loading: keep the width, spinner + verb -->
<button class="btn btn-primary fb-busy" type="button" aria-busy="true" aria-disabled="true" style="min-width:124px">
  <span class="spin" aria-hidden="true"></span>Sending…
</button>

<!-- skeleton list row -->
<div class="fb-sk-list" aria-busy="true" aria-label="Loading stations">
  <div class="fb-sk-row">
    <span class="fb-sk fb-sk-avatar"></span>
    <span class="fb-sk-lines"><span class="fb-sk" style="width:60%"></span><span class="fb-sk" style="height:10px;width:40%"></span></span>
  </div>
</div>
```

## Variants & states
| Variant | Classes | Notes |
|---|---|---|
| Spinner S / M / L | `.fb-spin` + `.fb-spin-s` (16) / `-m` (24) / `-l` (40) | `--gray-200` track, `--horizon-blue` head |
| Spinner on dark | add `.fb-spin-dk` | white head on a 22% white track |
| Spinner on a light button | add `.fb-spin-ink` | black head, for `.btn-secondary` |
| Spinner on a primary button | base `.spin` | white, 16px |
| Button loading | `.btn` + `.fb-busy` + `aria-busy="true"` | keeps its width; verb in -ing form |
| Skeleton card | `.card .card-flat` with `.fb-sk-media` + `.fb-sk` lines | |
| Skeleton list row | `.fb-sk-list` > `.fb-sk-row` (`.fb-sk-avatar` + `.fb-sk-lines`) | 72px rows |
| Skeleton text | `.fb-sk-text` with `.fb-sk-title` + `.fb-sk` lines | vary line widths |

## Rules
- Spinner turns once every 0.8s. Never colour a spinner with a status colour.
- Pick the size by context: S inside buttons and inputs, M inside menus and cards, L in an empty panel.
- A loading button keeps its width (set `min-width` to its idle width), shows the spinner before the verb, and cannot be clicked again (`.fb-busy`).
- Change only the clicked button; leave the rest of the group as is.
- Skeleton shimmer runs `--gray-100` to `--gray-200` over 1.4s. Lines are 12px tall with 6px radius; media blocks use `--radius-md`.
- Shape skeletons like the real layout: same card size, same row height, same number of lines (roughly).
- Show a skeleton only after 300ms; if content arrives sooner, show nothing.
- Replace skeletons with the content in one swap; never fade each line separately.
- If loading fails, replace the loader with an EmptyState offline or error panel.

## Accessibility
- A standalone spinner has `role="status"` and `aria-label="Loading"` (or a more specific label, "Loading stations").
- Spinners inside a button are `aria-hidden="true"`; the button text ("Sending…") carries the meaning. Add `aria-busy="true"` and `aria-disabled="true"`.
- Skeleton containers have `aria-busy="true"` and an `aria-label`; remove `aria-busy` when content arrives. Skeleton shapes are not announced.
- When content finishes loading after a long wait, announce it with a polite live region ("12 stations loaded").
- Reduced motion: the base layer stops the spin and shimmer; the static ring and grey blocks still read as loading.

## Content
- Button verbs in -ing form with an ellipsis: "Sending…", "Saving…", "Giving…", "Downloading…".
- Labels say what is loading: "Loading stations", "Loading Psalm 23".
- Never write "Please wait" on its own.
