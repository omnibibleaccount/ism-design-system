# AGENTS.md: how to use the ISM Design System

This repository is the single source of truth for the look, behaviour and wording of International Scripture Ministries (ISM) and dot.Bible interfaces. Read this file first; it tells you which file to trust for what.

## Order of authority

1. `tokens/tokens.json`: every colour, type style, spacing, radius, shadow, gradient, z-index, motion and size value. Never hard-code a value that exists here. Flat lookup: `packages/tokens/tokens.flat.json`.
2. `rules/rules.json` (prose in `rules/*.md`): behaviour rules the visuals cannot show: states, multilingual and RTL, layout, icons and links, accessibility, voice. Print, decks, email and social are under `applied` in `rules.json` and in `rules/print-editorial.md`, `decks.md`, `email.md`, `social.md` (social is thin). **Email** follows the email standard packaged as the skill `skills/ism-emails/` (templates, references, QA scan); it does not use the web components or `ism.css`.
3. `components/<Name>/spec.json` (index: `specs/index.json`, everything in one file: `specs/all.json`): per component anatomy, variants, props, states, do and don't, accessibility, content, code snippets, and which platforms implement it.
4. `components/<Name>/README.md`: the human-written source the spec is generated from.
5. The code: `packages/web` (HTML and CSS), `packages/react` (React, Next.js), `packages/react-native`, `packages/ios` (SwiftUI), `packages/android` (Jetpack Compose).

If two sources disagree, the higher one wins and the lower one is a bug: open an issue.

**Email is the exception.** For every ISM and THRU the BIBLE email (newsletters, appeals, thank-yous, updates, invitations), the email standard in `skills/ism-emails/` is the single source of truth and overrides everything above, including `tokens.json` (email uses its own palette and Poppins, Nunito and Lora). The President requires strict adherence: follow it exactly, use its templates, and do not mix in web components, web tokens or older email kits.

## Hosted copy, screenshots and the linter

- Hosted (GitHub Pages, no Git LFS): tokens, rules, specs, `css/ism.css`, fonts, images and a SHA-256 `manifest.json` at one base URL (see `integrations/README.md`). `llms.txt` there lists everything.
- Visual target for each component: `docs/screenshots/<Name>.png` (hosted: `screenshots/<Name>.png`). Match it; do not approximate.
- Paste-ready prompts: `prompts/ism-system-prompt.md` (full) and `prompts/ism-system-prompt-short.md`. Rebuild instructions: `RECREATE.md`. Per-tool guides: `integrations/`.
- Check every output: `node scripts/lint-usage.mjs <files>` (or the hosted `lint/lint-usage.mjs`). Errors mean drift; fix them, do not suppress them. Details in `rules/enforcement.md`.
- Figma and Style Dictionary: `packages/tokens/tokens.dtcg.json` (W3C DTCG).

## How to build a screen

1. Find the components in `specs/index.json` (79, grouped: Brand, Actions, Cards, Data display, Forms, Feedback, Navigation, Patterns, Scripture, Ministry, App UI). Prefer an existing component over new markup.
2. Read the component's `spec.json`: `whenToUse`, `whenNotToUse`, `do`, `dont`, `snippets`.
3. Use the platform package, not a copy of the CSS:
   - Web: `<link rel="stylesheet" href="packages/web/css/ism.css">` and the class names in `snippets.html`. For RTL add `css/rtl.css` and `dir="rtl"`.
   - React or Next.js: `import '@ism/ui/css'; import { Button } from '@ism/ui'`.
   - React Native: `import { Button, ISMThemeProvider } from '@ism/ui-native'`.
   - iOS: `import ISMDesignSystem` (Swift Package in `packages/ios`). Android: `bible.ism.design` (Gradle module in `packages/android`).
4. Use tokens by name (`var(--horizon-blue)`, `color['horizon-blue']`, `ISMTokens…`), never by value.
5. Check the result against `rules/accessibility.md` and `rules/states.md`.

## Non-negotiable rules (short form)

- One Horizon Blue primary action per group of actions.
- Inter for UI (h1 weight 700, other headings 600). Lora for Scripture and quotes only.
- Caret ⌄ means "opens here". ↗ means "goes to another page". › means "drills into an app screen". → is only for the primary continue action.
- Counts and notification dots are blue. Red is for errors only. The live dot is for on-air only.
- Every interactive element has seven states (default, hover, focus, pressed, disabled, loading, error) and a visible focus ring (2px blue outline plus `--shadow-focus`).
- Tap targets are at least 44px. Text contrast is at least 4.5:1; use only the pairs in `rules/rules.json`.
- Set `lang` (and `dir` for Arabic, Urdu, Farsi). Non-Latin scripts use their own line-height and no letter-spacing. Do not mirror ↗, the down caret, media controls, logos or QR codes.
- Logos are black ink; on dark backgrounds invert them (`filter: brightness(0) invert(1)`). Never recolour.
- Button labels: verb first, sentence case, no exclamation marks, no emoji. Errors say what is wrong and what to do.
- Scripture: never alter or paraphrase verse text in UI; always show reference and translation.

## Working on this repository

```
npm install
npm run check      # tokens, DTCG, specs, screenshots, prompts, validator, usage linter and its tests – must pass
npm run build      # generates tokens, specs, icons, CSS and builds all packages
npm test           # validator plus package tests
```

- Edit sources, not generated files. Sources: `tokens/tokens.json`, `rules/`, `components/*/README.md`, `packages/web/css/bundle.css`, `packages/web/css/states.css`, `packages/web/css/scripts.css`, `scripts/lint-usage.mjs` (rules), `packages/web/assets/ui-icons/source.json`, package `src/` folders. Generated: `packages/tokens/src/*.generated.ts`, `packages/web/css/tokens.css`, `rtl.css`, `ism.css`, `components/*/spec.json`, `specs/*.json`, ios/android `Generated/` and icon resources.
- After changing tokens run `npm run build:tokens`; after changing a README run `npm run build:specs`; after changing icons run `node scripts/build-icons.mjs`.
- Swift and Kotlin code was written without a compiler available. Build it in Xcode and Android Studio before releasing.
- Do not commit AI-tool working files (`.claude/`, `CLAUDE.md`, `.cursor/`, …); `.gitignore` excludes them. This file and `llms.txt` are intentionally tracked.
