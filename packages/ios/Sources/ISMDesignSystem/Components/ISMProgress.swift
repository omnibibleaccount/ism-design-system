import SwiftUI

public enum ISMProgressBarSize {
    /// 4pt track
    case regular
    /// 8pt track (with label)
    case large

    var height: CGFloat {
        switch self {
        case .regular: return 4
        case .large: return 8
        }
    }
}

/// Linear progress. `value` 0...1 is determinate; nil is indeterminate (a 35% bar loops every 1.4s;
/// with Reduce Motion on the bar stays still and the label carries the state).
/// Fills from the leading edge, so it mirrors in right-to-left layouts.
public struct ISMProgressBar: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.layoutDirection) private var layoutDirection
    @State private var phase: CGFloat = 0

    private let value: Double?
    private let label: String?
    private let showsValue: Bool
    private let size: ISMProgressBarSize
    private let indeterminateSpokenValue: String

    /// - Parameters:
    ///   - label: Visible name; also the accessibility label. Pass one whenever the bar is not self-explanatory.
    ///   - showsValue: Shows the percentage (tabular numerals) beside the label.
    public init(
        value: Double?,
        label: String? = nil,
        showsValue: Bool = false,
        size: ISMProgressBarSize = .regular,
        indeterminateSpokenValue: String = "In progress"
    ) {
        self.value = value
        self.label = label
        self.showsValue = showsValue
        self.size = size
        self.indeterminateSpokenValue = indeterminateSpokenValue
    }

    private var clamped: Double {
        return min(max(value ?? 0, 0), 1)
    }

    private var percentText: String {
        return String(Int((clamped * 100).rounded())) + "%"
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let fillColor: Color = theme.isDark ? ISMColor.skyBlue : ISMColor.horizonBlue
        let trackColor: Color = theme.isDark ? Color.white.opacity(0.16) : ISMColor.gray200
        let direction: CGFloat = layoutDirection == .rightToLeft ? -1 : 1
        let radius = ISMRadius.radiusXs

        let track = GeometryReader { proxy in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: radius, style: .continuous).fill(trackColor)
                if value != nil {
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                        .fill(fillColor)
                        .frame(width: proxy.size.width * CGFloat(clamped))
                        .animation(ISMMotionHelper.animation(ISMMotion.easeStandard(ISMMotion.durationSlow), reduceMotion: reduceMotion), value: clamped)
                } else {
                    let travel: CGFloat = proxy.size.width * 1.35 * phase - proxy.size.width * 0.35
                    let shift: CGFloat = reduceMotion ? 0 : direction * travel
                    RoundedRectangle(cornerRadius: radius, style: .continuous)
                        .fill(fillColor)
                        .frame(width: proxy.size.width * 0.35)
                        .offset(x: shift, y: 0)
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
        }
        .frame(height: size.height)
        .onAppear {
            if value == nil && !reduceMotion {
                withAnimation(Animation.linear(duration: 1.4).repeatForever(autoreverses: false)) {
                    phase = 1
                }
            }
        }

        return VStack(alignment: .leading, spacing: ISMSpacing.space2) {
            if label != nil || showsValue {
                HStack(spacing: ISMSpacing.space3) {
                    if let label = label {
                        Text(label)
                            .font(ISMFont.sans(15, .semibold, relativeTo: .callout))
                            .foregroundColor(theme.text)
                    }
                    Spacer(minLength: 0)
                    if showsValue && value != nil {
                        Text(percentText)
                            .font(ISMFont.sans(15, .regular, relativeTo: .callout))
                            .monospacedDigit()
                            .foregroundColor(theme.textSecondary)
                    }
                }
            }
            track
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(label ?? ""))
        .accessibilityValue(Text(value != nil ? percentText : indeterminateSpokenValue))
    }
}

public enum ISMProgressRingSize {
    /// 64pt, 6pt stroke, percentage in the centre.
    case regular
    /// 24pt, 3pt stroke, for use beside text.
    case inline

    var diameter: CGFloat {
        switch self {
        case .regular: return 64
        case .inline: return 24
        }
    }

    var stroke: CGFloat {
        switch self {
        case .regular: return 6
        case .inline: return 3
        }
    }
}

/// Circular determinate progress.
public struct ISMProgressRing: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private let value: Double
    private let size: ISMProgressRingSize
    private let label: String

    public init(value: Double, size: ISMProgressRingSize = .regular, label: String) {
        self.value = value
        self.size = size
        self.label = label
    }

    private var clamped: Double {
        return min(max(value, 0), 1)
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let trackColor: Color = theme.isDark ? Color.white.opacity(0.16) : ISMColor.gray200
        let fillColor: Color = theme.isDark ? ISMColor.skyBlue : ISMColor.horizonBlue
        let percent = String(Int((clamped * 100).rounded())) + "%"
        return ZStack {
            Circle().stroke(trackColor, lineWidth: size.stroke)
            Circle()
                .trim(from: 0, to: CGFloat(clamped))
                .stroke(fillColor, style: StrokeStyle(lineWidth: size.stroke, lineCap: .round))
                .rotationEffect(.degrees(-90))
                .animation(ISMMotionHelper.animation(ISMMotion.easeStandard(ISMMotion.durationSlow), reduceMotion: reduceMotion), value: clamped)
            if size == .regular {
                Text(percent)
                    .font(ISMFont.sans(14, .semibold, relativeTo: .footnote))
                    .monospacedDigit()
                    .foregroundColor(theme.text)
            }
        }
        .frame(width: size.diameter, height: size.diameter)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(label))
        .accessibilityValue(Text(percent))
    }
}

/// Step progress: "Step 1 of 2" above a bar that fills by completed step.
public struct ISMStepProgress: View {
    @Environment(\.colorScheme) private var scheme

    private let current: Int
    private let total: Int
    private let label: String?

    /// - Parameter label: Visible text. Defaults to "Step N of M" (English); pass a localised string in other languages.
    public init(current: Int, total: Int, label: String? = nil) {
        self.current = current
        self.total = max(total, 1)
        self.label = label
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let text = label ?? ("Step " + String(current) + " of " + String(total))
        return VStack(alignment: .leading, spacing: ISMSpacing.space2) {
            Text(text)
                .font(ISMFont.sans(14, .semibold, relativeTo: .subheadline))
                .foregroundColor(theme.textSecondary)
            ISMProgressBar(value: Double(current) / Double(total), size: .large)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(text))
        .accessibilityValue(Text(String(current) + " of " + String(total)))
    }
}

#Preview("Progress") {
    VStack(alignment: .leading, spacing: 20) {
        ISMProgressBar(value: 0.42, label: "Downloading Amharic Bible", showsValue: true, size: .large)
        ISMProgressBar(value: 0.7)
        ISMProgressBar(value: nil, label: "Preparing")
        HStack(spacing: 16) {
            ISMProgressRing(value: 0.6, label: "Storage used")
            ISMProgressRing(value: 0.3, size: .inline, label: "Sync")
        }
        ISMStepProgress(current: 1, total: 2)
    }
    .padding(16)
}
