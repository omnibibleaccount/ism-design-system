import SwiftUI

public enum ISMCardPadding {
    /// 24pt
    case standard
    /// 32pt
    case large
    /// 16pt
    case tight
    /// No padding (image-led cards that manage their own).
    case flush

    var value: CGFloat {
        switch self {
        case .standard: return ISMSpacing.space5
        case .large: return ISMSpacing.space6
        case .tight: return ISMSpacing.space4
        case .flush: return 0
        }
    }
}

struct ISMCardSurface<Content: View>: View {
    @Environment(\.colorScheme) private var scheme

    let padding: CGFloat
    let lifted: Bool
    let content: Content

    init(padding: CGFloat, lifted: Bool, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.lifted = lifted
        self.content = content()
    }

    var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusLg, style: .continuous)
        let hairline: Color = theme.isDark ? ISMColor.borderHairlineDark : ISMColor.borderHairlineLight
        let shadow: ISMShadowSpec? = lifted ? ISMShadow.lift : theme.cardShadow
        return content
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(shape.fill(theme.surface))
            .overlay(shape.strokeBorder(hairline, lineWidth: 1))
            .ismShadow(shadow)
    }
}

private struct ISMCardButtonStyle: ButtonStyle {
    let padding: CGFloat

    func makeBody(configuration: Configuration) -> some View {
        ISMCardSurface(padding: padding, lifted: configuration.isPressed) {
            configuration.label
        }
    }
}

/// Content card: 20pt radius, hairline border, resting shadow on light. Pass `action` to make the whole card one button
/// (it raises to the lift shadow while pressed). Never nest another button inside a tappable card.
public struct ISMCard<Content: View>: View {
    private let padding: ISMCardPadding
    private let action: (() -> Void)?
    private let accessibilityLabelText: String?
    private let content: Content

    public init(
        padding: ISMCardPadding = .standard,
        accessibilityLabel: String? = nil,
        action: (() -> Void)? = nil,
        @ViewBuilder content: () -> Content
    ) {
        self.padding = padding
        self.accessibilityLabelText = accessibilityLabel
        self.action = action
        self.content = content()
    }

    public var body: some View {
        if let action = action {
            Button(action: action) {
                VStack(alignment: .leading, spacing: ISMSpacing.space4) {
                    content
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .buttonStyle(ISMCardButtonStyle(padding: padding.value))
            .ismFocusRing(cornerRadius: ISMRadius.radiusLg)
            .ismAccessibilityLabel(accessibilityLabelText)
        } else {
            ISMCardSurface(padding: padding.value, lifted: false) {
                VStack(alignment: .leading, spacing: ISMSpacing.space4) {
                    content
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }
}

#Preview("Card") {
    ZStack {
        ISMColor.offWhite.ignoresSafeArea()
        VStack(spacing: 16) {
            ISMCard {
                ISMText("Static card", style: .webH4)
                ISMText("Card description in gray-700.", style: .webSmall, color: ISMColor.gray700)
            }
            ISMCard(padding: .large, action: {}) {
                ISMText("Linked card", style: .webH4)
                ISMText("The whole card is one button.", style: .webSmall, color: ISMColor.gray700)
            }
        }
        .padding(16)
    }
}
