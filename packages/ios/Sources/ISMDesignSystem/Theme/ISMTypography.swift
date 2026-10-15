import SwiftUI

/// Names of the typography tokens in `ISMType`.
public enum ISMTypeStyle: CaseIterable {
    case webH1, webH2, webH3, webH4, webLead, webBody, webSmall, webLabel, webEyebrow, webOverline
    case display1, display2, printH1, printH2, printH3, printH4, bodyLg, printBody, bodySm
    case scripture, pullQuote, editorialQuote

    public var token: ISMTextStyle {
        switch self {
        case .webH1: return ISMType.webH1
        case .webH2: return ISMType.webH2
        case .webH3: return ISMType.webH3
        case .webH4: return ISMType.webH4
        case .webLead: return ISMType.webLead
        case .webBody: return ISMType.webBody
        case .webSmall: return ISMType.webSmall
        case .webLabel: return ISMType.webLabel
        case .webEyebrow: return ISMType.webEyebrow
        case .webOverline: return ISMType.webOverline
        case .display1: return ISMType.display1
        case .display2: return ISMType.display2
        case .printH1: return ISMType.printH1
        case .printH2: return ISMType.printH2
        case .printH3: return ISMType.printH3
        case .printH4: return ISMType.printH4
        case .bodyLg: return ISMType.bodyLg
        case .printBody: return ISMType.printBody
        case .bodySm: return ISMType.bodySm
        case .scripture: return ISMType.scripture
        case .pullQuote: return ISMType.pullQuote
        case .editorialQuote: return ISMType.editorialQuote
        }
    }

    /// The Dynamic Type text style this token scales relative to.
    public var relativeTo: Font.TextStyle {
        switch self {
        case .webH1, .display1, .display2, .printH1: return .largeTitle
        case .webH2, .printH2, .editorialQuote: return .title
        case .webH3, .printH3, .pullQuote: return .title2
        case .webH4, .printH4: return .title3
        case .webLead, .webBody, .bodyLg, .printBody, .scripture: return .body
        case .webSmall, .bodySm: return .callout
        case .webLabel: return .subheadline
        case .webEyebrow, .webOverline: return .caption
        }
    }

    public var isHeading: Bool {
        switch self {
        case .webH1, .webH2, .webH3, .webH4, .display1, .display2, .printH1, .printH2, .printH3, .printH4:
            return true
        default:
            return false
        }
    }

    public var isUppercase: Bool {
        return self == .webEyebrow || self == .webOverline
    }
}

/// Script handling for non-Latin languages (rules/multilingual-rtl.md).
public enum ISMScriptSupport {
    /// Base language code: "am-ET" becomes "am".
    public static func baseCode(_ lang: String) -> String {
        let parts = lang.lowercased().split(whereSeparator: { $0 == "-" || $0 == "_" })
        if let first = parts.first {
            return String(first)
        }
        return lang.lowercased()
    }

    /// The matching script entry, or nil for unknown languages.
    public static func script(for lang: String?) -> ISMScript? {
        guard let lang = lang else { return nil }
        let code = baseCode(lang)
        for script in ISMScripts.all {
            if script.languages.contains(code) {
                return script
            }
        }
        return nil
    }

    /// Ethiopic, Myanmar and Arabic-script languages. Latin returns false.
    public static func isComplexScript(_ lang: String?) -> Bool {
        guard let script = script(for: lang) else { return false }
        return script.id != "latin"
    }

    public static func isRTL(_ lang: String?) -> Bool {
        guard let lang = lang else { return false }
        if baseCode(lang) == "he" { return true }
        if let script = script(for: lang) { return script.rtl }
        return false
    }

    /// Line-height multiplier for the language, or nil when the token's own value applies (Latin).
    public static func lineHeight(for lang: String?, heading: Bool) -> Double? {
        guard let script = script(for: lang), script.id != "latin" else { return nil }
        return heading ? script.lineHeightHeading : script.lineHeightBody
    }
}

/// Approximate Dynamic Type multipliers, used to scale values (such as line spacing) that SwiftUI does not scale itself.
public enum ISMDynamicType {
    public static func scale(_ size: DynamicTypeSize) -> CGFloat {
        switch size {
        case .xSmall: return 0.82
        case .small: return 0.88
        case .medium: return 0.94
        case .large: return 1.0
        case .xLarge: return 1.12
        case .xxLarge: return 1.23
        case .xxxLarge: return 1.35
        case .accessibility1: return 1.6
        case .accessibility2: return 1.9
        case .accessibility3: return 2.3
        case .accessibility4: return 2.75
        default: return 3.1
        }
    }
}

/// Typography view. Applies the token font (Inter or Lora), tracking and line spacing.
/// When `lang` names a non-Latin script the script line-height is used, tracking is removed,
/// uppercase and italics are dropped, and RTL languages get a right-to-left layout direction.
public struct ISMText: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.dynamicTypeSize) private var dynamicTypeSize
    @Environment(\.layoutDirection) private var layoutDirection

    private let text: String
    private let style: ISMTypeStyle
    private let lang: String?
    private let color: Color?
    private let sizeOverride: CGFloat?
    private let alignment: TextAlignment

    public init(
        _ text: String,
        style: ISMTypeStyle = .webBody,
        lang: String? = nil,
        color: Color? = nil,
        size: CGFloat? = nil,
        alignment: TextAlignment = .leading
    ) {
        self.text = text
        self.style = style
        self.lang = lang
        self.color = color
        self.sizeOverride = size
        self.alignment = alignment
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let token = style.token
        let complex = ISMScriptSupport.isComplexScript(lang)
        let size: CGFloat = sizeOverride ?? token.size
        let lineHeight: Double = ISMScriptSupport.lineHeight(for: lang, heading: style.isHeading) ?? token.lineHeight
        // Inter's natural line height is about 1.21 em; SwiftUI's lineSpacing adds to it.
        let extra: CGFloat = max(0, (CGFloat(lineHeight) - 1.21) * size) * ISMDynamicType.scale(dynamicTypeSize)
        let trackingValue: CGFloat = complex ? 0 : CGFloat(token.tracking)
        let italic: Bool = complex ? false : token.italic
        let direction: LayoutDirection = ISMScriptSupport.isRTL(lang) ? .rightToLeft : layoutDirection
        let uppercase: Bool = style.isUppercase && !complex

        return Text(text)
            .font(ISMFont.font(for: token, size: size, italic: italic, relativeTo: style.relativeTo))
            .tracking(trackingValue)
            .foregroundColor(color ?? theme.text)
            .lineSpacing(extra)
            .multilineTextAlignment(alignment)
            .textCase(uppercase ? Text.Case.uppercase : nil)
            .environment(\.layoutDirection, direction)
            .accessibilityAddTraits(style.isHeading ? AccessibilityTraits.isHeader : AccessibilityTraits())
    }
}

#Preview("ISMText") {
    ScrollView {
        VStack(alignment: .leading, spacing: 12) {
            ISMText("Heading one", style: .webH2)
            ISMText("Body copy in Inter.", style: .webBody)
            ISMText("EYEBROW", style: .webEyebrow)
            ISMText("In the beginning was the Word.", style: .scripture)
            ISMText("በመጀመሪያ ቃል ነበረ። ቃልም ከእግዚአብሔር ጋር ነበረ።", style: .webBody, lang: "am")
            ISMText("في البدء كان الكلمة", style: .webBody, lang: "ar")
        }
        .padding(16)
    }
}
