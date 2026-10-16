# Input
Rounded 48px text field with its label above, available as the React `Input` and as `.field` › `.label` + `.input` with hint, error and success messages.

## When to use
- Use for short free text: name, email, order number, partner code, search terms in a form.
- Use `.input-lg` (60px) for the one or two big fields of a sign-up or give flow; use the amount field (`.cr-amount`) for a gift amount.
- Use `<textarea class="input">` for messages and prayer requests.
- Do not use for a choice from a known list; use Select, Radio or Combobox. For search bars use SearchField; for phone numbers use PhoneInput.

## Anatomy & markup
Label above, field, then one line of hint OR error OR success below.

### React
`import { Input, Textarea } from '@ism/ui'` (source: `packages/react/src/components/Input.tsx`). Renders the `.field` markup below: `.label` tied with `for`/`id` (an id is generated when you pass none), the field, then one line of error, success or hint linked with `aria-describedby`. The ref goes to the `<input>`; other input attributes (`name`, `value`, `onChange`, `autoComplete`, `inputMode`, `required`, …) are passed through.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `ReactNode` (required) | — | Shown above the field. A placeholder is not a label. |
| `hint` | `ReactNode` | — | `.hint` line; shown only when there is no error or success. |
| `error` | `ReactNode` | — | `.err` line with an icon; sets `aria-invalid="true"` and replaces the hint. |
| `success` | `ReactNode` | — | `.cr-ok-msg` line plus a tick inside the field (`.cr-ok`). Only where a check really ran. |
| `optional` | `boolean` | `false` | Appends the `.opt` marker to the label. |
| `optionalLabel` | `ReactNode` | `"(optional)"` | Text of the marker; override to translate. |
| `size` | `"md" \| "lg"` | `"md"` | `lg` is `.input-lg` (60px) with the `.cr-label-lg` label. |
| `prefix` | `ReactNode` | — | Decorative symbol at the start of the field (renders `.cr-amount`); pair with `size="lg"` for a gift amount. |
| `type` | `string` | `"text"` | `email`, `tel`, `password`, … |
| `placeholder` | `string` | — | An example, never the label. |
| `disabled` | `boolean` | — | Disables the field and dims the label (`.cr-label-off`). |
| `readOnly` | `boolean` | — | Adds `.cr-ro` and a lock icon in `.cr-adorn-end`. |
| `dark` | `boolean` | `false` | Translucent field for `.sec-ink` / black surfaces. |
| `fieldClassName` | `string` | — | Class on the outer `.field`; `className` goes on the `<input>`. |

`Textarea` takes the same props except `size`, `prefix` and `type`, and renders `<textarea class="input">`. `FieldError`, `FieldSuccess` and `FieldHint` (`id`, `children`) are exported for custom fields.

```jsx
<Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" error="Enter a full email address." />
<Input label="Order #" optional hint="For questions about an ISM Publishing or NFC card order." />
<Input label="Gift amount (USD)" size="lg" prefix="$" inputMode="decimal" defaultValue="50" />
<Textarea label="Prayer request" placeholder="How can we help?" />
```

### HTML / CSS
```html
<div class="field">
  <label class="label" for="email">Email</label>
  <input class="input" id="email" type="email" autocomplete="email"
         placeholder="you@example.com" aria-describedby="email-err" aria-invalid="true">
  <p class="err" id="email-err">Enter a full email address.</p>
</div>

<div class="field">
  <label class="label" for="order">Order # <span class="opt">(optional)</span></label>
  <input class="input" id="order" type="text" aria-describedby="order-hint">
  <p class="hint" id="order-hint">For questions about an ISM Publishing or NFC card order.</p>
</div>

<div class="field">
  <label class="label cr-label-lg" for="amt">Gift amount (USD)</label>
  <div class="cr-amount"><span class="cr-amount-sym" aria-hidden="true">$</span>
    <input class="input input-lg" id="amt" inputmode="decimal" value="50"></div>
</div>
```

## Variants & states
| State | How | Look |
|---|---|---|
| Default | `.input` | 1px `rgba(0,0,0,.22)` border, `--radius-md` |
| Hover | `:hover` (`.cr-is-hover` for docs) | border `rgba(0,0,0,.4)` |
| Focus | `:focus` (`.cr-is-focus` for docs) | `--horizon-blue` border + `--shadow-focus` ring |
| Filled | value present | same as default, text `--black` |
| Disabled | `disabled`, label `.cr-label-off` | `--gray-100` fill, `--gray-600` text |
| Read-only | `readonly` + `.cr-ro` | `--off-white` fill; lock icon in `.cr-adorn-end` |
| Error | `aria-invalid="true"` + `.err` | `--error` border, pale error fill |
| Success | `.cr-ok` + `.cr-ok-msg`, tick in `.cr-adorn-end.cr-ok-ic` | `--success` border |

Sizes: default 48px, `.input-lg` 60px (pair with `.cr-label-lg` 17px label), amount 76px. Textarea starts at 144px and resizes vertically. Dark: React `dark`. React `size="lg"` and `prefix` give the large and amount fields.

## Rules
- Always show a visible `.label` above the field. Placeholders are examples only.
- Keep fields at least 48px tall; that also covers the 44px tap target.
- Validate on blur, not on every keystroke. On submit, move focus to the first field with an error.
- Show success only where a check really ran (server-confirmed email, partner code). Never on every field.
- Disabled fields are skipped by Tab and not submitted; read-only fields can be focused, copied and are submitted.
- Mark the fewer kind: most ISM forms are mostly required, so label the rest `(optional)` with `.opt`.
- The focus ring is the only blue on a field; never colour borders `--horizon-blue` at rest.

## Accessibility
- Tie the label with `for`/`id`. Tie hints and errors with `aria-describedby`.
- Set `aria-invalid="true"` on errors and give the error an icon plus text, never colour alone.
- Use the right `type`, `autocomplete` and `inputmode` so phones show the right keyboard.
- Icons inside `.cr-adorn-end` are decorative (`aria-hidden="true"`); say the state in text.

## Content
- Labels are nouns in sentence case: "Email", "Your full name", "Prayer request".
- Placeholders show a real example: "you@example.com", "e.g. Maria Santos", "How can we help?".
- Errors say how to fix it: "Enter a full email address.", "Please enter your name." Success is short: "Looks good."
