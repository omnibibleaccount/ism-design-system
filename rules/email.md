# Email

Source: the four Braze donor-newsletter templates in `reference/ui-kits/marketing-email/donor-newsletter/` (read directly), the lifecycle kit (`EmailParts.jsx`: re-engagement, profile completion, receipt) and the email reference images in `packages/web/assets/imagery/`. Machine-readable copy: `rules.json` under `applied.email`.

## Families
1. Donor engagement (Braze newsletters): stewardship and gratitude, one primary action.
2. Lifecycle marketing (welcome series, re-engagement, complete profile).
3. Transactional (donation receipt). Plainer than marketing. Do not mix the two.

## Structure
- Desktop content width 650px (a 600px variant exists). Below 670px the layout stacks: columns go full width, desktop hero image hides and the mobile hero shows. Ship desktop and mobile versions, each with and without a hero image.
- Required order: preheader (non-empty, hidden in the body, shows in the inbox), hero, greeting and intro, one primary button, optional scripture quote band, closing and signature, shared dark footer.
- Footer is the shared block `HTML-ISM-Dark-Footer`: full-width `#20242B`, unsubscribe, manage preferences, postal address, social links. Do not re-author it per email.
- One filled Horizon Blue button per email, the one unmistakable action. No new ask in the closing line.
- Copy holes are literal `[PLACEHOLDER …]` text. Optional modules use `show_*` toggles. Never ship invented numbers.

## Type and colour
- Inter via Google Fonts for clients that support it; fallback stack `Inter, Arial, sans-serif`. No web font assumptions for Outlook Windows.
- Colours seen in the templates: body text `#111111` and `#333333`, background `#F4F4F6`, Horizon Blue `#046DE3`, footer `#20242B`, cream quote band `#FFF9EC` with a gold rule `#E0A231`, light blue on dark `#8AB4F0`, gold `#F3B25A`.
- Scripture quote band: cream background, gold left rule. Citation plain ("Rom. 10:17").

## Dark mode
Light-only by design (`color-scheme: light only`). The `[data-ogsc]` swaps are a safety net for Outlook and Gmail apps that force dark: swap white assets with `.dm-hide` and `.dm-show`, lighten text with `.dm-text-light`. Do not add a `prefers-color-scheme` block: Apple Mail keeps the light background but the query would still fire and put white assets on a light email.

## Gradient hero word
Solid blue inline by default. The gradient (`#046DE3 → #8F7DE0 → #F3B25A`) applies only inside an `@supports` block that requires both `background-clip: text` and `text-fill-color: transparent`, so the word never disappears. Outlook Windows keeps the solid colour.

## Build constraints
Table-based layout, inline styles, MSO conditional comments, 96 PPI setting, images with real alt text, `a[x-apple-data-detectors]` reset. Keep these as static HTML; do not convert to the design-canvas format.

## Voice
Warm, concrete, stewardship first: thank the donor and say what their partnership made possible. Follow `voice-microcopy.md`.
