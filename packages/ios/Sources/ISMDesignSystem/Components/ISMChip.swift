import SwiftUI

private struct ISMChipChrome: View {
    @Environment(\.colorScheme) private var scheme

    let label: ButtonStyleConfiguration.Label
    let isPressed: Bool
    let isSelected: Bool
    let isCompact: Bool
    let isEnabled: Bool

    var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let ink: Color = theme.isDark ? ISMColor.white : ISMColor.black
        let invertedInk: Color = theme.isDark ? ISMColor.black : ISMColor.white
        let pressFill: Color = theme.isDark ? Color.white.opacity(0.16) : ISMColor.gray200
        let fill: Color = isSelected ? ink : (isPressed ? pressFill : theme.surface)
        let line: Color = isSelected ? ink : theme.fieldBorder
        let minHeight: CGFloat = isCompact ? ISMSize.controlSm : ISMSize.controlMd
        return label
            .foregroundColor(isSelected ? invertedInk : ink)
            .padding(.horizontal, isCompact ? 14 : 18)
            .frame(minHeight: minHeight)
            .background(Capsule().fill(fill))
            .overlay(Capsule().strokeBorder(line, lineWidth: 1))
            .opacity(isEnabled ? 1 : theme.disabledOpacity)
            .frame(minHeight: ISMLayout.tapTarget)
            .contentShape(Rectangle())
    }
}

private struct ISMChipStyle: ButtonStyle {
    let isSelected: Bool
    let isCompact: Bool
    let isEnabled: Bool
    let forcePressed: Bool

    func makeBody(configuration: Configuration) -> some View {
        ISMChipChrome(
            label: configuration.label,
            isPressed: configuration.isPressed || forcePressed,
            isSelected: isSelected,
            isCompact: isCompact,
            isEnabled: isEnabled
        )
    }
}

/// Filter or toggle pill. Selected chips invert fill and text (colour is not the only signal),
/// and VoiceOver reads them as selected.
public struct ISMChip: View {
    @Environment(\.isEnabled) private var isEnabled

    private let title: String
    private let isSelected: Bool
    private let isCompact: Bool
    private let leadingIcon: ISMUIIcon?
    private let forcePressed: Bool
    private let action: () -> Void

    public init(
        _ title: String,
        isSelected: Bool = false,
        isCompact: Bool = false,
        leadingIcon: ISMUIIcon? = nil,
        forcePressed: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.isSelected = isSelected
        self.isCompact = isCompact
        self.leadingIcon = leadingIcon
        self.forcePressed = forcePressed
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: ISMSpacing.space2) {
                if let icon = leadingIcon {
                    ISMGlyph(icon, size: ISMSize.iconSm)
                }
                Text(title)
                    .font(ISMFont.sans(isCompact ? 14 : 15, .semibold, relativeTo: .subheadline))
                    .multilineTextAlignment(.center)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .buttonStyle(ISMChipStyle(isSelected: isSelected, isCompact: isCompact, isEnabled: isEnabled, forcePressed: forcePressed))
        .ismFocusRing(cornerRadius: (isCompact ? ISMSize.controlSm : ISMSize.controlMd) / 2)
        .accessibilityAddTraits(isSelected ? AccessibilityTraits.isSelected : AccessibilityTraits())
    }
}

#Preview("Chip") {
    ISMFlow {
        ISMChip("All", isSelected: true) {}
        ISMChip("Audio") {}
        ISMChip("Video", leadingIcon: .play) {}
        ISMChip("Amharic", isCompact: true) {}
        ISMChip("Disabled") {}.disabled(true)
    }
    .padding(16)
}
