import SwiftUI

/// The switch graphic alone: 51 x 31pt, on = Horizon Blue. Decorative: put it inside a control that carries the semantics.
public struct ISMToggleControl: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private let isOn: Bool

    public init(isOn: Bool) {
        self.isOn = isOn
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let offTrack: Color = theme.isDark ? Color.white.opacity(0.28) : ISMColor.gray300
        return ZStack(alignment: isOn ? .trailing : .leading) {
            Capsule().fill(isOn ? ISMColor.horizonBlue : offTrack)
            Circle()
                .fill(ISMColor.white)
                .frame(width: 27, height: 27)
                .shadow(color: Color.black.opacity(0.2), radius: 2.5, x: 0, y: 2)
                .padding(2)
        }
        .frame(width: 51, height: 31)
        .animation(ISMMotionHelper.animation(ISMMotion.easeStandard(ISMMotion.durationFast), reduceMotion: reduceMotion), value: isOn)
        .accessibilityHidden(true)
    }
}

/// Labelled switch row. Exposed to VoiceOver as a real switch (it uses `Toggle` as its accessibility representation).
/// The whole row toggles; the change takes effect immediately.
public struct ISMToggle: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.isEnabled) private var isEnabled

    private let title: String
    private let detail: String?
    private let isOn: Binding<Bool>

    public init(_ title: String, detail: String? = nil, isOn: Binding<Bool>) {
        self.title = title
        self.detail = detail
        self.isOn = isOn
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return Button(action: {
            isOn.wrappedValue.toggle()
        }) {
            HStack(spacing: ISMSpacing.space3) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(ISMFont.sans(16, .regular, relativeTo: .body))
                        .foregroundColor(theme.text)
                        .multilineTextAlignment(.leading)
                    if let detail = detail {
                        Text(detail)
                            .font(ISMFont.sans(14, .regular, relativeTo: .subheadline))
                            .foregroundColor(theme.textTertiary)
                            .multilineTextAlignment(.leading)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                ISMToggleControl(isOn: isOn.wrappedValue)
            }
            .frame(minHeight: ISMLayout.tapTarget)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .opacity(isEnabled ? 1 : theme.disabledOpacity)
        .ismFocusRing(cornerRadius: ISMRadius.radiusSm)
        .accessibilityRepresentation {
            Toggle(isOn: isOn) {
                Text(title)
            }
        }
    }
}

private struct ISMTogglePreviewDemo: View {
    @State private var a = true
    @State private var b = false
    var body: some View {
        VStack(spacing: 8) {
            ISMToggle("Download over Wi-Fi only", detail: "Saves mobile data.", isOn: $a)
            ISMToggle("Notifications", isOn: $b)
            ISMToggle("Locked", isOn: $a).disabled(true)
        }
        .padding(16)
    }
}

#Preview("Switch") {
    ISMTogglePreviewDemo()
}
