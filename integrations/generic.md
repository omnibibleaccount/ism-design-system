# Claude, Cursor, Copilot and any other agent

- Repo access: the agent reads `AGENTS.md` and `llms.txt` first. Nothing else is needed.
- No repo access: paste `prompts/ism-system-prompt.md` and give the hosted base URL.
- Claude Projects: add `prompts/ism-system-prompt.md`, `tokens/tokens.json`, `specs/all.json` as project knowledge.
- Cursor: copy `AGENTS.md` and the prompt into `.cursor/rules` in your product repo (that folder is ignored here on purpose).
- Always finish with the linter: `node lint-usage.mjs --data lint-data.json <paths>`.
