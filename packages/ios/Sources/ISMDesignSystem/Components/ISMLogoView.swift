import SwiftUI

/// ISM and dot.Bible logos. Template-rendered black ink: black on light, white on dark.
/// Minimum heights from the Logos spec: full logo 24, mark 24, dot.Bible icon 32.
public struct ISMLogoView: View {
    @Environment(\.colorScheme) private var scheme

    private let logo: ISMLogo
    private let height: CGFloat
    private let onDark: Bool?
    private let label: String?
    private let isLink: Bool
    private let clearSpace: Bool

    /// - Parameters:
    ///   - height: Rendered height. Clamped to the minimum for the logo.
    ///   - onDark: Force white ink (true) or black ink (false). Default follows the colour scheme.
    ///   - label: VoiceOver label. Defaults to the organisation name. Pass "ISM home" when the logo is a home link.
    ///   - clearSpace: Adds the required clear space (a quarter of the height) around the logo.
    public init(_ logo: ISMLogo, height: CGFloat = 32, onDark: Bool? = nil, label: String? = nil, isLink: Bool = false, clearSpace: Bool = false) {
        self.logo = logo
        self.height = height
        self.onDark = onDark
        self.label = label
        self.isLink = isLink
        self.clearSpace = clearSpace
    }

    private var minimumHeight: CGFloat {
        switch logo {
        case .dotbibleIcon: return 32
        case .ismFull, .ismMark, .dotbibleFull: return 24
        }
    }

    private var defaultLabel: String {
        switch logo {
        case .ismFull, .ismMark: return "International Scripture Ministries"
        case .dotbibleFull, .dotbibleIcon: return "dot.Bible"
        }
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let useWhite: Bool = onDark ?? theme.isDark
        let h = max(height, minimumHeight)
        return logo.image
            .renderingMode(.template)
            .resizable()
            .scaledToFit()
            .frame(height: h)
            .foregroundColor(useWhite ? ISMColor.white : ISMColor.black)
            .padding(clearSpace ? h / 4 : 0)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text(label ?? defaultLabel))
            .accessibilityAddTraits(isLink ? AccessibilityTraits.isLink : AccessibilityTraits.isImage)
    }
}

#Preview("Logos") {
    VStack(alignment: .leading, spacing: 20) {
        ForEach(ISMLogo.allCases, id: \.rawValue) { logo in
            ISMLogoView(logo, height: 32)
        }
        ZStack {
            Color.black
            ISMLogoView(.ismFull, height: 32, onDark: true).padding(16)
        }
        .frame(height: 80)
    }
    .padding(16)
}
