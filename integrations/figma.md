# Figma

Figma cannot read CSS or run the linter. Use it in three layers.

## 1. Tokens as variables
`tokens/tokens.dtcg.json` (hosted: `<site>/tokens/tokens.dtcg.json`) is the W3C DTCG version of `tokens/tokens.json`: colours, spacing, radius, shadows, typography, motion, z-index, opacity, sizes, with aliases like `{font.family.sans}`.
- Tokens Studio for Figma: Settings > Add new > Import JSON/URL > choose the file or the hosted URL, then "Create variables".
- Style Dictionary or any DTCG-aware plugin: import the same file.
- Confirm the plugin's current DTCG support when you set up; plugins change. Gradients are stored as CSS strings (`ism.kind: css-gradient`) and need to be created as paint styles by hand.

## 2. Components
Build Figma components from the screenshots (`screenshots/<Name>.png`) and specs (`components/<Name>/spec.json`: anatomy, variants, states). Name variants exactly as the spec does so designers and code agree. The HTML specimens (`previews/<Name>.html`) can be captured with an HTML-to-Figma tool if you use one.

## 3. Figma Make / AI generation
Paste `prompts/ism-system-prompt-short.md` as the project instructions and add the hosted URLs. Review every frame against the self-check list in the prompt; Figma's AI cannot run the linter, so run it on any exported code.

## Keeping Figma in sync
Tokens change only in `tokens/tokens.json`. After a release, re-import `tokens.dtcg.json`. Never edit a variable in Figma without changing the repository first.
