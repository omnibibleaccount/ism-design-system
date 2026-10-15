# ChatGPT

## Custom GPT (recommended for the team)
1. Create a GPT. In Instructions paste `prompts/ism-system-prompt-short.md` (under 7,500 characters, within the Instructions limit).
2. Turn on Web Search so it can fetch the hosted files. If you prefer not to rely on browsing, upload as Knowledge: `prompts/ism-system-prompt.md`, `tokens/tokens.json`, `rules/rules.json`, `specs/index.json`, `specs/all.json`, and the component screenshots you use most.
3. Add conversation starters such as "Build a landing page for the app using ISM" so the first reply shows the method.
4. Test with the smoke test below, then run the linter on what it produces.

## Projects or Custom Instructions
Paste the short prompt. Add `prompts/ism-system-prompt.md` as a project file.

## Codex / agents that read the repo
Point them at the repository: `AGENTS.md` is read automatically. Tell them to run `npm run lint:usage` or the hosted linter before finishing.

## Check the output
Copy the generated HTML or React into a file and run:
```
node lint-usage.mjs --data lint-data.json page.html
```
Ask ChatGPT to fix every error and run again. Compare against `screenshots/<Name>.png`.

## Smoke test
Ask: "Build a donation section with a primary Give button, a secondary Learn about ISM button and a Bible verse." Expect: DonationWidget or CtaBand, one primary button, verb-first labels, VerseBlock with reference and translation, no hex values.
