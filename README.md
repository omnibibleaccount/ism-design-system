# ISM Design System

The source of truth for International Scripture Ministries (ISM) and dot.Bible interfaces. It holds the design tokens, the written rules, a machine-readable spec for each of the 79 components, and code libraries for every platform ISM ships on.

Humans and AI tools should start with [AGENTS.md](AGENTS.md) (also [llms.txt](llms.txt)).

## What is in here

| Path | What |
|---|---|
| `tokens/tokens.json` | Every design value. Generates CSS, TypeScript, React Native, Swift, Kotlin and Android XML |
| `rules/` | States, multilingual and RTL, layout and motion, icons and links, accessibility, voice. `rules.json` is the machine form |
| `components/<Name>/` | `README.md` (authored) and `spec.json` (generated): anatomy, variants, props, states, do and don't, snippets |
| `specs/` | `index.json`, `all.json`, `platforms.json` (which platform has which component) |
| `packages/tokens` | `@ism/tokens`: typed tokens, icon data, script helpers |
| `packages/web` | `@ism/web`: HTML and CSS (`css/ism.css`, `css/rtl.css`), fonts, icons, logos, patterns |
| `packages/react` | `@ism/ui`: 79 typed React components, Next.js App Router ready |
| `packages/react-native` | `@ism/ui-native`: 43 components for the dot.Bible app |
| `packages/ios` | Swift Package (SwiftUI): 23 components |
| `packages/android` | Gradle module (Jetpack Compose): 23 components |
| `examples/next-app` | Minimal Next.js example |
| `reference/` | Legacy kits, templates and board previews; reference only |
| `docs/screenshots/` | One PNG per component rendered from the real CSS: the visual target |
| `prompts/` | Generated, paste-ready system prompts for ChatGPT, Perplexity, Replit and others |
| `integrations/`, `RECREATE.md` | Per-tool setup guides and rebuild prompts |
| `packages/tokens/tokens.dtcg.json` | Tokens in W3C DTCG format for Figma, Tokens Studio, Style Dictionary |
| `tests/lint/` | Fixtures and tests for the usage linter |
| `scripts/` | Generators, the validator, the usage linter (`lint-usage.mjs`) and the hosted-site build |

## Quick start

Web (plain HTML):

```html
<link rel="stylesheet" href="packages/web/css/ism.css">
<a class="btn btn-primary" href="/give">Give online <span class="arrow" aria-hidden="true">↗</span></a>
```

React or Next.js:

```tsx
import '@ism/ui/css';
import { Button } from '@ism/ui';

<Button href="/give" icon="↗">Give online</Button>
```

React Native:

```tsx
import { ISMThemeProvider, Button } from '@ism/ui-native';

<ISMThemeProvider lang="en"><Button>Download Bible</Button></ISMThemeProvider>
```

iOS: add the package at `packages/ios`, `import ISMDesignSystem`, call `ISMFonts.register()` at launch, wrap the root in `.ismTheme()`.
Android: include the module `:ism-design-system`, wrap content in `ISMTheme { … }`.

## Working in the repo

```
npm install
npm run build     # tokens, specs, CSS, packages
npm run check     # generated files up to date, contrast pairs, CSS variables, spec coverage
npm test          # validator and package tests
npm run build:previews   # static component previews in docs/previews
npm run build:screenshots  # regenerate component screenshots (needs Chromium; PLAYWRIGHT_CHROMIUM_PATH)
npm run lint:usage       # usage linter over components and examples
npm run build:site       # hosted copy in site/ for GitHub Pages (SITE_BASE=<url> to override the base URL)
```

### Keeping tools on-system

Other tools (ChatGPT, Perplexity, Replit, Figma) read the hosted copy published by `.github/workflows/pages.yml` (enable Pages once: Settings > Pages > Source: GitHub Actions). Start with [integrations/README.md](integrations/README.md). Every output should pass `node scripts/lint-usage.mjs`; see [rules/enforcement.md](rules/enforcement.md).

See [CONTRIBUTING.md](CONTRIBUTING.md). Fonts and imagery are large binaries and are stored with Git LFS (`.gitattributes`).

## Status of each platform

| Platform | Verified here |
|---|---|
| Tokens, rules, specs, CSS, RTL | Generated and validated in CI (contrast, variables, staleness) |
| React / Next.js | Type-checked, server-rendered in tests for all 79 components, bundled, Next.js build passes |
| React Native | Type-checked, server-rendered through react-native-web for 43 components. Not run on a device or simulator |
| iOS (SwiftUI) | Written without a compiler. Must be built in Xcode before release |
| Android (Compose) | Written without a compiler. Must be built in Android Studio before release |
| Non-Latin scripts and RTL | Line-heights and mirroring are recommendations pending review by native readers (Amharic, Tigrinya, Burmese, Arabic, Persian, Urdu) |
