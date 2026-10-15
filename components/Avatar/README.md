# Avatar
A circular picture of a person or partner, shown as a photo, initials or a person icon, with an optional status dot and an overlapping group stack.

## When to use
- Use beside names in testimonials, partner lists, team pages, comments and list rows.
- Use the group stack to show "who else" in a compact space (partners in a city, listeners in a group).
- Do not use for logos, app icons or station artwork; those are square tiles.
- Do not use a status dot unless presence is real and live.

## Anatomy & markup
```html
<!-- image -->
<span class="dp-av dp-av-56"><img src="maria.jpg" alt="Maria Santos"></span>
<!-- initials -->
<span class="dp-av dp-av-40 dp-av-violet">MS</span>
<!-- icon fallback -->
<span class="dp-av dp-av-56 dp-av-ic" role="img" aria-label="No photo"><svg aria-hidden="true">…person…</svg></span>
<!-- status -->
<span class="dp-av dp-av-56 dp-av-blue">DA<span class="dp-pres dp-pres-away"></span></span>
<!-- group -->
<div class="dp-stack" role="img" aria-label="Maria, Dawit, Musa, Joy and 5 more partners">
  <span class="dp-av dp-av-40"><img src="…" alt=""></span>
  <span class="dp-av dp-av-40 dp-av-gold">JK</span>
  <span class="dp-av dp-av-40 dp-av-more">+5</span>
</div>
```

## Variants & states
- Sizes: `.dp-av-24`, `-32`, `-40`, `-56`, `-80`. Initials scale with the size.
- Initial colours: `.dp-av-blue` (`--horizon-blue`), `-violet` (`--gradient-violet`), `-gold` (`--gradient-gold`, dark text), `-ink` (`--charcoal-900`), `-peach` (`--gradient-peach`, dark text).
- Icon fallback: `.dp-av-ic` on `--gray-200`.
- Status dot `.dp-pres`: online `--success`; `.dp-pres-away` gold; `.dp-pres-off` `--gray-300`. It is 28% of the avatar with a 2px white ring.
- Stack: `.dp-stack` overlaps by 10px with a 2px white ring; the count tile is `.dp-av-more`.

## Rules
- Always circular. Never put an avatar in a square or rounded-square frame.
- Use 40px in list rows, 56px in testimonial cards, 80px on profile headers, 24–32px in dense UI.
- Show at most four faces in a stack, then a count tile.
- Pick an initials colour from the name, consistently, so a person keeps one colour.
- Use one or two initials, uppercase. No emoji.
- Do not use red for presence; offline is grey.

## Accessibility
- Decorative avatars next to a visible name get `alt=""`. A standalone avatar gets the person's name as alt.
- Initials avatars beside a name need nothing extra; alone, add `role="img"` and `aria-label`.
- Never show status with the dot alone; pair it with a word or put it in the label ("Dawit Alemu, away").
- A stack needs one `aria-label` listing names and the count.

## Content
- Use real names and roles: "Maria Santos, Partner pastor · Lima, Peru".
- Photos are warm and natural, faces centred, no heavy filters.
