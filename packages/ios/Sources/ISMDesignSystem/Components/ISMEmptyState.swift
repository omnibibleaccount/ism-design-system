import SwiftUI
import UIKit

public enum ISMEmptyStateTone {
    /// Gray circle (no results).
    case neutral
    /// Blue-tint circle (nothing yet).
    case brand
    /// Error-tint circle (offline, failed to load). Announced once when it appears.
    case error
}

/// Empty, offline and no-results states: icon circle, heading, one sentence, then one next step
/// (a button, or two to four suggestion chips).
public struct ISMEmptyState: View {
    @Environment(\.colorScheme) private var scheme

    private let icon: ISMUIIcon
    private let tone: ISMEmptyStateTone
    private let title: String
    private let message: String?
    private let actionTitle: String?
    private let actionIcon: ISMUIIcon?
    private let action: (() -> Void)?
    private let suggestions: [String]
    private let onSuggestion: ((String) -> Void)?
    private let showsContainer: Bool

    public init(
        icon: ISMUIIcon,
        tone: ISMEmptyStateTone = .neutral,
        title: String,
        message: String? = nil,
        actionTitle: String? = nil,
        actionIcon: ISMUIIcon? = nil,
        action: (() -> Void)? = nil,
        suggestions: [String] = [],
        onSuggestion: ((String) -> Void)? = nil,
        showsContainer: Bool = true
    ) {
        self.icon = icon
        self.tone = tone
        self.title = title
        self.message = message
        self.actionTitle = actionTitle
        self.actionIcon = actionIcon
        self.action = action
        self.suggestions = suggestions
        self.onSuggestion = onSuggestion
        self.showsContainer = showsContainer
    }

    private func circle(_ theme: ISMTheme) -> (fill: Color, ink: Color) {
        switch tone {
        case .neutral: return (theme.surfaceMuted, theme.textSecondary)
        case .brand: return (theme.selectedTint, theme.isDark ? ISMColor.blueOnDark : ISMColor.horizonBlue)
        case .error: return (theme.errorBackground, theme.error)
        }
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let c = circle(theme)
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusLg, style: .continuous)
        let content = VStack(spacing: ISMSpacing.space3) {
            ZStack {
                Circle().fill(c.fill)
                ISMGlyph(icon, size: 28)
                    .foregroundColor(c.ink)
            }
            .frame(width: 64, height: 64)
            .padding(.bottom, ISMSpacing.space1)
            .accessibilityHidden(true)

            Text(title)
                .font(ISMFont.sans(20, .semibold, relativeTo: .title3))
                .foregroundColor(theme.text)
                .multilineTextAlignment(.center)
                .fixedSize(horizontal: false, vertical: true)
                .accessibilityAddTraits(AccessibilityTraits.isHeader)

            if let message = message {
                Text(message)
                    .font(ISMFont.sans(15, .regular, relativeTo: .callout))
                    .foregroundColor(theme.textSecondary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 280)
                    .fixedSize(horizontal: false, vertical: true)
            }

            if let actionTitle = actionTitle, let action = action {
                ISMButton(
                    actionTitle,
                    variant: tone == .error ? .secondary : .primary,
                    leadingIcon: actionIcon,
                    action: action
                )
                .padding(.top, ISMSpacing.space2)
            }

            if !suggestions.isEmpty {
                ISMFlow(spacing: ISMSpacing.space2, centered: true) {
                    ForEach(suggestions, id: \.self) { suggestion in
                        ISMChip(suggestion, isCompact: false) {
                            onSuggestion?(suggestion)
                        }
                    }
                }
                .padding(.top, ISMSpacing.space1)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.horizontal, showsContainer ? 28 : ISMSpacing.space5)
        .padding(.vertical, showsContainer ? 40 : ISMSpacing.space5)

        return Group {
            if showsContainer {
                content
                    .background(shape.fill(theme.surface))
                    .overlay(shape.strokeBorder(theme.border, lineWidth: 1))
            } else {
                content
            }
        }
        .accessibilityElement(children: .contain)
        .onAppear {
            if tone == .error {
                UIAccessibility.post(notification: .announcement, argument: title)
            }
        }
    }
}

#Preview("EmptyState") {
    ScrollView {
        VStack(spacing: 16) {
            ISMEmptyState(
                icon: .search,
                title: "No results for \"psalm 151\"",
                message: "Check the spelling or try another book.",
                suggestions: ["Psalms", "Proverbs", "John"]
            )
            ISMEmptyState(
                icon: .bookmark,
                tone: .brand,
                title: "Nothing saved yet",
                message: "Bookmark a verse and it will appear here.",
                actionTitle: "Open the Bible",
                action: {}
            )
            ISMEmptyState(
                icon: .wifiOff,
                tone: .error,
                title: "You are offline",
                message: "Downloaded content still works.",
                actionTitle: "Try again",
                actionIcon: .refresh,
                action: {}
            )
        }
        .padding(16)
    }
}
