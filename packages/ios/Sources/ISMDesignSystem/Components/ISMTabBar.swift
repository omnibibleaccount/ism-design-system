import SwiftUI

public enum ISMTabBadge {
    case none
    /// "Something new" dot (9pt, Horizon Blue).
    case dot
    /// Count; never shows a number above 9.
    case count(Int)
}

public struct ISMTabItem<ID: Hashable>: Identifiable {
    public let id: ID
    public let title: String
    public let icon: ISMUIIcon
    public let badge: ISMTabBadge
    public let badgeLabel: String?

    /// - Parameter badgeLabel: Spoken text for the badge, for example "new" or "3 unread".
    public init(id: ID, title: String, icon: ISMUIIcon, badge: ISMTabBadge = .none, badgeLabel: String? = nil) {
        self.id = id
        self.title = title
        self.icon = icon
        self.badge = badge
        self.badgeLabel = badgeLabel
    }
}

private struct ISMTabPressChrome: View {
    @Environment(\.colorScheme) private var scheme

    let label: ButtonStyleConfiguration.Label
    let isPressed: Bool

    var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return label
            .background(
                RoundedRectangle(cornerRadius: ISMRadius.radiusMd, style: .continuous)
                    .fill(isPressed ? theme.surfacePressed : Color.clear)
            )
            .contentShape(Rectangle())
    }
}

private struct ISMTabButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        ISMTabPressChrome(label: configuration.label, isPressed: configuration.isPressed)
    }
}

/// Bottom tab bar. Five tabs in dot.Bible (Home, Bible, Listen, Saved, More), equal width, at least 52pt tall,
/// label always visible, exactly one selected. Place it with `.safeAreaInset(edge: .bottom)`;
/// the bar background extends under the home indicator.
public struct ISMTabBar<ID: Hashable>: View {
    @Environment(\.colorScheme) private var scheme

    private let items: [ISMTabItem<ID>]
    private let selection: Binding<ID>

    public init(items: [ISMTabItem<ID>], selection: Binding<ID>) {
        self.items = items
        self.selection = selection
    }

    @ViewBuilder
    private func badgeView(_ badge: ISMTabBadge, theme: ISMTheme) -> some View {
        switch badge {
        case .none:
            EmptyView()
        case .dot:
            Circle()
                .fill(theme.isDark ? ISMColor.blueOnDark : ISMColor.horizonBlue)
                .frame(width: 9, height: 9)
                .overlay(Circle().stroke(theme.surface, lineWidth: 2))
        case .count(let number):
            Text(number > 9 ? "9+" : String(number))
                .font(ISMFont.sans(11, .bold, relativeTo: .caption2))
                .foregroundColor(ISMColor.white)
                .padding(.horizontal, 4)
                .frame(minWidth: 16, minHeight: 16)
                .background(Capsule().fill(ISMColor.horizonBlue))
                .overlay(Capsule().stroke(theme.surface, lineWidth: 2))
        }
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let idle: Color = theme.isDark ? theme.textSecondary : theme.textTertiary
        return HStack(spacing: 0) {
            ForEach(items) { item in
                let isSelected = item.id == selection.wrappedValue
                Button(action: {
                    selection.wrappedValue = item.id
                }) {
                    VStack(spacing: 3) {
                        ZStack(alignment: .topTrailing) {
                            ISMGlyph(item.icon, size: ISMSize.iconLg)
                            badgeView(item.badge, theme: theme)
                                .offset(x: 6, y: -3)
                        }
                        Text(item.title)
                            .font(ISMFont.sans(11, .semibold, relativeTo: .caption2))
                            .lineLimit(1)
                            .minimumScaleFactor(0.75)
                    }
                    .foregroundColor(isSelected ? theme.link : idle)
                    .frame(maxWidth: .infinity, minHeight: 52)
                }
                .buttonStyle(ISMTabButtonStyle())
                .ismFocusRing(cornerRadius: ISMRadius.radiusMd, offset: -3)
                .accessibilityLabel(Text(item.title))
                .accessibilityValue(Text(item.badgeLabel ?? ""))
                .accessibilityAddTraits(isSelected ? AccessibilityTraits.isSelected : AccessibilityTraits())
            }
        }
        .padding(.top, 6)
        .padding(.horizontal, ISMSpacing.space1)
        .padding(.bottom, 2)
        .dynamicTypeSize(...DynamicTypeSize.xxxLarge)
        .background(
            theme.surface
                .overlay(alignment: .top) {
                    Rectangle().fill(theme.border).frame(height: 1)
                }
                .ignoresSafeArea(edges: .bottom)
        )
        .accessibilityElement(children: .contain)
    }
}

private struct ISMTabBarPreviewDemo: View {
    @State private var selection = "bible"
    var body: some View {
        VStack {
            Spacer()
            ISMTabBar(
                items: [
                    ISMTabItem(id: "home", title: "Home", icon: .home),
                    ISMTabItem(id: "bible", title: "Bible", icon: .bookOpen),
                    ISMTabItem(id: "listen", title: "Listen", icon: .headphones, badge: .dot, badgeLabel: "new"),
                    ISMTabItem(id: "saved", title: "Saved", icon: .bookmark, badge: .count(3), badgeLabel: "3 unread"),
                    ISMTabItem(id: "more", title: "More", icon: .menu)
                ],
                selection: $selection
            )
        }
    }
}

#Preview("TabBar") {
    ISMTabBarPreviewDemo()
}
