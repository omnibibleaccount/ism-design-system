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
`import { Input, Textarea } from '@ism/ui'`. Renders the same `.field` › `.label` + `.input` markup as the HTML below and wires `for`/`id`, `aria-describedby` and `aria-invalid` for you.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `ReactNode` | — | Required. Shown above the field. |
| `hint` | `ReactNode` | — | `.hint` line; shown only when there is no error or success. |
| `error` | `ReactNode` | — | `.err` line with an icon; sets `aria-invalid="true"` and replaces the hint. |
| `success` | `ReactNode` | — | `.cr-ok-msg` line and a tick in the field. Only where a check really ran. |
| `optional` | `boolean` | `false` | Appends the `.opt` marker to the label. |
| `optionalLabel` | `ReactNode` | `"(optional)"` | Text of the marker. |
| `size` | `"md" \| "lg"` | `"md"` | `lg` is `.input-lg` (60px) with the 17px `.cr-label-lg` label. |
| `prefix` | `ReactNode` | — | Decorative symbol inside the start (`.cr-amount`), such as `$`; pair with `size="lg"`. |
| `type` | `string` | `"text"` | `email`, `tel`, `password`, … |
| `dark` | `boolean` | `false` | Adds `.fm-sub-input`, the translucent pill field used inside `.sec-ink` and `.on-dark`. |
| `fieldClassName` | `string` | — | Class on the outer `.field`. |
| …rest | `InputHTMLAttributes` | | `placeholder`, `autoComplete`, `disabled` (also dims the label), `readOnly` (adds `.cr-ro` and the lock icon), `id` (generated when omitted). |

`Textarea` takes the same field props except `size`, `prefix` and `type`.

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

Sizes: default 48px, `.input-lg` 60px (pair with `.cr-label-lg` 17px label), amount 76px. Textarea starts at 144px and resizes vertically. React: `size="lg"`, `prefix` for the amount field, `dark` for dark surfaces.

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
