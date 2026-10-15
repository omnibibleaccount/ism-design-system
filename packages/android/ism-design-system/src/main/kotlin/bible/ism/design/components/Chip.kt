package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMLayout
import bible.ism.design.tokens.ISMOpacity

/**
 * Pill toggle for filtering a list or choosing a preset value. Selected chips are black (white in
 * dark theme), never Horizon Blue. Text only: no icons, flags or emoji. A single-choice filter
 * should start with "All" selected.
 *
 * [dense] draws a 36dp chip (app filter rows) inside a 44dp touch area.
 */
@Composable
fun ISMChip(
    text: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    dense: Boolean = false,
    lang: String = "en",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val targetContainer = when {
        selected -> c.chipSelectedBg
        interaction.pressed -> c.pressedFill
        interaction.hovered -> c.hoverFill
        else -> c.surface
    }
    val container by animateColorAsState(
        targetValue = targetContainer,
        animationSpec = ismAnimationSpec(),
        label = "ismChipContainer",
    )
    val borderColor = when {
        selected -> c.chipSelectedBg
        interaction.hovered -> c.textPrimary
        else -> c.fieldBorder
    }
    val contentColor = if (selected) c.onChipSelected else c.textPrimary
    val visibleHeight = if (dense) 36.dp else ISMLayout.tapTarget
    val shape = ISMShapes.pill

    Box(
        modifier = modifier
            .alpha(if (enabled) 1f else ISMOpacity.opacityDisabled)
            .sizeIn(minHeight = ISMLayout.tapTarget)
            .selectable(
                selected = selected,
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            ),
        contentAlignment = Alignment.Center,
    ) {
        Row(
            modifier = Modifier
                .heightIn(min = visibleHeight)
                .ismFocusRing(visible = interaction.focused, shape = shape, color = c.focusRing)
                .clip(shape)
                .background(container)
                .border(1.dp, borderColor, shape)
                .padding(horizontal = if (dense) 14.dp else 18.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            ISMText(
                text = text,
                lang = lang,
                style = ISMTheme.typography.callout.copy(
                    fontSize = if (dense) 14.sp else 15.sp,
                    fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold,
                ),
                color = contentColor,
                textAlign = TextAlign.Center,
            )
        }
    }
}

@Preview(name = "Chip", showBackground = true, widthDp = 360)
@Composable
private fun ISMChipPreview() {
    ISMPreviewBoard {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ISMChip("All", selected = true, onClick = {})
            ISMChip("Bibles", selected = false, onClick = {})
            ISMChip("Audio", selected = false, onClick = {}, dense = true)
            ISMChip("Off", selected = false, onClick = {}, enabled = false)
        }
    }
}
