import SwiftUI
import CoreText

/// Registers the bundled Inter and Lora fonts at runtime. Call `ISMFonts.register()` once at app launch
/// (for example in `App.init()`), before the first view renders.
public enum ISMFonts {
    /// PostScript / file base names of every bundled font.
    public static let fileNames: [String] = [
        "Inter-Regular", "Inter-Medium", "Inter-SemiBold", "Inter-Bold",
        "Lora-Regular", "Lora-SemiBold", "Lora-Bold",
        "Lora-Italic", "Lora-SemiBoldItalic", "Lora-BoldItalic"
    ]

    private static let registration: Bool = {
        var allOK = true
        for name in ISMFonts.fileNames {
            var url: URL? = Bundle.module.url(forResource: name, withExtension: "ttf", subdirectory: "Fonts")
            if url == nil {
                url = Bundle.module.url(forResource: name, withExtension: "ttf")
            }
            guard let fontURL = url else {
                allOK = false
                continue
            }
            // Returns false when the font is already registered; that is not an error for us.
            _ = CTFontManagerRegisterFontsForURL(fontURL as CFURL, .process, nil)
        }
        return allOK
    }()

    /// Registers all fonts once (later calls are no-ops). Returns false when a font file was missing from the bundle.
    @discardableResult
    public static func register() -> Bool {
        return registration
    }
}

/// Font construction from tokens. Uses `Font.custom(_:size:relativeTo:)` so every font scales with Dynamic Type.
public enum ISMFont {
    public static func postScriptName(serif: Bool, weight: Font.Weight, italic: Bool) -> String {
        if serif {
            if weight == .bold || weight == .heavy || weight == .black {
                return italic ? "Lora-BoldItalic" : "Lora-Bold"
            }
            if weight == .semibold {
                return italic ? "Lora-SemiBoldItalic" : "Lora-SemiBold"
            }
            return italic ? "Lora-Italic" : "Lora-Regular"
        }
        if weight == .bold || weight == .heavy || weight == .black {
            return "Inter-Bold"
        }
        if weight == .semibold {
            return "Inter-SemiBold"
        }
        if weight == .medium {
            return "Inter-Medium"
        }
        return "Inter-Regular"
    }

    public static func custom(
        serif: Bool,
        weight: Font.Weight,
        italic: Bool,
        size: CGFloat,
        relativeTo textStyle: Font.TextStyle
    ) -> Font {
        let name = postScriptName(serif: serif, weight: weight, italic: italic)
        return Font.custom(name, size: size, relativeTo: textStyle)
    }

    /// Inter at an arbitrary size.
    public static func sans(_ size: CGFloat, _ weight: Font.Weight = .regular, relativeTo textStyle: Font.TextStyle = .body) -> Font {
        return custom(serif: false, weight: weight, italic: false, size: size, relativeTo: textStyle)
    }

    /// Lora at an arbitrary size.
    public static func serif(_ size: CGFloat, _ weight: Font.Weight = .regular, italic: Bool = false, relativeTo textStyle: Font.TextStyle = .body) -> Font {
        return custom(serif: true, weight: weight, italic: italic, size: size, relativeTo: textStyle)
    }

    public static func font(for token: ISMTextStyle, size: CGFloat? = nil, italic: Bool? = nil, relativeTo textStyle: Font.TextStyle) -> Font {
        return custom(
            serif: token.serif,
            weight: token.weight,
            italic: italic ?? token.italic,
            size: size ?? token.size,
            relativeTo: textStyle
        )
    }
}
