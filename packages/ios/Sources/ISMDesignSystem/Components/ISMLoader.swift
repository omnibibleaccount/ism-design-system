import SwiftUI

/// Spinner. 16 / 24 / 40pt, gray-200 track with a Horizon Blue head. One turn takes 0.8s.
/// With Reduce Motion on, the ring stays still (the static arc still reads as loading).
public struct ISMSpinner: View {
    public enum Size {
        case s, m, l

        var diameter: CGFloat {
            switch self {
            case .s: return 16
            case .m: return 24
            case .l: return 40
            }
        }

        var lineWidth: CGFloat {
            switch self {
            case .s: return 2
            case .m: return 2.5
            case .l: return 3.5
            }
        }
    }

    public enum Tone {
        /// Horizon Blue head on a gray-200 track (default, on light).
        case brand
        /// White head on a 22% white track (on dark).
        case onDark
        /// Black head, for secondary and light buttons.
        case ink
        /// White head, for primary buttons.
        case onPrimary
    }

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.colorScheme) private var scheme
    @State private var rotation: Double = 0

    private let size: Size
    private let tone: Tone
    private let label: String?

    /// - Parameter label: VoiceOver label. Pass nil when the spinner sits inside a control whose text carries the meaning.
    public init(size: Size = .m, tone: Tone = .brand, label: String? = "Loading") {
        self.size = size
        self.tone = tone
        self.label = label
    }

    private func colors(_ theme: ISMTheme) -> (track: Color, head: Color) {
        switch tone {
        case .brand:
            if theme.isDark {
                return (Color.white.opacity(0.22), ISMColor.blueOnDark)
            }
            return (ISMColor.gray200, ISMColor.horizonBlue)
        case .onDark:
            return (Color.white.opacity(0.22), ISMColor.white)
        case .ink:
            return (Color.black.opacity(0.18), ISMColor.black)
        case .onPrimary:
            return (Color.white.opacity(0.3), ISMColor.white)
        }
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let c = colors(theme)
        let ring = ZStack {
            Circle().stroke(c.track, lineWidth: size.lineWidth)
            Circle()
                .trim(from: 0, to: 0.25)
                .stroke(c.head, style: StrokeStyle(lineWidth: size.lineWidth, lineCap: .round))
                .rotationEffect(.degrees(rotation))
        }
        .frame(width: size.diameter, height: size.diameter)
        .onAppear {
            if !reduceMotion {
                withAnimation(ISMMotion.easeLinear(ISMMotion.durationSpin).repeatForever(autoreverses: false)) {
                    rotation = 360
                }
            }
        }
        return Group {
            if let label = label {
                ring
                    .accessibilityElement(children: .ignore)
                    .accessibilityLabel(Text(label))
            } else {
                ring.accessibilityHidden(true)
            }
        }
    }
}

/// A shimmering placeholder block. Skeleton shapes are decorative; put `.accessibilityLabel` on the container.
public struct ISMSkeleton: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var phase: CGFloat = 0

    private let width: CGFloat?
    private let height: CGFloat
    private let cornerRadius: CGFloat

    public init(width: CGFloat? = nil, height: CGFloat = 12, cornerRadius: CGFloat = 6) {
        self.width = width
        self.height = height
        self.cornerRadius = cornerRadius
    }

    public var body: some View {
        let gradient = LinearGradient(
            colors: [ISMColor.gray100, ISMColor.gray200, ISMColor.gray100],
            startPoint: UnitPoint(x: phase - 1, y: 0.5),
            endPoint: UnitPoint(x: phase, y: 0.5)
        )
        return RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
            .fill(reduceMotion ? LinearGradient(colors: [ISMColor.gray100], startPoint: .leading, endPoint: .trailing) : gradient)
            .frame(width: width, height: height)
            .frame(maxWidth: width == nil ? CGFloat.infinity : nil)
            .onAppear {
                if !reduceMotion {
                    withAnimation(Animation.easeInOut(duration: 1.4).repeatForever(autoreverses: false)) {
                        phase = 2
                    }
                }
            }
            .accessibilityHidden(true)
    }
}

/// Skeleton for a list of 72pt rows (avatar + two lines).
public struct ISMSkeletonList: View {
    @Environment(\.colorScheme) private var scheme
    private let rows: Int
    private let label: String

    public init(rows: Int = 3, label: String = "Loading") {
        self.rows = rows
        self.label = label
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return VStack(spacing: 0) {
            ForEach(0..<rows, id: \.self) { _ in
                HStack(spacing: 14) {
                    ISMSkeleton(width: 44, height: 44, cornerRadius: 22)
                    VStack(alignment: .leading, spacing: ISMSpacing.space2) {
                        ISMSkeleton(height: 12)
                        ISMSkeleton(width: 120, height: 12)
                    }
                }
                .frame(minHeight: 72)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, ISMSpacing.space2)
        .background(theme.surface)
        .overlay(RoundedRectangle(cornerRadius: ISMRadius.radiusLg, style: .continuous).stroke(theme.border, lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: ISMRadius.radiusLg, style: .continuous))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(label))
    }
}

/// Skeleton for a text block: a 24pt title and body lines of varied width.
public struct ISMSkeletonText: View {
    @Environment(\.colorScheme) private var scheme
    private let lines: Int
    private let label: String

    public init(lines: Int = 3, label: String = "Loading") {
        self.lines = lines
        self.label = label
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return VStack(alignment: .leading, spacing: ISMSpacing.space3) {
            ISMSkeleton(width: 180, height: 24)
            ForEach(0..<lines, id: \.self) { index in
                ISMSkeleton(width: index == lines - 1 ? 140 : nil, height: 12)
            }
        }
        .padding(ISMSpacing.space5)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(theme.surface)
        .overlay(RoundedRectangle(cornerRadius: ISMRadius.radiusLg, style: .continuous).stroke(theme.border, lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: ISMRadius.radiusLg, style: .continuous))
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(label))
    }
}

#Preview("Loader") {
    VStack(alignment: .leading, spacing: 20) {
        HStack(spacing: 20) {
            ISMSpinner(size: .s)
            ISMSpinner(size: .m)
            ISMSpinner(size: .l)
        }
        ISMSkeletonList(rows: 2)
        ISMSkeletonText()
    }
    .padding(16)
}
