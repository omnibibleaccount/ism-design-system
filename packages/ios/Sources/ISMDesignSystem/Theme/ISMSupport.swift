import SwiftUI

// MARK: - RTL helpers

/// A UI icon that mirrors in right-to-left layouts (chevrons that mean next/back, forward arrows).
/// Do not use it for play, pause, skip, check, close, magnifier or the up-right arrow.
public struct ISMDirectionalIcon: View {
    private let icon: ISMUIIcon
    private let size: CGFloat
    private let color: Color?
    private let label: String?

    public init(_ icon: ISMUIIcon, size: CGFloat = ISMSize.iconLg, color: Color? = nil, label: String? = nil) {
        self.icon = icon
        self.size = size
        self.color = color
        self.label = label
    }

    public var body: some View {
        ISMIcon(icon, size: size, color: color, label: label, mirrors: true)
    }
}

public extension View {
    /// Isolates a left-to-right run (phone number, verse reference, URL) inside right-to-left text.
    func ismLTR() -> some View {
        environment(\.layoutDirection, .leftToRight)
    }

    /// Applies a layout direction from a language code (ar, fa, ur, he are right-to-left).
    func ismLayoutDirection(forLanguage lang: String?) -> some View {
        modifier(ISMLanguageDirectionModifier(lang: lang))
    }

    /// Applies an ISM shadow token. `nil` draws no shadow.
    func ismShadow(_ spec: ISMShadowSpec?) -> some View {
        shadow(
            color: spec?.color ?? Color.clear,
            radius: spec?.radius ?? 0,
            x: spec?.x ?? 0,
            y: spec?.y ?? 0
        )
    }

    /// `.focusable()` where the platform supports it (iOS 17+); a no-op before.
    @ViewBuilder
    func ismFocusable() -> some View {
        if #available(iOS 17.0, *) {
            self.focusable()
        } else {
            self
        }
    }

    /// Visible focus ring: 2pt outline, 2pt offset and a soft halo (rules/states.md).
    func ismFocusRing(cornerRadius: CGFloat, offset: CGFloat = ISMSize.focusOffset) -> some View {
        modifier(ISMFocusRingModifier(cornerRadius: cornerRadius, offset: offset))
    }

    /// Sets an accessibility label only when one is given (keeps the automatic label otherwise).
    @ViewBuilder
    func ismAccessibilityLabel(_ label: String?) -> some View {
        if let label = label {
            self.accessibilityLabel(Text(label))
        } else {
            self
        }
    }

    /// Minimum 44pt hit target, centred, without changing visuals.
    func ismMinTapTarget() -> some View {
        frame(minWidth: ISMLayout.tapTarget, minHeight: ISMLayout.tapTarget)
            .contentShape(Rectangle())
    }
}

private struct ISMLanguageDirectionModifier: ViewModifier {
    @Environment(\.layoutDirection) private var current
    let lang: String?

    func body(content: Content) -> some View {
        let direction: LayoutDirection = (lang != nil && ISMScriptSupport.isRTL(lang)) ? .rightToLeft : current
        return content.environment(\.layoutDirection, direction)
    }
}

// MARK: - Focus

struct ISMFocusRingModifier: ViewModifier {
    @Environment(\.colorScheme) private var scheme
    @FocusState private var isFocused: Bool
    let cornerRadius: CGFloat
    let offset: CGFloat

    func body(content: Content) -> some View {
        let theme = ISMTheme.resolve(scheme)
        return content
            .ismFocusable()
            .focused($isFocused)
            .overlay(
                ZStack {
                    if isFocused {
                        RoundedRectangle(cornerRadius: max(0, cornerRadius + offset), style: .continuous)
                            .stroke(theme.focus.opacity(0.35), lineWidth: 3)
                            .padding(-(offset + ISMSize.focusWidth + 1.5))
                        RoundedRectangle(cornerRadius: max(0, cornerRadius + offset), style: .continuous)
                            .stroke(theme.focus, lineWidth: ISMSize.focusWidth)
                            .padding(-(offset + ISMSize.focusWidth / 2))
                    }
                }
                .allowsHitTesting(false)
            )
    }
}

// MARK: - Motion

enum ISMMotionHelper {
    /// Returns nil (no animation) when Reduce Motion is on.
    static func animation(_ animation: Animation, reduceMotion: Bool) -> Animation? {
        return reduceMotion ? nil : animation
    }
}

// MARK: - Misc colours

enum ISMInternalColor {
    /// Brand badge text (#7A4B0C), from the .badge-brand class.
    static let brandInk = Color(.sRGB, red: 0.4784, green: 0.2941, blue: 0.0471, opacity: 1)
}

// MARK: - Flow layout

/// Wrapping row layout for chips and suggestions.
public struct ISMFlowLayout: Layout {
    public var spacing: CGFloat
    public var lineSpacing: CGFloat
    public var centered: Bool
    /// Layout does not mirror by itself; `ISMFlow` passes the environment layout direction in here.
    public var isRTL: Bool

    public init(spacing: CGFloat = ISMSpacing.space2, lineSpacing: CGFloat = ISMSpacing.space2, centered: Bool = false, isRTL: Bool = false) {
        self.spacing = spacing
        self.lineSpacing = lineSpacing
        self.centered = centered
        self.isRTL = isRTL
    }

    private struct Row {
        var indices: [Int] = []
        var width: CGFloat = 0
        var height: CGFloat = 0
    }

    private func rows(for subviews: Subviews, maxWidth: CGFloat) -> [Row] {
        var result: [Row] = []
        var current = Row()
        for index in subviews.indices {
            let size = subviews[index].sizeThatFits(ProposedViewSize(width: maxWidth, height: nil))
            let needed: CGFloat = current.indices.isEmpty ? size.width : current.width + spacing + size.width
            if needed > maxWidth && !current.indices.isEmpty {
                result.append(current)
                current = Row()
            }
            if current.indices.isEmpty {
                current.width = size.width
            } else {
                current.width += spacing + size.width
            }
            current.height = max(current.height, size.height)
            current.indices.append(index)
        }
        if !current.indices.isEmpty {
            result.append(current)
        }
        return result
    }

    public func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth: CGFloat = proposal.width ?? CGFloat.infinity
        let laidOut = rows(for: subviews, maxWidth: maxWidth)
        var width: CGFloat = 0
        var height: CGFloat = 0
        for (i, row) in laidOut.enumerated() {
            width = max(width, row.width)
            height += row.height
            if i > 0 { height += lineSpacing }
        }
        if let proposed = proposal.width, proposed.isFinite {
            width = max(width, 0)
        }
        return CGSize(width: width, height: height)
    }

    public func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let laidOut = rows(for: subviews, maxWidth: bounds.width)
        var y = bounds.minY
        for row in laidOut {
            var offset: CGFloat = 0
            if centered {
                offset += max(0, (bounds.width - row.width) / 2)
            }
            for index in row.indices {
                let size = subviews[index].sizeThatFits(ProposedViewSize(width: bounds.width, height: nil))
                let x: CGFloat = isRTL ? (bounds.maxX - offset - size.width) : (bounds.minX + offset)
                subviews[index].place(
                    at: CGPoint(x: x, y: y + (row.height - size.height) / 2),
                    anchor: .topLeading,
                    proposal: ProposedViewSize(width: size.width, height: size.height)
                )
                offset += size.width + spacing
            }
            y += row.height + lineSpacing
        }
    }
}

/// Wrapping row of views that follows the environment layout direction.
public struct ISMFlow<Content: View>: View {
    @Environment(\.layoutDirection) private var layoutDirection
    private let spacing: CGFloat
    private let centered: Bool
    private let content: Content

    public init(spacing: CGFloat = ISMSpacing.space2, centered: Bool = false, @ViewBuilder content: () -> Content) {
        self.spacing = spacing
        self.centered = centered
        self.content = content()
    }

    public var body: some View {
        ISMFlowLayout(spacing: spacing, lineSpacing: spacing, centered: centered, isRTL: layoutDirection == .rightToLeft) {
            content
        }
    }
}
