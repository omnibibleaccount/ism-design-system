import SwiftUI

public enum ISMSettingsRowKind {
    /// Drills into another screen: optional value and a chevron.
    case navigation(value: String?)
    /// A switch. The whole row toggles; never pair with a Save button.
    case toggle(Binding<Bool>)
    /// A radio-style choice: a check mark when selected.
    case selection(isSelected: Bool)
}

/// Settings row built on `ISMListRow`: 30pt icon tile, two-line variant (64pt), value + chevron, switch, radio check
/// and the destructive style (use alone at the end of a group, for example "Sign out").
public struct ISMSettingsRow: View {
    @Environment(\.colorScheme) private var scheme

    private let title: String
    private let subtitle: String?
    private let icon: ISMUIIcon?
    private let kind: ISMSettingsRowKind
    private let isDanger: Bool
    private let isLoading: Bool
    private let showsSeparator: Bool
    private let action: (() -> Void)?

    public init(
        _ title: String,
        subtitle: String? = nil,
        icon: ISMUIIcon? = nil,
        kind: ISMSettingsRowKind = .navigation(value: nil),
        isDanger: Bool = false,
        isLoading: Bool = false,
        showsSeparator: Bool = false,
        action: (() -> Void)? = nil
    ) {
        self.title = title
        self.subtitle = subtitle
        self.icon = icon
        self.kind = kind
        self.isDanger = isDanger
        self.isLoading = isLoading
        self.showsSeparator = showsSeparator
        self.action = action
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        switch kind {
        case .navigation(let value):
            ISMListRow(
                title,
                subtitle: subtitle,
                leadingIcon: icon,
                value: value,
                showsChevron: action != nil && !isDanger,
                isDanger: isDanger,
                isLoading: isLoading,
                showsSeparator: showsSeparator,
                action: action
            )
        case .toggle(let binding):
            ISMListRow(
                title,
                subtitle: subtitle,
                leadingIcon: icon,
                showsSeparator: showsSeparator,
                action: {
                    binding.wrappedValue.toggle()
                },
                trailing: {
                    ISMToggleControl(isOn: binding.wrappedValue)
                }
            )
            .accessibilityRepresentation {
                Toggle(isOn: binding) {
                    Text(title)
                }
            }
        case .selection(let isSelected):
            ISMListRow(
                title,
                subtitle: subtitle,
                leadingIcon: icon,
                showsSeparator: showsSeparator,
                action: action ?? {},
                trailing: {
                    ISMGlyph(.check, size: ISMSize.iconMd)
                        .foregroundColor(theme.link)
                        .opacity(isSelected ? 1 : 0)
                }
            )
            .accessibilityAddTraits(isSelected ? AccessibilityTraits.isSelected : AccessibilityTraits())
        }
    }
}

private struct ISMSettingsRowPreviewDemo: View {
    @State private var wifi = true
    @State private var lang = "en"
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                ISMListGroup(header: "Downloads", footer: "Changes apply immediately.") {
                    ISMSettingsRow("Wi-Fi only", subtitle: "Saves mobile data", icon: .wifiOff, kind: .toggle($wifi), showsSeparator: true)
                    ISMSettingsRow("Storage", icon: .download, kind: .navigation(value: "1.2 GB"), action: {})
                }
                ISMListGroup(header: "Language") {
                    ISMSettingsRow("English", kind: .selection(isSelected: lang == "en"), showsSeparator: true, action: { lang = "en" })
                    ISMSettingsRow("Amharic", kind: .selection(isSelected: lang == "am"), action: { lang = "am" })
                }
                ISMListGroup {
                    ISMSettingsRow("Sign out", isDanger: true, action: {})
                }
            }
            .padding(16)
        }
        .background(ISMColor.offWhite)
    }
}

#Preview("SettingsRow") {
    ISMSettingsRowPreviewDemo()
}
