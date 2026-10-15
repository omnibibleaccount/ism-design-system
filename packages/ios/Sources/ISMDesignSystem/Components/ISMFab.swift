import SwiftUI

private struct ISMFabChrome: View {
    @Environment(\.colorScheme) private var scheme

    let label: ButtonStyleConfiguration.Label
    let isPressed: Bool
    let isEnabled: Bool

    var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return label
            .foregroundColor(ISMColor.white)
            .frame(width: 56, height: 56)
            .background(Circle().fill(isPressed ? ISMColor.horizonBlueDim : ISMColor.horizonBlue))
            .shadow(color: ISMColor.horizonBlue.opacity(0.6), radius: 12, x: 0, y: 12)
            .opacity(isEnabled ? 1 : theme.disabledOpacity)
            .frame(minWidth: ISMLayout.tapTarget, minHeight: ISMLayout.tapTarget)
            .contentShape(Rectangle())
    }
}

private struct ISMFabStyle: ButtonStyle {
    let isEnabled: Bool
    let forcePressed: Bool

    func makeBody(configuration: Configuration) -> some View {
        ISMFabChrome(label: configuration.label, isPressed: configuration.isPressed || forcePressed, isEnabled: isEnabled)
    }
}

/// Floating action button: 56pt, Horizon Blue, white icon (always "+" for add). One per screen.
/// The action is named by `label` (VoiceOver), not by visible text.
public struct ISMFab: View {
    @Environment(\.isEnabled) private var isEnabled

    private let icon: ISMUIIcon
    private let label: String
    private let isLoading: Bool
    private let forcePressed: Bool
    private let action: () -> Void

    public init(_ icon: ISMUIIcon = .plus, label: String, isLoading: Bool = false, forcePressed: Bool = false, action: @escaping () -> Void) {
        self.icon = icon
        self.label = label
        self.isLoading = isLoading
        self.forcePressed = forcePressed
        self.action = action
    }

    public var body: some View {
        Button(action: {
            if !isLoading {
                action()
            }
        }) {
            if isLoading {
                ISMSpinner(size: .m, tone: .onPrimary, label: nil)
            } else {
                ISMGlyph(icon, size: ISMSize.iconLg)
            }
        }
        .buttonStyle(ISMFabStyle(isEnabled: isEnabled, forcePressed: forcePressed))
        .ismFocusRing(cornerRadius: 28)
        .accessibilityLabel(Text(label))
        .accessibilityValue(Text(isLoading ? "Loading" : ""))
    }
}

public extension View {
    /// Places a FAB 16pt from the trailing edge and bottom (it flips in right-to-left layouts).
    /// - Parameter bottomInset: Extra lift. Use a larger value while a toast shows, or to clear a tab bar or mini player.
    func ismFab(_ icon: ISMUIIcon = .plus, label: String, bottomInset: CGFloat = 0, action: @escaping () -> Void) -> some View {
        overlay(alignment: .bottomTrailing) {
            ISMFab(icon, label: label, action: action)
                .padding(.trailing, ISMSpacing.space4)
                .padding(.bottom, ISMSpacing.space4 + bottomInset)
                .zIndex(ISMZIndex.zFloat)
        }
    }
}

#Preview("Fab") {
    ZStack {
        ISMColor.offWhite.ignoresSafeArea()
        ISMText("Content", style: .webH3)
    }
    .ismFab(label: "Add note", action: {})
}
