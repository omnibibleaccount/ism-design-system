package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.error
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.forLanguage
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMSize
import bible.ism.design.tokens.ISMSpacing

/**
 * Text field with a visible label above, optional hint and an error message below.
 *
 * - Always give a [label]; the [placeholder] is only an example.
 * - [errorText] turns the border and fill to the error treatment, shows the message with an icon
 *   (never colour alone), and sets the semantics error so TalkBack reads it.
 * - Fields are at least 48dp tall ([large] = 60dp, 20sp for hero and directory search).
 * - Disabled fields use the gray-100 fill rather than opacity; read-only fields can be focused and copied.
 * - [success] (green border) only where a check really ran, such as a server-confirmed email.
 * - [loading] shows a trailing spinner (async validation).
 */
@Composable
fun ISMTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String? = null,
    hint: String? = null,
    errorText: String? = null,
    success: Boolean = false,
    optional: Boolean = false,
    optionalLabel: String = "(optional)",
    enabled: Boolean = true,
    readOnly: Boolean = false,
    singleLine: Boolean = true,
    minLines: Int = 1,
    large: Boolean = false,
    loading: Boolean = false,
    leadingIcon: ISMUIIcon? = null,
    trailing: (@Composable () -> Unit)? = null,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    lang: String = "en",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val isError = errorText != null
    val shape = ISMShapes.md

    val borderColor = when {
        isError -> c.error
        !enabled -> c.border
        interaction.focused -> c.focusRing
        success -> c.success
        interaction.hovered -> c.fieldBorderHover
        else -> c.fieldBorder
    }
    val fillColor = when {
        !enabled -> c.surfaceMuted
        isError -> c.errorFieldBg
        readOnly -> c.background
        else -> c.surfaceRaised
    }
    val textColor = if (enabled) c.textPrimary else c.textSecondary
    val fontSize = if (large) 20.sp else 16.sp
    val textStyle = ISMTheme.typography.body
        .copy(fontSize = fontSize, lineHeight = (fontSize.value * 1.4f).sp, color = textColor)
        .forLanguage(lang)

    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(ISMSpacing.space2)) {
        Row(horizontalArrangement = Arrangement.spacedBy(ISMSpacing.space1)) {
            ISMText(
                text = label,
                lang = lang,
                style = ISMTheme.typography.label,
                color = c.textPrimary.copy(alpha = 0.72f),
            )
            if (optional) {
                ISMText(
                    text = optionalLabel,
                    lang = lang,
                    style = ISMTheme.typography.label.copy(fontWeight = FontWeight.Normal),
                    color = c.textSecondary,
                )
            }
        }

        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .semantics {
                    contentDescription = label
                    if (errorText != null) error(errorText)
                },
            enabled = enabled,
            readOnly = readOnly,
            textStyle = textStyle,
            keyboardOptions = keyboardOptions,
            keyboardActions = keyboardActions,
            singleLine = singleLine,
            minLines = if (singleLine) 1 else minLines,
            visualTransformation = visualTransformation,
            interactionSource = interactionSource,
            cursorBrush = SolidColor(c.link),
            decorationBox = { innerTextField ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = if (large) ISMSize.fieldLg else ISMSize.field)
                        .ismFocusRing(
                            visible = interaction.focused && enabled,
                            shape = shape,
                            color = if (isError) c.error else c.focusRing,
                            width = 0.dp,
                            offset = 0.dp,
                        )
                        .background(fillColor, shape)
                        .border(1.dp, borderColor, shape)
                        .padding(horizontal = if (large) 18.dp else 16.dp, vertical = 13.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    if (leadingIcon != null) {
                        ISMIcon(leadingIcon, null, size = ISMSize.iconMd, tint = c.textSecondary)
                    }
                    Box(modifier = Modifier.weight(1f)) {
                        if (value.isEmpty() && placeholder != null) {
                            ISMText(
                                text = placeholder,
                                lang = lang,
                                style = textStyle,
                                color = c.textPlaceholder,
                            )
                        }
                        innerTextField()
                    }
                    if (loading) {
                        ISMSpinner(size = ISMSpinnerSize.Small)
                    }
                    if (trailing != null) trailing()
                }
            },
        )

        if (errorText != null) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(ISMSpacing.space1 + 2.dp),
                verticalAlignment = Alignment.Top,
                modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            ) {
                ISMIcon(ISMUIIcon.AlertCircle, null, size = ISMSize.iconSm, tint = c.error, modifier = Modifier.padding(top = 3.dp))
                ISMText(
                    text = errorText,
                    lang = lang,
                    style = ISMTheme.typography.subhead,
                    color = c.error,
                )
            }
        } else if (hint != null) {
            ISMText(text = hint, lang = lang, style = ISMTheme.typography.subhead, color = c.textSecondary)
        }
    }
}

@Preview(name = "Input", showBackground = true, widthDp = 360)
@Composable
private fun ISMTextFieldPreview() {
    ISMPreviewBoard {
        var text by remember { mutableStateOf("") }
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ISMTextField(
                value = text,
                onValueChange = { text = it },
                label = "Email",
                placeholder = "name@example.org",
                hint = "We only use it to send your receipt.",
            )
            ISMTextField(
                value = "not-an-email",
                onValueChange = {},
                label = "Email",
                errorText = "Enter an email address like name@example.org.",
            )
            ISMTextField(
                value = "Read only",
                onValueChange = {},
                label = "Partner code",
                readOnly = true,
                optional = true,
            )
            ISMTextField(value = "", onValueChange = {}, label = "Disabled", enabled = false, placeholder = "Not available")
        }
    }
}
