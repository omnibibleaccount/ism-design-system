import SwiftUI

public enum ISMDividerStyle {
    /// 1pt gray-200 hairline.
    case hairline
    /// 1pt charcoal line.
    case strong
    /// 2pt signature gradient line across the full width (.thread).
    case thread
    /// Short signature gradient accent, 72 x 2pt by default (the React Divider).
    case accent
}

/// Divider. Hairlines are decorative and hidden from VoiceOver; the labelled form ("or") is a separator with that label.
public struct ISMDivider: View {
    @Environment(\.colorScheme) private var scheme

    private let style: ISMDividerStyle
    private let axis: Axis
    private let length: CGFloat?
    private let label: String?

    /// - Parameters:
    ///   - axis: `.vertical` draws a short rule between inline facts (default length 16).
    ///   - length: Length along the main axis; nil fills (horizontal) or 16pt (vertical). `.accent` defaults to 72.
    ///   - label: Draws the label centred between two hairlines (horizontal only).
    public init(_ style: ISMDividerStyle = .hairline, axis: Axis = .horizontal, length: CGFloat? = nil, label: String? = nil) {
        self.style = style
        self.axis = axis
        self.length = length
        self.label = label
    }

    private func rule(_ theme: ISMTheme) -> some View {
        let thickness: CGFloat = (style == .thread || style == .accent) ? 2 : 1
        let isHorizontal = axis == .horizontal
        let mainLength: CGFloat? = length ?? (style == .accent ? 72 : (isHorizontal ? nil : 16))
        let strongColor: Color = theme.isDark ? ISMColor.white : ISMColor.charcoal900
        return Group {
            if style == .thread || style == .accent {
                Capsule().fill(ISMGradient.signature)
            } else if style == .strong {
                Rectangle().fill(strongColor)
            } else {
                Rectangle().fill(theme.border)
            }
        }
        .frame(
            width: isHorizontal ? mainLength : thickness,
            height: isHorizontal ? thickness : mainLength
        )
        .frame(maxWidth: (isHorizontal && mainLength == nil) ? CGFloat.infinity : nil)
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        if let label = label, axis == .horizontal {
            HStack(spacing: ISMSpacing.space4) {
                rule(theme)
                Text(label)
                    .font(ISMFont.sans(14, .regular, relativeTo: .subheadline))
                    .foregroundColor(theme.textTertiary)
                rule(theme)
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(label))
        } else {
            rule(theme).accessibilityHidden(true)
        }
    }
}

#Preview("Divider") {
    VStack(alignment: .leading, spacing: 20) {
        ISMDivider()
        ISMDivider(.strong)
        ISMDivider(.thread)
        ISMDivider(.accent)
        ISMDivider(label: "or")
        HStack(spacing: 16) {
            ISMText("98.7 FM", style: .webSmall)
            ISMDivider(axis: .vertical)
            ISMText("Amharic", style: .webSmall)
        }
    }
    .padding(16)
}
