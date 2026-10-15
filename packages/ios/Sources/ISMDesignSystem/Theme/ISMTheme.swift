import SwiftUI

/// Semantic, colour-scheme aware colours. Light and dark pairs follow rules/accessibility.md:
/// never `gray500` text, `blueOnDark` (not `horizonBlue`) for text on black, white on `horizonBlue` for fills.
public struct ISMTheme {
    public let isDark: Bool

    // Surfaces
    public let background: Color
    public let surface: Color
    /// Muted fill: input tracks, skeletons, pressed rows.
    public let surfaceMuted: Color
    /// Pressed fill for rows and icon buttons.
    public let surfacePressed: Color
    public let inverseSurface: Color
    public let onInverse: Color
    public let selectedTint: Color

    // Text
    public let text: Color
    public let textSecondary: Color
    public let textTertiary: Color
    public let placeholder: Color

    // Lines
    public let border: Color
    public let borderStrong: Color
    public let fieldBorder: Color

    // Action
    public let primary: Color
    public let primaryPressed: Color
    public let onPrimary: Color
    public let link: Color
    public let focus: Color

    // Status
    public let error: Color
    public let errorBackground: Color
    public let errorLine: Color
    public let errorField: Color
    public let success: Color
    public let successBackground: Color
    public let successLine: Color
    public let warning: Color
    public let warningBackground: Color
    public let warningLine: Color
    public let info: Color
    public let infoBackground: Color
    public let infoLine: Color
    public let live: Color

    // Misc
    public let disabledOpacity: Double
    public let cardShadow: ISMShadowSpec?

    public static func resolve(_ scheme: ColorScheme) -> ISMTheme {
        return scheme == .dark ? ISMTheme.dark : ISMTheme.light
    }

    public static let light = ISMTheme(
        isDark: false,
        background: ISMColor.offWhite,
        surface: ISMColor.white,
        surfaceMuted: ISMColor.gray100,
        surfacePressed: ISMColor.gray100,
        inverseSurface: ISMColor.charcoal900,
        onInverse: ISMColor.white,
        selectedTint: ISMColor.blueTint,
        text: ISMColor.textPrimaryLight,
        textSecondary: ISMColor.gray700,
        textTertiary: ISMColor.gray600,
        placeholder: ISMColor.grayPlaceholder,
        border: ISMColor.gray200,
        borderStrong: ISMColor.gray300,
        fieldBorder: Color(.sRGB, red: 0, green: 0, blue: 0, opacity: 0.22),
        primary: ISMColor.horizonBlue,
        primaryPressed: ISMColor.charcoal900,
        onPrimary: ISMColor.white,
        link: ISMColor.horizonBlue,
        focus: ISMColor.horizonBlue,
        error: ISMColor.error,
        errorBackground: ISMColor.errorBg,
        errorLine: ISMColor.errorLine,
        errorField: ISMColor.errorFieldBg,
        success: ISMColor.success,
        successBackground: ISMColor.successBg,
        successLine: ISMColor.successLine,
        warning: ISMColor.warning,
        warningBackground: ISMColor.warningBg,
        warningLine: ISMColor.warningLine,
        info: ISMColor.info,
        infoBackground: ISMColor.infoBg,
        infoLine: ISMColor.infoLine,
        live: ISMColor.live,
        disabledOpacity: ISMOpacity.opacityDisabled,
        cardShadow: ISMShadow.cardLight
    )

    public static let dark = ISMTheme(
        isDark: true,
        background: ISMColor.black,
        surface: ISMColor.charcoal900,
        surfaceMuted: ISMColor.charcoal800,
        surfacePressed: ISMColor.charcoal800,
        inverseSurface: ISMColor.charcoal800,
        onInverse: ISMColor.white,
        selectedTint: ISMColor.blueOnDark.opacity(0.16),
        text: ISMColor.textPrimaryDark,
        textSecondary: ISMColor.textSecondaryDark,
        textTertiary: ISMColor.textTertiaryDark,
        placeholder: ISMColor.textTertiaryDark,
        border: ISMColor.borderHairlineDark,
        borderStrong: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.32),
        fieldBorder: Color(.sRGB, red: 1, green: 1, blue: 1, opacity: 0.32),
        primary: ISMColor.horizonBlue,
        primaryPressed: ISMColor.horizonBlueDim,
        onPrimary: ISMColor.white,
        link: ISMColor.blueOnDark,
        focus: ISMColor.blueOnDark,
        error: ISMColor.errorOnDark,
        errorBackground: ISMColor.errorOnDark.opacity(0.16),
        errorLine: ISMColor.errorOnDark.opacity(0.4),
        errorField: ISMColor.errorOnDark.opacity(0.10),
        success: ISMColor.successOnDark,
        successBackground: ISMColor.successOnDark.opacity(0.16),
        successLine: ISMColor.successOnDark.opacity(0.4),
        warning: ISMColor.gradientGold,
        warningBackground: ISMColor.gradientGold.opacity(0.16),
        warningLine: ISMColor.gradientGold.opacity(0.4),
        info: ISMColor.blueOnDark,
        infoBackground: ISMColor.blueOnDark.opacity(0.16),
        infoLine: ISMColor.blueOnDark.opacity(0.4),
        live: ISMColor.live,
        disabledOpacity: ISMOpacity.opacityDisabled,
        cardShadow: nil
    )
}

// MARK: - Environment

private struct ISMThemeKey: EnvironmentKey {
    static let defaultValue: ISMTheme = ISMTheme.light
}

public extension EnvironmentValues {
    /// The resolved ISM theme. Set by `.ismTheme()`; app code can read it with `@Environment(\.ismTheme)`.
    /// ISM components resolve their own colours from `\.colorScheme`, so they are correct even without the modifier.
    var ismTheme: ISMTheme {
        get { self[ISMThemeKey.self] }
        set { self[ISMThemeKey.self] = newValue }
    }
}

private struct ISMThemeModifier: ViewModifier {
    @Environment(\.colorScheme) private var systemScheme
    let forced: ColorScheme?

    func body(content: Content) -> some View {
        let scheme: ColorScheme = forced ?? systemScheme
        return content
            .environment(\.colorScheme, scheme)
            .environment(\.ismTheme, ISMTheme.resolve(scheme))
    }
}

public extension View {
    /// Installs the ISM theme for the current (or a forced) colour scheme. Apply once near the root.
    func ismTheme(_ scheme: ColorScheme? = nil) -> some View {
        modifier(ISMThemeModifier(forced: scheme))
    }
}

/// Internal helper so every component resolves colours the same way.
struct ISMThemed<Content: View>: View {
    @Environment(\.colorScheme) private var scheme
    let content: (ISMTheme) -> Content

    init(@ViewBuilder content: @escaping (ISMTheme) -> Content) {
        self.content = content
    }

    var body: some View {
        content(ISMTheme.resolve(scheme))
    }
}

// MARK: - Resources

public enum ISMResources {
    /// The bundle that holds icons and fonts. Use it with `UIImage(named:in:with:)`.
    public static var bundle: Bundle { Bundle.module }
}
