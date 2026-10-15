package bible.ism.design.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.tokens.ISMColors

/** Presence dot. Offline is grey; never red. */
enum class ISMPresence { None, Online, Offline }

private val avatarPalette = listOf(
    ISMColors.charcoal900,
    ISMColors.horizonBlueDim,
    ISMColors.violetInk,
    ISMColors.success,
    ISMColors.charcoal700,
)

/** One or two uppercase initials from [name] (Latin names are uppercased; other scripts are left as written). */
internal fun ismInitials(name: String): String {
    val parts = name.trim().split(" ").filter { it.isNotEmpty() }
    if (parts.isEmpty()) return ""
    val letters = if (parts.size == 1) {
        parts[0].take(1)
    } else {
        parts[0].take(1) + parts[parts.size - 1].take(1)
    }
    return if (letters.all { it.code < 0x250 }) letters.uppercase() else letters
}

/** A colour that is stable for a given name, so a person keeps one colour everywhere. */
internal fun ismAvatarColor(name: String): Color {
    var hash = 0
    for (ch in name) hash = hash * 31 + ch.code
    val index = (hash and 0x7fffffff) % avatarPalette.size
    return avatarPalette[index]
}

/**
 * Circular avatar: a photo ([image]), initials from [name], or a person icon when [name] is empty.
 * Sizes: 40dp in rows, 56dp in testimonial cards, 80dp on profiles, 24 to 32dp in dense UI.
 * Always a circle. Screen readers hear [contentDescription] (default: the name) plus presence.
 */
@Composable
fun ISMAvatar(
    name: String,
    modifier: Modifier = Modifier,
    size: Dp = 40.dp,
    image: Painter? = null,
    contentDescription: String? = null,
    presence: ISMPresence = ISMPresence.None,
    presenceDescription: String? = null,
) {
    val c = ISMTheme.colors
    val description = contentDescription ?: name.ifEmpty { null }
    val semanticsModifier = if (description != null || presenceDescription != null) {
        Modifier.semantics(mergeDescendants = true) {
            if (description != null) this.contentDescription = description
            if (presenceDescription != null && presence != ISMPresence.None) {
                stateDescription = presenceDescription
            }
        }
    } else {
        Modifier.clearAndSetSemantics { }
    }
    Box(modifier = modifier.size(size).then(semanticsModifier)) {
        Box(
            modifier = Modifier
                .size(size)
                .clip(CircleShape)
                .background(if (image == null) ismAvatarColor(name) else c.surfaceMuted),
            contentAlignment = Alignment.Center,
        ) {
            if (image != null) {
                Image(
                    painter = image,
                    contentDescription = null,
                    modifier = Modifier.size(size),
                    contentScale = ContentScale.Crop,
                )
            } else if (name.isBlank()) {
                ISMIcon(ISMUIIcon.User, null, size = size * 0.5f, tint = Color.White)
            } else {
                ISMText(
                    text = ismInitials(name),
                    style = ISMTheme.typography.label.copy(
                        fontSize = (size.value * 0.37f).sp,
                        lineHeight = (size.value * 0.45f).sp,
                        fontWeight = FontWeight.SemiBold,
                    ),
                    color = Color.White,
                    textAlign = TextAlign.Center,
                    maxLines = 1,
                )
            }
        }
        if (presence != ISMPresence.None) {
            val dot = size * 0.28f
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .size(dot)
                    .background(
                        if (presence == ISMPresence.Online) ISMColors.success else ISMColors.gray500,
                        CircleShape,
                    )
                    .border(2.dp, c.surface, CircleShape),
            )
        }
    }
}

/** Overlapping group of up to [max] (default 4) avatars, then a "+N" tile. */
@Composable
fun ISMAvatarStack(
    names: List<String>,
    modifier: Modifier = Modifier,
    size: Dp = 32.dp,
    max: Int = 4,
) {
    val c = ISMTheme.colors
    val shown = names.take(max)
    val extra = names.size - shown.size
    Row(modifier = modifier, horizontalArrangement = Arrangement.spacedBy(-(size * 0.3f))) {
        for (n in shown) {
            ISMAvatar(
                name = n,
                size = size,
                modifier = Modifier.border(2.dp, c.surface, CircleShape),
            )
        }
        if (extra > 0) {
            Box(
                modifier = Modifier
                    .size(size)
                    .clip(CircleShape)
                    .background(c.surfaceMuted)
                    .border(2.dp, c.surface, CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                ISMText(
                    text = "+$extra",
                    style = ISMTheme.typography.footnote.copy(fontWeight = FontWeight.SemiBold),
                    color = c.textBody,
                    maxLines = 1,
                )
            }
        }
    }
}

@Preview(name = "Avatar", showBackground = true, widthDp = 360)
@Composable
private fun ISMAvatarPreview() {
    ISMPreviewBoard {
        androidx.compose.foundation.layout.Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                ISMAvatar("Grace Mensah")
                ISMAvatar("Samuel", size = 56.dp, presence = ISMPresence.Online, presenceDescription = "Online")
                ISMAvatar("", size = 40.dp)
                ISMAvatar("ሰላም ሀብቴ", size = 40.dp, presence = ISMPresence.Offline)
            }
            ISMAvatarStack(listOf("Ann Lee", "Bo Chen", "Cy Diaz", "Di Evans", "Ed Fox", "Fay Gu"))
        }
    }
}
