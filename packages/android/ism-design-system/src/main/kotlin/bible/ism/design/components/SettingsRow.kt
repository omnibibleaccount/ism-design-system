package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMScriptTypography
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMOpacity
import bible.ism.design.tokens.ISMSize

/**
 * Inset settings card (16dp margin, 12dp radius, white with a gray-200 hairline) holding
 * [ISMSettingsRow], [ISMSettingsToggleRow] and [ISMSettingsRadioRow]. Rows other than the first
 * set `dividerAbove = true` so dividers start 16dp in. [header] is a 12sp/600 overline (uppercased
 * only for Latin scripts); [footer] is 13sp helper text under the card.
 */
@Composable
fun ISMSettingsGroup(
    modifier: Modifier = Modifier,
    header: String? = null,
    footer: String? = null,
    lang: String = "en",
    content: @Composable ColumnScope.() -> Unit,
) {
    val c = ISMTheme.colors
    val shape = ISMShapes.md
    Column(modifier = modifier.fillMaxWidth()) {
        if (header != null) {
            ISMText(
                text = if (ISMScriptTypography.isLatin(lang)) header.uppercase() else header,
                lang = lang,
                style = ISMTheme.typography.overline,
                color = c.textSecondary,
                modifier = Modifier.padding(start = 32.dp, end = 32.dp, top = 16.dp, bottom = 8.dp),
            )
        }
        Column(
            modifier = Modifier
                .padding(horizontal = 16.dp)
                .fillMaxWidth()
                .clip(shape)
                .background(c.surface)
                .border(1.dp, c.border, shape),
            content = content,
        )
        if (footer != null) {
            ISMText(
                text = footer,
                lang = lang,
                style = ISMTheme.typography.footnote,
                color = c.textSecondary,
                modifier = Modifier.padding(start = 32.dp, end = 32.dp, top = 8.dp),
            )
        }
    }
}

/** Shared row chrome: leading tile, title and optional subtitle, trailing slot, divider. */
@Composable
private fun ISMSettingsRowScaffold(
    title: String,
    subtitle: String?,
    icon: ISMUIIcon?,
    danger: Boolean,
    enabled: Boolean,
    dividerAbove: Boolean,
    lang: String,
    pressed: Boolean,
    focused: Boolean,
    interactionModifier: Modifier,
    trailing: @Composable () -> Unit,
    modifier: Modifier,
) {
    val c = ISMTheme.colors
    val container by animateColorAsState(
        targetValue = if (pressed && enabled) c.hoverFill else Color.Transparent,
        animationSpec = ismAnimationSpec(),
        label = "ismSettingsRowContainer",
    )
    val titleColor = when {
        danger -> c.error
        enabled -> c.textPrimary
        else -> c.textSecondary
    }
    Column(modifier = modifier.fillMaxWidth()) {
        if (dividerAbove) ISMDivider(Modifier.padding(start = 16.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = if (subtitle != null) 64.dp else ISMSize.rowApp)
                .ismFocusRing(visible = focused, shape = ISMShapes.md, color = c.focusRing, inset = true)
                .background(container)
                .then(interactionModifier)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (icon != null) {
                Box(modifier = Modifier.alpha(if (enabled) 1f else 0.55f)) {
                    ISMIconTile(icon, size = 30.dp, iconSize = 18.dp)
                }
            }
            Column(modifier = Modifier.weight(1f)) {
                ISMText(
                    text = title,
                    lang = lang,
                    style = ISMTheme.typography.body.copy(
                        fontWeight = if (danger) FontWeight.SemiBold else FontWeight.Normal,
                    ),
                    color = titleColor,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                if (subtitle != null) {
                    ISMText(
                        text = subtitle,
                        lang = lang,
                        style = ISMTheme.typography.footnote,
                        color = c.textSecondary,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
            trailing()
        }
    }
}

/**
 * Navigation or action row. [value] is short gray text before the chevron; a chevron (drills into
 * another app screen) shows when [onClick] is set. Never put a chevron on a toggle or radio row.
 * [danger] is for destructive rows (Sign out, Delete): error colour, weight 600.
 */
@Composable
fun ISMSettingsRow(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    icon: ISMUIIcon? = null,
    value: String? = null,
    onClick: (() -> Unit)? = null,
    showChevron: Boolean = onClick != null,
    danger: Boolean = false,
    enabled: Boolean = true,
    dividerAbove: Boolean = false,
    lang: String = "en",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val clickModifier = if (onClick != null) {
        Modifier.clickable(
            interactionSource = interactionSource,
            indication = null,
            enabled = enabled,
            role = Role.Button,
            onClick = onClick,
        )
    } else {
        Modifier
    }
    ISMSettingsRowScaffold(
        title = title,
        subtitle = subtitle,
        icon = icon,
        danger = danger,
        enabled = enabled,
        dividerAbove = dividerAbove,
        lang = lang,
        pressed = interaction.pressed,
        focused = interaction.focused,
        interactionModifier = clickModifier,
        modifier = modifier,
        trailing = {
            if (value != null) {
                ISMText(value, lang = lang, style = ISMTheme.typography.callout, color = c.textSecondary, maxLines = 1)
            }
            if (showChevron) {
                ISMIcon(ISMUIIcon.ChevronRight, null, size = ISMSize.iconMd, tint = c.textSecondary)
            }
        },
    )
}

/**
 * Row with a switch. The WHOLE row toggles (role Switch, 52dp tall); the switch itself is purely
 * visual. Label says what is on ("Verse of the day"), not the action.
 */
@Composable
fun ISMSettingsToggleRow(
    title: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    icon: ISMUIIcon? = null,
    enabled: Boolean = true,
    dividerAbove: Boolean = false,
    lang: String = "en",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val interaction = interactionSource.collectISMInteractionState()
    ISMSettingsRowScaffold(
        title = title,
        subtitle = subtitle,
        icon = icon,
        danger = false,
        enabled = enabled,
        dividerAbove = dividerAbove,
        lang = lang,
        pressed = interaction.pressed,
        focused = interaction.focused,
        interactionModifier = Modifier.toggleable(
            value = checked,
            interactionSource = interactionSource,
            indication = null,
            enabled = enabled,
            role = Role.Switch,
            onValueChange = onCheckedChange,
        ),
        modifier = modifier,
        trailing = {
            ISMSwitch(
                checked = checked,
                onCheckedChange = null,
                enabled = enabled,
            )
        },
    )
}

/** Radio row for a single choice among a few. Pass the same `onClick` handler per option. */
@Composable
fun ISMSettingsRadioRow(
    title: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    enabled: Boolean = true,
    dividerAbove: Boolean = false,
    lang: String = "en",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    ISMSettingsRowScaffold(
        title = title,
        subtitle = subtitle,
        icon = null,
        danger = false,
        enabled = enabled,
        dividerAbove = dividerAbove,
        lang = lang,
        pressed = interaction.pressed,
        focused = interaction.focused,
        interactionModifier = Modifier.selectable(
            selected = selected,
            interactionSource = interactionSource,
            indication = null,
            enabled = enabled,
            role = Role.RadioButton,
            onClick = onClick,
        ),
        modifier = modifier,
        trailing = {
            val ringColor = if (selected) c.action else ISMColors.gray300
            Box(
                modifier = Modifier
                    .size(22.dp)
                    .alpha(if (enabled) 1f else ISMOpacity.opacityDisabled)
                    .border(2.dp, ringColor, CircleShape)
                    .padding(4.dp)
                    .background(if (selected) c.action else Color.Transparent, CircleShape),
            )
        },
    )
}

@Preview(name = "SettingsRow", showBackground = true, widthDp = 360)
@Composable
private fun ISMSettingsRowPreview() {
    ISMPreviewBoard {
        var verse by remember { mutableStateOf(true) }
        var theme by remember { mutableStateOf(0) }
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ISMSettingsGroup(header = "Reading", footer = "Applies to the Bible reader.") {
                ISMSettingsToggleRow("Verse of the day", verse, { verse = it }, icon = ISMUIIcon.BookOpen)
                ISMSettingsRow(
                    title = "Text size",
                    icon = ISMUIIcon.TextSize,
                    value = "Medium",
                    onClick = {},
                    dividerAbove = true,
                )
                ISMSettingsRow(
                    title = "Language",
                    subtitle = "Bible and app language",
                    icon = ISMUIIcon.Language,
                    onClick = {},
                    dividerAbove = true,
                )
            }
            ISMSettingsGroup(header = "Appearance") {
                ISMSettingsRadioRow("System", theme == 0, { theme = 0 })
                ISMSettingsRadioRow("Light", theme == 1, { theme = 1 }, dividerAbove = true)
                ISMSettingsRadioRow("Dark", theme == 2, { theme = 2 }, dividerAbove = true)
            }
            ISMSettingsGroup {
                ISMSettingsRow(title = "Sign out", danger = true, onClick = {})
            }
        }
    }
}
