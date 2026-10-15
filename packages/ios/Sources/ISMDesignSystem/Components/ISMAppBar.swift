import SwiftUI

/// Back control for an app bar: chevron plus the PARENT screen's name (never the word "Back").
/// The chevron mirrors in right-to-left layouts.
public struct ISMBackButton: View {
    @Environment(\.colorScheme) private var scheme

    private let title: String
    private let action: () -> Void

    public init(_ title: String, action: @escaping () -> Void) {
        self.title = title
        self.action = action
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return Button(action: action) {
            HStack(spacing: 2) {
                ISMGlyph(.chevronLeft, size: ISMSize.iconLg)
                Text(title)
                    .font(ISMFont.sans(16, .medium, relativeTo: .body))
                    .lineLimit(1)
            }
            .foregroundColor(theme.link)
            .padding(.trailing, 6)
            .frame(minHeight: ISMLayout.tapTarget)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .ismFocusRing(cornerRadius: ISMRadius.radiusPill)
        .accessibilityLabel(Text(title))
    }
}

/// App bar: 56pt, centred 17/600 title, leading and trailing slots (each control 44x44, at most three trailing actions).
/// - `largeTitle`: the title moves below the bar at 32/600 and the centred title is dropped.
/// - `isScrolled`: adds the glass background and hairline. A root screen at rest has no border.
public struct ISMAppBar<Leading: View, Trailing: View>: View {
    @Environment(\.colorScheme) private var scheme

    private let title: String
    private let largeTitle: Bool
    private let isScrolled: Bool
    private let leading: Leading
    private let trailing: Trailing

    public init(
        title: String,
        largeTitle: Bool = false,
        isScrolled: Bool = false,
        @ViewBuilder leading: () -> Leading,
        @ViewBuilder trailing: () -> Trailing
    ) {
        self.title = title
        self.largeTitle = largeTitle
        self.isScrolled = isScrolled
        self.leading = leading()
        self.trailing = trailing()
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        return VStack(spacing: 0) {
            HStack(spacing: 0) {
                leading
                    .frame(minWidth: 88, alignment: .leading)
                if largeTitle {
                    Spacer(minLength: 0)
                } else {
                    Text(title)
                        .font(ISMFont.sans(17, .semibold, relativeTo: .headline))
                        .foregroundColor(theme.text)
                        .lineLimit(1)
                        .truncationMode(.tail)
                        .frame(maxWidth: .infinity)
                        .accessibilityAddTraits(AccessibilityTraits.isHeader)
                }
                trailing
                    .frame(minWidth: 88, alignment: .trailing)
            }
            .padding(.horizontal, 6)
            .frame(minHeight: 56)

            if largeTitle {
                Text(title)
                    .font(ISMFont.sans(32, .semibold, relativeTo: .largeTitle))
                    .foregroundColor(theme.text)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 20)
                    .padding(.bottom, ISMSpacing.space3)
                    .accessibilityAddTraits(AccessibilityTraits.isHeader)
            }
        }
        .background {
            if isScrolled {
                Rectangle().fill(.regularMaterial)
            } else {
                Color.clear
            }
        }
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(theme.border)
                .frame(height: 1)
                .opacity(isScrolled ? 1 : 0)
        }
        .accessibilityElement(children: .contain)
    }
}

public extension ISMAppBar where Leading == EmptyView, Trailing == EmptyView {
    init(title: String, largeTitle: Bool = false, isScrolled: Bool = false) {
        self.init(
            title: title,
            largeTitle: largeTitle,
            isScrolled: isScrolled,
            leading: { EmptyView() },
            trailing: { EmptyView() }
        )
    }
}

public extension ISMAppBar where Trailing == EmptyView {
    init(title: String, largeTitle: Bool = false, isScrolled: Bool = false, @ViewBuilder leading: () -> Leading) {
        self.init(
            title: title,
            largeTitle: largeTitle,
            isScrolled: isScrolled,
            leading: leading,
            trailing: { EmptyView() }
        )
    }
}

public extension ISMAppBar where Leading == EmptyView {
    init(title: String, largeTitle: Bool = false, isScrolled: Bool = false, @ViewBuilder trailing: () -> Trailing) {
        self.init(
            title: title,
            largeTitle: largeTitle,
            isScrolled: isScrolled,
            leading: { EmptyView() },
            trailing: trailing
        )
    }
}

#Preview("AppBar") {
    VStack(spacing: 24) {
        ISMAppBar(
            title: "John 3",
            leading: { ISMBackButton("Bible") {} },
            trailing: {
                HStack(spacing: 0) {
                    ISMIconButton(.share, label: "Share") {}
                    ISMIconButton(.moreHorizontal, label: "More") {}
                }
            }
        )
        ISMAppBar(title: "Library", largeTitle: true, trailing: {
            ISMIconButton(.search, label: "Search") {}
        })
        ISMAppBar(title: "Settings", isScrolled: true)
        Spacer()
    }
}
