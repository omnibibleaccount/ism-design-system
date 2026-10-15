# Tooltip
A small dark label that names an icon-only control on hover or focus, and its light popover sibling that opens on click to explain something with a title and one link.

## When to use
- Use a tooltip on every icon-only button that has no visible text: Copy link, Share verse, Listen, Save verse.
- Use a popover for a short explanation next to a control or term, such as what offline reading needs.
- Do not put essential information only in a tooltip; touch screens may never show it.
- Do not put links, buttons or anything interactive in a tooltip. Use a popover.
- Do not use a popover for a task with inputs; use a Modal.

## Anatomy & markup
Tooltip: trigger (`position: relative`) + `.fb-tip` + side class. Popover: trigger with `aria-expanded` + `.fb-pop` with title, body and optional link.

```html
<button class="fb-ib" type="button" aria-label="Copy link" aria-describedby="tip-copy">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">…</svg>
  <span class="fb-tip fb-tip-t" id="tip-copy" role="tooltip">Copy link</span>
</button>

<div style="position:relative">
  <button class="fb-ib" type="button" aria-label="About offline reading" aria-expanded="true" aria-controls="pop-offline">…info icon…</button>
  <div class="fb-pop" id="pop-offline" role="dialog" aria-label="About offline reading">
    <span class="fb-pop-title">Read without a connection</span>
    <span class="fb-pop-body">Download a Bible once and it stays on your phone.</span>
    <a class="fb-pop-link" href="/dot-bible-app#offline">How offline reading works ↗</a>
  </div>
</div>
```

## Variants & states
| Variant | Classes | Notes |
|---|---|---|
| Tooltip top | `.fb-tip .fb-tip-t` | default |
| Tooltip bottom | `.fb-tip .fb-tip-b` | when there is no room above (e.g. under the header) |
| Tooltip left / right | `.fb-tip .fb-tip-l` / `.fb-tip-r` | for controls at a screen edge or in a vertical rail |
| Popover | `.fb-pop` | 300px wide, opens below, arrow at 28px from the left |
| Trigger | `.fb-ib` | 44px round icon button, `--gray-300` border; `aria-expanded="true"` turns it Horizon Blue |

Hidden is the default state; show the tooltip by rendering it (or toggling `hidden`) on hover and focus.

## Rules
- Tooltip: `--charcoal-900` fill, white 13px/500 text, radius `--radius-sm`, padding 7px 10px, 10px gap to the trigger plus a 10px arrow. One line, no wrap.
- Show after 300ms hover or immediately on keyboard focus; hide on mouse-out, blur or Esc.
- Default to top. Flip to the opposite side when there is no room; never cover the trigger.
- Popover: `--white`, 1px `--gray-200` border, radius `--radius-md`, shadow `--shadow-overlay`, padding 16px 18px, max-width `calc(100vw - 32px)`.
- Popover title 16px/600, body 14px `--gray-700`, link 14px/600 Horizon Blue.
- Link icons: ↗ when the link goes to another page; › when it drills into an app screen.
- Popovers open on click, not hover. Esc, a click outside, or the trigger again closes them. Only one open at a time.
- Triggers are 44px tap targets and keep the focus ring while their popover is open.

## Accessibility
- The icon button has its own `aria-label`; the tooltip adds `role="tooltip"` and is linked by `aria-describedby`. Do not repeat the label word for word if it adds nothing; the tooltip then only helps sighted users.
- Tooltips must appear on keyboard focus, stay while hovered, and dismiss with Esc (WCAG 1.4.13).
- Popover trigger has `aria-expanded` and `aria-controls`. The popover is `role="dialog"` with `aria-label`.
- When a popover opens, focus stays on the trigger; Tab moves into the popover's link. On close, focus returns to the trigger.
- Never hide the only route to information in a hover state.

## Content
- Tooltips: two or three words, sentence case, verb first. "Copy link", "Share verse", "Save verse", "Listen".
- Popovers: a short title, one or two plain sentences, one link. "Read without a connection. Download a Bible once and it stays on your phone. Audio needs about 600 MB of space." (600 MB is a sample figure.)
- No full stops in tooltips. No emoji.
