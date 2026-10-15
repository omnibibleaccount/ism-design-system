package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMLayout
import bible.ism.design.tokens.ISMOpacity

/**
 * Toggle for a setting that takes effect at once (never pair with a Save button). On is always
 * Horizon Blue. 51 x 31dp track with a 44dp-tall touch area.
 *
 * Standalone: pass [onCheckedChange] and a [contentDescription] naming what the switch controls.
 * Inside a row that already toggles from anywhere (see ISMSettingsToggleRow): pass
 * `onCheckedChange = null`; the switch is then purely visual and hidden from semantics.
 */
@Composable
fun ISMSwitch(
    checked: Boolean,
    onCheckedChange: ((Boolean) -> Unit)?,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    contentDescription: String? = null,
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
) {
    val c = ISMTheme.colors
    val interaction = interactionSource.collectISMInteractionState()
    val track by animateColorAsState(
        targetValue = if (checked) c.action else ISMColors.gray300,
        animationSpec = ismAnimationSpec(),
        label = "ismSwitchTrack",
    )
    val knobStart by animateDpAsState(
        targetValue = if (checked) 22.dp else 2.dp,
        animationSpec = ismAnimationSpec(),
        label = "ismSwitchKnob",
    )
    val interactiveModifier = if (onCheckedChange != null) {
        Modifier
            .toggleable(
                value = checked,
                interactionSource = interactionSource,
                indication = null,
                enabled = enabled,
                role = Role.Switch,
                onValueChange = onCheckedChange,
            )
            .then(
                if (contentDescription != null) Modifier.semantics { this.contentDescription = contentDescription }
                else Modifier,
            )
    } else {
        Modifier
    }

    Box(
        modifier = modifier
            .alpha(if (enabled) 1f else ISMOpacity.opacityDisabled)
            .sizeIn(minWidth = ISMLayout.tapTarget, minHeight = ISMLayout.tapTarget)
            .then(interactiveModifier),
        contentAlignment = Alignment.Center,
    ) {
        Box(
            modifier = Modifier
                .size(width = 51.dp, height = 31.dp)
                .ismFocusRing(visible = interaction.focused, shape = ISMShapes.pill, color = c.focusRing)
                .clip(ISMShapes.pill)
                .background(track),
        ) {
            Box(
                modifier = Modifier
                    .align(Alignment.CenterStart)
                    .padding(start = knobStart)
                    .size(27.dp)
                    .shadow(elevation = 2.dp, shape = CircleShape)
                    .background(Color.White, CircleShape),
            )
        }
    }
}

@Preview(name = "Switch", showBackground = true, widthDp = 360)
@Composable
private fun ISMSwitchPreview() {
    ISMPreviewBoard {
        var on by remember { mutableStateOf(true) }
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            ISMSwitch(checked = on, onCheckedChange = { on = it }, contentDescription = "Verse of the day")
            ISMSwitch(checked = false, onCheckedChange = {}, contentDescription = "Off")
            ISMSwitch(checked = true, onCheckedChange = {}, enabled = false, contentDescription = "Disabled")
        }
    }
}
