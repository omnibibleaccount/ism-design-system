# @ism/ui-native

React Native components for the dot.Bible app (iOS and Android).

```tsx
import { ISMThemeProvider, Text, Button } from '@ism/ui-native';
```

Setup:

1. Peer dependencies: `react-native`, `react-native-svg`.
2. Fonts: React Native needs static weights. Copy `fonts/*.ttf` into the app (`react-native.config.js` `assets` or `expo-font`) and keep the file names; see `src/fonts.ts`.
3. RTL: call `I18nManager.forceRTL(true)` for Arabic, Urdu, Farsi and restart; pass `lang` to `ISMThemeProvider`.
4. Gradients: components accept an optional `GradientComponent` (expo-linear-gradient or react-native-linear-gradient) and fall back to a solid colour.

Conventions for contributors: [CONVENTIONS.md](CONVENTIONS.md). Tests render examples through react-native-web; always also test on a device.
