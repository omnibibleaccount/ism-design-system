package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.max
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMLayout
import bible.ism.design.tokens.ISMOpacity
import bible.ism.design.tokens.ISMSize

/**
 * Ghost: app bars (no ring). Outline: ringed, on light or dark per theme. OutlineOnDark: white ring
 * over a dark photo or section. Solid: the one blue icon button of a group. Tonal: gray fill.
 * Glass: translucent black over imagery (always add a scrim behind it).
 */
enum class ISMIconButtonVariant { Ghost, Outline, OutlineOnDark, Solid, Tonal, Glass }

/** Small is 36dp visible with a 44dp touch area; Medium 44dp; Large 52dp. */
enum class ISMIconButtonSize(val visible: Dp) {
    Small(ISMSize.controlSm),
    Medium(ISMSize.controlMd),
    Large(ISMSize.controlLg),
}

private class IconButtonPalette(val container: Color, val content: Color, val border: Color?)

/**
 * Round icon-only button. [contentDescription] is required: it is the accessible name
 * ("Share", "Close"). [loading] replaces the icon with a spinner and blocks clicks.
 */
@Composable
fun ISMIconButton(
    icon: ISMUIIcon,
    contentDescription: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ISMIconButtonVariant = ISMIconButtonVariant.Ghost,
    size: ISMIconButtonSize = ISMIconButtonSize.Medium,
    enabled: Boolean = true,
    loading: Boolean = false,
    loadingDescription: String = "Loading",
    tint: Color = Color.Unspecified,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val pressed = interaction.pressed && !loading
    val hovered = interaction.hovered && !loading

    val palette: IconButtonPalette = when (variant) {
        ISMIconButtonVariant.Ghost -> IconButtonPalette(
            container = if (pressed) c.pressedFill else if (hovered) c.hoverFill else Color.Transparent,
            content = c.textPrimary,
            border = null,
        )
        ISMIconButtonVariant.Outline -> IconButtonPalette(
            container = if (pressed) c.pressedFill else if (hovered) c.hoverFill else c.surface,
            content = c.textPrimary,
            border = c.fieldBorder,
        )
        ISMIconButtonVariant.OutlineOnDark -> IconButtonPalette(
            container = if (pressed) Color.White.copy(alpha = 0.18f)
            else if (hovered) Color.White.copy(alpha = 0.10f)
            else Color.Transparent,
            content = Color.White,
            border = Color.White.copy(alpha = 0.3f),
        )
        ISMIconButtonVariant.Solid -> IconButtonPalette(
            container = if (pressed) c.actionPressed else if (hovered) c.actionHover else c.action,
            content = c.onAction,
            border = null,
        )
        ISMIconButtonVariant.Tonal -> IconButtonPalette(
            container = if (pressed) c.pressedFill else if (hovered) c.border else c.surfaceMuted,
            content = c.textPrimary,
            border = null,
        )
        ISMIconButtonVariant.Glass -> IconButtonPalette(
            container = if (pressed) Color(0x80000000) else Color(0x59000000),
            content = Color.White,
            border = null,
        )
    }
    val container = palette.container
    val content = palette.content
    val borderColor = palette.border
    val animatedContainer by animateColorAsState(
        targetValue = container,
        animationSpec = ismAnimationSpec(),
        label = "ismIconButtonContainer",
    )
    val iconColor = tint.let { if (it == Color.Unspecified) content else it }
    val ringColor = if (variant == ISMIconButtonVariant.OutlineOnDark || variant == ISMIconButtonVariant.Glass) {
        ISMColors.blueOnDark
    } else {
        c.focusRing
    }
    val shape = ISMShapes.pill

    Box(
        modifier = modifier
            .alpha(if (enabled) 1f else ISMOpacity.opacityDisabled)
            .sizeIn(
                minWidth = max(size.visible, ISMLayout.tapTarget),
                minHeight = max(size.visible, ISMLayout.tapTarget),
            )
            .semantics(mergeDescendants = true) {
                this.contentDescription = contentDescription
                if (loading) stateDescription = loadingDescription
            }
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = { if (!loading) onClick() },
            ),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(size.visible)
                .ismFocusRing(visible = interaction.focused, shape = shape, color = ringColor)
                .clip(shape)
                .background(animatedContainer)
                .then(
                    if (borderColor != null) Modifier.border(1.dp, borderColor, shape) else Modifier,
                ),
            contentAlignment = Alignment.Center,
        ) {
            if (loading) {
                ISMSpinnerArc(
                    diameter = ISMSize.iconMd,
                    stroke = 2.dp,
                    headColor = iconColor,
                    trackColor = iconColor.copy(alpha = 0.25f),
                )
            } else {
                ISMIcon(icon, null, size = ISMSize.iconLg, tint = iconColor)
            }
        }
    }
}

@Preview(name = "IconButton", showBackground = true, widthDp = 360)
@Composable
private fun ISMIconButtonPreview() {
    ISMPreviewBoard {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            ISMIconButton(ISMUIIcon.Share, "Share", onClick = {})
            ISMIconButton(ISMUIIcon.Search, "Search", onClick = {}, variant = ISMIconButtonVariant.Outline)
            ISMIconButton(ISMUIIcon.Plus, "Add", onClick = {}, variant = ISMIconButtonVariant.Solid)
            ISMIconButton(ISMUIIcon.Heart, "Save", onClick = {}, variant = ISMIconButtonVariant.Tonal, size = ISMIconButtonSize.Small)
            ISMIconButton(ISMUIIcon.Download, "Download", onClick = {}, loading = true)
            ISMIconButton(ISMUIIcon.Trash, "Delete", onClick = {}, enabled = false)
        }
    }
}
