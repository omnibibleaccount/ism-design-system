import SwiftUI
import UIKit

/// Text field with visible label, hint and error. 48pt tall (60pt with `isLarge`), 12pt radius.
/// States: focus (blue border + halo), error (red border, tinted fill, icon + message under the field),
/// disabled (`.disabled(true)`: gray fill), loading (trailing spinner; typing stays possible).
/// The error text is also read as the accessibility hint, prefixed with "Error".
public struct ISMTextField: View {
    @Environment(\.colorScheme) private var scheme
    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @FocusState private var isFocused: Bool

    private let title: String
    private let text: Binding<String>
    private let placeholder: String
    private let hint: String?
    private let error: String?
    private let isOptional: Bool
    private let optionalLabel: String
    private let isSecure: Bool
    private let isLoading: Bool
    private let isLarge: Bool
    private let leadingIcon: ISMUIIcon?
    private let keyboardType: UIKeyboardType
    private let contentType: UITextContentType?
    private let capitalization: TextInputAutocapitalization?
    private let submitLabel: SubmitLabel
    private let onSubmit: (() -> Void)?

    public init(
        _ title: String,
        text: Binding<String>,
        placeholder: String = "",
        hint: String? = nil,
        error: String? = nil,
        isOptional: Bool = false,
        optionalLabel: String = "optional",
        isSecure: Bool = false,
        isLoading: Bool = false,
        isLarge: Bool = false,
        leadingIcon: ISMUIIcon? = nil,
        keyboardType: UIKeyboardType = .default,
        contentType: UITextContentType? = nil,
        capitalization: TextInputAutocapitalization? = nil,
        submitLabel: SubmitLabel = .done,
        onSubmit: (() -> Void)? = nil
    ) {
        self.title = title
        self.text = text
        self.placeholder = placeholder
        self.hint = hint
        self.error = error
        self.isOptional = isOptional
        self.optionalLabel = optionalLabel
        self.isSecure = isSecure
        self.isLoading = isLoading
        self.isLarge = isLarge
        self.leadingIcon = leadingIcon
        self.keyboardType = keyboardType
        self.contentType = contentType
        self.capitalization = capitalization
        self.submitLabel = submitLabel
        self.onSubmit = onSubmit
    }

    private var describing: String {
        if let error = error {
            return "Error: " + error
        }
        return hint ?? ""
    }

    public var body: some View {
        let theme = ISMTheme.resolve(scheme)
        let hasError = error != nil
        let height: CGFloat = isLarge ? ISMSize.fieldLg : ISMSize.field
        let fontSize: CGFloat = isLarge ? 20 : 16
        let shape = RoundedRectangle(cornerRadius: ISMRadius.radiusMd, style: .continuous)
        let fill: Color = !isEnabled ? theme.surfaceMuted : (hasError ? theme.errorField : theme.surface)
        let line: Color = hasError ? theme.error : (isFocused ? theme.focus : theme.fieldBorder)
        let inkColor: Color = isEnabled ? theme.text : theme.textTertiary
        let prompt = Text(placeholder).foregroundColor(theme.placeholder)

        return VStack(alignment: .leading, spacing: ISMSpacing.space2) {
            HStack(spacing: ISMSpacing.space1) {
                Text(title)
                    .font(ISMFont.sans(14, .semibold, relativeTo: .subheadline))
                    .foregroundColor(theme.text.opacity(0.78))
                if isOptional {
                    Text("(" + optionalLabel + ")")
                        .font(ISMFont.sans(14, .regular, relativeTo: .subheadline))
                        .foregroundColor(theme.textTertiary)
                }
            }
            .accessibilityHidden(true)

            HStack(spacing: ISMSpacing.space2) {
                if let icon = leadingIcon {
                    ISMGlyph(icon, size: ISMSize.iconMd)
                        .foregroundColor(theme.textTertiary)
                }
                Group {
                    if isSecure {
                        SecureField("", text: text, prompt: prompt)
                            .focused($isFocused)
                    } else {
                        TextField("", text: text, prompt: prompt)
                            .focused($isFocused)
                    }
                }
                .font(ISMFont.sans(fontSize, .regular, relativeTo: .body))
                .foregroundColor(inkColor)
                .keyboardType(keyboardType)
                .textContentType(contentType)
                .textInputAutocapitalization(capitalization)
                .submitLabel(submitLabel)
                .onSubmit {
                    onSubmit?()
                }
                .accessibilityLabel(Text(title))
                .accessibilityHint(Text(describing))
                if isLoading {
                    ISMSpinner(size: .s, tone: .brand, label: nil)
                }
            }
            .padding(.horizontal, ISMSpacing.space4)
            .frame(minHeight: height)
            .background(shape.fill(fill))
            .overlay(shape.strokeBorder(line, lineWidth: 1))
            .overlay(
                shape
                    .stroke(theme.focus.opacity(0.35), lineWidth: 3)
                    .padding(-1.5)
                    .opacity(isFocused && !hasError ? 1 : 0)
            )
            .contentShape(Rectangle())
            .onTapGesture {
                isFocused = true
            }
            .animation(ISMMotionHelper.animation(ISMMotion.easeStandard(ISMMotion.durationFast), reduceMotion: reduceMotion), value: isFocused)

            if let error = error {
                HStack(alignment: .top, spacing: ISMSpacing.space2) {
                    ISMGlyph(.alertCircle, size: ISMSize.iconSm)
                    Text(error)
                        .font(ISMFont.sans(14, .regular, relativeTo: .subheadline))
                        .fixedSize(horizontal: false, vertical: true)
                }
                .foregroundColor(theme.error)
                .accessibilityHidden(true)
            } else if let hint = hint {
                Text(hint)
                    .font(ISMFont.sans(14, .regular, relativeTo: .subheadline))
                    .foregroundColor(theme.textTertiary)
                    .fixedSize(horizontal: false, vertical: true)
                    .accessibilityHidden(true)
            }
        }
    }
}

private struct ISMTextFieldPreviewDemo: View {
    @State private var a = ""
    @State private var b = "not-an-email"
    @State private var c = "Locked"
    var body: some View {
        VStack(spacing: 20) {
            ISMTextField("Full name", text: $a, placeholder: "Maria Santos", hint: "As it appears on your ID.")
            ISMTextField("Email", text: $b, error: "Enter an email like name@example.com.", keyboardType: .emailAddress, capitalization: .never)
            ISMTextField("Code", text: $c, isOptional: true).disabled(true)
            ISMTextField("Checking", text: $a, isLoading: true)
        }
        .padding(16)
    }
}

#Preview("Input") {
    ISMTextFieldPreviewDemo()
}
