# InlineSubscribe
A single-row newsletter sign-up: a 52px pill email field and a Subscribe pill button that wrap onto two lines on narrow screens, for light and dark sections.

## When to use
- Inline email capture inside a section, footer or article end: the ISM newsletter, prayer updates, ISM Radio programme news.
- Only an email is needed. If you also need a name, topics or a heading block, use NewsletterCard or a FormLayout.
- Do not use for search (SearchField) or for sign-in.

## Anatomy & markup
```html
<div class="fm-sub-wrap">
  <form class="fm-sub" novalidate>
    <label class="fm-vh" for="sub-email">Email address</label>
    <input class="input fm-sub-input" id="sub-email" type="email" autocomplete="email"
      placeholder="you@example.com" aria-describedby="sub-msg">
    <button class="btn btn-primary btn-lg" type="submit">Subscribe</button>
  </form>
  <p class="fm-sub-note" id="sub-msg">Stories from the field, once a month. Unsubscribe anytime.</p>
</div>

<!-- success replaces the form -->
<p class="fm-sub-done" role="status"><svg …tick…/>You're in. Watch for our next letter.</p>
```
- `.fm-sub`: flex row with 10px gap that wraps; the input grows (`flex: 1 1 240px`), the button keeps its width.
- `.fm-sub-input`: the base `.input` at 52px tall with `--radius-pill` corners and 22px side padding.
- The button is `.btn .btn-primary .btn-lg` at 52px so both pills line up.
- `.fm-vh` keeps the label for screen readers only; the placeholder is an example, never the label.
- `.fm-sub-note` (14px `--gray-600`) holds the reassurance line; it is replaced by the error when there is one.

## Variants & states
- Light: white field with the base border on `--off-white` or white.
- Dark (inside `.on-dark` or `.sec-ink`): field turns `rgba(255,255,255,.06)` with a 30% white border and white text; placeholder `--text-tertiary-dark`; the note uses `--text-tertiary-dark`.
- Focus: the base `--horizon-blue` border and `--shadow-focus` on both backgrounds.
- Error: `aria-invalid="true"` on the input and an `.err.fm-sub-err` line under the row. On dark the border and text use `--error-on-dark`.
- Success: the form is replaced by `.fm-sub-done`, a 52px pill with a tick: `--success` on `--success-bg` on light, `--success-on-dark` on a translucent fill on dark.
- Sending: the button shows `.spin` and is `aria-disabled="true"` until the request returns.

## Rules
- One field, one button. The button is the one Horizon Blue primary in its group; do not add a second blue button beside it.
- Always use `type="email"` and `autocomplete="email"`; validate on submit, then live once an error is showing.
- Keep the field and button the same 52px height and pill shape; never square the corners.
- Put the success message where the form was, so the layout does not jump; keep it until the page is left.
- Never pre-tick or hide marketing consent; the button label is the consent action ("Subscribe").
- Give the reassurance line (frequency, unsubscribe) next to the form, not in a tooltip.
- On phones the button drops below the field at full width; both stay 52px tall.

## Accessibility
- Visually hidden label "Email address" tied to the input with `for`.
- The note and the error are linked with `aria-describedby`; switch it to the error id when invalid.
- Success uses `role="status"`; move focus to it only if the form had focus.
- Error and success are carried by text and icon, not colour alone.
- `--error-on-dark` and `--success-on-dark` keep contrast on black; never use `--error` text on dark.

## Content
- Placeholder: "you@example.com". Button: "Subscribe".
- Note: "Stories from the field, once a month. Unsubscribe anytime."
- Errors: "Please enter your email address." / "Enter a valid email, like name@example.com."
- Success: "You're in. Watch for our next letter."
