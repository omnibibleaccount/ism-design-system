import SwiftUI

public enum ISMVerseVariant {
    /// White card on off-white.
    case card
    /// Black panel with blue and gold glows (verse of the day).
    case verseOfTheDay
}

/// Scripture quotation with reference and optional tools (share, copy, bookmark).
/// Text is Lora (`scripture` style). Set `lang` for non-Latin scripts so line-height and direction follow the script.
/// The reference is isolated left-to-right. Confirm copy and share with an `ISMToast`, never only by changing the icon.
public struct ISMVerseBlock: View {
    @Environment(\.colorScheme) private var scheme

    private let text: String
    private let reference: String
    private let lang: String?
    private let variant: ISMVerseVariant
    private let eyebrow: String?
    private let isBookmarked: Binding<Bool>?
    private let onShare: (() -> Void)?
    private let onCopy: (() -> Void)?
    private let shareLabel: String
    private let copyLabel: String
    private let bookmarkLabel: String
    private let removeBookmarkLabel: String

    public init(
        text: String,
        reference: String,
        lang: String? = nil,
        variant: ISMVerseVariant = .card,
        eyebrow: String? = nil,
        isBookmarked: Binding<Bool>? = nil,
        onShare: (() -> Void)? = nil,
        onCopy: (() -> Void)? = nil,
        shareLabel: String = "Share verse",
        copyLabel: String = "Copy verse",
        bookmarkLabel: String = "Bookmark verse",
        removeBookmarkLabel: String = "Remove bookmark"
    ) {
        self.text = text
        self.reference = reference
        self.lang = lang
        self.variant = variant
        self.eyebrow = eyebrow
        self.isBookmarked = isBookmarked
        self.onShare = onShare
        self.onCopy = onCopy
        self.shareLabel = shareLabel
        self.copyLabel = copyLabel
        self.bookmarkLabel = bookmarkLabel
        self.removeBookmarkLabel = removeBookmarkLabel
    }

    private var hasTools: Bool {
        return onShare != nil || onCopy != nil || isBookmarked != nil
    }

    private var restingToolKind: ISMIconButtonKind {
        return variant == .card ? ISMIconButtonKind.tinted : ISMIconButtonKind.glass
    }

    private var tools: some View {
        HStack(spacing: ISMSpacing.space2) {
            if let onCopy = onCopy {
                ISMIconButton(.copy, label: copyLabel, kind: restingToolKind, size: .md, action: onCopy)
            }
            if let onShare = onShare {
                ISMIconButton(.share, label: shareLabel, kind: restingToolKind, size: .md, action: onShare)
            }
            if let binding = isBookmarked {
                ISMIconButton(
                    .bookmark,
                    label: binding.wrappedValue ? removeBookmarkLabel : bookmarkLabel,
                    kind: binding.wrappedValue ? ISMIconButtonKind.solid : restingToolKind,
                    size: .md,
                    isToggled: binding.wrappedValue,
                    action: {
                        binding.wrappedValue.toggle()
                    }
                )
            }
        }
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusLg, style: .continuous)
        let isCard = variant == .card
        let textColor: Color = isCard ? (theme.isDark ? Color.white.opacity(0.88) : ISMColor.charcoal900) : ISMColor.white
        let refColor: Color = isCard ? (theme.isDark ? ISMColor.blueOnDark : ISMColor.horizonBlueDim) : ISMColor.leatherGold
        let verseSize: CGFloat = isCard ? 21 : 26
        let pad: CGFloat = isCard ? 24 : 28

        let inner = VStack(alignment: .leading, spacing: isCard ? 20 : ISMSpacing.space5) {
            if let eyebrow = eyebrow {
                ISMText(eyebrow, style: .webOverline, lang: lang, color: isCard ? theme.textTertiary : ISMColor.blueOnDark)
                    .accessibilityAddTraits(AccessibilityTraits.isHeader)
            }
            ISMText(text, style: .scripture, lang: lang, color: textColor, size: verseSize)
                .textSelection(.enabled)
            HStack(spacing: ISMSpacing.space4) {
                Text(reference)
                    .font(ISMFont.sans(isCard ? 14 : 15, .semibold, relativeTo: .subheadline))
                    .foregroundColor(refColor)
                    .ismLTR()
                Spacer(minLength: 0)
                if hasTools {
                    tools
                }
            }
        }
        .padding(pad)
        .frame(maxWidth: .infinity, alignment: .leading)

        return Group {
            if isCard {
                inner
                    .background(shape.fill(theme.surface))
                    .overlay(shape.strokeBorder(theme.isDark ? ISMColor.borderHairlineDark : ISMColor.borderHairlineLight, lineWidth: 1))
                    .ismShadow(theme.cardShadow)
            } else {
                inner
                    .background(
                        ZStack {
                            Color.black
                            RadialGradient(
                                colors: [ISMColor.horizonBlue.opacity(0.32), Color.clear],
                                center: UnitPoint(x: 0.12, y: 0),
                                startRadius: 0,
                                endRadius: 280
                            )
                            RadialGradient(
                                colors: [ISMColor.gradientGold.opacity(0.18), Color.clear],
                                center: UnitPoint(x: 0.9, y: 1),
                                startRadius: 0,
                                endRadius: 280
                            )
                        }
                    )
                    .clipShape(shape)
            }
        }
        .accessibilityElement(children: .contain)
    }
}

/// Inline scripture citation inside running text: semibold, dotted underline, 44pt hit area is provided by the surrounding line.
public struct ISMCitation: View {
    @Environment(\.colorScheme) private var scheme

    private let reference: String
    private let action: () -> Void

    public init(_ reference: String, action: @escaping () -> Void) {
        self.reference = reference
        self.action = action
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let color: Color = theme.isDark ? ISMColor.blueOnDark : ISMColor.horizonBlueDim
        return Button(action: action) {
            Text(reference)
                .font(ISMFont.sans(16, .semibold, relativeTo: .body))
                .underline(true, pattern: .dot, color: color.opacity(0.6))
                .foregroundColor(color)
                .frame(minHeight: ISMLayout.tapTarget)
                .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .ismFocusRing(cornerRadius: ISMRadius.radiusXs)
        .ismLTR()
        .accessibilityAddTraits(AccessibilityTraits.isLink)
    }
}

private struct ISMVerseBlockPreviewDemo: View {
    @State private var saved = false
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                ISMVerseBlock(
                    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
                    reference: "John 3:16",
                    isBookmarked: $saved,
                    onShare: {},
                    onCopy: {}
                )
                ISMVerseBlock(
                    text: "The Lord is my shepherd; I shall not want.",
                    reference: "Psalm 23:1",
                    variant: .verseOfTheDay,
                    eyebrow: "Verse of the day",
                    onShare: {}
                )
                ISMCitation("Romans 8:28") {}
            }
            .padding(16)
        }
        .background(ISMColor.offWhite)
    }
}

#Preview("VerseBlock") {
    ISMVerseBlockPreviewDemo()
}
