# @ism/ui

Typed React components over the ISM CSS classes. Works with Next.js App Router (the bundle is marked `"use client"`) and any React 18+ app.

```tsx
import '@ism/ui/css';            // add '@ism/ui/css/rtl' for Arabic, Urdu, Farsi
import { Button, DirectionProvider } from '@ism/ui';
```

- Conventions for contributors: [CONVENTIONS.md](CONVENTIONS.md).
- Links: components that render links accept `linkComponent` so you can pass `next/link`.
- Visible text always comes from props or children; accessible-name defaults are English and overridable.
- Tests: `npm test --workspace @ism/ui` server-renders every component example.
