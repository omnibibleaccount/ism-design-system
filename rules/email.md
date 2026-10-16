# Email

**Source of truth: the ISM Email Design & Copy Standard v1.2, packaged as the skill [`skills/ism-emails/`](../skills/ism-emails/SKILL.md)** (owner: Curt Branscombe, Director of Digital Marketing). Build every ISM and THRU the BIBLE (TTB) email from that skill: its `SKILL.md` workflow, the references, the HTML templates and the QA scan. Troy Carl (President) requires strict adherence. For email the skill overrides everything else in this design system, including `tokens.json`, the web components and the older email kits. This page is the short form; when they differ, the skill wins. Machine-readable copy: `rules.json` under `applied.email`.

Hosted: `<base>/skills/ism-emails/` (templates at `<base>/skills/ism-emails/assets/templates/`). Download the whole skill as one file from `<base>/skills/ism-emails.zip`.

## Start from a template, never from scratch
| Route | When | Template |
|---|---|---|
| ESP newsletter | Donor or partner newsletter, impact or partner update, recurring roundup | `skills/ism-emails/assets/templates/email-template-newsletter.html`: the ESP template with the dark newsletter footer |
| ESP | Any other email through Braze, Postmark, Resend or another email service | `skills/ism-emails/assets/templates/email-template.html`: responsive, 600px max, hosted HTTPS images, light footer |
| Gmail paste | Troy or staff paste a rendered page into Gmail | `skills/ism-emails/assets/templates/email-template-gmail-paste.html`: every style inline, root `max-width:420px`, images embedded with `scripts/embed_images.py` |

## Footers
The footer is part of each template; use it exactly as provided and never write one.
- **Newsletters** end with the approved **dark newsletter footer** (`skills/ism-emails/assets/templates/newsletter-footer.html`, built into the newsletter template): `#20242B`, white ISM logo, Find a station and Download the app, Facebook, Instagram and YouTube, `International Scripture Ministries, Inc.` / `PO Box 24253, Boone, IA 50950` / `1-833-60-BIBLE (24253) | contact@ism.bible`, the subscription notice, and Manage preferences, Unsubscribe and Privacy. In Braze it is the shared content block `{{content_blocks.${HTML-ISM-Dark-Footer}}}`.
- **Every other email** keeps the light footer on `#F4F4F6` in its template: organisation name, tagline, the contact canon once, and on the ESP route the mailing address and unsubscribe link.
- The dark footer is for newsletters only. It holds no reading copy, so it does not break the dark-text-on-light rule.

## Non-negotiables
- Dark text on a light background. Body on Celestial White `#F4F4F6` or white with Solar Black `#000000` text. No live white-on-black reading copy; a dark header is allowed only as a flattened image, and the only dark block is the newsletter footer. Light-mode designs only; do not produce dark variants.
- Colour means action. Horizon Blue `#046DE3` for buttons and links only. Radiant Dawn `#E7B650` for accents and dividers only. Greeting and sign-off are bold black, never blue. Emphasise with weight, not colour.
- One primary CTA, Horizon Blue, first person and specific ("Yes, I'll Pray for the Team", never "Submit" or "Learn more"), visible in the first phone screen. A giving ask in a non-appeal email is a secondary text link.
- Subject under ~45 characters; a preheader that adds new information. Sender name is the person (Troy Carl).
- Signature, three lines, bold black: `'til all have heard,` / `Troy Carl` / `President`. Never "God Bless You".
- Footer contact, exactly once: `1-833-60-BIBLE (24253) | contact@ism.bible`. Retired, never use: 1-833-65-BIBLE, 1-800-65-BIBLE, TTB.org as contact, Biblebus@ttb.org.
- `{FirstName}` with a "Friend" fallback. Never fabricate a testimony, name, place or number: leave a marked placeholder such as `{IMPACT_NUMBER}` and list it.
- No em dashes (en dash only for ranges, 7–8:30 PM), no emojis unless asked, no hidden or zero-width characters, no AI-authorship comments.
- Whole message under ~100 KB (Gmail clips at about 102 KB).

## Type and palette (email only)
Email uses the brand-guideline fonts, not the web UI stack: headings Poppins bold, body Nunito 14–16px, quotes Lora italic, each with its fallback (`'Poppins', Arial, Helvetica, sans-serif`; `'Nunito', Arial, sans-serif`; `'Lora', Georgia, serif`). The paste route uses Arial throughout because Gmail drops web fonts.

| Name | Hex | Use |
|---|---|---|
| Solar Black | `#000000` | Text and bold headers |
| Celestial White | `#F4F4F6` | Body background |
| Horizon Blue | `#046DE3` | Buttons and links only |
| Radiant Dawn | `#E7B650` | Accents and dividers only |
| Steadfast Slate | `#41484E` | Muted structure, scripture text, footer |
| Ocean Mist | `#A3D7FF` | Secondary buttons (black text) |

## Structure
Classify by the one action (appeal, thank-you, impact, announcement, weekly update, prayer, welcome, event, re-engagement, recruitment) and follow that type in `skills/ism-emails/references/email-types-playbook.md`. Universal order: preheader, logo header, hero image or Poppins headline, bold greeting, short body paragraphs, primary CTA, optional Scripture in Lora italic (reference spelled out: Romans 10:17), three-line sign-off, footer.

## QA gate
Run `python3 skills/ism-emails/scripts/qa_scan.py <file>.html --route esp|paste` on every HTML and plain-text file until it prints PASS, render at 320, 390 and 430px (paste route also 1440px), then work through `skills/ism-emails/references/qa-checklist.md`. Deliver the HTML, a plain-text version and a copy spec.

## Superseded
The Braze donor-newsletter templates in `reference/ui-kits/marketing-email/donor-newsletter/` and the lifecycle kit `EmailParts.jsx` predate the standard: 650px, Inter, a gradient hero word, a cream Scripture band and abbreviated citations. Keep them for study only. Their dark footer lives on, standardised, as the newsletter footer in the skill; take it from there, not from these files.
