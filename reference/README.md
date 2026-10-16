# Reference

Verbatim copies of the original design-system templates and UI kits, kept for study and as the source the applied rules (`rules/print-editorial.md`, `decks.md`, `email.md`) were read from. They are not part of any shipped package.

- `templates/`: deck, brochure and impact-report templates (`*.dc.html` plus their runtime scripts).
- `ui-kits/`: dot.Bible app, marketing email (including the four Braze donor templates) and marketing site recreations. The email kit is superseded by the email standard in `skills/ism-emails/`; see `ui-kits/marketing-email/README.md`.
- `board-previews/`, `legacy-react-src/`, `bundle.legacy.js`: legacy board cards and the original React sources.

Paths inside these files (`../../assets/...`, `../../tokens/...`, `../../components/bundle.js`) point at the original system layout, where tokens, assets and the bundle sat at the project root. In this repo the equivalents are `packages/web/assets`, `packages/web/css` and `packages/web/css/bundle.css`; the templates will not render unless you serve them from a folder laid out like the original. Treat them as read-only references.
