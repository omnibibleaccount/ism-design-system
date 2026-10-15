package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMShadow

/**
 * Compact: app verse card (17sp Lora, off-white panel). Card: larger reading card (21sp, white,
 * shadow). VerseOfTheDay: dark hero with gold reference, no blue button inside it.
 */
enum class ISMVerseStyle { Compact, Card, VerseOfTheDay }

/**
 * A Bible verse in Lora with its reference and up to three tools in the order Share, Copy,
 * Bookmark (each shown only when its callback is given). The verse is wrapped in curly quotes and
 * never italic. The reference is sans 600 after the verse: "John 3:16 · BSB".
 *
 * [lang] sets script rules and direction for the verse text (for example "ar" lays it out right to
 * left). The reference is left in its own direction. Descriptions are parameters so they can be
 * translated.
 */
@Composable
fun ISMVerseBlock(
    text: String,
    reference: String,
    modifier: Modifier = Modifier,
    style: ISMVerseStyle = ISMVerseStyle.Compact,
    lang: String = "en",
    quoteMarks: Boolean = true,
    onShare: (() -> Unit)? = null,
    onCopy: (() -> Unit)? = null,
    onBookmark: (() -> Unit)? = null,
    bookmarked: Boolean = false,
    shareDescription: String = "Share verse",
    copyDescription: String = "Copy verse",
    bookmarkDescription: String = "Bookmark verse",
    removeBookmarkDescription: String = "Remove bookmark",
) {
    val c = ISMTheme.colors
    val typography = ISMTheme.typography
    val dark = style == ISMVerseStyle.VerseOfTheDay

    val verseStyle = when (style) {
        ISMVerseStyle.Compact -> typography.verse
        ISMVerseStyle.Card -> typography.verse.copy(fontSize = 21.sp, lineHeight = 33.6.sp)
        ISMVerseStyle.VerseOfTheDay -> typography.verse.copy(fontSize = 26.sp, lineHeight = 36.4.sp)
    }
    val verseColor = if (dark) ISMColors.white else c.textPrimary
    val referenceColor = if (dark) ISMColors.leatherGold else c.textBody
    val shape = if (style == ISMVerseStyle.Compact) ISMShapes.md else ISMShapes.lg
    val contentPadding = when (style) {
        ISMVerseStyle.Compact -> 16.dp
        ISMVerseStyle.Card -> 24.dp
        ISMVerseStyle.VerseOfTheDay -> 32.dp
    }

    val containerModifier = when (style) {
        ISMVerseStyle.Compact -> Modifier
            .background(c.background, shape)
            .border(1.dp, c.border, shape)
        ISMVerseStyle.Card -> if (c.isDark) {
            Modifier
                .background(c.surface, shape)
                .border(1.dp, ISMColors.borderHairlineDark, shape)
        } else {
            Modifier
                .shadow(
                    elevation = ISMShadow.cardLight.elevation,
                    shape = shape,
                    ambientColor = ISMShadow.cardLight.color,
                    spotColor = ISMShadow.cardLight.color,
                )
                .background(c.surface, shape)
                .border(1.dp, ISMColors.borderHairlineLight, shape)
        }
        ISMVerseStyle.VerseOfTheDay -> Modifier.background(ISMColors.black, shape)
    }

    val displayed = if (quoteMarks) "“$text”" else text

    Column(
        modifier = modifier
            .fillMaxWidth()
            .then(containerModifier)
            .padding(contentPadding),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        ISMText(
            text = displayed,
            lang = lang,
            style = verseStyle,
            color = verseColor,
            modifier = Modifier.fillMaxWidth(),
            textAlign = TextAlign.Start,
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            ISMText(
                text = reference,
                style = typography.verseReference.copy(fontWeight = FontWeight.SemiBold),
                color = referenceColor,
                modifier = Modifier.weight(1f, fill = false),
            )
            if (onShare != null || onCopy != null || onBookmark != null) {
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
                    if (onShare != null) {
                        ISMIconButton(
                            icon = ISMUIIcon.Share,
                            contentDescription = shareDescription,
                            onClick = onShare,
                            variant = if (dark) ISMIconButtonVariant.OutlineOnDark else ISMIconButtonVariant.Ghost,
                        )
                    }
                    if (onCopy != null) {
                        ISMIconButton(
                            icon = ISMUIIcon.Copy,
                            contentDescription = copyDescription,
                            onClick = onCopy,
                            variant = if (dark) ISMIconButtonVariant.OutlineOnDark else ISMIconButtonVariant.Ghost,
                        )
                    }
                    if (onBookmark != null) {
                        ISMIconButton(
                            icon = ISMUIIcon.Bookmark,
                            contentDescription = if (bookmarked) removeBookmarkDescription else bookmarkDescription,
                            onClick = onBookmark,
                            variant = if (dark) ISMIconButtonVariant.OutlineOnDark else ISMIconButtonVariant.Ghost,
                            tint = if (bookmarked) {
                                if (dark) ISMColors.leatherGold else c.link
                            } else {
                                Color.Unspecified
                            },
                        )
                    }
                }
            }
        }
    }
}

@Preview(name = "VerseBlock", showBackground = true, widthDp = 360)
@Composable
private fun ISMVerseBlockPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ISMVerseBlock(
                text = "For God so loved the world that he gave his one and only Son.",
                reference = "John 3:16 · BSB",
                onShare = {},
                onCopy = {},
                onBookmark = {},
            )
            ISMVerseBlock(
                text = "The Lord is my shepherd; I shall not want.",
                reference = "Psalm 23:1 · BSB",
                style = ISMVerseStyle.Card,
                bookmarked = true,
                onBookmark = {},
            )
            ISMVerseBlock(
                text = "Your word is a lamp to my feet.",
                reference = "Psalm 119:105 · BSB",
                style = ISMVerseStyle.VerseOfTheDay,
                onShare = {},
            )
        }
    }
}
