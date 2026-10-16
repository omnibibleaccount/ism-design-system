---
name: ism-emails
description: "Build ISM and THRU the BIBLE emails as brand-compliant, mobile-first HTML plus plain text and a copy spec: appeals, thank-yous, impact, newsletters, prayer, welcome, invitations, re-engagement. For partner copy signed by Troy and/or Cynthia, also use ism-letter-skill for the words. Not for web pages, social posts, or print letters."
metadata:
  author: Troy Carl / International Scripture Ministries
  version: '2.1'
  baseline: ISM Email Design & Copy Standard v1.2
---

# ISM Email Builder

Produce ISM and THRU the BIBLE (TTB) emails that convert, render perfectly on a phone, and pass the ISM Email Design & Copy Standard on every send.

## Standing Rules (never violate)

- Content consistent with biblical, evangelical, Charismatic/Word of Faith doctrine, seasoned with grace, from a Christian global worldview.
- No em dashes anywhere. En dash only for numeric or time ranges (7–8:30 PM).
- No emojis unless the user explicitly asks.
- No AI footprints: no hidden characters, zero-width or invisible spacers, watermarks, or AI-authorship comments.
- Copy reads like Troy typed it himself: warm, plain, personal. Never corporate, stiff, or formulaic.
- Never fabricate a testimony, name, place, or number. Use a marked placeholder such as `{IMPACT_NUMBER}` and list it for the user.

## Canon (exact, every email)

- Signature, three lines, bold black: `'til all have heard,` / `Troy Carl` / `President`. Never add "God Bless You." In translated emails, render the closing as the target-language equivalent of "Until everyone has heard."
- Footer contact, listed once: `1-833-60-BIBLE (24253) | contact@ism.bible`. Never use the legacy 1-833-65 or 1-800-65 numbers, TTB.org, or Biblebus@ttb.org.
- Inbox sender name is the person (Troy Carl). Light-mode designs only; do not produce dark variants.
- Footer: email newsletters use the approved dark newsletter footer (`assets/templates/newsletter-footer.html`, built into `email-template-newsletter.html`); every other email uses the light footer already in its template. Never invent or restyle a footer.

## Workflow

1. **Load the rules.** Read `references/email-standard.md` (wins on any email-specific conflict), `references/brand-guidelines.md`, `references/email-types-playbook.md`, and `references/html-build-guide.md`.
2. **Clarify once.** Unless the prompt already answers them, ask one grouped question: audience, the one action, primary CTA URL, brand (ISM, TTB, or both), and delivery route (ESP such as Braze, Postmark, or Resend, or Gmail paste). Default sender is Troy Carl, President.
3. **Classify.** Use the playbook decision table. The primary CTA sets the type; any competing ask becomes a secondary text link. State the type and why in one line, then proceed.
4. **Gather sources.** Pull current testimonies (ECMS Stories, app-user stories first), Drive/Docs reports and prior emails, Gmail and Calendar hooks, GA4/Search Console signals, and meeting transcripts. Record each source for the copy spec.
5. **Draft.** Follow the type structure and Universal Anatomy. Subject under 45 characters, preheader that adds new information, one first-person CTA in the first phone screen, Scripture anchor where the type calls for it. For donor or partner copy signed by Troy and/or Cynthia (appeals, thank-yous, sponsor updates), apply `ism-letter-skill` non-negotiables and its voice lint to the words; this skill's canon still wins on signature, footer, and layout.
6. **Build per route.** Read the route section of `references/html-build-guide.md`, then fill the matching template:
   - ESP newsletter (donor or partner newsletter, impact or partner update, recurring roundup): `assets/templates/email-template-newsletter.html` (same as the ESP template, with the dark newsletter footer).
   - ESP send, any other type: `assets/templates/email-template.html` (responsive, hosted HTTPS images, light footer).
   - Gmail paste or team email: `assets/templates/email-template-gmail-paste.html` (inline only, 420px root, embedded images). Embed images with `python3 scripts/embed_images.py {file}.html`.
   Also produce `{slug}-{brand}.txt` and `{slug}-copy-spec.md` from `assets/templates/copy-spec-template.md`. For "both," build separate self-contained ISM and TTB versions.
7. **QA gate.** Run `python3 scripts/qa_scan.py {file}.html --route {esp|paste}` on every HTML and `.txt` file and fix every FAIL. Then render screenshots at 320, 390, and 430px wide (paste route also at 1440px) and confirm no horizontal overflow, no wrapped or clipped text, readable contrast, and the CTA visible in the first screen. Finish with `references/qa-checklist.md`. Done when the scan prints PASS and every checklist item is checked.
8. **Deliver.** Share HTML, plain text, copy spec, and any logo files the user must host. Summarize the type, why it will perform, and every placeholder left to fill. Offer a Gmail draft; never send or save external drafts without the user's confirmation.

## Assets

- `assets/logos/Full-Logo-Black-email-360.png`: email-ready dot.Bible wordmark (360px, flattened on white). Default header on both routes.
- `assets/logos/Full-Logo-Black.png/.svg`, `Full-Logo-White.png/.svg`, `ISM-Icon.png/.svg`: masters for light, dark-image, and compact placements.
- `assets/logos/ISM-Logo-White-on-footer-360.png`: white ISM logo flattened on `#20242B`, for the newsletter footer only.
- `assets/logos/ISM-Logo-highres.jpg`, `ISM-Pub-Logo-highres.jpg`: high-res print masters; downscale before email use. Use the Publishing logo for ISM Publishing emails.

## Palette

Solar Black `#000000` text · Celestial White `#F4F4F6` or white backgrounds · Horizon Blue `#046DE3` buttons and links only · Radiant Dawn `#E7B650` accents and dividers only · Steadfast Slate `#41484E` muted text · Ocean Mist `#A3D7FF` secondary buttons.

## Guardrails

- One primary CTA per email. Never color the greeting or sign-off blue. Never live white-on-black reading copy (the newsletter footer is the one approved dark block, and it holds no reading copy).
- Recommend A/B subject tests only for lists of 1,000+ recipients.
