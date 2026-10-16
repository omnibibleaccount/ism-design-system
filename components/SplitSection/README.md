# SplitSection
Two-column section with a photo on one side and eyebrow, headline, lead and actions on the other; image-left/text-right by default, reversible.

## When to use
- Use for "About ISM", programme introductions (dot.Bible app, HD Radio, ISM Publishing) and any section that pairs one strong photo with a short story.
- Alternate `.dp-split` and `.dp-split-rev` down a page so photos zigzag.
- Do not use for more than one paragraph of copy or for lists of items; use NumberedList or Card grids.
- Do not use without a real photo; use PageIntro or CenteredCta instead.

## Anatomy & markup
```html
<section class="dp-split" aria-labelledby="about-h">
  <div class="media dp-split-media">
    <img class="photo" src="assets/imagery/photo-friends.jpg" alt="Two friends reading their Bibles together">
  </div>
  <div class="dp-split-body">
    <span class="eyebrow">About ISM</span>
    <h2 class="h2" id="about-h">A ministry built on one <span class="em">simple</span> conviction.</h2>
    <p class="lead">Everyone deserves to read, hear and understand the Bible in their own language.</p>
    <div class="dp-split-actions">
      <a class="btn btn-secondary" href="/about">Learn about ISM</a>
      <a class="btn btn-ghost" href="/statement-of-faith">Our statement of faith <span class="arrow" aria-hidden="true">↗</span></a>
    </div>
  </div>
</section>
```

## Variants & states
- Image left (default) `.dp-split`.
- Image right `.dp-split dp-split-rev` (text-left-image-right).
- Media is 4:5 on desktop and 4:3 on mobile, with the `.media` 20px radius.
- Columns are equal with a 64px (`--space-8`) gap, vertically centred. Under 768px it stacks: photo first, then text, 32px gap.
- On a light page, wrap it in a white card (`--radius-lg`, `--gray-200` border, 48px padding) or leave it on `--off-white`; on `.sec-ink` the type switches to its dark styles.

## Rules
- One `.em` word per headline.
- Actions: at most two. Use `.btn-secondary` + `.btn-ghost`; use `.btn-primary` only if this section holds the page's main action, and then only one.
- ↗ on a link means it goes to another page.
- Headline at most about 10 words; lead one or two sentences.
- Use a real ISM photo of people reading or listening, never an illustration or screenshot here.
- Keep the photo first in the DOM in both variants so mobile always stacks image-then-text.

## Accessibility
- Use a real heading (`h2`) and label the section with `aria-labelledby`.
- Write alt text that says what the photo shows; use `alt=""` only if it is purely decorative.
- Reversing with `order` keeps reading order sensible because the photo carries no essential text.

## Content
- Eyebrow: the section name ("About ISM", "HD Radio", "dot.Bible app").
- Headline: "A ministry built on one simple conviction."
- Lead: "Everyone deserves to read, hear and understand the Bible in their own language."
