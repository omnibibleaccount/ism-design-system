package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.tokens.ISMColors

enum class ISMBadgeTone { Neutral, Info, Success, Warning, Error, Brand, Partner }

/**
 * Small status pill: 24dp tall, 13sp/600, one line. Always carries a word (never colour alone).
 * Use status tones only for status. [solid] gives the stronger fill; avoid solid Info next to a
 * blue primary button. Counts use [ISMCountBadge]; live/on-air uses [ISMLiveBadge].
 */
@Composable
fun ISMBadge(
    text: String,
    modifier: Modifier = Modifier,
    tone: ISMBadgeTone = ISMBadgeTone.Neutral,
    solid: Boolean = false,
    showDot: Boolean = false,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val colors: Pair<Color, Color> = if (solid) {
        when (tone) {
            ISMBadgeTone.Neutral -> Pair(c.inverseSurface, c.onInverseSurface)
            ISMBadgeTone.Info -> Pair(ISMColors.horizonBlue, Color.White)
            ISMBadgeTone.Success -> Pair(ISMColors.success, Color.White)
            ISMBadgeTone.Warning -> Pair(ISMColors.warning, Color.White)
            ISMBadgeTone.Error -> Pair(ISMColors.error, Color.White)
            ISMBadgeTone.Brand -> Pair(ISMColors.gradientGold, ISMColors.charcoal900)
            ISMBadgeTone.Partner -> Pair(ISMColors.violetInk, Color.White)
        }
    } else {
        when (tone) {
            ISMBadgeTone.Neutral -> Pair(c.surfaceMuted, c.textBody)
            ISMBadgeTone.Info -> Pair(c.infoBg, c.info)
            ISMBadgeTone.Success -> Pair(c.successBg, c.success)
            ISMBadgeTone.Warning -> Pair(c.warningBg, c.warning)
            ISMBadgeTone.Error -> Pair(c.errorBg, c.error)
            ISMBadgeTone.Brand -> Pair(c.tintGold, c.onTintGold)
            ISMBadgeTone.Partner -> Pair(c.tintViolet, c.onTintViolet)
        }
    }
    val container = colors.first
    val content = colors.second
    Row(
        modifier = modifier
            .heightIn(min = 24.dp)
            .background(container, ISMShapes.pill)
            .padding(horizontal = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (showDot) {
            Box(Modifier.size(6.dp).background(content, CircleShape))
        }
        ISMText(
            text = text,
            lang = lang,
            style = ISMTheme.typography.footnote.copy(fontWeight = FontWeight.SemiBold, lineHeight = 16.sp),
            color = content,
            maxLines = 1,
        )
    }
}

/**
 * Number dot (notifications, tab counts): Horizon Blue, never red. Shows "9+" above [max].
 * Pass [description] (for example "3 new") so the number is announced with its meaning.
 */
@Composable
fun ISMCountBadge(
    count: Int,
    modifier: Modifier = Modifier,
    max: Int = 9,
    description: String? = null,
) {
    val c = ISMTheme.colors
    val label = if (count > max) "$max+" else count.toString()
    Box(
        modifier = modifier
            .sizeIn(minWidth = 18.dp, minHeight = 18.dp)
            .background(if (c.isDark) ISMColors.blueOnDark else ISMColors.horizonBlue, CircleShape)
            .padding(horizontal = 5.dp)
            .then(
                if (description != null) Modifier.semantics { contentDescription = description } else Modifier,
            ),
        contentAlignment = Alignment.Center,
    ) {
        ISMText(
            text = label,
            style = ISMTheme.typography.tabLabel.copy(fontWeight = FontWeight.Bold, lineHeight = 14.sp),
            color = if (c.isDark) ISMColors.black else Color.White,
            textAlign = TextAlign.Center,
            maxLines = 1,
        )
    }
}

/** On-air badge: red dot plus the word. The live colour is used for on-air only. */
@Composable
fun ISMLiveBadge(
    modifier: Modifier = Modifier,
    text: String = "Live",
    lang: String = "en",
) {
    val c = ISMTheme.colors
    Row(
        modifier = modifier
            .heightIn(min = 24.dp)
            .background(c.surfaceMuted, ISMShapes.pill)
            .padding(horizontal = 10.dp),
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(Modifier.size(8.dp).background(c.live, CircleShape))
        ISMText(
            text = text,
            lang = lang,
            style = ISMTheme.typography.footnote.copy(fontWeight = FontWeight.SemiBold, lineHeight = 16.sp),
            color = c.textPrimary,
            maxLines = 1,
        )
    }
}

@Preview(name = "Badge", showBackground = true, widthDp = 360)
@Composable
private fun ISMBadgePreview() {
    ISMPreviewBoard {
        androidx.compose.foundation.layout.Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                ISMBadge("Neutral")
                ISMBadge("Info", tone = ISMBadgeTone.Info)
                ISMBadge("Success", tone = ISMBadgeTone.Success, showDot = true)
                ISMBadge("Draft", tone = ISMBadgeTone.Warning)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                ISMBadge("Error", tone = ISMBadgeTone.Error)
                ISMBadge("Featured", tone = ISMBadgeTone.Brand)
                ISMBadge("Partner", tone = ISMBadgeTone.Partner)
                ISMBadge("Solid", tone = ISMBadgeTone.Success, solid = true)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                ISMCountBadge(3, description = "3 new")
                ISMCountBadge(12)
                ISMLiveBadge()
            }
        }
    }
}
