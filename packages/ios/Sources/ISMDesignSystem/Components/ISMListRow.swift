import SwiftUI

private struct ISMRowPressChrome: View {
    @Environment(\.colorScheme) private var scheme

    let label: ButtonStyleConfiguration.Label
    let isPressed: Bool

    var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return label
            .background(isPressed ? theme.surfacePressed : Color.clear)
            .contentShape(Rectangle())
    }
}

private struct ISMRowButtonStyle: ButtonStyle {
    let forcePressed: Bool

    func makeBody(configuration: Configuration) -> some View {
        ISMRowPressChrome(label: configuration.label, isPressed: configuration.isPressed || forcePressed)
    }
}

/// Row with an optional leading icon tile, title, subtitle, value, custom trailing content and a drill-in chevron.
/// Rows are at least 52pt (64pt with a subtitle). Pass `action` to make the whole row one button.
/// The chevron means "drills into another screen" and mirrors in right-to-left layouts.
public struct ISMListRow<Trailing: View>: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.isEnabled) private var isEnabled

    private let title: String
    private let subtitle: String?
    private let leadingIcon: ISMUIIcon?
    private let value: String?
    private let showsChevron: Bool
    private let isDanger: Bool
    private let isLoading: Bool
    private let showsSeparator: Bool
    private let forcePressed: Bool
    private let action: (() -> Void)?
    private let trailing: Trailing

    public init(
        _ title: String,
        subtitle: String? = nil,
        leadingIcon: ISMUIIcon? = nil,
        value: String? = nil,
        showsChevron: Bool = false,
        isDanger: Bool = false,
        isLoading: Bool = false,
        showsSeparator: Bool = false,
        forcePressed: Bool = false,
        action: (() -> Void)? = nil,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.subtitle = subtitle
        self.leadingIcon = leadingIcon
        self.value = value
        self.showsChevron = showsChevron
        self.isDanger = isDanger
        self.isLoading = isLoading
        self.showsSeparator = showsSeparator
        self.forcePressed = forcePressed
        self.action = action
        self.trailing = trailing()
    }

    private var minHeight: CGFloat {
        return subtitle == nil ? ISMSize.rowApp : 64
    }

    private var rowContent: some View {
        let theme = ISMTheme.resolve(scheme)
        let titleColor: Color = isDanger ? theme.error : (isEnabled ? theme.text : theme.textTertiary)
        return HStack(spacing: ISMSpacing.space3) {
            if let icon = leadingIcon {
                ISMIconTile(icon, size: 30)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(ISMFont.sans(16, isDanger ? .semibold : .regular, relativeTo: .body))
                    .foregroundColor(titleColor)
                    .multilineTextAlignment(.leading)
                if let subtitle = subtitle {
                    Text(subtitle)
                        .font(ISMFont.sans(13, .regular, relativeTo: .footnote))
                        .foregroundColor(theme.textTertiary)
                        .multilineTextAlignment(.leading)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            if let value = value {
                Text(value)
                    .font(ISMFont.sans(15, .regular, relativeTo: .subheadline))
                    .foregroundColor(theme.textTertiary)
            }
            trailing
            if isLoading {
                ISMSpinner(size: .s, tone: .brand, label: nil)
            } else if showsChevron {
                ISMGlyph(.chevronRight, size: ISMSize.iconSm)
                    .foregroundColor(theme.textTertiary)
            }
        }
        .padding(.horizontal, ISMSpacing.space4)
        .frame(minHeight: minHeight)
        .frame(maxWidth: .infinity)
        .opacity(isEnabled ? 1 : theme.disabledOpacity + 0.1)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(theme.border)
                .frame(height: 1)
                .padding(.leading, ISMSpacing.space4)
                .opacity(showsSeparator ? 1 : 0)
        }
    }

    public var body: some View {
        if let action = action {
            Button(action: {
                if !isLoading {
                    action()
                }
            }) {
                rowContent
            }
            .buttonStyle(ISMRowButtonStyle(forcePressed: forcePressed))
            .ismFocusRing(cornerRadius: ISMRadius.radiusMd, offset: -3)
            .accessibilityValue(value ?? "")
        } else {
            rowContent
                .accessibilityElement(children: .combine)
        }
    }
}

public extension ISMListRow where Trailing == EmptyView {
    init(
        _ title: String,
        subtitle: String? = nil,
        leadingIcon: ISMUIIcon? = nil,
        value: String? = nil,
        showsChevron: Bool = false,
        isDanger: Bool = false,
        isLoading: Bool = false,
        showsSeparator: Bool = false,
        forcePressed: Bool = false,
        action: (() -> Void)? = nil
    ) {
        self.init(
            title,
            subtitle: subtitle,
            leadingIcon: leadingIcon,
            value: value,
            showsChevron: showsChevron,
            isDanger: isDanger,
            isLoading: isLoading,
            showsSeparator: showsSeparator,
            forcePressed: forcePressed,
            action: action,
            trailing: { EmptyView() }
        )
    }
}

/// Inset group card for rows (16pt radius 12, gray-200 hairline), with an optional overline header and footer.
public struct ISMListGroup<Content: View>: View {
    @Environment(\.colorScheme) private var scheme

    private let header: String?
    private let footer: String?
    private let content: Content

    public init(header: String? = nil, footer: String? = nil, @ViewBuilder content: () -> Content) {
        self.header = header
        self.footer = footer
        self.content = content()
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusMd, style: .continuous)
        return VStack(alignment: .leading, spacing: ISMSpacing.space2) {
            if let header = header {
                ISMText(header, style: .webOverline, color: theme.textTertiary)
                    .accessibilityAddTraits(AccessibilityTraits.isHeader)
                    .padding(.horizontal, ISMSpacing.space4)
                    .padding(.top, ISMSpacing.space2)
            }
            VStack(spacing: 0) {
                content
            }
            .background(shape.fill(theme.surface))
            .clipShape(shape)
            .overlay(shape.strokeBorder(theme.border, lineWidth: 1))
            if let footer = footer {
                Text(footer)
                    .font(ISMFont.sans(13, .regular, relativeTo: .footnote))
                    .foregroundColor(theme.textTertiary)
                    .padding(.horizontal, ISMSpacing.space4)
            }
        }
    }
}

#Preview("ListRow") {
    ZStack {
        ISMColor.offWhite.ignoresSafeArea()
        ISMListGroup(header: "Library", footer: "Downloads use mobile data only on Wi-Fi.") {
            ISMListRow("Bibles", leadingIcon: .bookOpen, value: "12", showsChevron: true, showsSeparator: true, action: {})
            ISMListRow("Audio", subtitle: "Dramatised and plain", leadingIcon: .headphones, showsChevron: true, showsSeparator: true, action: {})
            ISMListRow("Pressed", leadingIcon: .star, showsSeparator: true, forcePressed: true, action: {})
            ISMListRow("Disabled", leadingIcon: .lock, action: {}).disabled(true)
        }
        .padding(16)
    }
}
