import SwiftUI

public enum ISMButtonVariant {
    /// Solid Horizon Blue. The ONE main action in a group.
    case primary
    /// Black outline on transparent, for light sections.
    case secondary
    /// Text-only inline action.
    case ghost
    /// Solid white, for dark sections.
    case light
    /// White outline on transparent, for dark sections.
    case outlineLight
}

public enum ISMButtonSize {
    /// 36pt. Dense toolbars only; the hit area is still 44pt.
    case sm
    /// 44pt default.
    case md
    /// 52pt.
    case lg

    public var minHeight: CGFloat {
        switch self {
        case .sm: return ISMSize.controlSm
        case .md: return ISMSize.controlMd
        case .lg: return ISMSize.controlLg
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .sm: return 20
        case .md: return 26
        case .lg: return 32
        }
    }

    var fontSize: CGFloat {
        switch self {
        case .sm: return 14
        case .md: return 16
        case .lg: return 17
        }
    }
}

private struct ISMButtonColors {
    let fill: Color
    let foreground: Color
    let border: Color
}

private func ismButtonColors(_ variant: ISMButtonVariant, theme: ISMTheme, pressed: Bool) -> ISMButtonColors {
    switch variant {
    case .primary:
        return ISMButtonColors(
            fill: pressed ? theme.primaryPressed : theme.primary,
            foreground: theme.onPrimary,
            border: Color.clear
        )
    case .secondary:
        let ink: Color = theme.isDark ? ISMColor.white : ISMColor.black
        let line: Color = theme.isDark ? Color.white.opacity(0.55) : Color.black.opacity(0.4)
        let press: Color = theme.isDark ? Color.white.opacity(0.16) : Color.black.opacity(0.12)
        return ISMButtonColors(fill: pressed ? press : Color.clear, foreground: ink, border: line)
    case .ghost:
        let normal: Color = theme.link
        let down: Color = theme.isDark ? ISMColor.white : ISMColor.charcoal900
        return ISMButtonColors(fill: Color.clear, foreground: pressed ? down : normal, border: Color.clear)
    case .light:
        return ISMButtonColors(
            fill: pressed ? ISMColor.gray200 : ISMColor.white,
            foreground: ISMColor.black,
            border: Color.clear
        )
    case .outlineLight:
        return ISMButtonColors(
            fill: pressed ? Color.white.opacity(0.18) : Color.clear,
            foreground: ISMColor.white,
            border: Color.white.opacity(0.55)
        )
    }
}

/// The ISM button look as a `ButtonStyle`. Use `ISMButton` unless you need a custom label.
/// Pressed state is driven by the platform; `forcePressed` pins it for previews and tests.
public struct ISMButtonStyle: ButtonStyle {
    public var variant: ISMButtonVariant
    public var size: ISMButtonSize
    public var isEnabled: Bool
    public var forcePressed: Bool

    public init(variant: ISMButtonVariant = .primary, size: ISMButtonSize = .md, isEnabled: Bool = true, forcePressed: Bool = false) {
        self.variant = variant
        self.size = size
        self.isEnabled = isEnabled
        self.forcePressed = forcePressed
    }

    public func makeBody(configuration: Configuration) -> some View {
        ISMButtonChrome(
            label: configuration.label,
            isPressed: configuration.isPressed || forcePressed,
            variant: variant,
            size: size,
            isEnabled: isEnabled
        )
    }
}

private struct ISMButtonChrome: View {
    @Environment(\.colorScheme) private var scheme

    let label: ButtonStyleConfiguration.Label
    let isPressed: Bool
    let variant: ISMButtonVariant
    let size: ISMButtonSize
    let isEnabled: Bool

    var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let colors = ismButtonColors(variant, theme: theme, pressed: isPressed)
        let padding: CGFloat = variant == .ghost ? 4 : size.horizontalPadding
        return label
            .foregroundColor(colors.foreground)
            .padding(.horizontal, padding)
            .frame(minHeight: size.minHeight)
            .background(Capsule().fill(colors.fill))
            .overlay(Capsule().strokeBorder(colors.border, lineWidth: 1))
            .opacity(isEnabled ? 1 : theme.disabledOpacity)
            .frame(minHeight: ISMLayout.tapTarget)
            .contentShape(Rectangle())
    }
}

/// Pill button. Variants primary / secondary / ghost / light / outlineLight, sizes sm / md / lg.
/// - Loading: a spinner replaces the leading icon, the label stays, taps are ignored and VoiceOver reads "Loading".
/// - Disabled: use `.disabled(true)`; the button fades to 45%.
public struct ISMButton: View {
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.colorScheme) private var scheme

    private let title: String
    private let variant: ISMButtonVariant
    private let size: ISMButtonSize
    private let leadingIcon: ISMUIIcon?
    private let trailingIcon: ISMUIIcon?
    private let isLoading: Bool
    private let reservesLoadingSpace: Bool
    private let forcePressed: Bool
    private let hint: String?
    private let action: () -> Void

    public init(
        _ title: String,
        variant: ISMButtonVariant = .primary,
        size: ISMButtonSize = .md,
        leadingIcon: ISMUIIcon? = nil,
        trailingIcon: ISMUIIcon? = nil,
        isLoading: Bool = false,
        reservesLoadingSpace: Bool = false,
        forcePressed: Bool = false,
        accessibilityHint: String? = nil,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.variant = variant
        self.size = size
        self.leadingIcon = leadingIcon
        self.trailingIcon = trailingIcon
        self.isLoading = isLoading
        self.reservesLoadingSpace = reservesLoadingSpace
        self.forcePressed = forcePressed
        self.hint = accessibilityHint
        self.action = action
    }

    private var spinnerTone: ISMSpinner.Tone {
        switch variant {
        case .primary: return .onPrimary
        case .ghost: return .brand
        case .secondary: return scheme == .dark ? .onDark : .ink
        case .light: return .ink
        case .outlineLight: return .onDark
        }
    }

    private var loadingValue: String {
        return isLoading ? "Loading" : ""
    }

    private var showsLeadingSlot: Bool {
        return leadingIcon != nil || isLoading || reservesLoadingSpace
    }

    public var body: some View {
        Button(action: {
            if !isLoading {
                action()
            }
        }) {
            HStack(spacing: ISMSpacing.space2) {
                if isLoading {
                    ISMSpinner(size: .s, tone: spinnerTone, label: nil)
                } else if let leading = leadingIcon {
                    ISMGlyph(leading, size: ISMSize.iconSm)
                } else if showsLeadingSlot {
                    Color.clear.frame(width: ISMSize.iconSm, height: ISMSize.iconSm)
                }
                Text(title)
                    .font(ISMFont.sans(size.fontSize, .semibold))
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
                if let trailing = trailingIcon {
                    ISMGlyph(trailing, size: ISMSize.iconSm)
                }
            }
        }
        .buttonStyle(ISMButtonStyle(variant: variant, size: size, isEnabled: isEnabled, forcePressed: forcePressed))
        .ismFocusRing(cornerRadius: size.minHeight / 2)
        .accessibilityValue(loadingValue)
        .accessibilityHint(hint ?? "")
        .accessibilityAddTraits(AccessibilityTraits.isButton)
    }
}

#Preview("Button") {
    ScrollView {
        VStack(alignment: .leading, spacing: 12) {
            ISMButton("Give online", trailingIcon: .arrowUpRight) {}
            ISMButton("Learn about ISM", variant: .secondary) {}
            ISMButton("Our statement of faith", variant: .ghost, trailingIcon: .arrowUpRight) {}
            ISMButton("Large primary", size: .lg) {}
            ISMButton("Small", size: .sm) {}
            ISMButton("Sending", isLoading: true) {}
            ISMButton("Pressed", forcePressed: true) {}
            ISMButton("Disabled") {}.disabled(true)
            VStack(alignment: .leading, spacing: 12) {
                ISMButton("Light", variant: .light) {}
                ISMButton("Outline light", variant: .outlineLight) {}
            }
            .padding(16)
            .background(Color.black)
        }
        .padding(16)
    }
}
