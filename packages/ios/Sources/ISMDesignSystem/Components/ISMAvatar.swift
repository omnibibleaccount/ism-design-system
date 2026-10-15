import SwiftUI

public enum ISMAvatarSize {
    case xs, s, m, l, xl

    /// 24 / 32 / 40 / 56 / 80
    public var points: CGFloat {
        switch self {
        case .xs: return 24
        case .s: return 32
        case .m: return 40
        case .l: return 56
        case .xl: return 80
        }
    }
}

public enum ISMAvatarTone: CaseIterable {
    case blue, violet, gold, ink, peach

    /// A stable tone for a name, so a person always keeps one colour.
    public static func automatic(for name: String) -> ISMAvatarTone {
        var total = 0
        for scalar in name.unicodeScalars {
            total += Int(scalar.value)
        }
        let all = ISMAvatarTone.allCases
        return all[total % all.count]
    }
}

public enum ISMPresence {
    case online, away, offline

    var spokenLabel: String {
        switch self {
        case .online: return "online"
        case .away: return "away"
        case .offline: return "offline"
        }
    }
}

/// Circular avatar: photo, initials or a person icon, with an optional presence dot.
/// Always circular. Pair presence with the spoken label (VoiceOver reads "Dawit Alemu, away").
public struct ISMAvatar: View {
    @Environment(\.colorScheme) private var scheme

    private let name: String
    private let image: Image?
    private let size: ISMAvatarSize
    private let tone: ISMAvatarTone
    private let presence: ISMPresence?
    private let isDecorative: Bool

    /// - Parameters:
    ///   - name: Full name; used for initials, the tone and the VoiceOver label.
    ///   - isDecorative: Hide from VoiceOver when a visible name sits next to the avatar.
    public init(
        name: String,
        image: Image? = nil,
        size: ISMAvatarSize = .m,
        tone: ISMAvatarTone? = nil,
        presence: ISMPresence? = nil,
        isDecorative: Bool = false
    ) {
        self.name = name
        self.image = image
        self.size = size
        self.tone = tone ?? ISMAvatarTone.automatic(for: name)
        self.presence = presence
        self.isDecorative = isDecorative
    }

    private var initials: String {
        let words = name.split(separator: " ").map { String($0) }
        guard let first = words.first else { return "" }
        if words.count == 1 {
            return String(first.prefix(1)).uppercased()
        }
        let last = words[words.count - 1]
        return (String(first.prefix(1)) + String(last.prefix(1))).uppercased()
    }

    private func palette() -> (fill: Color, ink: Color) {
        switch tone {
        case .blue: return (ISMColor.horizonBlue, ISMColor.white)
        case .violet: return (ISMColor.gradientViolet, ISMColor.charcoal900)
        case .gold: return (ISMColor.gradientGold, ISMColor.charcoal900)
        case .ink: return (ISMColor.charcoal900, ISMColor.white)
        case .peach: return (ISMColor.gradientPeach, ISMColor.charcoal900)
        }
    }

    private var presenceColor: Color {
        switch presence {
        case .some(.online): return ISMColor.success
        case .some(.away): return ISMColor.gradientGold
        default: return ISMColor.gray300
        }
    }

    private var spokenLabel: String {
        if let presence = presence {
            return name + ", " + presence.spokenLabel
        }
        return name
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let diameter = size.points
        let colors = palette()
        let dot = diameter * 0.28
        let avatar = ZStack {
            if let image = image {
                image
                    .resizable()
                    .scaledToFill()
                    .frame(width: diameter, height: diameter)
                    .clipShape(Circle())
            } else {
                Circle().fill(colors.fill)
                Text(initials)
                    .font(ISMFont.sans(diameter * 0.38, .semibold, relativeTo: .body))
                    .foregroundColor(colors.ink)
            }
        }
        .frame(width: diameter, height: diameter)
        .overlay(alignment: .bottomTrailing) {
            if presence != nil {
                Circle()
                    .fill(presenceColor)
                    .frame(width: dot, height: dot)
                    .overlay(Circle().stroke(theme.surface, lineWidth: 2))
            }
        }

        return Group {
            if isDecorative {
                avatar.accessibilityHidden(true)
            } else {
                avatar
                    .accessibilityElement(children: .ignore)
                    .accessibilityLabel(Text(spokenLabel))
                    .accessibilityAddTraits(AccessibilityTraits.isImage)
            }
        }
    }
}

/// Overlapping avatars (10pt overlap, 2pt ring). Shows at most `maxVisible` faces, then a "+N" tile.
public struct ISMAvatarStack: View {
    @Environment(\.colorScheme) private var scheme

    private let names: [String]
    private let size: ISMAvatarSize
    private let maxVisible: Int

    public init(names: [String], size: ISMAvatarSize = .m, maxVisible: Int = 4) {
        self.names = names
        self.size = size
        self.maxVisible = min(maxVisible, 4)
    }

    private var spokenLabel: String {
        let shown = Array(names.prefix(maxVisible))
        let rest = names.count - shown.count
        var text = shown.joined(separator: ", ")
        if rest > 0 {
            text += " and \(rest) more"
        }
        return text
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let shown = Array(names.prefix(maxVisible))
        let rest = names.count - shown.count
        let diameter = size.points
        return HStack(spacing: -10) {
            ForEach(Array(shown.enumerated()), id: \.offset) { entry in
                ISMAvatar(name: entry.element, size: size, isDecorative: true)
                    .overlay(Circle().stroke(theme.surface, lineWidth: 2))
            }
            if rest > 0 {
                ZStack {
                    Circle().fill(theme.surfaceMuted)
                    Text("+\(rest)")
                        .font(ISMFont.sans(diameter * 0.34, .semibold, relativeTo: .body))
                        .foregroundColor(theme.textSecondary)
                }
                .frame(width: diameter, height: diameter)
                .overlay(Circle().stroke(theme.surface, lineWidth: 2))
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text(spokenLabel))
    }
}

#Preview("Avatar") {
    VStack(alignment: .leading, spacing: 16) {
        HStack(spacing: 12) {
            ISMAvatar(name: "Maria Santos", size: .xs)
            ISMAvatar(name: "Dawit Alemu", size: .m, tone: .blue, presence: .away)
            ISMAvatar(name: "Joy Kamau", size: .l, tone: .gold, presence: .online)
            ISMAvatar(name: "Musa", size: .xl, tone: .ink, presence: .offline)
        }
        ISMAvatarStack(names: ["Maria Santos", "Dawit Alemu", "Musa Bello", "Joy Kamau", "Ana Cruz", "Li Wei"])
    }
    .padding(16)
}
