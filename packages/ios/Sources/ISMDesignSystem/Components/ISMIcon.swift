import SwiftUI

/// A UI line icon or ministry icon, template-rendered and tinted with the current foreground colour or `color`.
/// Ministry icons use the `ministry:` label because several names (home, globe, phone) exist in both sets.
/// Sizes: UI icons 16 / 20 / 24, ministry icons 24 / 32 / 48. Decorative unless `label` is given.
public struct ISMIcon: View {
    @Environment(\.colorScheme) private var scheme
    @ScaledMetric private var scaledSize: CGFloat

    private let image: Image
    private let color: Color?
    private let label: String?
    private let mirrors: Bool

    public init(_ icon: ISMUIIcon, size: CGFloat = ISMSize.iconLg, color: Color? = nil, label: String? = nil, mirrors: Bool? = nil) {
        self.image = icon.image
        self.color = color
        self.label = label
        self.mirrors = mirrors ?? icon.mirrorsInRTL
        self._scaledSize = ScaledMetric(wrappedValue: size, relativeTo: .body)
    }

    public init(ministry icon: ISMMinistryIcon, size: CGFloat = ISMSize.iconLg, color: Color? = nil, label: String? = nil) {
        self.image = icon.image
        self.color = color
        self.label = label
        self.mirrors = false
        self._scaledSize = ScaledMetric(wrappedValue: size, relativeTo: .body)
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let base = image
            .renderingMode(.template)
            .resizable()
            .scaledToFit()
            .frame(width: scaledSize, height: scaledSize)
            .foregroundColor(color ?? theme.text)
            .flipsForRightToLeftLayoutDirection(mirrors)
        if let label = label {
            base
                .accessibilityElement(children: .ignore)
                .accessibilityLabel(Text(label))
                .accessibilityAddTraits(AccessibilityTraits.isImage)
        } else {
            base.accessibilityHidden(true)
        }
    }
}

/// A tinted square tile that holds an icon (list-row leading icons, share tiles, medallions).
public struct ISMIconTile: View {
    public enum Tone {
        case blue, gold, neutral
    }

    @Environment(\.colorScheme) private var scheme

    private let image: Image
    private let size: CGFloat
    private let tone: Tone
    private let cornerRadius: CGFloat
    private let label: String?

    /// - Parameters:
    ///   - size: Tile edge. 30 for list rows (radius 8), 56 for share tiles (radius 16).
    public init(_ icon: ISMUIIcon, size: CGFloat = 30, tone: Tone = .blue, cornerRadius: CGFloat? = nil, label: String? = nil) {
        self.image = icon.image
        self.size = size
        self.tone = tone
        self.cornerRadius = cornerRadius ?? (size >= 48 ? ISMRadius.radiusMl : ISMRadius.radiusSm)
        self.label = label
    }

    public init(ministry icon: ISMMinistryIcon, size: CGFloat = 30, tone: Tone = .blue, cornerRadius: CGFloat? = nil, label: String? = nil) {
        self.image = icon.image
        self.size = size
        self.tone = tone
        self.cornerRadius = cornerRadius ?? (size >= 48 ? ISMRadius.radiusMl : ISMRadius.radiusSm)
        self.label = label
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let fill: Color
        let ink: Color
        switch tone {
        case .blue:
            fill = theme.selectedTint
            ink = theme.isDark ? ISMColor.blueOnDark : ISMColor.horizonBlue
        case .gold:
            fill = theme.isDark ? ISMColor.gradientGold.opacity(0.16) : ISMColor.goldTint
            ink = theme.isDark ? ISMColor.gradientGold : ISMColor.warning
        case .neutral:
            fill = theme.surfaceMuted
            ink = theme.textSecondary
        }
        let glyph: CGFloat = (size * 0.56).rounded()
        let tile = ZStack {
            RoundedRectangle(cornerRadius: cornerRadius, style: .continuous).fill(fill)
            image
                .renderingMode(.template)
                .resizable()
                .scaledToFit()
                .frame(width: glyph, height: glyph)
                .foregroundColor(ink)
        }
        .frame(width: size, height: size)

        return Group {
            if let label = label {
                tile
                    .accessibilityElement(children: .ignore)
                    .accessibilityLabel(Text(label))
            } else {
                tile.accessibilityHidden(true)
            }
        }
    }
}

#Preview("Iconography") {
    ScrollView {
        VStack(alignment: .leading, spacing: 16) {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 44), spacing: 12)], spacing: 12) {
                ForEach(ISMUIIcon.allCases, id: \.rawValue) { icon in
                    ISMIcon(icon)
                }
            }
            HStack(spacing: 12) {
                ISMIconTile(.bookOpen)
                ISMIconTile(.share, size: 56)
                ISMIconTile(ministry: .radio, size: 48, tone: .gold)
                ISMIconTile(.settings, tone: .neutral)
            }
            HStack(spacing: 12) {
                ISMIcon(ministry: .bible, size: 32)
                ISMIcon(ministry: .church, size: 48)
            }
        }
        .padding(16)
    }
}

public extension ISMUIIcon {
    /// True for icons whose meaning is directional (next, back, drill-in). They mirror in right-to-left layouts.
    /// Play, pause, skip, check, close, search and the up-right arrow never mirror.
    var mirrorsInRTL: Bool {
        switch self {
        case .arrowLeft, .arrowRight, .chevronLeft, .chevronRight:
            return true
        default:
            return false
        }
    }
}

/// Internal icon that inherits the surrounding foreground colour (used inside buttons, chips and rows).
struct ISMGlyph: View {
    @ScaledMetric private var scaledSize: CGFloat
    private let image: Image
    private let mirrors: Bool

    init(_ icon: ISMUIIcon, size: CGFloat) {
        self.image = icon.image
        self.mirrors = icon.mirrorsInRTL
        self._scaledSize = ScaledMetric(wrappedValue: size, relativeTo: .body)
    }

    var body: some View {
        image
            .renderingMode(.template)
            .resizable()
            .scaledToFit()
            .frame(width: scaledSize, height: scaledSize)
            .flipsForRightToLeftLayoutDirection(mirrors)
            .accessibilityHidden(true)
    }
}
