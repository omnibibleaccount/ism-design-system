# React component conventions (@ism/ui)

Every component is a thin, typed React wrapper over the CSS classes in `packages/web/css/bundle.css`. The README in `components/<Name>/README.md` is the contract; the CSS is the implementation. Do not invent styling.

## File layout

- `src/components/<Name>.tsx` — the component, its sub-components and its prop types. One file per component folder in `components/`. Named exports only, no default export.
- `test/examples/<Name>.tsx` — default export `function Example()` that renders the README's examples through your component (several variants and states). The shared test renders it on the server and checks every class used exists in the CSS.
- Do not edit `src/index.ts` (generated), `utils.ts`, `direction.tsx`, `Icon.tsx`, package files or anyone else's component. Reuse `cx`, `UiIcon`, `MinistryIcon`, `useDirection` from `../utils`, `../Icon`, `../direction`. Import another component from `./Other` (same folder) when the README says one is composed from another.

## API rules

1. If the README has a React prop table, implement exactly that API (adding props is fine, removing or renaming is not). Otherwise design a small typed API from the HTML variants: variants as string-literal unions named after the README table, booleans for flags, `ReactNode` for slots.
2. Every prop has a JSDoc comment. Use `@default` where there is a default. The spec generator reads these.
3. Export `interface <Name>Props` (or a type alias for unions). Extend the native element attributes (`HTMLAttributes<HTMLDivElement>`, `ButtonHTMLAttributes`, …) and `Omit` the keys you redefine, so `className`, `id`, `aria-*`, `data-*` and event handlers pass through. Merge `className` with `cx(...)`.
4. Use `forwardRef` for components that render one DOM element a consumer might focus or measure (buttons, inputs, links, dialogs).
5. States: where the README or `rules/states.md` says the state applies, support `disabled`, `loading` (sets `aria-busy`, shows the documented spinner) and `invalid` / `error` (sets `aria-invalid`, links the message with `aria-describedby`). Use native pseudo-class styling; do not add inline styles for hover, focus or pressed.
6. Render the exact markup and class names shown in the README's HTML examples, including roles, ARIA attributes and the hidden "(opens in a new tab)" text. The README's Accessibility section is a requirement, not a suggestion: keyboard keys, focus management, live regions.
7. No hard-coded English in visible text. Visible strings come from props or children. Accessible-name defaults (for example "Close") may have an English default but must be overridable through a prop (`closeLabel`, `labels`).
8. Controlled and uncontrolled: stateful components (Accordion, Tabs, Select, Combobox, Modal, …) accept `value`/`defaultValue`/`onChange` (or `open`/`defaultOpen`/`onOpenChange`). Generate ids with React `useId`.
9. Server-safe: no `window`/`document` access during render; only inside effects or handlers. No `useLayoutEffect` warnings on the server (use `useEffect`).
10. RTL: never hard-code left or right; rely on the CSS. Where behaviour depends on direction (arrow keys, swipe) use `useDirection()`.
11. Dependencies: React and `@ism/tokens` only. No UI libraries, no CSS-in-JS, no Tailwind. Inline `style` only for dynamic values (a progress width, a CSS custom property).
12. External links (`↗`): add `target="_blank" rel="noopener"` and visually hidden text as the README says.
13. Logos and images: reference assets by `src` prop (default path `/ism/assets/...` documented in JSDoc), never import binary files.

## Checking your work

From `packages/react` run:

```
npx tsc --noEmit -p tsconfig.json
node --import tsx --test test/*.test.tsx
```

Both must pass for your components (the test "every component has an example" is expected to fail until all groups are finished; ignore only that one). Fix every type error in your files; do not use `any` or `// @ts-ignore`.
