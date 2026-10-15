# ISMDesignSystem (iOS)

SwiftUI implementation of the ISM Design System for iOS 16 and later. One Swift Package product: `ISMDesignSystem`.

> **Written without compiling.** This package was authored in an environment with no Swift toolchain (`swiftc` was not available). It has never been built, previewed or tested. Open it in Xcode 15 or later, fix any compile errors, run the `ISMDesignSystemTests` target and review every `#Preview` on device and simulator **before any release**.

## Install (Swift Package Manager)

Xcode: File > Add Package Dependencies, then add this repository and select the `ISMDesignSystem` library.

`Package.swift`:

```swift
dependencies: [
    .package(path: "../ism-design-system/packages/ios")   // or a url + version
],
targets: [
    .target(name: "MyApp", dependencies: [
        .product(name: "ISMDesignSystem", package: "ios")
    ])
]
```

Requirements: Swift 5.9 (Xcode 15), iOS 16+. The package targets iOS only. Run the tests with `xcodebuild test -scheme ISMDesignSystem -destination 'platform=iOS Simulator,name=iPhone 15'` (they use UIKit, so `swift test` on a Mac host will not work).

## Fonts

Inter (Regular, Medium, SemiBold, Bold) and Lora (Regular, SemiBold, Bold, Italic, SemiBoldItalic, BoldItalic) are bundled in `Resources/Fonts` and registered at runtime. No `Info.plist` entry is needed. Call it once at launch, before the first view renders:

```swift
import SwiftUI
import ISMDesignSystem

@main
struct MyApp: App {
    init() { ISMFonts.register() }
    var body: some Scene {
        WindowGroup { RootView().ismTheme() }
    }
}
```

`ISMFont.sans(_:_:relativeTo:)`, `ISMFont.serif(...)` and `ISMFont.font(for:relativeTo:)` build `Font.custom(_, size:, relativeTo:)`, so all text scales with Dynamic Type. Inter and Lora cover Latin, Cyrillic and Greek only. Ethiopic, Myanmar and Arabic-script text falls back to the system fonts. The Noto families named in `rules/multilingual-rtl.md` are **not** bundled; add them to your app if you need them on iOS versions where the system fallback is not good enough.

## Theme

```swift
@Environment(\.ismTheme) private var theme   // ISMTheme: background, surface, text, textSecondary, textTertiary,
                                             // border, primary, primaryPressed, onPrimary, link, focus,
                                             // error/success/warning/info (+ Background, Line), live, disabledOpacity
```

- `ISMTheme.light`, `ISMTheme.dark`, `ISMTheme.resolve(_ scheme:)`.
- `.ismTheme()` on your root view installs the theme for the current colour scheme. `.ismTheme(.dark)` forces one.
- Components resolve their colours from `\.colorScheme` themselves, so they are correct even if you forget the modifier. Use `\.ismTheme` in your own views.
- Colour pairs follow `rules/accessibility.md`: `blueOnDark` (not `horizonBlue`) for text on black, no `gray500` text.

## Typography

```swift
ISMText("Heading", style: .webH2)
ISMText("በመጀመሪያ ቃል ነበረ።", style: .webBody, lang: "am")   // line-height 1.65, no tracking
ISMText("في البدء كان الكلمة", style: .webBody, lang: "ar")    // line-height 1.9, right-to-left, no tracking
```

`ISMTypeStyle` mirrors the token names in `ISMType` (`webH1` ... `scripture`, `editorialQuote`). With a `lang`, `ISMText` uses the per-script line-height (am/ti 1.65, my 1.9, ar/fa/ur 1.9, heading values for heading styles), removes tracking, uppercase and italics, and sets the layout direction for RTL languages. SwiftUI can only add line spacing, so a token line-height below the font's natural 1.21 em (the tight display headings) is not tightened.

## Components

All components live in `Sources/ISMDesignSystem/Components`, each with a `#Preview`. Minimum 44pt hit targets, VoiceOver labels and traits, a focus ring when focused (2pt outline, 2pt offset, halo; iOS 17+ for hardware-keyboard focus), Reduce Motion honoured (`\.accessibilityReduceMotion`), 45% opacity for disabled.

| Spec | View(s) |
|---|---|
| Logos | `ISMLogoView` |
| Iconography | `ISMIcon`, `ISMIcon(ministry:)`, `ISMIconTile`, `ISMDirectionalIcon` |
| Button | `ISMButton`, `ISMButtonStyle` (primary, secondary, ghost, light, outlineLight; sm, md, lg; loading; pressed) |
| IconButton | `ISMIconButton` (plain, outline, tinted, solid, glass) |
| Chip | `ISMChip` |
| Badge | `ISMBadge`, `ISMCount`, `ISMLiveBadge` |
| Card | `ISMCard` |
| Divider | `ISMDivider` (hairline, strong, thread, accent, labelled "or", vertical) |
| ListRow | `ISMListRow`, `ISMListGroup` |
| Avatar | `ISMAvatar`, `ISMAvatarStack` |
| Input | `ISMTextField` (label, hint, error, optional, secure, loading) |
| SearchField | `ISMSearchField` |
| Switch | `ISMToggle`, `ISMToggleControl` |
| Alert | `ISMAlert` |
| Toast | `ISMToast`, `.ismToast(item:)` with `ISMToastItem` |
| Loader | `ISMSpinner`, `ISMSkeleton`, `ISMSkeletonList`, `ISMSkeletonText` |
| Progress | `ISMProgressBar`, `ISMProgressRing`, `ISMStepProgress` |
| EmptyState | `ISMEmptyState` |
| VerseBlock | `ISMVerseBlock` (card, verse of the day), `ISMCitation` |
| AppBar | `ISMAppBar`, `ISMBackButton` |
| TabBar | `ISMTabBar`, `ISMTabItem` |
| SettingsRow | `ISMSettingsRow` |
| Fab | `ISMFab`, `.ismFab(label:action:)` |

Helpers: `ISMFlow` (wrapping row), `.ismFocusRing(cornerRadius:)`, `.ismShadow(_:)`, `.ismLTR()`.

Ministry icons use a labelled initialiser (`ISMIcon(ministry: .radio)`) because `home`, `globe`, `phone` and others exist in both icon sets and would otherwise be ambiguous.

```swift
ISMButton("Give online", trailingIcon: .arrowUpRight) { give() }
ISMTextField("Email", text: $email, error: emailError, keyboardType: .emailAddress)
content.ismToast(item: $toast)               // toast = ISMToastItem("Verse copied", actionTitle: "Undo") { ... }
ISMTabBar(items: items, selection: $tab)      // place with .safeAreaInset(edge: .bottom)
```

## Right-to-left

SwiftUI mirrors layout automatically. In addition:

- Directional icons (`chevronLeft`, `chevronRight`, `arrowLeft`, `arrowRight`) mirror in RTL (`ISMUIIcon.mirrorsInRTL`, applied by `ISMIcon` and inside components). Use `ISMDirectionalIcon` to force mirroring of another icon.
- Play, pause, skip, check, close, search, the up-right arrow and logos never mirror.
- Isolate phone numbers, verse references, URLs and email addresses with `.ismLTR()` (`ISMVerseBlock` does this for the reference).
- Progress bars and the toggle fill from the leading edge, so they mirror. `ISMFlowLayout` places items using the environment direction (via `ISMFlow`).
- `ISMText(lang:)` and `.ismLayoutDirection(forLanguage:)` set the direction from a language code (ar, fa, ur, he).
- Test with a long Amharic and a long Arabic string. Do not fix widths on buttons, tabs or labels; all labels here wrap.

## Known gaps

- Announcement bar (Alert spec), mini-player, pull-to-refresh and snackbar variants are not built; the toast covers the snackbar role.
- Toast: the auto-dismiss timer lengthens while VoiceOver runs but does not pause on touch.
- `ISMButton.size == .sm` is 36pt tall with a 44pt hit area, as the spec allows for dense toolbars only.
- Avatar violet uses dark initials for contrast (white on `gradientViolet` fails 4.5:1).
- Generated files (`Generated/ISMTokens.swift`, `Generated/ISMIcons.swift`) are produced by `scripts/build-tokens.mjs` and `scripts/build-icons.mjs`. Do not edit them.
