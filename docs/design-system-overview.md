# ISM Design System

International Scripture Ministries (ISM) is a FaithTech nonprofit delivering unhindered access to the Bible across languages, cultures, and technologies — print-on-demand Bibles on Amazon, the **dot.Bible** mobile app, dramatized audio Bibles, HD radio, and a global partner network. Founder & President: Troy Carl. Tagline seen across letterhead: *"Making Scripture Accessible to All Nations, Anywhere."*

## Sources
- **Figma — "Static Creative.fig"** (mounted): pages `Amazon-ATF-07.07` (multi-language above-the-fold ad slides for the printed Bible's Amazon listing) and `Amazon-Product-07.28` (Amazon product-detail creative). No reusable UI components are defined in this file (0 component sets) — it is static ad/creative artwork, used here as copy, layout and imagery reference only.
- **Figma — "Website widgets.fig" and "Email Designs.fig"**: re-attached but the mounted VFS resolved to an unrelated, near-empty 3-node placeholder file both times — not the real inventories. **Still not imported** — please re-attach again.
- **Real production HTML** (`uploads/ISM website partner with us page`): the live "Partner With Us" marketing page — dark-mode hero, video banner, "Why Partner" grid, GBN platform 2x2 cards, three-step Partner Pathway, FAQ accordion, footer. Rebuilt as its own single-page recreation (previously it was incorrectly combined with the separate Resources page — split apart per feedback). `uploads/ISM website Resources page` remains unused pending a dedicated recreation if wanted. Primary source for `components/core/Footer.jsx` and `ui_kits/marketing-site/`.
- **Figma — "Email Designs (1).fig"**, frame `/Welcome-Series-07-24-26/Suggestions2`: the real 4-email Welcome Series (marketing/lifecycle emails, distinct from the transactional donation-receipt family) — numbered step cards, an amber-accented pull-quote block, icon-tile action rows, and a dark (#20242B) footer with logo/address/social. Used to add `QuoteBlock`, `StepCard`, `IconStepRow`, `SignOff`, `DarkFooter` to `ui_kits/marketing-email/EmailParts.jsx` and a third template (`Welcome`) to that kit.
- **ISM - Sojourner Media Kit.pdf**: print/editorial typography reference; not yet mined page-by-page.
- **Uploads**: brand colour/pattern sheets, logos incl. dot.Bible lockups (SVG), 5 typefaces, icon set (Material-style + custom line icons), social/email/print creative comps, a donor letter, and several PDF decks/brochures (CFNI deck, TAP deck, Impact Report, Prospectus, Partnership Guide, Media Kit, postcards).

## Products represented
1. **dot.Bible** — the mobile Bible app (reading, audio, guided studies).
2. **Marketing site / ism.bible** — donor & partner-facing website.
3. **Lifecycle email** — re-engagement, profile-completion, transactional receipt templates.
4. **Social** — Instagram-style grid creative.
5. **Amazon retail creative** — product listing images for the printed Bible, in 21 languages.
6. **Print** — TAP card holders/postcards, donor letters, brochures, decks.


## Index
- `tokens.json` → `tokens.css`: the token source (colour, type, spacing, radius, shadow, gradient, layout). Use only these names.
- `components/bundle.css`: the class layer for every component (shared base classes plus one prefixed chunk per group).
- `components/bundle.js`: React components on `window.ISMDesignSystem_106e83` (Button, Badge, Card, ListRow, Input, Divider, AccentBar, Footer, SiteHeader).
- `components/<Comp>/`: `README.md` (rules), `preview.html` (live specimen), and `<Comp>.d.ts` for the React ones. Sources in `components/src/`.
- `tokens/`: `colors.css` (`--gradient-atmosphere-dark`), `typography.css` (the `--text-*` shorthands), `logos.css` (logo URL properties), `all.css` (imports everything for a plain HTML page).
- `fonts/`: Inter, Lora, Procerus, Neue Power, Miss Noteworthy.
- `assets/`: `logos/`, `icons/`, `patterns/`, `imagery/`, each with a README of usage notes.
- `ui_kits/`: dot.Bible app, marketing email, marketing site recreations.
- `templates/`: deck, brochure and impact report templates.
- `archived/`: superseded files moved aside during the 2026 clean-up (old card pages, prompt notes, spacing.css, migration notes). Reference only.

## Components
79 components, grouped as they appear in the catalogue. Each folder's README holds the rules; build from those, not from screenshots.

- **Brand:** Logos, Iconography
- **Actions:** Button, IconButton, Chip, Link, Badge, Eyebrow
- **Cards & media:** Card
- **Data display:** Divider, AccentBar, ListRow, Table, Avatar, StatTile, Quote, DescriptionList, Accordion
- **Forms:** Input, SearchField, Select, Combobox, Checkbox, Radio, Switch, SegmentedControl, DatePicker, FileUpload, PhoneInput, MultiSelect, FormLayout, InlineSubscribe
- **Feedback:** Alert, Toast, Modal, Tooltip, Loader, Progress, EmptyState
- **Navigation:** SiteHeader, Footer, Breadcrumbs, Tabs, Pagination, AnchorNav, BackToTop, LanguageSwitcher, CookieBanner, SkipLink
- **Patterns:** Hero, PageIntro, SplitSection, NumberedList, CtaBand, CenteredCta
- **Scripture:** VerseBlock, ReadingView, BookPicker, AudioPlayer, BibleCard, LanguageRow, QrShare
- **Ministry:** StoreBadges, AppBanner, DonationWidget, NetworkMap, StationCard, PartnerCard, VideoPlayer, EventCard, NewsletterCard
- **App UI:** AppBar, TabBar, BottomSheet, SettingsRow, SearchResults, DownloadState, Fab, AppHomeScreen

The library was ported from the ISM website component library (the "ISM Main Website" canvas), which is the approved visual source.

## How to consume
- **Any web page or app:** load `tokens.css`, then `components/bundle.css`. Use the classes shown in each component's README. Add `components/bundle.js` (after React 18 and ReactDOM 18) only when you want the React components.
- **Plain HTML in this repo** (ui_kits, cards): link `tokens/all.css`.
- **Class prefixes** keep groups apart: shared base classes have no prefix (`.btn`, `.card`, `.input`, `.chip`, `.alert`, `.badge`, `.eyebrow`, `.h1`–`.h4`); group classes use `cr-` core, `fm-` forms, `fb-` feedback, `nv-` navigation, `dp-` data & patterns, `sx-` scripture, `mn-` ministry, `ap-` app UI.

## Tokens (v3 summary)
- **Colour:** brand `--horizon-blue` #046DE3 (hover `--horizon-blue-dim`, light `--sky-blue`, on dark `--blue-on-dark`, tints `--blue-tint` / `--blue-tint-line`); accents `--gradient-violet`, `--gradient-gold`, `--gradient-peach`, `--violet-ink`, `--violet-tint`, `--gold-tint`, `--leather-gold`; neutrals `--black`, `--charcoal-900/800/700`, `--gray-700…100`, `--gray-placeholder`, `--off-white`, `--white`.
- **Status:** `--success`, `--error`, `--warning`, `--info`, each with `-bg` and `-line`; `--success-on-dark`, `--error-on-dark`, `--error-field-bg`. `--live` (#e5484d) is only for on-air indicators.
- **Gradients:** `--gradient-signature` (blue → violet → gold glow), `--gradient-line` (hairlines, borders, progress), `--gradient-marker` (highlight behind a key word), `--gradient-signature-soft`.
- **Radius:** `--radius-xs` 4, `-sm` 8, `-md` 12 (fields), `-ml` 16, `-lg` 20 (cards, panels), `-xl` 28, `-pill` (buttons, chips).
- **Shadow:** `--shadow-card-light`, `--shadow-lift`, `--shadow-overlay`, `--shadow-card-dark`, `--shadow-focus`.
- **Layout:** `--frame-max` 1280, `--container-max` 1200, `--gutter`, `--measure-reading`, `--measure-scripture`, `--breakpoint-mobile`, `--breakpoint-desktop`, `--tap-target` 44px.
- **Type:** `--font-sans` (Inter with Noto Ethiopic, Myanmar and Naskh Arabic fallbacks), `--font-serif` (Lora). `.h1` is weight 700; `.h2`–`.h4` and UI labels are 600. Eyebrows: 12px, 600, uppercase, `--eyebrow-tracking` 0.2em. Overlines: `--overline-tracking` 0.06em.

> Full v3 token set (z-index, motion, opacity, size, per-script line heights) lives in `tokens/tokens.json`; written rules in `rules/`.

## Building rules
- **One Horizon Blue primary per group.** Every other action in that group is secondary, outline, light or ghost.
- **Icon direction:** down caret ⌄ = opens or expands here; diagonal ↗ = goes to another page; right chevron › = drills into an app screen; → = primary "continue" only.
- **Counts and notification dots are Horizon Blue.** Red (`--error`) means an error, nothing else. `--live` is only for on-air.
- **Status colours** appear only with a status message (alerts, toasts, field errors, badges) and always with text, never colour alone.
- **Tap targets** are at least 44px. Focus is always visible: `outline: 2px solid var(--horizon-blue); outline-offset: 2px; box-shadow: var(--shadow-focus)`.
- **Type roles:** Inter for all UI; Lora only for scripture and quotations. Procerus, Neue Power and Miss Noteworthy are print and campaign faces only, never in product UI.
- **Multilingual:** write scripture references in full ("John 3:16"); verse numbers are small blue superscripts. Amharic, Burmese and other scripts rely on the Noto fallbacks in `--font-sans`; set `lang` on the element. For Arabic, Urdu and Farsi set `dir="rtl"` and mirror directional icons (not ↗ or media controls).
- **Surfaces:** light sections are `--white` cards on `--off-white`; dark sections are `--black` or `--charcoal-900` with white text and `--blue-on-dark` links.
- **Sample data** in previews (counts, dates, prices) is illustrative. Never ship invented numbers; use real figures or a `[ # ]` placeholder.

## CONTENT FUNDAMENTALS
- **Voice**: clear, bold, hopeful, human, mission-driven — reads like a guide, not a corporation or a traditional ministry. From the donor letter: *"That's why ISM exists—to help people encounter Jesus through Scripture—in the language they understand, through ministries they know and trust."*
- **Person**: mostly second-person direct address in UI ("Start your first Bible journey today!", "Share the Bible with a Friend") and warm first-person-plural in donor copy ("We partner with...", "It is a joy to have you with us").
- **Casing**: sentence case for headlines and body; UPPERCASE + wide letter-spacing reserved for small eyebrow tags only ("TRENDING", "YOU'RE ALMOST DONE!").
- **Numbers as proof points**: used sparingly and concretely, never decorative — "47 million immigrants," "450+ Languages," "One Bible."
- **CTAs**: short, verb-first, often paired with a ↗ or ⬇ glyph — "Get Started ↗", "Browse All", "Download the App ⬇", "Complete Your Profile".
- **Scripture citations**: referenced plainly and sparingly (e.g. "Matt. 28:19-20") — never large ornamental block quotes.
- **Emoji**: none observed. Iconography carries the tone instead.
- **Vibe**: technology-forward and editorial rather than devotional-decorative — copy leads with the human/spiritual outcome, then the technology that delivers it.

## VISUAL FOUNDATIONS
- **Colour**: primarily deep black (`#000`) / charcoal (`#161819`) sections alternating with clean white/off-white sections. Horizon Blue `#046DE3` is the one recurring action colour (links, primary buttons, progress bars). A signature gradient — blue → violet → warm gold/peach — appears as atmospheric glows, borders, and italic-accent type; it is used as a light, luminous wash, never as a loud all-over background.
- **Type**: Inter for everything functional — Bold (700) for the h1, SemiBold (600) for other headlines, buttons, nav, eyebrows; Regular (400) for body/support copy. Lora (serif, incl. italic) appears editorially for scripture-title treatments (e.g. book cover mockups). Procerus, Neue Power and Miss Noteworthy are decorative/display faces used sparingly as accents — mainly social media, occasionally print/web — never for body copy or primary UI type.
- **Spacing**: generous, editorial whitespace; base 4px scale (4/8/12/16/24/32/48/64/96/128).
- **Backgrounds**: full-bleed photography with a dark gradient overlay for text legibility is the default for hero/card imagery; flat colour sections (black or off-white) separate content blocks; a fine dot/diamond half-tone pattern and thin concentric-circle marks are the recurring textural motif (see `assets/patterns/`), used small and in corners — never as a loud all-over texture.
- **Gradients**: soft, luminous, diagonal (120°) blue→violet→gold; used behind hero type, on donor-letter corners, and as a glow rather than a hard-edged shape.
- **Corners & cards**: cards use `--radius-lg` (20px), fields `--radius-md` (12px), buttons and chips `--radius-pill`; a 1px hairline border (`rgba(255,255,255,.16)` on dark / `rgba(0,0,0,.12)` on light), and a soft outer shadow on light surfaces; no left-border-accent cards.
- **Buttons**: pill / fully-rounded, solid Horizon Blue on light or as an outlined stroke on dark photography; compact padding, no drop shadow.
- **Eyebrow labels**: 12px, 600, uppercase, 0.2em tracking, in a 1px blue square-cornered box (`.eyebrow`), `--horizon-blue-dim` text on light and `--blue-on-dark` on dark; used to caption a section before its headline.
- **Hover/press**: hover darkens a solid blue button one step, or adds a faint white/black tint fill to an outline button; no scale/bounce transforms observed — motion is restrained.
- **Imagery tone**: warm-to-neutral real photography of people, phones, books and global settings; black-and-white treatments used for a few emotive/editorial moments (see Instagram grid). Avoid generic staged "church stock" imagery.
- **Iconography**: see below.
- **Layout**: asymmetric marketing sections; centered, single-column mobile app screens; alternating dark/light section rhythm is the primary structuring device across email and site.

## ICONOGRAPHY
Two icon families are in the source material, both copied verbatim into `assets/icons/` (never redrawn):
1. A **custom outline set** (Bible, Radio, Satellite, Globe, TV, SmartPhone, Audio, Video, Download, Search, Home, Email, Phone, SMS, Log In, Location, Text, Socials, Analytics, Epub) — the primary set for product/ministry surfaces (reach, distribution, devices).
2. **Google Material Symbols** (outlined, 24dp, weight 400) for supporting concepts — church, translate, language, handshake, explore, folded-hands, bar-chart, qr-code, etc. — recognizable by their `_24dp_1F1F1F_FILL0_wght400_GRAD0_opsz24` filenames.
No icon font or sprite sheet was provided; icons are flat SVGs, used at small-to-medium sizes, monochrome black ink (as files they do not follow `currentColor`; invert on dark). Interface controls use inline line icons instead; see the Iconography component. No emoji or Unicode-glyph icons observed. Note: the two families render at different visual weights when mixed at the same size — the custom set (1) is thinner/more delicate; Material Symbols (2) is bolder and more uniform. Don't mix families within one row of UI at the same scale.

## PRINT & EDITORIAL (gold standard)
The **ISM Partnership Guide** and **Donor Impact In Motion** brochures (8.5×11, in `uploads/`) are the canonical reference for print. `templates/ism-brochure/IsmBrochure.dc.html` reproduces that system across five pages (cover, Who We Are, The Problem, Ministry Streams, Next Steps). Rules:
- **Page** 8.5×11 portrait, ~0.6in margins, white stock; the cover and closing page invert to `#0E1013`.
- **Boxed eyebrow + rule**: uppercase, 11px, `0.2em` tracking, Horizon-blue text inside a 1px blue **rectangle** (never a pill), with a 1px blue rule running from the box to the page edge. This opens every section.
- **Headline**: Inter SemiBold (600), 31–54px, `-0.02em`, near-black on white / white on dark. A key word gets a **gradient marker highlight** (`linear-gradient(90deg,rgba(75,110,224,.45),rgba(143,125,224,.45))`) behind it — the print equivalent of the deck's gradient-clipped word.
- **Blue italic subline** under the headline, bold italic `#1a7fe8` — same signature pair as the decks.
- **Body**: 12.5px/1.65, **justified with hyphenation**, two columns. Bold lead-ins inside bullets (`Language barriers that…`).
- **Pull quote**: right-aligned, 23px SemiBold, one phrase in violet.
- **Icon medallions**: 62px gradient circles (blue, deep blue, gold, lavender) with a white line icon and a thin white halo ring, sitting above each stream title.
- **Full-bleed gradient band** across the page foot (blue→violet→peach) carrying one centred white statement — the standard section closer.
- **Full-bleed photography** occupies a whole column or a page-foot band, never a floated inset.
- **Boilerplate footer line** on the closing page: `International Scripture Ministries, Inc. | PO Box 24253 Boone, IA 50950 | +1 (833) 60-24253 | ISM.Bible`, 10px, low-emphasis. Small white iSM mark bottom-right of every page.
- **Numbered next steps** are blue bold-italic (`1. Meet with Our Team`), body justified beneath.

## PRINT & EDITORIAL (from the Sojourner Media Kit)
- **Numbered section cards**: every kit section is tagged with a two-digit index (`01`, `02`…) beside its title — the same numbered-badge pattern as the website's resource cards.
- **All-caps, letter-spaced micro-labels used liberally**: "A T A G L A N C E", "K I T S E C T I O N S", "D I G I T A L A C C E S S L I N K" — wide-tracked uppercase eyebrows caption nearly every module, not just hero sections.
- **QR + direct link per section**: each module pairs a QR code with a plain-text URL (`ism.bible/sojourner-media-...`) — practical, not decorative.
- **Consistent footer boilerplate line** on every page: `International Scripture Ministries. Inc. | PO Box 24253 Boone, IA 50950 | +1 (833) 60-24253 | ISM.Bible` — small, centered or left-aligned, low-emphasis.
- **"Who We Are" / "About Us" self-descriptions repeat verbatim** across pieces: *"a FaithTech organization dedicated to delivering unhindered access to the Bible so every person can know Christ through God's Word."* — treat this as the canonical boilerplate line for print/media-kit contexts.

## No logo was invented
Real logos **were** provided (`assets/logos/`): the ISM institutional lockup (Full Logo Black/White, Logo Black/White — "iSM." wordmark + "International Scripture Ministries"), and separate **dot.Bible** logos (Full Logo + Icon, Black/White) used specifically for the Bible app, print Bibles, ePub Bibles, and on-demand audio/streaming surfaces. Use the SVGs as-is; do not redraw. Note: several of the "White" logo SVGs ship with an empty `.cls-1` style class (they render black regardless of filename) — apply a `filter: brightness(0) invert(1)` to the Black variant when you need a white mark on a dark surface, as done in the Footer and SiteHeader components.

### Logo path in a bound design system
The 8 logo SVGs ship with the bundle and resolve at **`_ds/<this-system>/assets/logos/<file>.svg`** inside a project that binds this design system (files: `Full Logo Black.svg`, `Full Logo White.svg`, `Logo Black.svg`, `Logo White.svg`, `dot.bible Full Logo Black.svg`, `dot.bible Full Logo White.svg`, `dot.bible Icon Black.svg`, `dot.bible Icon White.svg`). They are pulled into the shipped closure via `tokens/logos.css`, which also exposes each as a CSS custom property (`--logo-full-black`, `--logo-mark-white`, `--logo-dotbible-full-black`, …) for use as a `background-image`/`mask`. **Reminder (bears repeating): the "White" SVGs render BLACK** — for a white mark on a dark surface, use the Black variant with `filter: brightness(0) invert(1)`, not the White file.

## Caveats
- This project was **restored from a flat upload dump** of the original design system; the folder structure above was reconstructed from `_ds_manifest.json`. Two files could not be recovered because their names collided in the dump (`ui_kits/dot-bible-app/index.html` and `ui_kits/marketing-email/index.html`) and were **re-authored** from the surviving `HomeScreen.jsx` / `ios-frame.jsx` / `EmailParts.jsx` — they follow the original card viewports (420x860, 960x640) but are not byte-identical to the originals. The email kit's third template (`Welcome`) from the original kit was not recovered; only Re-engagement and Receipt are present.
- The bundle namespace is `ISMDesignSystem_106e83`.
- The React bundle was patched in place (gradient, greys, nav labels, logo) rather than recompiled from `components/src/`; the sources carry the same patches.
- "Website widgets.fig" and "Email Designs.fig" have now been attached twice but both resolve to an empty placeholder VFS — their component/token/text-style inventories are still not imported. This is the biggest open gap.
- The Sojourner Media Kit PDF was mined for text/structure (see PRINT & EDITORIAL below), but page-image rendering timed out in this environment, so exact print point-sizes/leading couldn't be measured pixel-for-pixel — the layout patterns below are read from the text flow, not measured from rendered pages.
- dot.Bible logo lockups are in `assets/logos/` — used for the Bible app, print Bibles, ePub Bibles, and on-demand audio/streaming surfaces (distinct from the ISM institutional mark).
- Donation-receipt-style emails (transactional) vs. the lighter marketing emails from Email Designs.fig are two distinct email families — see Marketing Email vs. a future Transactional Email group once that Figma file is actually importable.

## DECK SYSTEM (gold standard)
The **TAP Deck v2** and **CFNI Presentation Deck 2026** PDFs (in `uploads/`; slide photography extracted into `assets/imagery/deck-*`) are the canonical reference for every ISM slide deck. `templates/cfni-tap-deck/CfniTapDeck.dc.html` reproduces that system slide-for-slide. Rules:
- **Canvas** 1920×1080. Slide field is near-black `#16191E` (not pure black); occasional light slides on `#f4f3f1` or a full-bleed gradient.
- **Anatomy**: bold white headline (66–76px, weight 700, `-0.02em`) with a **blue italic subtitle directly beneath it** (`#2A86F0`, italic, weight 700, 30–34px). This headline + blue-italic pair is the deck's signature and appears on nearly every content slide.
- **Left text column / right full-bleed photo**, split ~56/44. Photography bleeds to the slide edge and carries a blue→violet→peach gradient wash at its lower corner.
- **Gradient hairlines**: 1px `linear-gradient(90deg,#4b6ee0,#8f7de0,#f3b25a)` separating stacked label/description rows. Never a plain grey rule.
- **Dot mark**: a small 2–3 dot cluster (one outlined) sits above the headline in the top-left, echoing the `iSM` mark.
- **Body copy** 25–28px, `rgba(255,255,255,.86)` for lead paragraphs, `.62–.72` for supporting text. Bulleted lists use plain discs.
- **Numerals/stats** are **amber `#F3B25A`**, 96px+, in hairline-bordered `rgba(255,255,255,.03)` cards with 20px radius — amber is the stat colour, blue stays the action colour.
- **Icon chips**: 76–78px circles filled with a two-stop slice of the signature gradient, white icon inside (from `assets/icons/`).
- **Section dividers**: full-bleed brand gradient mesh (`assets/imagery/deck-bg-gradient-*.jpg`) with one centred headline, no body copy.
- **Gradient panel openers**: half-slide gradient card with a product name + italic tagline, photo on the other half, and a small gradient-bar + white-line accent at the bottom-left.
- **Closing slide**: “To Reach Billions, We Need **You**.” — one gradient-clipped word in the headline.
- **Logo**: small white `iSM` mark, bottom-right, ~58px, on every slide.
- **Never**: outlined eyebrow pills, centred body copy, drop shadows on cards, more than one accent colour per slide.

## Templates
- `ui_kits/marketing-email/donor-newsletter/` — four production **Braze donor-engagement email** templates (not DC): light-only with `[data-ogsc]` dark-mode swaps, `@supports`-gated gradient hero word, `[PLACEHOLDER …]` copy holes, `show_*` module toggles, and the shared `HTML-ISM-Dark-Footer` block stubbed in. Keep as static HTML — do not convert to `.dc.html`.
- `templates/ism-impact-report/` — 8.5 × 11 in print magazine / impact report (11 pages, 0.125 in bleed, print-ready PDF out of the box): full-bleed dark cover with gradient italic accent, alternating dark/off-white page rhythm, two-digit numbered section eyebrows with hairline rules, 4-up gradient stat rows, `[ # ]` metric placeholders, drag-and-drop image slots, black inset callout panels, handwritten sign-off, and a back-cover CTA with QR block. Entry: `IsmImpactReport.dc.html`. Unconfirmed figures stay as literal `[ # ]` / `TBD` placeholders rather than invented numbers.
- `templates/ism-brochure/` — the 8.5×11 magazine-style print brochure template (5 pages), built on `doc-page` so it prints/exports to PDF as-is. See PRINT & EDITORIAL above.
- `templates/cfni-tap-deck/` — the ISM presentation deck template (11 archetype slides: cover, split text+photo, labeled benefits, process steps, light slide, gradient divider, gradient panel opener, stats, testimonial, icon grid, closing CTA), rebuilt directly from the TAP v2 and CFNI 2026 decks. See DECK SYSTEM above.

## Ask
Please re-attach **Website widgets.fig** and **Email Designs.fig** one more time — both currently resolve to an unrelated empty file, so their real component/token/text-style inventories still haven't come through.

## Files
This system was moved from the standalone Design System app on 2026-10-08 and reorganised into the files layout in October 2026. Superseded files (old `*.card.html` specimens, `*.prompt.md` notes, `tokens/spacing.css`, the root `styles.css`, the import prompt, the migration notes and markdown uploads) sit under `archived/` at their old paths. Nothing was deleted except the generated `manifest.json` and `migration-map.json`.
