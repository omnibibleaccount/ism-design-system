# Fab
The floating + button for a screen's one main create action, with the pull-to-refresh indicator and the snackbar that sits above the tab bar.

## When to use
- Use the FAB for the single most common create action on a list screen: New note on Saved.
- Use pull to refresh on feeds that change from the server: Listen episodes, ISM Radio schedules.
- Use the snackbar to confirm an action and offer Undo (note deleted, verse saved).
- Do not use a FAB on reading screens, settings or anywhere with a blue primary button already.
- Do not use the snackbar for errors that need attention; use an inline Alert.

## Anatomy & markup
```html
<button class="ap-fab" type="button" aria-label="New note"><svg …><path d="M12 5v14M5 12h14"/></svg></button>

<div class="ap-ptr" role="status">
  <span class="ap-ptr-c"><svg …><path d="M12 3a9 9 0 1 1-8.5 6"/></svg></span>
  <span class="ap-ptr-t">Checking for new episodes…</span>
</div>

<div class="ap-snack" role="status"><span>Note deleted</span><button class="ap-snack-a" type="button">Undo</button></div>
```

All three are placed inside `.ap-screen`, which is `position: relative`.

## Variants & states
| Part | Classes | Notes |
|---|---|---|
| FAB | `.ap-fab` | 56px, Horizon Blue, 16px from the right, 16px above the tab bar |
| FAB lifted | `.ap-fab.ap-fab-lifted` | moves up while a snackbar shows |
| Pressed | `:active` | `--horizon-blue-dim` |
| Pull to refresh | `.ap-ptr` + `.ap-ptr-c` | white 40px disc, spinning blue arc, under the app bar |
| Snackbar | `.ap-snack` + `.ap-snack-a` | `--charcoal-900`, `--radius-md`, 12px above the tab bar |

## Rules
- One FAB per screen, and it is the screen's one Horizon Blue primary.
- The icon is always +; the action is named in `aria-label`, not in visible text.
- The FAB never covers the tab bar or the mini player; lift it with `.ap-fab-lifted` when a snackbar appears.
- Snackbar: one line, one text action in `--blue-on-dark`, 44px tall action. Hide after 5s (8s with Undo).
- Pull to refresh only on lists that fetch new data; show a short line of what is happening.
- Feed rows (`.ap-ep`) use a 56px image, title 15/600, meta line and a 36px play button.

## Accessibility
- `aria-label` on the FAB names the action ("New note").
- Snackbar and refresh indicator use `role="status"`; never move focus to them.
- Offer Undo somewhere else as well (the item's menu), as the snackbar disappears.
- Provide a Refresh command for people who cannot pull (in More or via keyboard).
- Reduced motion: no spin, show the static arc and the text.

## Content
- FAB labels: "New note", "New highlight".
- Refresh text: "Checking for new episodes…"
- Snackbar: past tense + verb: "Note deleted" + "Undo", "Verse saved" + "View".
