# Component states

Every interactive component has seven states. If one does not apply, its `spec.json` says so and why. Never invent a new visual language for a state: reuse the treatments below.

| State | CSS hook | Treatment |
|---|---|---|
| default | none | The resting design |
| hover | `:hover` | One step darker or tinted. Pointer devices only. Never the only way to find an action |
| focus | `:focus-visible` | 2px `--horizon-blue` outline, 2px offset, plus `--shadow-focus`. Inside clipped containers (rows, tabs) use a negative offset or an inset ring |
| pressed | `:active`, `.is-pressed` | One more step darker than hover. No scale, no movement |
| disabled | `[disabled]`, `[aria-disabled="true"]` | `opacity: var(--opacity-disabled)` (0.45), no pointer events, `cursor: not-allowed`. Fields use `--gray-100` fill and `--gray-600` text instead of opacity |
| loading | `[aria-busy="true"]`, `.is-loading` | Spinner replaces the leading icon, label stays, width does not change, input is blocked |
| error | `[aria-invalid="true"]`, `.is-error` | `--error` border, `--error-field-bg` fill on fields, plus a message in text |

## Rules

1. Focus must always be visible. Do not write `outline: none` without an equal replacement.
2. Disabled does not also grey the text. The opacity token is the only dimming.
3. Loading never resizes a control and never hides its label.
4. Error is never colour alone: add the message, and an icon or the word "Error" for alerts.
5. Error text sits directly under the field, is referenced by `aria-describedby`, and tells the user what to do.
6. Do not rely on hover on touch devices. Everything revealed on hover must also be reachable by focus and tap.
7. The `.is-*` classes exist so previews, tests and design tools can force a state. Production code should use the native pseudo-classes and ARIA attributes.

## Per control family

| Family | Hover | Pressed | Disabled | Loading | Error |
|---|---|---|---|---|---|
| Button primary | `--horizon-blue-dim` | `--charcoal-900` | opacity .45 | leading spinner | not applicable; errors belong to the form |
| Button secondary | 6% black fill | 12% black fill | opacity .45 | leading spinner | not applicable |
| Button ghost | `--horizon-blue-dim` text | `--charcoal-900` text | opacity .45 | leading spinner | not applicable |
| Icon button, chip | `--gray-100` | `--gray-200` | opacity .45 | spinner replaces icon | not applicable |
| Text field, search, select, combobox | border darkens | n/a | `--gray-100` fill | trailing spinner (async validation) | `--error` border and message |
| Checkbox, radio | border darkens | n/a | `--gray-100`, `--gray-300` | n/a | `--error` border, message under group |
| Switch | n/a | n/a | opacity .45 | n/a | n/a |
| List rows (app, settings, language) | `--gray-100` | `--gray-100` | `--gray-600` text | trailing spinner | n/a |
| Cards (linked) | raises to `--shadow-lift` | back to card shadow | n/a | skeleton | n/a |
| Overlays (modal, sheet, toast, tooltip) | none on the surface | none | n/a | n/a | n/a (actions inside follow button rules) |

## Source of truth in code

- Web: `packages/web/css/bundle.css` (component states) and `packages/web/css/states.css` (universal pressed, loading, error, disabled).
- React: every component forwards `disabled`, `loading` and `invalid` props and sets the matching ARIA attribute.
- React Native: components accept `disabled`, `loading`, `error`; pressed state uses `Pressable`'s `pressed` callback.
- Swift and Compose: `isEnabled`, `isLoading`, `isError` parameters; pressed is driven by the platform interaction source.
