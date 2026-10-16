# ISM Email Copy & Design Spec, {EMAIL_TITLE}

**Brand version:** {ISM | THRU the BIBLE}
**Email type:** {type from playbook}
**Primary goal / one action:** {the single action this email drives}
**Audience:** {segment}
**Delivery route:** {ESP (Braze, Postmark, Resend) | Gmail paste}
**Recommended send:** {day/time rationale, if relevant}

---

## 1. Subject & Preheader

- **Subject (primary):** {under ~45 chars}, {char count}
- **Subject (A/B variant, only if list is 1,000+):** {variant}, {char count}
- **Recommended primary:** {A or B + one-line reason}
- **Preheader:** {35-90 chars, complements the subject}
- **Sender name:** {person, e.g., Troy Carl} · **Signature title:** President

## 2. Copy Blocks

- **Headline (Poppins bold):** {headline}
- **Greeting:** Hi {FirstName|Friend},
- **Body paragraph 1:** {lead with the most compelling fact/number/story}
- **Body paragraph 2:** {stakes / detail}
- **Body paragraph 3 (optional):** {proof point}
- **Primary CTA button (Horizon Blue, first-person):** {e.g., "Yes, I'll Pray for the Team"} → {CTA_URL}
- **Secondary text link (optional):** {e.g., soft giving ask} → {URL}
- **Scripture anchor (Lora italic):** "{quote}" {Reference spelled out}
- **Sign-off:** 'til all have heard, / Troy Carl / President
- **Footer contact:** 1-833-60-BIBLE (24253) | contact@ism.bible

## 3. Design Notes

- **Layout:** single column, mobile-first, {600px ESP | 420px paste root}. Above-the-fold: {what fits in first phone screen}.
- **Logo variant:** {Full-Logo-Black-email-360.png (default) | Full-Logo-White.png (dark image) | ISM-Icon.png (compact)}
- **Hero image:** {description + alt text}, or "headline-only, no hero."
- **Palette applied:** bg Celestial White/White, text Solar Black, CTA Horizon Blue, divider Radiant Dawn.
- **Personalization tokens:** {FirstName|Friend}{, others with fallbacks}

## 4. Conversion Rationale (why this will perform)

- **Open rate:** {how the subject/preheader earns the open}
- **Click-through:** {single CTA, placement, first-person copy}
- **Response/conversion:** {clarity of the ask, concreteness of outcome}
- **Deliverability/accessibility:** {dark-on-light, live text, alt text, plain-text version}

## 5. Sources Used

- {Testimonial / impact story source, file, ECMS Story, transcript, etc.}
- {Data point source, GA4, Search Console, report}
- {Any other reference}

## 6. QA Confirmation

- [ ] scripts/qa_scan.py printed PASS
- [ ] Rendered at 320, 390, 430px with no horizontal scroll
- [ ] Passed full QA checklist (references/qa-checklist.md)
- [ ] No em dashes, no emojis, no AI footprints
- [ ] HTML + plain-text delivered; images hosted (ESP) or embedded (paste)
