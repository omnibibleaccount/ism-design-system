import SwiftUI
import UIKit

public enum ISMAlertTone {
    case info, success, warning, error

    var icon: ISMUIIcon {
        switch self {
        case .info: return .info
        case .success: return .checkCircle
        case .warning: return .alertTriangle
        case .error: return .alertCircle
        }
    }

    /// Spoken prefix so the tone never depends on colour alone.
    var spokenName: String {
        switch self {
        case .info: return "Information"
        case .success: return "Success"
        case .warning: return "Warning"
        case .error: return "Error"
        }
    }
}

/// Inline banner. Icon + title/message + optional action and dismiss button. 12pt radius, tone text on tone background.
/// Errors are announced to VoiceOver as soon as they appear. Insert the alert when the event happens;
/// a pre-rendered hidden alert is not announced.
public struct ISMAlert: View {
    @Environment(\.colorScheme) private var scheme

    private let tone: ISMAlertTone
    private let title: String?
    private let message: String
    private let actionTitle: String?
    private let action: (() -> Void)?
    private let onDismiss: (() -> Void)?
    private let dismissLabel: String

    public init(
        _ tone: ISMAlertTone,
        title: String? = nil,
        message: String,
        actionTitle: String? = nil,
        action: (() -> Void)? = nil,
        onDismiss: (() -> Void)? = nil,
        dismissLabel: String = "Dismiss"
    ) {
        self.tone = tone
        self.title = title
        self.message = message
        self.actionTitle = actionTitle
        self.action = action
        self.onDismiss = onDismiss
        self.dismissLabel = dismissLabel
    }

    private func palette(_ theme: ISMTheme) -> (ink: Color, fill: Color, line: Color) {
        switch tone {
        case .info: return (theme.info, theme.infoBackground, theme.infoLine)
        case .success: return (theme.success, theme.successBackground, theme.successLine)
        case .warning: return (theme.warning, theme.warningBackground, theme.warningLine)
        case .error: return (theme.error, theme.errorBackground, theme.errorLine)
        }
    }

    private var spokenText: String {
        var parts: [String] = [tone.spokenName]
        if let title = title {
            parts.append(title)
        }
        parts.append(message)
        return parts.joined(separator: ". ")
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let p = palette(theme)
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusMd, style: .continuous)
        return HStack(alignment: .top, spacing: ISMSpacing.space3) {
            ISMGlyph(tone.icon, size: ISMSize.iconMd)
                .padding(.top, 1)
            VStack(alignment: .leading, spacing: 2) {
                if let title = title {
                    Text(title)
                        .font(ISMFont.sans(16, .semibold, relativeTo: .body))
                        .fixedSize(horizontal: false, vertical: true)
                }
                Text(message)
                    .font(ISMFont.sans(15, .regular, relativeTo: .callout))
                    .fixedSize(horizontal: false, vertical: true)
                if let actionTitle = actionTitle, let action = action {
                    Button(action: action) {
                        Text(actionTitle)
                            .font(ISMFont.sans(15, .semibold, relativeTo: .callout))
                            .underline()
                            .frame(minHeight: ISMLayout.tapTarget, alignment: .leading)
                            .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    .ismFocusRing(cornerRadius: ISMRadius.radiusSm)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(spokenText))
            if let onDismiss = onDismiss {
                Button(action: onDismiss) {
                    ISMGlyph(.close, size: ISMSize.iconMd)
                        .frame(width: ISMLayout.tapTarget, height: ISMLayout.tapTarget)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .padding(.top, -12)
                .padding(.trailing, -ISMSpacing.space3)
                .ismFocusRing(cornerRadius: ISMRadius.radiusSm)
                .accessibilityLabel(Text(dismissLabel))
            }
        }
        .foregroundColor(p.ink)
        .padding(.vertical, ISMSpacing.space4)
        .padding(.horizontal, 18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(shape.fill(p.fill))
        .overlay(shape.strokeBorder(p.line, lineWidth: 1))
        .accessibilityElement(children: .contain)
        .onAppear {
            if tone == .error {
                UIAccessibility.post(notification: .announcement, argument: spokenText)
            }
        }
    }
}

#Preview("Alert") {
    VStack(spacing: 12) {
        ISMAlert(.info, title: "Offline reading", message: "Downloaded Bibles work without a connection.")
        ISMAlert(.success, message: "Your gift was received. Thank you.", onDismiss: {})
        ISMAlert(.warning, title: "Draft", message: "This translation is still being reviewed.", actionTitle: "Learn more", action: {})
        ISMAlert(.error, title: "Could not save", message: "Check your connection and try again.")
    }
    .padding(16)
}
