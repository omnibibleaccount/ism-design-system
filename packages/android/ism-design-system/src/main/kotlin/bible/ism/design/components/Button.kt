package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
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
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.max
import androidx.compose.ui.unit.sp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMSemanticColors
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMLayout
import bible.ism.design.tokens.ISMOpacity
import bible.ism.design.tokens.ISMSize
import bible.ism.design.tokens.ISMSpacing

/**
 * Colour treatment. Primary is the ONE main action in a group; never two blue buttons together.
 * Light and OutlineLight are for dark surfaces; Secondary and Ghost adapt to the theme.
 */
enum class ISMButtonVariant { Primary, Secondary, Ghost, Light, OutlineLight }

/** Small is 36dp (dense toolbars; its touch area is still 44dp). Medium 44dp. Large 52dp. */
enum class ISMButtonSize(val height: Dp, val horizontalPadding: Dp, val fontSize: TextUnit, val iconSize: Dp) {
    Small(ISMSize.controlSm, 20.dp, 14.sp, ISMSize.iconSm),
    Medium(ISMSize.controlMd, 26.dp, 16.sp, ISMSize.iconMd),
    Large(ISMSize.controlLg, 32.dp, 17.sp, ISMSize.iconMd),
}

private class ButtonPalette(val container: Color, val content: Color, val border: Color?)

private fun buttonPalette(
    variant: ISMButtonVariant,
    c: ISMSemanticColors,
    pressed: Boolean,
    hovered: Boolean,
): ButtonPalette = when (variant) {
    ISMButtonVariant.Primary -> ButtonPalette(
        container = if (pressed) c.actionPressed else if (hovered) c.actionHover else c.action,
        content = c.onAction,
        border = null,
    )
    ISMButtonVariant.Secondary -> ButtonPalette(
        container = if (pressed) c.textPrimary.copy(alpha = 0.12f)
        else if (hovered) c.textPrimary.copy(alpha = 0.06f)
        else Color.Transparent,
        content = c.textPrimary,
        border = c.textPrimary.copy(alpha = 0.4f),
    )
    ISMButtonVariant.Ghost -> ButtonPalette(
        container = Color.Transparent,
        content = if (pressed) c.linkPressed else if (hovered) c.linkHover else c.link,
        border = null,
    )
    ISMButtonVariant.Light -> ButtonPalette(
        container = if (pressed || hovered) ISMColors.gray200 else ISMColors.white,
        content = ISMColors.black,
        border = null,
    )
    ISMButtonVariant.OutlineLight -> ButtonPalette(
        container = if (pressed) Color.White.copy(alpha = 0.18f)
        else if (hovered) Color.White.copy(alpha = 0.10f)
        else Color.Transparent,
        content = Color.White,
        border = Color.White.copy(alpha = 0.55f),
    )
}

/**
 * ISM call-to-action button (pill).
 *
 * - Minimum touch target 44dp, also for [ISMButtonSize.Small].
 * - Pressed, hovered and focused visuals come from [interactionSource]; focus shows the 2dp ring.
 * - [loading] shows a spinner before the label, keeps the label, blocks clicks and announces
 *   [loadingDescription]. If the button has no [leadingIcon] its width grows by the spinner slot;
 *   give it a `Modifier.widthIn(min = ...)` to keep the width exactly stable.
 * - [enabled] = false dims to 45% and blocks input.
 */
@Composable
fun ISMButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ISMButtonVariant = ISMButtonVariant.Primary,
    size: ISMButtonSize = ISMButtonSize.Medium,
    enabled: Boolean = true,
    loading: Boolean = false,
    leadingIcon: ISMUIIcon? = null,
    trailingIcon: ISMUIIcon? = null,
    block: Boolean = false,
    lang: String = "en",
    loadingDescription: String = "Loading",
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val colors = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val palette = buttonPalette(
        variant = variant,
        c = colors,
        pressed = interaction.pressed && !loading,
        hovered = interaction.hovered && !loading,
    )
    val container by animateColorAsState(
        targetValue = palette.container,
        animationSpec = ismAnimationSpec(),
        label = "ismButtonContainer",
    )
    val onDarkVariant = variant == ISMButtonVariant.Light || variant == ISMButtonVariant.OutlineLight
    val ringColor = if (onDarkVariant) ISMColors.blueOnDark else colors.focusRing
    val horizontalPadding = if (variant == ISMButtonVariant.Ghost) 4.dp else size.horizontalPadding
    val widthModifier = if (block) Modifier.fillMaxWidth() else Modifier
    val shape = ISMShapes.pill

    Box(
        modifier = modifier
            .then(widthModifier)
            .alpha(if (enabled) 1f else ISMOpacity.opacityDisabled)
            .sizeIn(minHeight = max(size.height, ISMLayout.tapTarget))
            .semantics(mergeDescendants = true) {
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
        Row(
            modifier = widthModifier
                .heightIn(min = size.height)
                .ismFocusRing(visible = interaction.focused, shape = shape, color = ringColor)
                .clip(shape)
                .background(container)
                .then(
                    if (palette.border != null) Modifier.border(BorderStroke(1.dp, palette.border), shape)
                    else Modifier,
                )
                .padding(horizontal = horizontalPadding, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(ISMSpacing.space2, Alignment.CenterHorizontally),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            if (loading) {
                ISMSpinnerArc(
                    diameter = ISMSize.iconSm,
                    stroke = 2.dp,
                    headColor = palette.content,
                    trackColor = palette.content.copy(alpha = 0.25f),
                )
            } else if (leadingIcon != null) {
                ISMIcon(leadingIcon, null, size = size.iconSize, tint = palette.content)
            }
            ISMText(
                text = text,
                lang = lang,
                style = ISMTheme.typography.button.copy(fontSize = size.fontSize),
                color = palette.content,
                textAlign = TextAlign.Center,
                modifier = Modifier.weight(1f, fill = false),
            )
            if (trailingIcon != null) {
                ISMIcon(trailingIcon, null, size = size.iconSize, tint = palette.content)
            }
        }
    }
}

@Preview(name = "Button", showBackground = true, widthDp = 360)
@Composable
private fun ISMButtonPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            ISMButton("Give online", onClick = {}, trailingIcon = ISMUIIcon.ArrowUpRight)
            ISMButton("Learn about ISM", onClick = {}, variant = ISMButtonVariant.Secondary)
            ISMButton("Browse all", onClick = {}, variant = ISMButtonVariant.Ghost)
            ISMButton("Sending", onClick = {}, loading = true, leadingIcon = ISMUIIcon.Mail)
            ISMButton("Disabled", onClick = {}, enabled = false)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ISMButton("Small", onClick = {}, size = ISMButtonSize.Small)
                ISMButton("Large", onClick = {}, size = ISMButtonSize.Large)
            }
            Box(Modifier.background(ISMColors.black).padding(12.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    ISMButton("Light", onClick = {}, variant = ISMButtonVariant.Light)
                    ISMButton("Outline", onClick = {}, variant = ISMButtonVariant.OutlineLight)
                }
            }
        }
    }
}
