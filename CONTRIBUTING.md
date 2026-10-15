# Contributing

1. Read [AGENTS.md](AGENTS.md) for the order of authority and the generated-file list.
2. `npm install`, then work on a branch.
3. Change a source of truth first (tokens, rules, component README), then the code on every platform that has the component (see `specs/platforms.json`).
4. Run `npm run build`, `npm run check` and `npm test`. CI runs the same plus Xcode and Gradle builds.
5. Open a pull request using the template. A design owner reviews tokens, rules and visual changes; an engineer reviews code.

Commit messages: imperative, one topic each ("Add Tabs vertical variant"). Do not commit AI-tool files, build output or secrets; `.gitignore` covers them.

Native code: Swift and Kotlin must be built in Xcode and Android Studio; CI does this for pull requests.
