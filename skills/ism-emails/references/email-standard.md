# ISM Email Design & Copy Standard (v1.1), The Baseline

This is the governing standard for every marketing and lifecycle email ISM and THRU the BIBLE (TTB) sends. It exists to lift click-through and response ratios while protecting readability, accessibility, and deliverability for a global partner base. Every email produced by this skill MUST comply with every section and pass the Pre-Send Checklist.

Core principle: **Reserve color for action. Keep reading copy high-contrast. Give every email one clear next step.**

Brand Manager / owner of this standard: Curt Branscombe, Director of Digital Marketing (curt@ism.bible).

---

## 1. Backgrounds & Text

- **No white text on black backgrounds for live reading copy.** It fails partners with dyslexia or astigmatism and triggers spam-filter and inversion issues.
- Body copy sits on **Celestial White `#F4F4F6`** or white, with **Solar Black `#000000`** text.
- Dark headers are allowed **only as a flattened image** (photo, logo, title baked in), never as live text a client can invert. Troy prefers light variants; do not produce dark-mode design variants.
- Never use pure black or pure white as a live-text background. Use them for text and bold headers as the brand palette intends.

## 2. Color = Action Only

- **Do not color the greeting or sign-off blue.** Make "Hi Friend" and "'til all have heard" **bold black**.
- **Horizon Blue `#046DE3`** is reserved for buttons and text links so partners instantly know what is clickable.
- Use **Radiant Dawn `#E7B650`** only for accents and dividers, never for body text.
- Emphasize with **weight (bold)**, not color.

## 3. Subject & Preheader

- Subject line **under ~45 characters / 6-10 words.** Lead with the specific news, number, or a question.
- **Always write preheader text** that complements the subject, never repeats it. Empty preheaders waste inbox space.
- Keep **the person** as the sender name (e.g. Troy Carl). Do not spend subject characters on "From the President."
- A/B test subject lines only when each variant reaches **1,000+ recipients**.

## 4. One CTA, Above the Fold

- **One primary CTA per email**, visually distinct in Horizon Blue.
- Place the primary CTA **in the first screen on mobile**; repeat the same CTA lower down if the email is long.
- Button copy is **first-person and specific**: "Yes, I'll Pray for the Team," not "Submit."
- Every triggered / thank-you email still needs one clear next step; a giving ask stays a **secondary text link**.

## 5. Personalization, Voice & Accessibility

- Render the partner's **first name** where available; default to **"Friend"** only when missing.
- Voice is our **Mission-Driven Guide**: bold, clear, compassionate, seasoned with grace.
- Write **mobile-first**: 55%+ of opens are on phones. Verify the hero, headline, and first CTA fit one phone screen.
- Body type: **Nunito at 14-16px**; headings in **Poppins bold**; quotes in **Lora italic**.
- Every image needs **accurate alt text** that matches its visible label.
- Use **live text**, not text baked into images, for all reading copy.

## 6. Approved Email Palette

| Name | Hex | Use |
|------|-----|-----|
| Solar Black | `#000000` | Text & bold headers |
| Celestial White | `#F4F4F6` | Body background |
| Horizon Blue | `#046DE3` | Buttons & links only |
| Radiant Dawn | `#E7B650` | Accents & dividers |
| Steadfast Slate | `#41484E` | Muted structure |
| Ocean Mist | `#A3D7FF` | Secondary buttons |

## 7. Pre-Send Checklist (every email must pass all)

- [ ] Body copy is dark text on light background (no white-on-black)
- [ ] Greeting & sign-off are bold black, not blue
- [ ] Subject under ~45 characters; preheader written
- [ ] First name renders; "Friend" fallback set
- [ ] One primary CTA, visible in the first phone screen
- [ ] Button copy is first-person and specific
- [ ] Every image has accurate alt text
- [ ] Tested in light & dark mode on mobile before send
- [ ] Signature reads 'til all have heard, / Troy Carl / President
- [ ] Footer lists 1-833-60-BIBLE (24253) | contact@ism.bible exactly once
- [ ] Built for the correct delivery route (§9) and under 100 KB total

## 8. Signature & Contact Canon (v1.1)

- **Closing, three lines, bold black:**
  `'til all have heard,`
  `Troy Carl`
  `President`
- Title is simply **President**. Never add "God Bless You" as a closing.
- If "'til all have heard" does not translate well, use the target-language equivalent of **"Until everyone has heard."**
- **Footer contact (list once, never twice):** `1-833-60-BIBLE (24253) | contact@ism.bible`.
- Retired, never use: 1-833-65-BIBLE, 1-800-65-BIBLE, TTB.org as contact, Biblebus@ttb.org.
- The vanity phone format above overrides the general period-separated phone style in the brand guidelines.

## 9. Delivery Route Rules (v1.1)

- **ESP route (Braze, Postmark, Resend, or similar):** responsive 600px template, hosted HTTPS images, media queries allowed, real unsubscribe and mailing address required.
- **Gmail paste route (Troy's team and partner emails composed in Chrome and pasted into Gmail):** Gmail deletes `<style>` blocks, media queries, and classes, and bakes the browser window width into any full-width wrapper. Therefore: every style inline, no stylesheet, no classes, no grey outer shell, root table `width:100%;max-width:420px`, images embedded as compressed base64, audio as tappable Play links (never HTML5 players), no `overflow:hidden` wrappers.
- **Size:** keep the whole message under ~100 KB; Gmail clips at about 102 KB and hides content behind "View entire message."
- For recurring paste-delivered emails, recommend moving to an ESP once the ism.bible domain is verified, so the layout can be fully fluid on desktop and phone.

---

Tagline for footer / context: *"Making Scripture accessible to all nations, anywhere."*
Organization: International Scripture Ministries · ISM.Bible
