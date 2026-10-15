# Replit

1. In the Repl, create `replit.md` (Agent reads it) with the contents of `prompts/ism-system-prompt.md`.
2. Install the system in the project:
   - Static or any web project: `<link rel="stylesheet" href="https://omnibibleaccount.github.io/ism-design-system/css/ism.css">` (fonts and images resolve from the same host).
   - React: clone or vendor `packages/react`, or load the hosted CSS and use the class names from the specs.
3. Add the linter: `curl -O <site>/lint/lint-usage.mjs && curl -O <site>/lint/lint-data.json`, then add `"lint:ism": "node lint-usage.mjs --data lint-data.json src"` to package.json.
4. Tell Agent: "After every change, run `npm run lint:ism` and fix all errors."
5. Add the lint step to CI or a pre-commit hook so it cannot be skipped.
