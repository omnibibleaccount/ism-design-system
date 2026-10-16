# ISM HTML Email Build Guide (v2.0)

How to produce the ready-to-send HTML deliverable. Pick the delivery route first; the route decides the template, image handling, and layout width.

---

## Choose the Route

| Route | When | Template | Images | Width |
|---|---|---|---|---|
| **ESP** | Sent through Braze, Postmark, Resend, or another email service | `assets/templates/email-template.html` | Hosted public HTTPS URLs | Fluid, 600px max |
| **Gmail paste** | Troy or staff copy the rendered page from Chrome and paste into Gmail (team updates, personal partner notes) | `assets/templates/email-template-gmail-paste.html` | Embedded base64 via `scripts/embed_images.py` | Root locked to 420px max |

If the user does not say, ask. If it is a team or one-to-one note from Troy's own Gmail, default to Gmail paste.

## Non-negotiables (both routes)

1. **Dark text on light background.** White or `#F4F4F6` surfaces, `#000000` body text. No live white-on-black reading copy.
2. **Color = action only.** Buttons and links `#046DE3`. Accents and dividers `#E7B650`. Greeting and sign-off bold `#000000`.
3. **One primary CTA**, Horizon Blue, visible in the first phone screen. Repeat the same CTA lower only if the email is long.
4. **Live text** for all reading copy. Never bake reading copy into images.
5. **Alt text** on every image, matching its visible label.
6. **Mobile-first:** single column, 16px body, 44px+ tap targets, 20px side padding.
7. **Canon:** signature `'til all have heard,` / `Troy Carl` / `President`; footer `1-833-60-BIBLE (24253) | contact@ism.bible` listed once.

## ESP Route

- Start from `email-template.html`. A `<style>` block and media queries are allowed here because the ESP sends the HTML intact.
- Keep the head meta: `color-scheme: light`, `supported-color-schemes: light`, viewport.
- Images: keep the bundled filename in `src` with a `<!-- HOST: replace src with a public HTTPS URL -->` note and bundle the file so the user can upload it. Never use base64 on this route; many clients block data-URI images in received mail.
- Footer must include a real mailing address and unsubscribe link (`{MAILING_ADDRESS}`, `{UNSUBSCRIBE_URL}`), plus the contact canon.

## Gmail Paste Route

Gmail's paste handler deletes the stylesheet, strips media queries, renames classes to inert `gmail-` names, and hardcodes the Chrome window width (for example `width:1440px`) on any full-width outer table. On iPhone that shrinks the email to about a quarter size with grey side bars. Build so there is nothing to strip:

- Start from `email-template-gmail-paste.html`. No `<style>`, no classes, no media queries, every style inline.
- No grey outer shell table. The root table is `width:100%;max-width:420px` on a white body.
- Fonts: inline `font-family:Arial,Helvetica,sans-serif` on the root (web fonts are dropped on paste). Headline 26-29px, section heads 20-22px, body 16px, line-height 1.6.
- Bullets: build as table rows with a real bullet glyph cell, not `<ul>`, so sanitizers cannot flatten them.
- Images: reference local files in `src`, then run `python3 scripts/embed_images.py email.html` to resize to 2x display width, compress, and inline as base64. Place each image as a direct child of a plain table cell. Never wrap images in `overflow:hidden` containers; sanitizers strip them with their contents. Never use signed or private preview URLs; Gmail fails to fetch them and silently drops the image.
- Audio: HTML5 `<audio>` players are stripped. Use a full-width tappable link styled as an Ocean Mist `#A3D7FF` secondary button with black text ("Play the Hindi sample") pointing at the stream URL, so it never competes with the Horizon Blue primary CTA. Verify each stream URL returns audio before delivery when reachable.
- Screenshots of dashboards or tables: crop to the columns that matter so text stays legible at 380px.
- Total size under ~100 KB (Gmail clips at about 102 KB). The QA scan reports the size.
- Paste-route tradeoff: on desktop the email shows as a clean 420px column. If the user wants fully fluid desktop and phone layouts for a recurring send, recommend an ESP once the ism.bible sending domain is verified.

## Shared Patterns

### Button (bulletproof, Outlook-safe)

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
  <tr>
    <td align="center" bgcolor="#046DE3" style="border-radius:6px;">
      <a href="{CTA_URL}" target="_blank" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:700;line-height:20px;color:#FFFFFF;text-decoration:none;border-radius:6px;">{FIRST_PERSON_CTA}</a>
    </td>
  </tr>
</table>
```

On the paste route, a full-width block link (`display:block;text-align:center;padding:15px 10px;`) is the most reliable tap target.

### Divider (Radiant Dawn)

```html
<tr><td style="padding:8px 20px;"><div style="height:2px;background-color:#E7B650;line-height:2px;font-size:2px;">&nbsp;</div></td></tr>
```

### Scripture block

```html
<tr><td style="padding:16px 20px;">
  <p style="margin:0;font-family:'Lora',Georgia,serif;font-style:italic;font-size:16px;line-height:1.6;color:#41484E;">&ldquo;The Word became flesh.&rdquo; <span style="font-style:normal;font-weight:700;">John 1:14</span></p>
</td></tr>
```

### Preheader

```html
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#FFFFFF;opacity:0;">{PREHEADER_TEXT}</div>
```

Do not append invisible spacer characters (zero-width joiners, `&#8199;`, `&#65279;`, `&#847;`) to pad the preheader. They are hidden characters and violate the standing rules. If body copy leaks into the inbox preview, lengthen the preheader to about 90 characters instead.

## Fonts (ESP route)

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Nunito:wght@400;600;700&family=Lora:ital@1&display=swap" rel="stylesheet">
```

- Headings: `'Poppins',Arial,Helvetica,sans-serif` bold.
- Body: `'Nunito',Arial,sans-serif` 16px, line-height 1.6.
- Quotes: `'Lora',Georgia,serif` italic.

## Logo Selection

- Default header (both routes): `assets/logos/Full-Logo-Black-email-360.png` displayed at 180px wide.
- Dark photo hero (flattened image only): `Full-Logo-White.png`.
- Compact or square: `ISM-Icon.png`.
- Publishing emails: `ISM-Pub-Logo-highres.jpg`, downscaled and converted to RGB first.

## Plain-Text Version (required)

- Subject and preheader on the first lines.
- Greeting, body, the CTA as a full URL, three-line signature, footer contact canon.
- No markup.

## Render Check

Screenshot the final HTML at 320, 390, and 430px viewport widths (paste route also at 1440px to prove the root holds at 420px). Confirm `document.documentElement.scrollWidth <= window.innerWidth` at each width, the CTA is within the first ~640px, and no text wraps mid-word or clips.

## Output Files per Email

- `{slug}-{brand}.html` ready to send or paste.
- `{slug}-{brand}.txt` plain-text alternative.
- `{slug}-copy-spec.md` from `assets/templates/copy-spec-template.md`.
- ESP route only: the logo and image files the user must host.
