package bible.ism.design.theme

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.takeOrElse
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection

/**
 * Text that applies the per-script rules for [lang]: Amharic and Tigrinya line-height 1.65,
 * Burmese 1.9, Arabic, Persian and Urdu 1.9 with right-to-left direction, and letter-spacing 0
 * for all of them. Set [heading] to use the (tighter) heading line-height of the script.
 * Never fix the width of the container: these scripts run 20 to 40 percent longer.
 */
@Composable
fun ISMText(
    text: String,
    modifier: Modifier = Modifier,
    lang: String = "en",
    style: TextStyle = ISMTheme.typography.body,
    color: Color = Color.Unspecified,
    heading: Boolean = false,
    textAlign: TextAlign? = null,
    maxLines: Int = Int.MAX_VALUE,
    overflow: TextOverflow = TextOverflow.Clip,
) {
    Text(
        text = text,
        modifier = modifier,
        color = color.takeOrElse { ISMTheme.colors.textPrimary },
        style = style.forLanguage(lang, heading),
        textAlign = textAlign,
        maxLines = maxLines,
        overflow = overflow,
    )
}

/**
 * Sets the layout direction for a block of content in [lang]. Use around a whole screen or a
 * verse when the content language differs from the device language.
 */
@Composable
fun ISMLanguageProvider(lang: String, content: @Composable () -> Unit) {
    val direction = if (ISMScriptTypography.isRtl(lang)) LayoutDirection.Rtl else LayoutDirection.Ltr
    CompositionLocalProvider(LocalLayoutDirection provides direction) {
        content()
    }
}
