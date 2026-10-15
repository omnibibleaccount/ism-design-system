# PageIntro
The opening block of an inner page (eyebrow, headline, lead) and the matching section heading row with an eyebrow, h2 and a ghost "See all" link.

## When to use
- Page intro: top of every inner page (HD Radio, Publishing, About, FAQ, Give) where the home Hero would be too heavy.
- Section heading row: above a grid or list section that has its own index page ("What we do", "Latest stories").
- Do not use the page intro twice on one page.
- Do not add a ghost link when there is nothing more to see.

## Anatomy & markup
```html
<!-- page intro -->
<header class="dp-intro">
  <span class="eyebrow">HD Radio Broadcast</span>
  <h1 class="h2">Scripture on the <span class="em">airwaves</span>.</h1>
  <p class="lead">Clear, continuous scripture readings on HD Radio.</p>
</header>

<!-- section heading row -->
<div class="dp-sechead">
  <div class="dp-sechead-text">
    <span class="eyebrow">What we do</span>
    <h2 class="h2">Four ways scripture <span class="em">travels</span>.</h2>
  </div>
  <a class="btn btn-ghost" href="/programs">See all ↗</a>
</div>
```

## Variants & states
- Intro on light (default): `.em` shows the gradient marker. Inside `.sec-ink` the eyebrow, headline and lead switch to dark styles automatically.
- Intro may add buttons below the lead (a `.btn-primary` and a `.btn-secondary`) on pages with one clear action.
- Heading row: text left, ghost link aligned to the bottom right; on narrow screens the link wraps under the heading.
- Ghost link hover: `--horizon-blue-dim`; the ↗ arrow nudges up-right.

## Rules
- Inner pages style their `<h1>` with `.h2`; only the home Hero uses `.h1` size.
- Cap the intro at `--measure-reading` (760px) wide; it is built in to `.dp-intro`.
- One `.em` word per headline.
- Keep 20px between eyebrow, headline and lead.
- The heading-row link is `.btn-ghost`, never a filled button. Use ↗ when it opens another page; use no arrow for an in-page anchor.
- Leave at least `--space-7` (48px) between the heading row and the content below.

## Accessibility
- The intro headline is the page's single `<h1>`; section headings are `<h2>`.
- The eyebrow is a label, not a heading; do not mark it up as `h*`.
- Make the ghost link text specific when there are several on a page ("See all programmes ↗"), or add a `.dp-vh` suffix.
- Ghost links keep the 44px `.btn` height for tap targets.

## Content
- Eyebrow: the programme or section name ("HD Radio Broadcast", "What we do").
- Headline: short and concrete, ending in a full stop: "Scripture on the airwaves."
- Lead: one sentence on what the page offers.
