# @ism/tokens

Typed design tokens generated from `tokens/tokens.json`.

```ts
import { color, spacing, zIndex } from '@ism/tokens';          // web values (CSS strings)
import { color as nativeColor } from '@ism/tokens/native';      // React Native values (numbers, rgba)
import { scriptFor, directionFor, lineHeightFor } from '@ism/tokens/script';
import { uiIcons, ministryIcons } from '@ism/tokens/icons';
import { logos } from '@ism/tokens/logos';
```

Do not edit `src/*.generated.ts`; run `npm run build:tokens` or `node scripts/build-icons.mjs` at the repo root.
