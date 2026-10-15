# EmptyState
A centred panel that explains why a list, search or screen has nothing to show and offers the one next step.

## When to use
- Use when a search returns no results: suggest close matches as chips.
- Use when a personal collection is empty for the first time (saved verses, downloads, favourite stations): offer the action that fills it.
- Use when content cannot load because the reader is offline or the request failed: offer Retry.
- Do not use while content is still loading; use Loader skeletons.
- Do not use for a whole-site error page; that is the 404 page pattern.

## Anatomy & markup
Icon circle (64px) + title + one short sentence + one next step (chips, a primary button, or a secondary Retry).

```html
<div class="fb-empty">
  <span class="fb-eicon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4z"/></svg></span>
  <h3 class="fb-empty-title">No saved verses yet</h3>
  <p class="fb-empty-text">Tap the bookmark on any verse and it will wait for you here.</p>
  <button class="btn btn-primary fb-empty-act" type="button">Start reading</button>
</div>
```

## Variants & states
| Variant | Icon circle | Next step |
|---|---|---|
| No results | `.fb-eicon .fb-eicon-neutral` (`--gray-100`, search icon) | `.fb-empty-chips` with two to four `.chip` suggestions |
| Nothing yet | `.fb-eicon` (`--blue-tint`, Horizon Blue icon) | one `.btn .btn-primary` |
| Offline / error | `.fb-eicon .fb-eicon-error` (`--error-bg`, `--error` icon) | `.btn .btn-secondary` "Try again" with a refresh icon |

## Rules
- Panel `--white`, 1px `--gray-200` border, radius `--radius-lg`, padding 40px 28px, everything centred.
- Title 20px/600 (`.fb-empty-title`). Sentence 15px `--gray-700`, max-width 280px (`.fb-empty-text`).
- One next step only. "Nothing yet" gets the single Horizon Blue primary; offline uses a secondary button so it never competes with the page's primary.
- Suggestion chips are real searches the reader can tap; 44px tall from `.chip`.
- Icons: 28px inline SVG, stroke currentColor, 1.8 width, round caps.
- Inside a list or card, the empty state replaces the list in place; keep the page header and filters visible.
- Red tint only for offline and errors. Never use it for an empty collection.
- Link icons on the action: ↗ when it goes to another page, › when it drills into an app screen.

## Accessibility
- Use a real heading (`h2`/`h3`) at the level that fits the page outline.
- When results update to empty after a search, announce it: wrap in or update a `role="status"` region ("No results for psalm 151").
- Offline and load errors use `role="alert"` once, when they appear.
- After Retry, move focus to the first loaded item or keep it on the button if it fails again.
- Icons are `aria-hidden="true"`; the title and sentence carry the meaning.
- Chips and buttons are 44px tap targets with the base focus ring.

## Content
- Say what happened and what to do. Never blame the reader ("You typed it wrong").
- No results: echo the query. "No results for “psalm 151”. Check the spelling, or try one of these:" + Psalm 23, Psalms, dot.Bible app.
- Nothing yet: invite. "No saved verses yet. Tap the bookmark on any verse and it will wait for you here." + Start reading.
- Offline: reassure. "You’re offline. Check your connection and try again. Bibles you’ve downloaded still work." + Try again.
- Keep it warm and short. No jokes, no emoji, no exclamation marks.
