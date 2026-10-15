# NewsletterCard
A dark email sign-up card with an eyebrow, headline, one email field and a full-width Subscribe button, which turns into a one-line confirmation after sign-up.

## When to use
- Use at the end of stories, in the footer area of ism.bible and on the News page.
- Use once per page.
- Do not use for giving or partner sign-up; use DonationWidget or PartnerCard.
- Do not add more fields (name, country) here; a longer form belongs on its own page.

## Anatomy & markup
`.mn-nl` (black with blue and gold glows, `--radius-lg`) → eyebrow → title → lead → field → button → note.

```html
<form class="mn-nl on-dark" novalidate>
  <span class="eyebrow">Newsletter</span>
  <h3 class="h3 mn-nl-title">Stories from the field, once a month.</h3>
  <p class="mn-nl-lead">Answered prayers, new languages and ways to help. Short and worth reading.</p>
  <div class="field">
    <label class="label" for="nl-email">Email</label>
    <input class="input" id="nl-email" type="email" autocomplete="email" placeholder="you@example.com" aria-describedby="nl-err">
    <span class="mn-nl-err" id="nl-err" hidden>Enter an email like name@example.com.</span>
  </div>
  <button class="btn btn-primary" type="submit" style="width:100%">Subscribe</button>
  <p class="mn-nl-note">No spam. Unsubscribe anytime. <a href="/privacy">Privacy</a></p>
</form>
```

Success (replaces field, button and note):

```html
<div class="mn-nl-rule"></div>
<p class="mn-nl-ok" role="status"><svg width="18" height="18" …aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>You’re in. Watch for our next letter.</p>
```

## Variants & states
- Default: input on white 6% with a white 30% border; hover border white 55%; focus border `--blue-on-dark`.
- Error: `aria-invalid="true"` on the input turns its border `--error-on-dark`; `.mn-nl-err` shows below in `--error-on-dark`; focus returns to the input.
- Success: field, button and note hide; `.mn-nl-rule` (`--gradient-line`) and `.mn-nl-ok` (check in `--blue-on-dark`) appear.
- Submitting: button shows `.spin` + "Subscribing…" and is disabled.

## Rules
- Always dark (`--black` surface); add `.on-dark` so the base eyebrow, label and links switch colours.
- One field, one button. Subscribe is the single Horizon Blue button, full width.
- Label above the field ("Email"); the placeholder is an example, not the label.
- Validate on submit, not while typing. Keep the message next to the field.
- The privacy note sits under the button at 13px, with the link in `--blue-on-dark`.
- Field and button are at least 44px tall.

## Accessibility
- Real `<label for>` on the input; `type="email"` and `autocomplete="email"`.
- The error is linked through `aria-describedby`; set `aria-invalid="true"` only while invalid.
- The success line is `role="status"` so it is announced; move focus to it after submit.
- Check contrast of the lead and note text on black (white 72% and 60% pass at these sizes).

## Content
- Eyebrow: "Newsletter". Title: "Stories from the field, once a month."
- Lead: "Answered prayers, new languages and ways to help. Short and worth reading."
- Error: "Enter an email like name@example.com."
- Success: "You’re in. Watch for our next letter."
- Note: "No spam. Unsubscribe anytime. Privacy".
