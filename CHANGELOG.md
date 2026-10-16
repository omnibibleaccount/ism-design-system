# Changelog

## Unreleased
- Email: the ISM Email Design & Copy Standard (v1.2) is now part of the system as the agent skill `skills/ism-emails/` (workflow, references, newsletter, ESP and Gmail-paste templates, logos, QA scan). It is the single source of truth for every email. Newsletters end with the approved dark newsletter footer (`newsletter-footer.html`, Braze block `HTML-ISM-Dark-Footer`); every other email uses the light footer. `rules/email.md` and `rules.json` `applied.email` follow it. The hosted site serves the skill and `skills/ism-emails.zip`; the generated prompts route email work to it.
- React previews and screenshots render from `@ism/ui`; component READMEs document the current React API.
- Ten more UI line icons (75 total); web crops of three print photos; AudioPlayer, AnchorNav, Input-on-dark and ListRow fixes.

## 3.0.0
- Tokens v3: z-index scale, motion, opacity and scrims, elevation, sizes, per-script typography data. Toast now sits above modals.
- Written rules (states, multilingual and RTL, layout and motion, icons and links, accessibility, voice) with `rules.json`.
- 79 generated component specs.
- Code: `@ism/web`, `@ism/ui` (React, Next.js), `@ism/ui-native` (React Native), Swift package, Android Compose module.
- 65 UI line icons, 40 ministry icons and 4 logos generated for every platform.
