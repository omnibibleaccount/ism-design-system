# Recreate the ISM Design System (or any screen) from this repository

Give this to an LLM or design tool when you want it to rebuild the system's visual reference, or a new screen, faithfully. Paste the block below after the system prompt (`prompts/ism-system-prompt.md`).

## Prompt: rebuild the design system reference page

```
Rebuild the ISM Design System reference page from the repository files. Do not design anything.

Inputs (fetch all; stop and report if any fails):
- tokens/tokens.json, rules/rules.json, specs/index.json, specs/all.json
- css/ism.css (use as is, do not rewrite), fonts and images under assets/
- screenshots/<Name>.png for every component (the visual target)

Steps:
1. Page shell: link css/ism.css. Sections in this order: Colour, Type, Spacing and radius, Shadows and gradients, Layout and motion, Components (grouped as in specs/index.json groups), Rules (one block per rules/*.md).
2. Colour and type: render one swatch/sample per token in tokens.json, labelled with the token name and value, with the usage text beside it.
3. Components: for each component in index order, show its name, summary and group, then render every snippet in components/<Name>/spec.json snippets.html with the real class names. Beside each, show screenshots/<Name>.png as the target.
4. Compare each rendered component to its screenshot. If they differ, fix your markup, not the CSS. List any component you could not match.
5. Run: node lint-usage.mjs --data lint-data.json <your file>. Fix all errors. Report the final line of the linter output.
6. Finish with a "Design system check": components rendered (count out of 79), tokens used, mismatches vs screenshots.
```

## Prompt: build a new screen

```
Build: <describe the screen, audience, language(s)>.
Use only ISM components. For each part of the screen, name the component you chose and why (cite whenToUse from its spec). Use css/ism.css and real class names; tokens by name only. Set lang (and dir for RTL languages). Run the linter and fix all errors. End with a "Design system check".
```

## What to expect

- Layout, colour, type, spacing, states, icons and copy follow the specs and screenshots.
- Anything not in the system is reported as missing instead of invented.
- Pixel-exact matches against the screenshots depend on the tool. Reference templates under `reference/` are legacy and are not rendered standalone.
- Cover (the artifact's title page) exists only in the Claude artifact, not in the repository.
