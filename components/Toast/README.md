# Toast
A short dark message that confirms an action or reports a quiet failure, then hides itself, with at most one action such as Undo or Retry.

## When to use
- Use after the reader does something and the result is not otherwise visible: a verse saved, a link copied, a download started.
- Use the error toast for a failed background action the reader can retry.
- Do not use a toast for form validation or anything the reader must read; use an inline Alert next to the form.
- Do not use a toast for a question or a choice; use a Modal.
- Never put the only path to an important action inside a toast.

## Anatomy & markup
Status dot (24px) + message + one action or a dismiss X. Toasts live inside one `.fb-toaster` region per page.

```html
<div class="fb-toaster" aria-live="polite">
  <div class="fb-toast" role="status">
    <span class="fb-tdot fb-tdot-ok"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span>
    <span class="fb-toast-msg">Link copied</span>
    <button class="fb-toast-act" type="button">Undo</button>
  </div>
</div>
```

## Variants & states
| Variant | Dot | Ends with |
|---|---|---|
| Success | `.fb-tdot-ok` (`--success`) | `.fb-toast-x` dismiss, or an Undo action |
| Error | `.fb-tdot-err` (`--error`) | `.fb-toast-act` Retry; `role="alert"` |
| Info | `.fb-tdot-info` (`--horizon-blue`) | `.fb-toast-x` dismiss |
| With action | any dot | `.fb-toast-act` (Undo, Retry, View) |
| Compact | `.fb-toast-sm` | 44px tall; inside small frames and narrow phones |

States: entering (rise from 8px below, 200ms), resting, paused (hover or focus inside), leaving (fade 150ms).

## Rules
- Surface `--charcoal-900`, text white 15px, radius `--radius-md`, shadow `--shadow-overlay`, min-height 52px, max-width 420px.
- One action at most, text only, colour `--blue-on-dark`. Never a filled Horizon Blue button inside a toast.
- The action and the dismiss X are 44px tap targets.
- Auto-hide after 5s; 8s when there is an action. Pause the timer on hover and on focus.
- Placement: `.fb-toaster` puts toasts bottom-center 16px from the edges on mobile and bottom-right 24px in on desktop (768px and up). Keep them clear of the sticky Give bar and the cookie banner; raise the toaster above them.
- Stack newest on top, three at most; drop the oldest when a fourth arrives.
- One message per toast, one line where possible, two at most.
- Status colour lives only in the 24px dot. Never colour the whole toast.

## Accessibility
- The `.fb-toaster` region exists in the page from load with `aria-live="polite"`, so new toasts are announced.
- Success and info toasts use `role="status"`; error toasts use `role="alert"`.
- Do not move focus to a toast. Offer the same action elsewhere (Undo is also reachable through the item itself).
- Give the dismiss button `aria-label="Dismiss"`. Status dots are `aria-hidden` icons; the message text carries the meaning.
- Respect reduced motion: no slide, just appear and disappear.
- Allow the reader enough time: the timer pauses while the pointer or focus is on the toast.

## Content
- Past tense, plain, short. Say what happened, not that something "succeeded".
- Good: "Verse saved to your library." / "Link copied" + Undo / "Amharic Bible downloading for offline use."
- Error: say what failed and what to do. "Couldn’t send your message. Check your connection." + Retry.
- Action labels are one verb: Undo, Retry, View.
- No exclamation marks, no emoji.
