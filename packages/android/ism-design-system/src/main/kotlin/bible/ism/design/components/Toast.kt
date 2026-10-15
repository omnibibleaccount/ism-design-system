package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.SnackbarData
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.SnackbarResult
import androidx.compose.material3.SnackbarVisuals
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMShadow
import bible.ism.design.tokens.ISMSize
import kotlinx.coroutines.delay

/** Dot colour of a toast. Error toasts are announced assertively; others politely. */
enum class ISMToastTone { Success, Error, Info }

/** Visuals carrying the tone to [ISMSnackbarHost]. Create with [showISMToast]. */
class ISMSnackbarVisuals(
    override val message: String,
    override val actionLabel: String? = null,
    val tone: ISMToastTone = ISMToastTone.Info,
    override val withDismissAction: Boolean = false,
    override val duration: SnackbarDuration = SnackbarDuration.Indefinite,
) : SnackbarVisuals

/**
 * Shows an ISM toast. The host hides it after 5s (8s when there is an action); the duration is
 * handled by [ISMSnackbarHost], so leave [SnackbarDuration.Indefinite] here.
 */
suspend fun SnackbarHostState.showISMToast(
    message: String,
    actionLabel: String? = null,
    tone: ISMToastTone = ISMToastTone.Info,
    withDismissAction: Boolean = false,
): SnackbarResult = showSnackbar(
    ISMSnackbarVisuals(
        message = message,
        actionLabel = actionLabel,
        tone = tone,
        withDismissAction = withDismissAction,
    ),
)

/**
 * ISM-styled replacement for Material's SnackbarHost: charcoal surface, white 15sp text, 12dp
 * radius, one text action in blue-on-dark, optional 44dp dismiss X. Place it bottom-centre with
 * 16dp margins, above the tab bar and the FAB.
 */
@Composable
fun ISMSnackbarHost(
    hostState: SnackbarHostState,
    modifier: Modifier = Modifier,
    dismissDescription: String = "Dismiss",
) {
    SnackbarHost(hostState = hostState, modifier = modifier) { data ->
        val visuals = data.visuals
        val hasAction = visuals.actionLabel != null
        LaunchedEffect(data) {
            delay(if (hasAction) 8000L else 5000L)
            data.dismiss()
        }
        ISMToast(
            message = visuals.message,
            tone = (visuals as? ISMSnackbarVisuals)?.tone ?: ISMToastTone.Info,
            actionLabel = visuals.actionLabel,
            onAction = { data.performAction() },
            onDismiss = if (visuals.withDismissAction) {
                { data.dismiss() }
            } else {
                null
            },
            dismissDescription = dismissDescription,
        )
    }
}

/**
 * The toast surface itself, for use without a host (previews, custom placement).
 * Min height 52dp, max width 420dp. The action and the dismiss X are 44dp targets.
 */
@Composable
fun ISMToast(
    message: String,
    modifier: Modifier = Modifier,
    tone: ISMToastTone = ISMToastTone.Info,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null,
    onDismiss: (() -> Unit)? = null,
    dismissDescription: String = "Dismiss",
    toneLabel: String = when (tone) {
        ISMToastTone.Success -> "Success"
        ISMToastTone.Error -> "Error"
        ISMToastTone.Info -> "Information"
    },
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val dotColor = when (tone) {
        ISMToastTone.Success -> ISMColors.success
        ISMToastTone.Error -> ISMColors.error
        ISMToastTone.Info -> ISMColors.horizonBlue
    }
    val dotIcon = when (tone) {
        ISMToastTone.Success -> ISMUIIcon.Check
        ISMToastTone.Error -> ISMUIIcon.Close
        ISMToastTone.Info -> ISMUIIcon.Info
    }
    val shape = ISMShapes.md
    Row(
        modifier = modifier
            .fillMaxWidth()
            .widthIn(max = 420.dp)
            .shadow(
                elevation = ISMShadow.overlay.elevation,
                shape = shape,
                ambientColor = ISMShadow.overlay.color,
                spotColor = ISMShadow.overlay.color,
            )
            .background(c.inverseSurface, shape)
            .heightIn(min = 52.dp)
            .padding(start = 16.dp, top = 4.dp, bottom = 4.dp, end = 4.dp)
            .semantics(mergeDescendants = true) {
                liveRegion = if (tone == ISMToastTone.Error) LiveRegionMode.Assertive else LiveRegionMode.Polite
            },
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier.size(24.dp).clip(CircleShape).background(dotColor),
            contentAlignment = Alignment.Center,
        ) {
            ISMIcon(dotIcon, toneLabel, size = 14.dp, tint = Color.White)
        }
        ISMText(
            text = message,
            lang = lang,
            style = ISMTheme.typography.callout,
            color = c.onInverseSurface,
            modifier = Modifier.weight(1f).padding(vertical = 8.dp),
        )
        if (actionLabel != null && onAction != null) {
            Box(
                modifier = Modifier
                    .sizeIn(minHeight = 44.dp, minWidth = 44.dp)
                    .clip(ISMShapes.pill)
                    .clickable(role = Role.Button, onClick = onAction)
                    .padding(horizontal = 12.dp),
                contentAlignment = Alignment.Center,
            ) {
                ISMText(
                    text = actionLabel,
                    lang = lang,
                    style = ISMTheme.typography.callout.copy(fontWeight = FontWeight.SemiBold),
                    color = c.inverseLink,
                )
            }
        }
        if (onDismiss != null) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .clickable(role = Role.Button, onClick = onDismiss)
                    .semantics { contentDescription = dismissDescription },
                contentAlignment = Alignment.Center,
            ) {
                ISMIcon(ISMUIIcon.Close, null, size = ISMSize.iconMd, tint = c.onInverseSurface.copy(alpha = 0.7f))
            }
        }
    }
}

@Preview(name = "Toast", showBackground = true, widthDp = 360)
@Composable
private fun ISMToastPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            ISMToast("Link copied", tone = ISMToastTone.Success, onDismiss = {})
            ISMToast("Could not save. Try again.", tone = ISMToastTone.Error, actionLabel = "Retry", onAction = {})
            ISMToast("Download started", tone = ISMToastTone.Info, actionLabel = "Undo", onAction = {})
        }
    }
}
