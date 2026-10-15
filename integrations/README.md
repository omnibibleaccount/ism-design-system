# Using the ISM Design System from other tools

Every tool needs the same three things: the **system prompt** (how to behave), **fetchable files** (tokens, specs, CSS, screenshots at stable URLs), and a **check** (the linter). The hosted site provides all three with no Git LFS.

Hosted base URL: `https://omnibibleaccount.github.io/ism-design-system/` (after Pages is enabled; see below). Replace with your own if the repo moves; rebuild with `SITE_BASE=<url> npm run build:site`.

One-time setup: GitHub repo > Settings > Pages > Build and deployment > Source = "GitHub Actions". Then every push to `main` runs `.github/workflows/pages.yml`.

| Tool | Guide |
|---|---|
| ChatGPT (Custom GPT, Projects, Codex) | [chatgpt.md](chatgpt.md) |
| Perplexity (Spaces, Computer) | [perplexity.md](perplexity.md) |
| Replit (Agent, Replit.md) | [replit.md](replit.md) |
| Figma (variables, Tokens Studio, Make) | [figma.md](figma.md) |
| Claude (Projects, Code), Cursor, Copilot, any other agent | [generic.md](generic.md) |

Paste-ready prompts are generated from the real sources: `prompts/ism-system-prompt.md` (full) and `prompts/ism-system-prompt-short.md` (under 7,500 characters). To rebuild an existing design from scratch, use [../RECREATE.md](../RECREATE.md).

## Honest limits

- A model can ignore instructions. The prompt reduces drift; the linter and screenshots let you catch what remains. Run the linter on every output.
- Tools that cannot browse (or that block external URLs) need the files uploaded instead: `prompts/ism-system-prompt.md`, `tokens/tokens.json`, `specs/all.json` and the screenshots you need.
- Figma cannot execute CSS. Tokens import as variables; components must be built or imported separately (see figma.md).
