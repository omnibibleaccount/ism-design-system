# Perplexity

1. Create a Space. Paste `prompts/ism-system-prompt.md` into the Space instructions (trim to `ism-system-prompt-short.md` if the limit is hit).
2. Attach files if the plan allows: `tokens/tokens.json`, `specs/all.json`, `rules/rules.json`. Otherwise rely on the hosted URLs in the prompt.
3. Ask for output as a single HTML file using `<link rel="stylesheet" href="<site>/css/ism.css">`. Do not ask it to inline or rewrite the CSS.
4. Run the linter on the result. Perplexity cannot run it for you; paste its error list back and ask for fixes.

Limit: Perplexity prioritises web search and may paraphrase. If it invents class names, the linter's `unknown-class` rule will catch it.
