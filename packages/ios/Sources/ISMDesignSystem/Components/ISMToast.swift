import SwiftUI
import UIKit

public enum ISMToastTone {
    case success, error, info

    var icon: ISMUIIcon {
        switch self {
        case .success: return .check
        case .error: return .alertCircle
        case .info: return .info
        }
    }

    var dotColor: Color {
        switch self {
        case .success: return ISMColor.success
        case .error: return ISMColor.error
        case .info: return ISMColor.horizonBlue
        }
    }
}

/// A message to show in a toast. Set a binding of this type to present one; set it to nil to hide it.
public struct ISMToastItem: Identifiable {
    public let id: UUID
    public let message: String
    public let tone: ISMToastTone
    public let actionTitle: String?
    public let action: (() -> Void)?

    public init(_ message: String, tone: ISMToastTone = .success, actionTitle: String? = nil, action: (() -> Void)? = nil) {
        self.id = UUID()
        self.message = message
        self.tone = tone
        self.actionTitle = actionTitle
        self.action = action
    }
}

/// The toast surface: charcoal, 12pt radius, tone dot, message, optional text action (44pt) and a dismiss button.
public struct ISMToast: View {
    @Environment(\.colorScheme) private var scheme

    private let message: String
    private let tone: ISMToastTone
    private let actionTitle: String?
    private let onAction: (() -> Void)?
    private let onDismiss: (() -> Void)?
    private let dismissLabel: String

    public init(
        _ message: String,
        tone: ISMToastTone = .success,
        actionTitle: String? = nil,
        onAction: (() -> Void)? = nil,
        onDismiss: (() -> Void)? = nil,
        dismissLabel: String = "Dismiss"
    ) {
        self.message = message
        self.tone = tone
        self.actionTitle = actionTitle
        self.onAction = onAction
        self.onDismiss = onDismiss
        self.dismissLabel = dismissLabel
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusMd, style: .continuous)
        return HStack(spacing: ISMSpacing.space3) {
            ZStack {
                Circle().fill(tone.dotColor)
                ISMGlyph(tone.icon, size: 14)
                    .foregroundColor(ISMColor.white)
            }
            .frame(width: 24, height: 24)
            Text(message)
                .font(ISMFont.sans(15, .regular, relativeTo: .callout))
                .foregroundColor(theme.onInverse)
                .multilineTextAlignment(.leading)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.vertical, ISMSpacing.space2)
                .accessibilityLabel(Text((tone == .error ? "Error. " : "") + message))
            if let actionTitle = actionTitle, let onAction = onAction {
                Button(action: onAction) {
                    Text(actionTitle)
                        .font(ISMFont.sans(15, .semibold, relativeTo: .callout))
                        .foregroundColor(ISMColor.blueOnDark)
                        .padding(.horizontal, ISMSpacing.space3)
                        .frame(minHeight: ISMLayout.tapTarget)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .ismFocusRing(cornerRadius: ISMRadius.radiusSm)
            }
            if let onDismiss = onDismiss {
                Button(action: onDismiss) {
                    ISMGlyph(.close, size: ISMSize.iconMd)
                        .foregroundColor(Color.white.opacity(0.7))
                        .frame(width: ISMLayout.tapTarget, height: ISMLayout.tapTarget)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .ismFocusRing(cornerRadius: ISMRadius.radiusSm)
                .accessibilityLabel(Text(dismissLabel))
            }
        }
        .padding(.leading, ISMSpacing.space4)
        .padding(.trailing, ISMSpacing.space1)
        .padding(.vertical, ISMSpacing.space1)
        .frame(minHeight: 52)
        .frame(maxWidth: 420)
        .background(shape.fill(theme.inverseSurface))
        .overlay(shape.strokeBorder(theme.isDark ? ISMColor.borderHairlineDark : Color.clear, lineWidth: 1))
        .ismShadow(ISMShadow.overlay)
        .accessibilityElement(children: .contain)
    }
}

private struct ISMToastModifier: ViewModifier {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Binding var item: ISMToastItem?
    let duration: TimeInterval
    let bottomInset: CGFloat

    func body(content: Content) -> some View {
        let transition: AnyTransition = reduceMotion
            ? AnyTransition.opacity
            : AnyTransition.move(edge: .bottom).combined(with: AnyTransition.opacity)
        return content
            .overlay(alignment: .bottom) {
                ZStack {
                    if let current = item {
                        ISMToast(
                            current.message,
                            tone: current.tone,
                            actionTitle: current.actionTitle,
                            onAction: {
                                current.action?()
                                item = nil
                            },
                            onDismiss: {
                                item = nil
                            }
                        )
                        .padding(.horizontal, ISMSpacing.space4)
                        .padding(.bottom, bottomInset)
                        .transition(transition)
                        .id(current.id)
                    }
                }
                .zIndex(ISMZIndex.zToast)
                .animation(
                    ISMMotionHelper.animation(ISMMotion.easeRise(ISMMotion.durationBase), reduceMotion: reduceMotion),
                    value: item?.id
                )
            }
            .task(id: item?.id) {
                let shown: ISMToastItem? = await MainActor.run { item }
                guard let current = shown else { return }
                let seconds: Double = await MainActor.run { () -> Double in
                    UIAccessibility.post(notification: .announcement, argument: current.message)
                    var value: Double = current.actionTitle != nil ? max(duration, 8) : duration
                    if UIAccessibility.isVoiceOverRunning {
                        value *= 3
                    }
                    return value
                }
                try? await Task.sleep(nanoseconds: UInt64(seconds * 1_000_000_000))
                if Task.isCancelled { return }
                await MainActor.run {
                    if item?.id == current.id {
                        item = nil
                    }
                }
            }
    }
}

public extension View {
    /// Shows a toast at the bottom of this view while `item` is non-nil. It hides itself after `duration`
    /// seconds (8 with an action, three times longer while VoiceOver runs). Focus never moves to a toast.
    /// - Parameter bottomInset: Distance from the bottom edge; raise it to clear a tab bar.
    func ismToast(item: Binding<ISMToastItem?>, duration: TimeInterval = 4, bottomInset: CGFloat = ISMSpacing.space4) -> some View {
        modifier(ISMToastModifier(item: item, duration: duration, bottomInset: bottomInset))
    }
}

private struct ISMToastPreviewDemo: View {
    @State private var toast: ISMToastItem?
    var body: some View {
        VStack(spacing: 16) {
            ISMButton("Show toast") {
                toast = ISMToastItem("Verse copied", tone: .success, actionTitle: "Undo", action: {})
            }
            ISMToast("Could not sync. Try again.", tone: .error, actionTitle: "Retry", onAction: {}, onDismiss: {})
            ISMToast("Saved to your library", tone: .info, onDismiss: {})
        }
        .padding(16)
        .ismToast(item: $toast)
    }
}

#Preview("Toast") {
    ISMToastPreviewDemo()
}
