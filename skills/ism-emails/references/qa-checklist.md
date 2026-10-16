# ISM Email QA Checklist (v2.0), Run Before Delivery

Run `python3 scripts/qa_scan.py {files} --route {esp|paste}` first; it automates the em dash, emoji, hidden-character, canon, alt-text, size, and route checks. Then run this full checklist on every email (each brand version) before presenting it to the user. If any item fails, fix it before delivery. This is the final gate that protects open rate, click-through, response, and deliverability.

## A. Pre-Send Checklist (from the standard, all required)

- [ ] Body copy is dark text on light background (no white-on-black live reading copy)
- [ ] Greeting and sign-off are bold black, not blue
- [ ] Subject under ~45 characters; preheader written and complements (not repeats) the subject
- [ ] First name token renders; "Friend" fallback set
- [ ] One primary CTA, visible in the first phone screen (first ~600px)
- [ ] Button copy is first-person and specific (no "Submit," "Click here," "Learn more")
- [ ] Every image has accurate alt text matching its visible label
- [ ] Renders correctly in light and dark mode on mobile (verify contrast, logo visibility)

## B. Color & Brand

- [ ] Horizon Blue `#046DE3` used only for buttons/links
- [ ] Radiant Dawn `#E7B650` used only for accents/dividers, never body text
- [ ] Palette limited to the Approved Email Palette
- [ ] Correct logo variant for background (black wordmark on light, white on dark, icon for compact)
- [ ] Emphasis via bold weight, not color

## C. Typography

- [ ] Headings Poppins bold (with Arial/Helvetica fallback)
- [ ] Body Nunito 14-16px (with Arial fallback)
- [ ] Quotes Lora italic (with Georgia fallback)
- [ ] Single column, 44px+ tap targets; ESP route 600px max, paste route root locked to 420px

## D. Editorial Style (ISM)

- [ ] Active voice
- [ ] Bible references spelled out (Revelation 1:1, not Rev. 1:1)
- [ ] Deity pronouns capitalized (He, Him, His); Scripture, Gospel, New Testament capitalized
- [ ] Oxford comma; one space after periods; commas/periods inside quotes
- [ ] Numbers: spell out one through nine, numerals for 10+
- [ ] Dates: "Tuesday, March 9" (no suffixes/year unless needed); time AM/PM caps, ranges with en dash
- [ ] Email/URLs italicized in body, no "www," not underlined
- [ ] Exclamation points sparing (max two in a row)
- [ ] "Dot Bible" in copy, "dot.Bible" for domain/UI/URLs
- [ ] No all caps in reading copy

## E. Voice

- [ ] Reads like Troy typed it himself: warm, plain, personal; no corporate, stiff, or formulaic phrasing
- [ ] Reads as Mission-Driven Guide: bold, clear, compassionate, seasoned with grace
- [ ] Inspires hope; concrete and specific over vague
- [ ] Culturally sensitive; no untranslatable slang/jargon/metaphor
- [ ] Doctrinally consistent (biblical, evangelical, seasoned with grace)

## F. Structure & Conversion

- [ ] Matches the correct email type playbook structure
- [ ] Leads with the most compelling fact/number/story
- [ ] Most compelling content and CTA above the fold on mobile
- [ ] Secondary goals are text links, not competing buttons
- [ ] Scripture anchor included where the type calls for it
- [ ] Clear next step even in thank-you/triggered emails

## F2. Canon & Route (v1.1 standard)

- [ ] Signature is three lines: 'til all have heard, / Troy Carl / President (no "God Bless You")
- [ ] Footer lists 1-833-60-BIBLE (24253) | contact@ism.bible once; no legacy 65-BIBLE, TTB.org, or Biblebus@ttb.org
- [ ] Light-mode design only; no dark variant produced
- [ ] Correct template for the delivery route
- [ ] Paste route: no `<style>`, classes, or media queries; no grey shell; images embedded; audio as Play links; under 100 KB
- [ ] ESP route: hosted HTTPS images, unsubscribe and mailing address present
- [ ] Rendered at 320, 390, and 430px (paste route also 1440px) with no horizontal scroll and CTA in the first screen
- [ ] `scripts/qa_scan.py` printed PASS

## G. Cleanliness (user standing rules)

- [ ] No em dashes anywhere
- [ ] No emojis (unless the user explicitly asked)
- [ ] No hidden characters, zero-width spaces, invisible watermarks, or AI footprints
- [ ] No AI-authorship comments in the HTML
- [ ] Clean, valid, human-looking HTML

## H. Deliverables Complete

- [ ] Ready-to-send HTML file(s)
- [ ] Plain-text alternative file(s)
- [ ] Copy/design spec document
- [ ] Logo/image files bundled for hosting (ESP route) or embedded (paste route)
- [ ] Both ISM and TTB versions produced if requested
- [ ] Sourcing noted for any testimonial/impact/data claims used
