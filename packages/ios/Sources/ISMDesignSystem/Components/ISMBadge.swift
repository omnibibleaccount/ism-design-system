import SwiftUI

public enum ISMBadgeTone {
    case neutral, info, success, warning, error, brand, partner
}

public enum ISMBadgeStyle {
    /// Tinted background, coloured text.
    case subtle
    /// Solid fill, white (or dark) text.
    case solid
}

public enum ISMBadgeSize {
    /// 24pt, 13pt text.
    case sm
    /// 28pt, 13pt text.
    case md
}

/// Status badge. The text carries the meaning; colour is a second signal.
public struct ISMBadge: View {
    @Environment(\.colorScheme) private var scheme

    private let text: String
    private let tone: ISMBadgeTone
    private let style: ISMBadgeStyle
    private let size: ISMBadgeSize
    private let showsDot: Bool

    public init(_ text: String, tone: ISMBadgeTone = .neutral, style: ISMBadgeStyle = .subtle, size: ISMBadgeSize = .sm, showsDot: Bool = false) {
        self.text = text
        self.tone = tone
        self.style = style
        self.size = size
        self.showsDot = showsDot
    }

    private func colors(_ theme: ISMTheme) -> (fill: Color, ink: Color, line: Color) {
        let none = Color.clear
        if style == .solid {
            switch tone {
            case .neutral: return (theme.isDark ? ISMColor.gray700 : ISMColor.charcoal900, ISMColor.white, none)
            case .info: return (ISMColor.horizonBlue, ISMColor.white, none)
            case .success: return (ISMColor.success, ISMColor.white, none)
            case .warning: return (ISMColor.warning, ISMColor.white, none)
            case .error: return (ISMColor.error, ISMColor.white, none)
            case .brand: return (ISMColor.gradientGold, ISMColor.charcoal900, none)
            case .partner: return (ISMColor.violetInk, ISMColor.white, none)
            }
        }
        switch tone {
        case .neutral: return (theme.surfaceMuted, theme.textSecondary, none)
        case .info: return (theme.infoBackground, theme.info, none)
        case .success: return (theme.successBackground, theme.success, none)
        case .warning: return (theme.warningBackground, theme.warning, theme.warningLine)
        case .error: return (theme.errorBackground, theme.error, none)
        case .brand:
            return theme.isDark
                ? (ISMColor.gradientGold.opacity(0.16), ISMColor.gradientGold, none)
                : (ISMColor.goldTint, ISMInternalColor.brandInk, none)
        case .partner:
            return theme.isDark
                ? (ISMColor.gradientViolet.opacity(0.22), ISMColor.white, none)
                : (ISMColor.violetTint, ISMColor.violetInk, none)
        }
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let c = colors(theme)
        let height: CGFloat = size == .sm ? 24 : 28
        return HStack(spacing: 6) {
            if showsDot {
                Circle().fill(c.ink).frame(width: 6, height: 6)
            }
            Text(text)
                .font(ISMFont.sans(13, .semibold, relativeTo: .footnote))
                .lineLimit(1)
        }
        .foregroundColor(c.ink)
        .padding(.horizontal, size == .sm ? 10 : 12)
        .frame(minHeight: height)
        .background(Capsule().fill(c.fill))
        .overlay(Capsule().strokeBorder(c.line, lineWidth: 1))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(text))
    }
}

/// Notification count. Horizon Blue, never red. Shows "99+" above 99.
public struct ISMCount: View {
    private let value: Int
    private let label: String?

    /// - Parameter label: Spoken text, for example "3 unread". Defaults to the number.
    public init(_ value: Int, label: String? = nil) {
        self.value = value
        self.label = label
    }

    public var body: some View {
        Text(value > 99 ? "99+" : String(value))
            .font(ISMFont.sans(11, .bold, relativeTo: .caption2))
            .foregroundColor(ISMColor.white)
            .padding(.horizontal, 5)
            .frame(minWidth: 18, minHeight: 18)
            .background(Capsule().fill(ISMColor.horizonBlue))
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(label ?? String(value)))
    }
}

/// On-air marker. The dot always sits next to the word ("Live", "On air"); the dot pulses unless Reduce Motion is on.
public struct ISMLiveBadge: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var scheme
    @State private var dim = false

    private let text: String

    public init(_ text: String = "Live") {
        self.text = text
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return HStack(spacing: 6) {
            Circle()
                .fill(theme.live)
                .frame(width: 8, height: 8)
                .opacity(dim ? 0.35 : 1)
            Text(text)
                .font(ISMFont.sans(13, .semibold, relativeTo: .footnote))
                .foregroundColor(theme.text)
        }
        .onAppear {
            if !reduceMotion {
                withAnimation(Animation.easeInOut(duration: ISMMotion.durationPulse).repeatForever(autoreverses: true)) {
                    dim = true
                }
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(text))
    }
}

#Preview("Badge") {
    VStack(alignment: .leading, spacing: 12) {
        ISMFlow {
            ISMBadge("Neutral")
            ISMBadge("Info", tone: .info)
            ISMBadge("Success", tone: .success, showsDot: true)
            ISMBadge("Warning", tone: .warning)
            ISMBadge("Error", tone: .error)
            ISMBadge("Brand", tone: .brand)
            ISMBadge("Partner", tone: .partner)
        }
        ISMFlow {
            ISMBadge("Solid", tone: .info, style: .solid, size: .md)
            ISMBadge("Solid", tone: .success, style: .solid)
            ISMBadge("Gold", tone: .brand, style: .solid)
            ISMCount(3)
            ISMCount(120)
            ISMLiveBadge()
        }
    }
    .padding(16)
}
