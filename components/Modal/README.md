# Modal
A white dialog over a dimmed scrim that holds one short task or one decision, including the confirmation dialog for destructive and neutral choices.

## When to use
- Use a dialog (S or M) for a short focused task that should not leave the page: send an app link, request NFC Bible cards.
- Use the confirmation dialog before an action that cannot be undone or loses work: remove a partner, leave an unfinished sign-up.
- Do not use a modal for long forms, reading content or anything with more than one step; give it its own page.
- Do not open a modal on page load or on scroll. Open it only from a click.
- Do not confirm actions that can be undone; do them and offer Undo in a Toast.

## Anatomy & markup
Scrim, panel, header (title + 44px close X), body, footer with a secondary button then one primary.

```html
<div class="fb-scrim">
  <div class="fb-modal fb-modal-s" role="dialog" aria-modal="true" aria-labelledby="app-title">
    <div class="fb-modal-head">
      <h2 class="fb-modal-title" id="app-title">Get the dot.Bible app</h2>
      <button class="fb-x" type="button" aria-label="Close">…x icon…</button>
    </div>
    <div class="fb-modal-body"><p>Read and listen in 500+ languages, even offline.</p></div>
    <div class="fb-modal-foot">
      <button class="btn btn-secondary btn-sm" type="button">Not now</button>
      <button class="btn btn-primary btn-sm" type="button">Send link</button>
    </div>
  </div>
</div>

<!-- confirmation -->
<div class="fb-modal fb-modal-s" role="alertdialog" aria-modal="true" aria-labelledby="c-t" aria-describedby="c-d">
  <div class="fb-confirm">
    <span class="fb-cicon fb-cicon-danger">…trash icon…</span>
    <div class="fb-confirm-text">
      <h2 class="fb-modal-title" id="c-t">Remove this partner?</h2>
      <p class="fb-confirm-desc" id="c-d">Grace Fellowship will lose access to the partner dashboard.</p>
    </div>
  </div>
  <div class="fb-modal-foot">
    <button class="btn btn-secondary btn-sm" type="button">Cancel</button>
    <button class="btn btn-sm fb-danger" type="button">Remove partner</button>
  </div>
</div>
```

## Variants & states
| Variant | Classes | Notes |
|---|---|---|
| Dialog S | `.fb-modal .fb-modal-s` | max-width 400px; a sentence and two buttons |
| Dialog M | `.fb-modal .fb-modal-m` | max-width 560px; a short form (`.fb-modal-grid` for two fields side by side) |
| Confirm, destructive | `.fb-confirm` + `.fb-cicon-danger` + `.fb-danger` button | `role="alertdialog"`, no close X |
| Confirm, neutral | `.fb-confirm` + `.fb-cicon-info` + `.btn-primary` | the primary keeps the reader safe ("Keep editing") |

`.fb-scrim` is the fixed full-screen overlay. `.fb-scrim-demo` is an in-page stage for docs and previews only.

## Rules
- Scrim `rgba(22,24,25,.6)` (charcoal-900 at 60%). Panel `--white`, radius `--radius-lg`, shadow `--shadow-overlay`.
- Title 20px/600. Body 16px, `--gray-700`. Footer has a 1px `--gray-200` rule and right-aligned buttons, `.btn-sm`.
- Footer order: secondary first, then one primary. One Horizon Blue primary per dialog.
- Destructive actions use `.fb-danger` (`--error` fill) and name the action ("Remove partner"), never "OK" or "Yes".
- The close X is `.fb-x`, a 44px round button, top right. Confirmation dialogs have no X: the two buttons are the only way out.
- Esc, the X or a scrim click closes a dialog. In a confirmation, Esc means Cancel and scrim clicks do nothing.
- On phones the panel keeps 16px from the screen edges and scrolls inside itself (`max-height: calc(100vh - 32px)`).
- Lock page scroll while open. One modal at a time; never open a modal from a modal.

## Accessibility
- `role="dialog"` (or `role="alertdialog"` for confirmations), `aria-modal="true"`, `aria-labelledby` the title; confirmations also `aria-describedby` the sentence.
- On open, move focus into the dialog: the first field in a form, the Cancel button in a confirmation, otherwise the title (`tabindex="-1"`).
- Trap Tab inside the dialog. On close, return focus to the button that opened it.
- Make the page behind `inert`.
- Focus ring on every control: `outline: 2px solid var(--horizon-blue); outline-offset: 2px; box-shadow: var(--shadow-focus)`.
- Icons in the dialog are `aria-hidden="true"`; the close button has `aria-label="Close"`.

## Content
- Title is the task or the question. "Get the dot.Bible app", "Remove this partner?", "Leave without saving?"
- The body says what will happen, in one or two sentences. "Grace Fellowship will lose access to the partner dashboard. You can invite them again later."
- Button labels are verbs that match the title: "Send link", "Send request", "Remove partner", "Keep editing". Dismiss with "Not now" or "Cancel".
- Never use "Are you sure?" as the whole message.
