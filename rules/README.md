# Rules

These are the rules a person or an LLM needs and cannot infer from the visual boards. They are the written half of the source of truth; `tokens/tokens.json` and `components/*/spec.json` are the machine half.

| File | Covers |
|---|---|
| [states.md](states.md) | The seven states every interactive component needs, with hooks and treatments |
| [multilingual-rtl.md](multilingual-rtl.md) | Script fallbacks, line-heights per script, mirroring for Arabic, Urdu, Farsi |
| [layout-motion.md](layout-motion.md) | Breakpoints, containers, grid, z-index, elevation, motion |
| [icons-links.md](icons-links.md) | What ⌄ ↗ › → mean, link and icon rules |
| [accessibility.md](accessibility.md) | Contrast, focus ring, tap targets, alt text, semantics |
| [voice-microcopy.md](voice-microcopy.md) | Button verbs, error tone, how to refer to scripture |
| [print-editorial.md](print-editorial.md) | Print brochures, reports and media kits |
| [decks.md](decks.md) | Slide decks |
| [email.md](email.md) | Email: short form of the ISM Email Design & Copy Standard; the full standard is the skill `skills/ism-emails/` |
| [social.md](social.md) | Social (thin, observed only) |
| [rules.json](rules.json) | All of the above in machine-readable form (also validated in CI) |

Email is the exception: for any email, `skills/ism-emails/` (the ISM Email Design & Copy Standard) overrides every file here, `tokens.json` included.

Precedence when two sources disagree: `tokens.json` for values, `rules.json` for behaviour, the component `spec.json` for a single component, then the Markdown prose. CI fails if the contrast pairs or z-index values in `rules.json` stop matching `tokens.json`.
