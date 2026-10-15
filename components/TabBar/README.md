# TabBar
The bottom tab bar of an ISM app: five equal tabs (Home, Bible, Listen, Saved, More) that switch between the app's top-level sections.

## When to use
- Use on every root screen of dot.Bible and other ISM apps with three to five top-level sections.
- Keep it visible on drilled-in screens unless the screen is full-screen reading or a modal flow.
- Do not use it for in-page filters; use SegmentedControl or chips.
- Do not put actions (Share, Give) in the tab bar; tabs only navigate.

## Anatomy & markup
84px including the home indicator area. Each tab is a 24px icon over an 11/600 label.

```html
<nav class="ap-tabbar" aria-label="Main">
  <button class="ap-tab" type="button" aria-current="page"><span class="ap-tab-ico"><svg …/></span>Home</button>
  <button class="ap-tab" type="button"><span class="ap-tab-ico"><svg …/></span>Bible</button>
  <button class="ap-tab" type="button"><span class="ap-tab-ico"><svg …/></span>Listen</button>
  <button class="ap-tab" type="button"><span class="ap-tab-ico"><svg …/></span>Saved</button>
  <button class="ap-tab" type="button" aria-label="More, new item"><span class="ap-tab-ico"><svg …/><span class="ap-dot" aria-hidden="true"></span></span>More</button>
</nav>
```

## Variants & states
| State | How |
|---|---|
| Default | `--gray-600` icon and label |
| Active | `aria-current="page"` (or `.ap-is-active`): Horizon Blue icon and label |
| Pressed | `:active` / `.ap-is-pressed`: `--gray-100` tile |
| Badge | `.ap-dot` 9px Horizon Blue with a 2px ring in the bar colour |
| Focus | keyboard focus ring inset (`.ap-is-focus` for specimens) |
| Dark | `.ap-tabbar.ap-dark`: `--charcoal-900` bar, active `--blue-on-dark` |

## Rules
- Exactly five tabs in dot.Bible, always in this order: Home, Bible, Listen, Saved, More.
- One active tab at all times. Colour alone is not the cue: the label stays visible on every tab.
- Badge dots and counts are Horizon Blue (`--blue-on-dark` on dark), never red. Red is reserved for errors.
- Use the dot for "something new"; never show a number above 9 in a tab.
- Tabs are at least 44px tall (52px here) and share the width equally.
- Use outline icons at stroke 1.8; do not swap to filled icons for the active tab.
- The bar sits on white with a top hairline (`--gray-200`); content scrolls under it.

## Accessibility
- Wrap in `<nav aria-label="Main">`; mark the current tab with `aria-current="page"`.
- When a tab has a dot, extend its name: `aria-label="More, new item"`.
- Do not trap focus; Tab moves through the five tabs in order.
- Labels never truncate; keep them to one short word.

## Content
- Labels are one word, title case: Home, Bible, Listen, Saved, More.
- Translate labels with the app; keep them short in every language.
