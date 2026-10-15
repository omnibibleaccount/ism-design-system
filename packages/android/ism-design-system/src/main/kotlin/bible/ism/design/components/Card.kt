package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMShadow

/**
 * Content container: 20dp radius, hairline border, soft shadow on light (none on dark).
 * Pass [onClick] to make the whole card one button (do not put a second button inside it);
 * pressed raises it to the lift shadow. [contentPadding] is 24dp, or 32dp for large cards.
 */
@Composable
fun ISMCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    onClickLabel: String? = null,
    contentPadding: Dp = 24.dp,
    shape: Shape = ISMShapes.lg,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
    content: @Composable ColumnScope.() -> Unit,
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val lifted = onClick != null && (interaction.pressed || interaction.hovered)
    val spec = if (lifted) ISMShadow.lift else ISMShadow.cardLight
    val borderColor = if (c.isDark) ISMColors.borderHairlineDark else ISMColors.borderHairlineLight
    val liftedBorder = if (lifted && !c.isDark) ISMColors.black.copy(alpha = 0.2f) else borderColor

    val shadowModifier = if (c.isDark) {
        Modifier
    } else {
        Modifier.shadow(
            elevation = spec.elevation,
            shape = shape,
            ambientColor = spec.color,
            spotColor = spec.color,
        )
    }
    val clickModifier = if (onClick != null) {
        Modifier.clickable(
            interactionSource = interactionSource,
            indication = null,
            onClickLabel = onClickLabel,
            role = Role.Button,
            onClick = onClick,
        )
    } else {
        Modifier
    }

    Column(
        modifier = modifier
            .ismFocusRing(visible = interaction.focused, shape = shape, color = c.focusRing)
            .then(shadowModifier)
            .background(c.surface, shape)
            .border(1.dp, liftedBorder, shape)
            .then(clickModifier)
            .padding(contentPadding),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        content = content,
    )
}

@Preview(name = "Card", showBackground = true, widthDp = 360)
@Composable
private fun ISMCardPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ISMCard(Modifier.fillMaxWidth()) {
                ISMText("Bible translation", style = ISMTheme.typography.title)
                ISMText("Scripture in the languages people speak.", color = ISMTheme.colors.textBody)
            }
            ISMCard(Modifier.fillMaxWidth(), onClick = {}) {
                ISMText("Tappable card", style = ISMTheme.typography.headline)
            }
        }
    }
}
