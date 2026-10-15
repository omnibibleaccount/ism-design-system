package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMSize

/**
 * List row, at least 56dp tall with 20dp side padding. The whole row is the tap target.
 * Slots: [leading] (icon tile or avatar), title, [subtitle] (max 2 lines), [trailing] (value,
 * badge) and an optional drill-in chevron. A row with [onClick] is one button: do not nest
 * another control in it. Put [showDividerAbove] on every row but the first of a group.
 */
@Composable
fun ISMListRow(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)? = null,
    enabled: Boolean = true,
    showChevron: Boolean = onClick != null,
    showDividerAbove: Boolean = false,
    lang: String = "en",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val target = if (onClick != null && enabled && (interaction.pressed || interaction.hovered)) {
        c.hoverFill
    } else {
        Color.Transparent
    }
    val container by animateColorAsState(
        targetValue = target,
        animationSpec = ismAnimationSpec(),
        label = "ismListRowContainer",
    )
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
    Column(modifier = modifier.fillMaxWidth()) {
        if (showDividerAbove) ISMDivider(Modifier.padding(start = 20.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 56.dp)
                .ismFocusRing(
                    visible = interaction.focused,
                    shape = ISMShapes.sm,
                    color = c.focusRing,
                    inset = true,
                )
                .background(container)
                .then(clickModifier)
                .padding(horizontal = 20.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (leading != null) leading()
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                ISMText(
                    text = title,
                    lang = lang,
                    style = ISMTheme.typography.bodyMedium,
                    color = if (enabled) c.textPrimary else c.textSecondary,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
                if (subtitle != null) {
                    ISMText(
                        text = subtitle,
                        lang = lang,
                        style = ISMTheme.typography.subhead,
                        color = c.textSecondary,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
            if (trailing != null) trailing()
            if (showChevron) {
                ISMIcon(ISMUIIcon.ChevronRight, null, size = ISMSize.iconMd, tint = c.textSecondary)
            }
        }
    }
}

@Preview(name = "ListRow", showBackground = true, widthDp = 360)
@Composable
private fun ISMListRowPreview() {
    ISMPreviewBoard {
        Column(Modifier.background(ISMTheme.colors.surface)) {
            ISMListRow(title = "Simple row")
            ISMListRow(
                title = "Psalm 23",
                subtitle = "Read yesterday",
                leading = { ISMIconTile(ISMUIIcon.BookOpen, size = 40.dp, shape = ISMShapes.md) },
                onClick = {},
                showDividerAbove = true,
            )
            ISMListRow(
                title = "Language",
                trailing = { ISMText("English", color = ISMTheme.colors.textSecondary) },
                onClick = {},
                showDividerAbove = true,
            )
            ISMListRow(title = "Disabled", onClick = {}, enabled = false, showDividerAbove = true)
        }
    }
}
