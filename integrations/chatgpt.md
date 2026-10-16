# ChatGPT

## Custom GPT (recommended for the team)
1. Create a GPT. In Instructions paste `prompts/ism-system-prompt-short.md` (under 7,500 characters, within the Instructions limit).
2. Turn on Web Search so it can fetch the hosted files. If you prefer not to rely on browsing, upload as Knowledge: `prompts/ism-system-prompt.md`, `tokens/tokens.json`, `rules/rules.json`, `specs/index.json`, `specs/all.json`, and the component screenshots you use most.
3. Add conversation starters such as "Build a landing page for the app using ISM" so the first reply shows the method.
4. Test with the smoke test below, then run the linter on what it produces.

## Emails
Emails follow the email standard, not the web components. For a GPT or Project that writes emails, upload the whole skill so nothing has to be fetched: download `skills/ism-emails.zip` from the hosted site (or zip `skills/ism-emails/` from the repo) and add `SKILL.md`, the five files in `references/`, both files in `assets/templates/` and `assets/logos/Full-Logo-Black-email-360.png` as Knowledge. The footer is inside the templates; there is no separate footer file. ChatGPT cannot run `scripts/qa_scan.py`; ask it to walk `references/qa-checklist.md` instead, then run the scan yourself.

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

## Smoke tests
Ask: "Build a donation section with a primary Give button, a secondary Learn about ISM button and a Bible verse." Expect: DonationWidget or CtaBand, one primary button, verb-first labels, VerseBlock with reference and translation, no hex values.

Email: ask "Write a thank-you email to donors for the Amharic audio Bible launch, Braze send." Expect: the ESP template filled in, a light footer with `1-833-60-BIBLE (24253) | contact@ism.bible` once, the three-line bold sign-off, one first-person blue button, no em dashes, and a list of placeholders it could not fill.
