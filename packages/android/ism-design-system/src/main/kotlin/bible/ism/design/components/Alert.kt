package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.wrapContentHeight
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.tokens.ISMSize

enum class ISMAlertTone(val defaultLabel: String) {
    Info("Information"),
    Success("Success"),
    Warning("Warning"),
    Error("Error"),
}

/**
 * Inline status banner placed directly above the content it describes. The icon plus the tone word
 * (read by screen readers) mean colour is never the only signal. Error alerts are announced
 * assertively, the rest politely.
 *
 * No buttons inside an inline alert: at most one text link ([linkText] + [onLinkClick]).
 * [toneLabel] is the spoken tone word; pass a translated string for non-English UIs.
 */
@Composable
fun ISMAlert(
    message: String,
    modifier: Modifier = Modifier,
    tone: ISMAlertTone = ISMAlertTone.Info,
    title: String? = null,
    linkText: String? = null,
    onLinkClick: (() -> Unit)? = null,
    toneLabel: String = tone.defaultLabel,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val foreground = when (tone) {
        ISMAlertTone.Info -> c.info
        ISMAlertTone.Success -> c.success
        ISMAlertTone.Warning -> c.warning
        ISMAlertTone.Error -> c.error
    }
    val background = when (tone) {
        ISMAlertTone.Info -> c.infoBg
        ISMAlertTone.Success -> c.successBg
        ISMAlertTone.Warning -> c.warningBg
        ISMAlertTone.Error -> c.errorBg
    }
    val line = when (tone) {
        ISMAlertTone.Info -> c.infoLine
        ISMAlertTone.Success -> c.successLine
        ISMAlertTone.Warning -> c.warningLine
        ISMAlertTone.Error -> c.errorLine
    }
    val icon = when (tone) {
        ISMAlertTone.Info -> ISMUIIcon.Info
        ISMAlertTone.Success -> ISMUIIcon.CheckCircle
        ISMAlertTone.Warning -> ISMUIIcon.AlertTriangle
        ISMAlertTone.Error -> ISMUIIcon.AlertCircle
    }
    val shape = ISMShapes.md

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(background, shape)
            .border(1.dp, line, shape)
            .padding(horizontal = 18.dp, vertical = 16.dp)
            .semantics(mergeDescendants = true) {
                liveRegion = if (tone == ISMAlertTone.Error) LiveRegionMode.Assertive else LiveRegionMode.Polite
            },
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.Top,
    ) {
        ISMIcon(icon, toneLabel, size = ISMSize.iconMd, tint = foreground, modifier = Modifier.padding(top = 1.dp))
        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
            if (title != null) {
                ISMText(
                    text = title,
                    lang = lang,
                    style = ISMTheme.typography.body.copy(fontWeight = FontWeight.SemiBold),
                    color = foreground,
                    heading = true,
                )
            }
            ISMText(text = message, lang = lang, style = ISMTheme.typography.callout, color = foreground)
            if (linkText != null && onLinkClick != null) {
                ISMText(
                    text = linkText,
                    lang = lang,
                    style = ISMTheme.typography.callout.copy(
                        fontWeight = FontWeight.SemiBold,
                        textDecoration = TextDecoration.Underline,
                    ),
                    color = foreground,
                    modifier = Modifier
                        .sizeIn(minHeight = 44.dp)
                        .clickable(role = Role.Button, onClick = onLinkClick)
                        .wrapContentHeight(Alignment.CenterVertically),
                )
            }
        }
    }
}

@Preview(name = "Alert", showBackground = true, widthDp = 360)
@Composable
private fun ISMAlertPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            ISMAlert("Your download will continue on Wi-Fi.", tone = ISMAlertTone.Info)
            ISMAlert("Saved to your library.", tone = ISMAlertTone.Success, title = "Done")
            ISMAlert("Storage is almost full.", tone = ISMAlertTone.Warning, linkText = "Manage storage", onLinkClick = {})
            ISMAlert("We could not reach the server. Check your connection and try again.", tone = ISMAlertTone.Error)
        }
    }
}
