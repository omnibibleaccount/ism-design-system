# Fonts

Shipped here (SIL Open Font License): Inter and Lora variable fonts. Static cuts for native apps are in `../fonts-static/`.

Not shipped: Procerus (`--font-print-serif`), Neue Power (`--font-display-alt`) and Miss Noteworthy (`--font-script-accent`) are commercial fonts. Their licences do not allow redistribution, so they are not in this repository or on the hosted site. Install a licensed copy from the vendor on the machines and in the apps that need them. Without them the family stacks fall back to Georgia, Inter and a cursive system font.

`tokens/tokens.json` lists these families with a `licensed` note instead of a `file`, and `scripts/build-tokens.mjs` emits `@font-face` only for fonts that have a file.
