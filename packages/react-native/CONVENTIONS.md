# React Native component conventions (@ism/ui-native)

Components re-create the web components for the dot.Bible app with React Native primitives. The README in `components/<Name>/README.md` is the contract for behaviour, anatomy, states, accessibility and content; the web CSS in `packages/web/css/bundle.css` (grep the component's class names, especially `.ap-*` app classes) is the contract for dimensions, colours, radii and spacing. Translate every value to a token from `@ism/tokens/native` or the theme; never invent values.

## Files

- `src/components/<Name>.tsx` — component(s) and prop types. Named exports only.
- `test/examples/<Name>.tsx` — default export `Example()` rendering several variants and states. The shared test server-renders it through react-native-web.
- Do not edit `src/index.ts` (generated), `theme.tsx`, `Text.tsx`, `Icon.tsx`, `fonts.ts`, `a11y.ts`, package files, or another agent's components. Use `Text`, `UiIcon`, `MinistryIcon`, `Logo`, `useTheme`, `hitSlopFor`, `minTarget` from `../Text`, `../Icon`, `../theme`, `../a11y`.

## Rules

1. Props are typed, documented with JSDoc (use `@default`), and follow the web component's variant names. Extend the matching React Native props (`PressableProps`, `TextInputProps`, `ViewProps`) and forward `testID`, `accessibilityLabel`, `style`.
2. Colours only through `useTheme().colors` (supports light and dark). Spacing, radius, sizes, durations from the theme/tokens. Use `theme.shadow['shadow-…']` for elevation.
3. Text only through `<Text variant tone>` so fonts, script-aware line-height and RTL work. No hard-coded font families.
4. States: default, pressed (Pressable's `pressed`), focus (visible 2dp ring in `colors.focus` for keyboard/switch-control focus via `onFocus`/`onBlur`), disabled (`opacity['opacity-disabled']`), loading (`ActivityIndicator`, busy state), error. Follow `rules/states.md`.
5. Touch targets at least 44×44dp (use `minTarget` or `hitSlopFor`).
6. Accessibility: `accessibilityRole`, `accessibilityState` (`disabled`, `selected`, `checked`, `busy`, `expanded`), `accessibilityLabel`/`Hint`, `accessibilityLiveRegion` for toasts and errors, `accessibilityViewIsModal` for modals/sheets. Decorative elements hidden from screen readers. Follow the README's Accessibility section.
7. RTL: use `start`/`end` style props (`marginStart`, `paddingEnd`, `borderStartWidth`, `start`/`end` positioning), `flexDirection: 'row'` (RN mirrors it), never `left`/`right` for layout. Directional icons use `mirrorInRTL`. Do not mirror ↗, down caret, media transport controls, logos, QR codes.
8. No visible English text hard-coded; strings come from props or children. Accessible-name defaults (like "Close") may have English defaults but must be overridable.
9. Respect reduced motion: check `AccessibilityInfo.isReduceMotionEnabled()` for non-essential animation and skip it. Use `Animated` with `useNativeDriver: true` where possible; durations from `theme.duration`.
10. Dependencies: `react`, `react-native`, `react-native-svg`, `@ism/tokens`. No other packages (no gesture-handler, reanimated, expo). Where a gesture is documented (drag-down sheet) use `PanResponder`.
11. Server-render safe in tests: no calls to native modules at render time; effects only.

## Checking

From `packages/react-native`: `npx tsc --noEmit -p tsconfig.json` and `npm test`. Both must pass for your components (the test "every React Native component … has an example" fails until all groups are done; ignore only that one). No `any`, no `@ts-ignore`.
