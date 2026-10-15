import SwiftUI

/// Search field: 48pt, 12pt radius, gray-100 at rest, white with the blue focus ring when active.
/// Includes a 44pt-hit clear button and an optional Cancel action that appears while editing.
public struct ISMSearchField: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @FocusState private var isFocused: Bool

    private let text: Binding<String>
    private let placeholder: String
    private let clearLabel: String
    private let cancelTitle: String
    private let showsCancel: Bool
    private let onSubmit: (() -> Void)?

    public init(
        text: Binding<String>,
        placeholder: String = "Search",
        clearLabel: String = "Clear search",
        cancelTitle: String = "Cancel",
        showsCancel: Bool = false,
        onSubmit: (() -> Void)? = nil
    ) {
        self.text = text
        self.placeholder = placeholder
        self.clearLabel = clearLabel
        self.cancelTitle = cancelTitle
        self.showsCancel = showsCancel
        self.onSubmit = onSubmit
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusMd, style: .continuous)
        let fill: Color = isFocused ? theme.surface : theme.surfaceMuted
        let line: Color = isFocused ? theme.focus : Color.clear
        let prompt = Text(placeholder).foregroundColor(theme.placeholder)

        return HStack(spacing: ISMSpacing.space2) {
            HStack(spacing: 10) {
                ISMGlyph(.search, size: ISMSize.iconMd)
                    .foregroundColor(theme.textTertiary)
                TextField("", text: text, prompt: prompt)
                    .focused($isFocused)
                    .font(ISMFont.sans(16, .regular, relativeTo: .body))
                    .foregroundColor(theme.text)
                    .submitLabel(.search)
                    .onSubmit {
                        onSubmit?()
                    }
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled(true)
                    .accessibilityLabel(Text(placeholder))
                    .accessibilityAddTraits(AccessibilityTraits.isSearchField)
                if !text.wrappedValue.isEmpty {
                    Button(action: {
                        text.wrappedValue = ""
                    }) {
                        ZStack {
                            Circle().fill(ISMColor.gray300)
                                .frame(width: 24, height: 24)
                            ISMGlyph(.close, size: 12)
                                .foregroundColor(ISMColor.white)
                        }
                        .frame(width: ISMLayout.tapTarget, height: ISMLayout.tapTarget)
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(Text(clearLabel))
                    .padding(.trailing, -ISMSpacing.space3)
                }
            }
            .padding(.leading, 14)
            .padding(.trailing, ISMSpacing.space3)
            .frame(minHeight: ISMSize.field)
            .background(shape.fill(fill))
            .overlay(shape.strokeBorder(line, lineWidth: 1))
            .overlay(
                shape
                    .stroke(theme.focus.opacity(0.35), lineWidth: 3)
                    .padding(-1.5)
                    .opacity(isFocused ? 1 : 0)
            )
            .contentShape(Rectangle())
            .onTapGesture {
                isFocused = true
            }

            if showsCancel && isFocused {
                Button(action: {
                    text.wrappedValue = ""
                    isFocused = false
                }) {
                    Text(cancelTitle)
                        .font(ISMFont.sans(16, .medium, relativeTo: .body))
                        .foregroundColor(theme.link)
                        .frame(minHeight: ISMLayout.tapTarget)
                        .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
        }
        .opacity(isEnabled ? 1 : theme.disabledOpacity)
        .animation(ISMMotionHelper.animation(ISMMotion.easeStandard(ISMMotion.durationFast), reduceMotion: reduceMotion), value: isFocused)
    }
}

private struct ISMSearchFieldPreviewDemo: View {
    @State private var query = ""
    @State private var filled = "Psalm 23"
    var body: some View {
        VStack(spacing: 16) {
            ISMSearchField(text: $query, showsCancel: true)
            ISMSearchField(text: $filled)
        }
        .padding(16)
    }
}

#Preview("SearchField") {
    ISMSearchFieldPreviewDemo()
}
