# ISM Design System for Android

Jetpack Compose implementation of the ISM Design System: theme, fonts, 23 components, vector icons and logos. One Gradle library module, `ism-design-system`, namespace `bible.ism.design`, minSdk 24, compileSdk 35, Compose BOM 2024.12.01, Kotlin 2.0.21 with the Compose compiler plugin, AGP 8.7.3.

> **Written without compiling.** This module was authored in an environment with no Kotlin compiler and no Gradle (`kotlinc` and `./gradlew` were not available). It has never been built, previewed or tested. Open `packages/android` in Android Studio (Ladybug or newer), fix any compile errors, run `./gradlew :ism-design-system:testDebugUnitTest`, review every `@Preview` and run the Compose screens on a device **before any release**. The Gradle wrapper is not included; Android Studio creates it (or run `gradle wrapper --gradle-version 8.9`).

## Install

Placeholder coordinates: `bible.ism:design-system:3.0.0`. Nothing is published yet.

Maven (once published) or JitPack (placeholder, replace with the real repository):

```kotlin
// settings.gradle.kts
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven("https://jitpack.io")          // placeholder
    }
}

// app/build.gradle.kts
dependencies {
    implementation("bible.ism:design-system:3.0.0")   // placeholder coordinates
}
```

Local development: include the module directly.

```kotlin
// settings.gradle.kts
include(":ism-design-system")
project(":ism-design-system").projectDir = file("../ism-design-system/packages/android/ism-design-system")
```

Publish to a local folder with `./gradlew :ism-design-system:publishReleasePublicationToLocalRepository` (writes `build/repo`).

## Theme

Wrap your UI once. `ISMTheme` follows the system dark setting unless you pass `darkTheme`.

```kotlin
import bible.ism.design.theme.ISMTheme

setContent {
    ISMTheme {                       // or ISMTheme(darkTheme = true)
        Surface(color = ISMTheme.colors.background) { MyScreen() }
    }
}
```

Read values anywhere inside it:

| Accessor | What it is |
|---|---|
| `ISMTheme.colors` | `ISMSemanticColors`, resolved for light or dark: `background`, `surface`, `textPrimary`, `textSecondary`, `action`, `link`, `focusRing`, `error`, `successBg`, ... |
| `ISMTheme.typography` | `ISMTypography`: app scale (`largeTitle` 32/600, `headline` 17/600, `body` 16, `callout` 15, `subhead` 14, `footnote` 13, `overline`, `verse` ...) plus web roles (`webH1`..`webBody`, `scripture`, `pullQuote`) |
| `ISMTheme.shapes` | `ISMShapes`: `xs`, `sm`, `md`, `ml`, `lg`, `xl`, `pill`, `sheet` |
| `ISMTheme.spacing` | `ISMSpacing` (`space1` 4dp ... `space10` 128dp) |

Raw palette and scales (`ISMColors`, `ISMSpacing`, `ISMRadius`, `ISMLayout`, `ISMSize`, `ISMMotion`, ...) live in `bible.ism.design.tokens` and are generated from `tokens/tokens.json`; never edit them by hand.

`ISMTheme` also installs a Material 3 `MaterialTheme` with the same colours, so Material parts (`SnackbarHost`, `Text`, `Icon`) match. Components do not depend on Material shapes or ripples: pressed states are explicit fills, as in `rules/states.md`.

### Fonts

Inter (400, 500, 600, 700) and Lora (regular, italic, 600, 600 italic, 700, 700 italic) are bundled in `res/font` and exposed as `ISMInter` and `ISMLora`. Inter and Lora cover Latin, Cyrillic and Greek only. Ethiopic, Myanmar and Arabic-script text falls back to the Android system fonts. The Noto families named in `rules/multilingual-rtl.md` are not bundled; add them to your app (downloadable fonts or `res/font`) if the system fallback is not good enough.

### Text per script

```kotlin
ISMText(text = "ሰላም", lang = "am")                 // line-height 1.65, letter-spacing 0
ISMText(text = "مرحبا", lang = "ar", heading = true) // RTL text direction, heading line-height 1.4
ISMText(text = "မင်္ဂလာပါ", lang = "my")              // line-height 1.9
```

`ISMText` applies `TextStyle.forLanguage(lang, heading)`: Ethiopic (am, ti) 1.65, Myanmar (my) 1.9, Arabic script (ar, fa, ur) 1.9, letter-spacing 0 and no italics for all of them; Arabic script and `he` get `TextDirection.Rtl`. Latin keeps the style's own line-height. Every component takes a `lang` parameter and forwards it to `ISMText`. The helpers are pure Kotlin in `ISMScriptTypography` (`scriptFor`, `isRtl`, `lineHeightMultiplier`) and are unit tested.

### Reduced motion

`LocalReducedMotion` is true when `Settings.Global.ANIMATOR_DURATION_SCALE` is 0 (Developer options "Animator duration scale: off", or accessibility "Remove animations"). `ISMTheme` provides it and updates it live. Components use `ismAnimationSpec()`, which snaps instead of tweening, and the spinner, skeleton shimmer and indeterminate bar stop moving. Use `ismAnimationSpec()` in your own animations.

## Components

All components live in `bible.ism.design.components`, each with a `@Preview` (light and dark stacked). Their contracts are the repository's `components/<Name>/README.md` and `spec.json`.

| Component | Composables |
|---|---|
| Logos | `ISMLogoImage` |
| Iconography | `ISMIcon` (UI and ministry icons), `ISMIconTile`, `ISMUIIcon.mirrorsInRtl` |
| Button | `ISMButton` (primary, secondary, ghost, light, outlineLight; sm, md, lg; `loading`, `enabled`) |
| IconButton | `ISMIconButton` (ghost, outline, outlineOnDark, solid, tonal, glass) |
| Chip | `ISMChip` |
| Badge | `ISMBadge`, `ISMCountBadge`, `ISMLiveBadge` |
| Card | `ISMCard` |
| Divider | `ISMDivider`, `ISMVerticalDivider`, `ISMThread` |
| ListRow | `ISMListRow` |
| Avatar | `ISMAvatar`, `ISMAvatarStack` |
| Input | `ISMTextField` (label, hint, `errorText`, `success`, optional, loading) |
| SearchField | `ISMSearchField` |
| Switch | `ISMSwitch` |
| Alert | `ISMAlert` |
| Toast | `ISMSnackbarHost`, `ISMToast`, `showISMToast` |
| Loader | `ISMSpinner`, `ISMSkeleton`, `ISMSkeletonRow` |
| Progress | `ISMProgressBar`, `ISMStepProgress`, `ISMProgressRing` |
| EmptyState | `ISMEmptyState` |
| VerseBlock | `ISMVerseBlock` (compact, card, verse of the day) |
| AppBar | `ISMAppBar`, `ISMAppBarAction` |
| TabBar | `ISMTabBar`, `ISMTabItem` |
| SettingsRow | `ISMSettingsGroup`, `ISMSettingsRow`, `ISMSettingsToggleRow`, `ISMSettingsRadioRow` |
| Fab | `ISMFab`, `ISMRefreshIndicator` |

```kotlin
ISMButton(text = "Give online", onClick = ::give, trailingIcon = ISMUIIcon.ArrowUpRight)
ISMButton(text = "Sending", onClick = {}, loading = true)

ISMTextField(
    value = email, onValueChange = { email = it },
    label = "Email", errorText = if (invalid) "Enter an email like name@example.org." else null,
)

val snackbarHost = remember { SnackbarHostState() }
ISMSnackbarHost(snackbarHost, Modifier.padding(16.dp))
scope.launch { snackbarHost.showISMToast("Link copied", tone = ISMToastTone.Success) }
```

### Behaviour shared by all components

- **Touch targets**: every control is at least 44dp in both directions (`ISMLayout.tapTarget`). Smaller visuals (36dp small button, 36dp small icon button, 24dp clear button, 51 x 31dp switch) sit inside a 44dp touch area.
- **States** (`rules/states.md`): pressed, hovered (pointer or hardware) and focused visuals come from the `interactionSource` parameter. Focus draws a 2dp ring with a 3dp halo (`Modifier.ismFocusRing`; inset inside clipped rows and tabs). Disabled dims to 45%, text fields use the gray fill instead. Loading blocks clicks and announces itself. Errors always carry a message and an icon, never colour alone.
- **Semantics**: roles (`Button`, `Switch`, `Tab`, `RadioButton`), required `contentDescription` on icon-only controls, `stateDescription` for loading and badges, `liveRegion` for alerts, toasts and field errors (assertive for errors), `heading()` on titles, progress range info.
- **Strings**: components ship no string resources. Every spoken or visible default ("Loading", "Dismiss", "Clear search", tone words) is a parameter with an English default; pass translated strings.
- **No experimental APIs**: no `@OptIn` is used anywhere in the module. Wrapping rows use a small hand-written layout (`ISMWrapRow`) instead of `FlowRow`.

## Right-to-left

- Layout mirrors automatically through `LocalLayoutDirection`; components use start and end, never left and right (`padding(start = ...)`, `Alignment.CenterStart`, `placeRelative`).
- `Modifier.mirrorInRtl()` flips a glyph with `graphicsLayer(scaleX = -1f)` when the layout is RTL. `ISMIcon` applies it automatically for `ISMUIIcon.mirrorsInRtl` (ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, i.e. back, forward and drill-in). Do not mirror play and skip controls, check, close, magnifier, the down caret, the off-page diagonal arrow, logos or QR codes.
- `ISMLanguageProvider(lang) { ... }` sets the layout direction for a block whose language differs from the device language (for example an Arabic verse in an English UI).
- Phone numbers, URLs, verse references and numerals in code should stay left to right: give those `ISMText`s `lang = "en"` or wrap them in `ISMLanguageProvider("en")`.
- Progress and sliders fill from the start edge; the indeterminate bar reverses in RTL.
- Test with real strings: a long Amharic and a long Arabic string in every component. Do not fix widths on buttons, tabs or labels.

## Tests

- `src/test`: JVM unit tests for token constants (Horizon Blue `0xFF046DE3`, tap target 44dp, controls, radii, opacity, motion) and the script and RTL helpers.
- `src/androidTest`: placeholder instrumented test that every `ISMUIIcon`, `ISMMinistryIcon`, `ISMLogo` and bundled font resolves to a real resource.

## Known gaps against the component contracts

- `ISMButton` with `loading = true` and no leading icon grows by the spinner slot; set a minimum width to keep it exact.
- `ISMToast`: one toast at a time (Material's queue), no pause-on-focus, no "three at most" stack. Auto-hide is 5s, 8s with an action.
- Removable tags (`.cr-tag`), the audio `ListRow` with progress and play, the search app bar with Cancel, the mini player, store-usage bars and `.ap-ep` feed rows are not implemented.
- Parameters are named in Compose style (`enabled`, `loading`, `errorText`) rather than the `isEnabled`, `isLoading`, `isError` of `rules/states.md`.
- Pressed feedback is an explicit fill, not a ripple.
- Logo patterns and clear-space enforcement are not provided; follow `components/Logos`.

## Regenerating tokens and icons

`tokens/ISMTokens.kt`, `icons/ISMIcons.kt`, `res/values/ism_*.xml` and `res/drawable/*.xml` are generated by `scripts/build-tokens.mjs`, `scripts/build-icons.mjs` and `npm run sync:native`. Do not edit them by hand. Fonts in `res/font` were copied from `packages/web/assets/fonts-static` with lowercase snake_case names (`inter_semibold.ttf`).
