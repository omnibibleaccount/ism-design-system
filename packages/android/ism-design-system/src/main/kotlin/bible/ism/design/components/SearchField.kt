package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.forLanguage
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMSize

/**
 * 48dp search field: magnifier at the start, a round clear button once there is text.
 * [label] is the accessible name (also shown above when [showLabel] is true). The clear button is
 * 24dp visually inside a 44dp touch area. Enter or the keyboard's search key calls [onSearch].
 */
@Composable
fun ISMSearchField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String = "Search",
    placeholder: String = "Search",
    clearDescription: String = "Clear search",
    showLabel: Boolean = false,
    enabled: Boolean = true,
    loading: Boolean = false,
    onSearch: (() -> Unit)? = null,
    lang: String = "en",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val shape = ISMShapes.md
    val focused = interaction.focused
    val fill = if (focused) c.surfaceRaised else c.surfaceMuted
    val borderColor = if (focused) c.focusRing else Color.Transparent
    val textStyle = ISMTheme.typography.body.copy(color = c.textPrimary).forLanguage(lang)

    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        if (showLabel) {
            ISMText(
                text = label,
                lang = lang,
                style = ISMTheme.typography.label,
                color = c.textPrimary.copy(alpha = 0.72f),
            )
        }
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier
                .fillMaxWidth()
                .semantics { contentDescription = label },
            enabled = enabled,
            textStyle = textStyle,
            singleLine = true,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            keyboardActions = KeyboardActions(onSearch = { onSearch?.invoke() }),
            interactionSource = interactionSource,
            cursorBrush = SolidColor(c.link),
            decorationBox = { innerTextField ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(min = ISMSize.field)
                        .ismFocusRing(
                            visible = focused,
                            shape = shape,
                            color = c.focusRing,
                            width = 0.dp,
                            offset = 0.dp,
                        )
                        .clip(shape)
                        .background(fill)
                        .border(1.dp, borderColor, shape)
                        .padding(start = 14.dp, end = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    ISMIcon(
                        ISMUIIcon.Search,
                        null,
                        size = ISMSize.iconMd,
                        tint = if (focused) c.textPrimary else c.textSecondary,
                    )
                    Box(modifier = Modifier.weight(1f)) {
                        if (value.isEmpty()) {
                            ISMText(
                                text = placeholder,
                                lang = lang,
                                style = textStyle,
                                color = c.textPlaceholder,
                                maxLines = 1,
                            )
                        }
                        innerTextField()
                    }
                    if (loading) {
                        ISMSpinner(size = ISMSpinnerSize.Small)
                    }
                    if (value.isNotEmpty() && enabled) {
                        Box(
                            modifier = Modifier
                                .sizeIn(minWidth = 44.dp, minHeight = 44.dp)
                                .clickable(
                                    role = Role.Button,
                                    onClickLabel = clearDescription,
                                    onClick = { onValueChange("") },
                                )
                                .semantics { contentDescription = clearDescription },
                            contentAlignment = Alignment.Center,
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(CircleShape)
                                    .background(ISMColors.gray300),
                                contentAlignment = Alignment.Center,
                            ) {
                                ISMIcon(ISMUIIcon.Close, null, size = ISMSize.iconSm, tint = Color.White)
                            }
                        }
                    }
                }
            },
        )
    }
}

@Preview(name = "SearchField", showBackground = true, widthDp = 360)
@Composable
private fun ISMSearchFieldPreview() {
    ISMPreviewBoard {
        var query by remember { mutableStateOf("Psalm 23") }
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            ISMSearchField(value = "", onValueChange = {}, placeholder = "Search the Bible")
            ISMSearchField(value = query, onValueChange = { query = it })
        }
    }
}
