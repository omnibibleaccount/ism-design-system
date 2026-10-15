import SwiftUI

public enum ISMIconButtonKind {
    /// No fill, no ring (app bar actions).
    case plain
    /// Ring and surface fill (black ring on light, white ring on dark).
    case outline
    /// Gray-100 fill (small tools).
    case tinted
    /// Filled Horizon Blue (a player's Play). Counts as the group's one primary.
    case solid
    /// Translucent black with white icon, for use over photography.
    case glass
}

public enum ISMIconButtonSize {
    /// 36pt visual, 44pt hit area.
    case sm
    /// 44pt.
    case md
    /// 52pt.
    case lg

    public var diameter: CGFloat {
        switch self {
        case .sm: return ISMSize.controlSm
        case .md: return ISMSize.controlMd
        case .lg: return ISMSize.controlLg
        }
    }

    var iconSize: CGFloat {
        switch self {
        case .sm: return ISMSize.iconMd
        case .md, .lg: return ISMSize.iconLg
        }
    }
}

private struct ISMIconButtonChrome: View {
    @Environment(\.colorScheme) private var scheme

    let label: ButtonStyleConfiguration.Label
    let isPressed: Bool
    let kind: ISMIconButtonKind
    let size: ISMIconButtonSize
    let isEnabled: Bool

    var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let pressFill: Color = theme.isDark ? Color.white.opacity(0.16) : ISMColor.gray200
        let fill: Color
        let ring: Color
        let ink: Color
        switch kind {
        case .plain:
            fill = isPressed ? theme.surfacePressed : Color.clear
            ring = Color.clear
            ink = theme.isDark ? ISMColor.white : ISMColor.black
        case .outline:
            fill = isPressed ? pressFill : theme.surface
            ring = theme.fieldBorder
            ink = theme.isDark ? ISMColor.white : ISMColor.black
        case .tinted:
            fill = isPressed ? pressFill : theme.surfaceMuted
            ring = Color.clear
            ink = theme.isDark ? ISMColor.white : ISMColor.black
        case .solid:
            fill = isPressed ? ISMColor.horizonBlueDim : ISMColor.horizonBlue
            ring = Color.clear
            ink = ISMColor.white
        case .glass:
            fill = Color.black.opacity(isPressed ? 0.55 : 0.35)
            ring = Color.clear
            ink = ISMColor.white
        }
        return label
            .foregroundColor(ink)
            .frame(width: size.diameter, height: size.diameter)
            .background(Circle().fill(fill))
            .overlay(Circle().strokeBorder(ring, lineWidth: 1))
            .opacity(isEnabled ? 1 : theme.disabledOpacity)
            .frame(minWidth: ISMLayout.tapTarget, minHeight: ISMLayout.tapTarget)
            .contentShape(Rectangle())
    }
}

private struct ISMIconButtonStyle: ButtonStyle {
    let kind: ISMIconButtonKind
    let size: ISMIconButtonSize
    let isEnabled: Bool
    let forcePressed: Bool

    func makeBody(configuration: Configuration) -> some View {
        ISMIconButtonChrome(
            label: configuration.label,
            isPressed: configuration.isPressed || forcePressed,
            kind: kind,
            size: size,
            isEnabled: isEnabled
        )
    }
}

/// Round icon-only button. `label` is required: it is the VoiceOver name ("Share verse", "Close").
/// The hit area is always at least 44x44pt, also for the 36pt small size.
public struct ISMIconButton: View {
    @Environment(\.isEnabled) private var isEnabled

    private let icon: ISMUIIcon
    private let label: String
    private let kind: ISMIconButtonKind
    private let size: ISMIconButtonSize
    private let isLoading: Bool
    private let isToggled: Bool?
    private let forcePressed: Bool
    private let action: () -> Void

    /// - Parameter isToggled: Pass a value for toggle buttons (bookmark); it is exposed as the selected trait.
    public init(
        _ icon: ISMUIIcon,
        label: String,
        kind: ISMIconButtonKind = .plain,
        size: ISMIconButtonSize = .md,
        isLoading: Bool = false,
        isToggled: Bool? = nil,
        forcePressed: Bool = false,
        action: @escaping () -> Void
    ) {
        self.icon = icon
        self.label = label
        self.kind = kind
        self.size = size
        self.isLoading = isLoading
        self.isToggled = isToggled
        self.forcePressed = forcePressed
        self.action = action
    }

    private var loadingValue: String {
        return isLoading ? "Loading" : ""
    }

    public var body: some View {
        Button(action: {
            if !isLoading {
                action()
            }
        }) {
            if isLoading {
                ISMSpinner(size: .s, tone: kind == .solid || kind == .glass ? .onPrimary : .ink, label: nil)
            } else {
                ISMGlyph(icon, size: size.iconSize)
            }
        }
        .buttonStyle(ISMIconButtonStyle(kind: kind, size: size, isEnabled: isEnabled, forcePressed: forcePressed))
        .ismFocusRing(cornerRadius: size.diameter / 2)
        .accessibilityLabel(Text(label))
        .accessibilityValue(loadingValue)
        .accessibilityAddTraits(isToggled == true ? AccessibilityTraits.isSelected : AccessibilityTraits())
    }
}

#Preview("IconButton") {
    VStack(spacing: 16) {
        HStack(spacing: 12) {
            ISMIconButton(.share, label: "Share") {}
            ISMIconButton(.copy, label: "Copy", kind: .outline) {}
            ISMIconButton(.bookmark, label: "Bookmark", kind: .tinted, size: .sm, isToggled: true) {}
            ISMIconButton(.play, label: "Play", kind: .solid, size: .lg) {}
            ISMIconButton(.refresh, label: "Refresh", kind: .outline, isLoading: true) {}
            ISMIconButton(.trash, label: "Delete", kind: .outline) {}.disabled(true)
        }
        HStack {
            ISMIconButton(.close, label: "Close", kind: .glass) {}
        }
        .padding(16)
        .background(Color.gray)
    }
    .padding(16)
}
