package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMOpacity

/**
 * Floating action button: 56dp round, Horizon Blue, white icon (default +). One per screen, and it
 * is that screen's one blue primary. The action is named by [contentDescription], not by visible
 * text. Place it 16dp from the end edge and 16dp above the tab bar; never over the tab bar or the
 * mini player. Move it up (for example `Modifier.padding(bottom = 64.dp)`) while a snackbar shows.
 */
@Composable
fun ISMFab(
    onClick: () -> Unit,
    contentDescription: String,
    modifier: Modifier = Modifier,
    icon: ISMUIIcon = ISMUIIcon.Plus,
    enabled: Boolean = true,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val container by animateColorAsState(
        targetValue = if (interaction.pressed || interaction.hovered) c.actionHover else c.action,
        animationSpec = ismAnimationSpec(),
        label = "ismFabContainer",
    )
    Box(
        modifier = modifier
            .alpha(if (enabled) 1f else ISMOpacity.opacityDisabled)
            .ismFocusRing(
                visible = interaction.focused,
                shape = CircleShape,
                color = if (c.isDark) ISMColors.blueOnDark else c.focusRing,
            )
            .shadow(
                elevation = 8.dp,
                shape = CircleShape,
                ambientColor = ISMColors.horizonBlue.copy(alpha = 0.6f),
                spotColor = ISMColors.horizonBlue.copy(alpha = 0.6f),
            )
            .size(56.dp)
            .clip(CircleShape)
            .background(container)
            .semantics { this.contentDescription = contentDescription }
            .clickable(
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            ),
        contentAlignment = Alignment.Center,
    ) {
        ISMIcon(icon, null, tint = Color.White)
    }
}

/**
 * Pull-to-refresh indicator visual: a 40dp white disc with a spinner and a short line saying what
 * is happening. This is only the visual; wire it to your own refresh gesture or to Material's
 * pull-to-refresh state.
 */
@Composable
fun ISMRefreshIndicator(
    modifier: Modifier = Modifier,
    text: String? = null,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    Column(
        modifier = modifier.semantics { liveRegion = LiveRegionMode.Polite },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Box(
            modifier = Modifier
                .shadow(elevation = 4.dp, shape = CircleShape)
                .size(40.dp)
                .clip(CircleShape)
                .background(c.surfaceRaised),
            contentAlignment = Alignment.Center,
        ) {
            ISMSpinner(size = ISMSpinnerSize.Medium)
        }
        if (text != null) {
            ISMText(text, lang = lang, style = ISMTheme.typography.footnote, color = c.textBody)
        }
    }
}

@Preview(name = "Fab", showBackground = true, widthDp = 360)
@Composable
private fun ISMFabPreview() {
    ISMPreviewBoard {
        Row(horizontalArrangement = Arrangement.spacedBy(24.dp), modifier = Modifier.padding(8.dp)) {
            ISMFab(onClick = {}, contentDescription = "Add note")
            ISMFab(onClick = {}, contentDescription = "Add", icon = ISMUIIcon.Edit)
            ISMRefreshIndicator(text = "Checking for new episodes")
        }
    }
}
