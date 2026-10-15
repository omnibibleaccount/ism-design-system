# Enforcement: how drift is stopped

Written rules are not enough when LLMs and design tools build screens. This repository makes the rules checkable.

## What is enforced, and where

| Layer | What it checks | Command |
|---|---|---|
| Tokens | Generated files match `tokens/tokens.json` | `npm run check:tokens`, `check:dtcg` |
| Validator | Contrast pairs, CSS variables, rule coverage, component folders | `npm run validate` |
| Specs | Component specs match their READMEs | `npm run check:specs` |
| Screenshots | One PNG per component, regenerated when CSS or snippets change | `npm run check:screenshots` |
| Prompts | Generated system prompts match tokens, rules and index | `npm run check:prompts` |
| Usage linter | Output from people or tools matches the rules | `npm run lint:usage`, `node lint-usage.mjs <files>` |

## The usage linter

`scripts/lint-usage.mjs` (hosted: `<site>/lint/lint-usage.mjs`) checks HTML, CSS, JSX/TSX, Vue, Svelte and Markdown code fences. Errors fail the run (exit 1); warnings fail only with `--strict`.

Errors: hardcoded colour (hex, rgb, hsl), font outside Inter/Lora/Procerus/Noto, numeric z-index, raw border-radius, raw box-shadow, raw gradient, unknown CSS variable, invented class name with an ISM prefix, Tailwind palette or arbitrary-value classes, emoji, "!" in a button label, vague labels ("Click here", "Submit", "OK", "Go"), two primary buttons in one group, white or recoloured logo files, missing `alt`, missing `lang`, RTL language without `dir="rtl"`.

Warnings: spacing off the space scale, raw motion durations, pill-shaped eyebrows, typed ALL CAPS labels, component overrides.

`component-override` (warning) fires when a `<style>` rule or an inline `style` restyles a system class (any class in `specs/lint-data.json`, such as `.btn-primary`, `.ap-tab`, `.sx-reader`, `.dp-ccta`) by setting `border*`, `border-radius`, `background*`, `color`, `text-decoration*`, `padding*` or `margin*`. Only the subject of a selector counts: `.ap-tab:hover { color: … }` warns, `.my-shell .ap-tab { … }` warns, but `.ap-tab .my-note { … }` styles your own class and does not. Layout properties (`display`, `flex`, `gap`, `position`, `inset`, `width`, `height`, `max-width`, `overflow`, `z-index` tokens) and classes you define yourself never trigger it. Spacing on the page containers `.wrap` and `.narrow` is page layout and is allowed; borders, backgrounds and colours on them still warn. If a component cannot do what you need, report the gap instead of patching it.

Suppress deliberately: `ism-lint-disable-line [rule]` on the line, or `ism-lint-disable-file`. A suppression is a design decision; say why next to it.

What the linter cannot judge: whether the right component was chosen, whether hierarchy and spacing look right, whether copy is good. For that, compare against `screenshots/<Name>.png` and the component's `whenToUse`.

## Running it outside this repository

```
curl -O <site>/lint/lint-usage.mjs && curl -O <site>/lint/lint-data.json
node lint-usage.mjs --data lint-data.json src/
```

Add it to CI next to your tests so generated code cannot merge with drift.

## Tests

`tests/lint/` holds clean fixtures (`good.html`, `override-clean.html`) and deliberately bad fixtures (`bad.html`, `bad.tsx`, `bad-rtl.html`, `override.html`). `npm run test:lint` proves each rule fires, and that all 79 component snippets pass. Add a fixture whenever you add a rule.
