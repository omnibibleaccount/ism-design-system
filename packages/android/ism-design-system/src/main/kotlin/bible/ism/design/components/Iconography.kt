package bible.ism.design.components

import androidx.annotation.DrawableRes
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalContentColor
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMMinistryIcon
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.mirrorInRtl
import bible.ism.design.tokens.ISMSize

/**
 * Directional UI icons that must flip in right-to-left layouts (rules/multilingual-rtl.md):
 * back, forward and drill-in chevrons and arrows. Everything else (play, check, close, search,
 * the down caret, the diagonal off-page arrow) keeps its orientation.
 */
val ISMUIIcon.mirrorsInRtl: Boolean
    get() = when (this) {
        ISMUIIcon.ArrowLeft,
        ISMUIIcon.ArrowRight,
        ISMUIIcon.ChevronLeft,
        ISMUIIcon.ChevronRight -> true
        else -> false
    }

@Composable
private fun ISMIconPainter(
    @DrawableRes res: Int,
    contentDescription: String?,
    modifier: Modifier,
    size: Dp,
    tint: Color,
    mirror: Boolean,
) {
    val mirrorModifier = if (mirror) Modifier.mirrorInRtl() else Modifier
    Icon(
        painter = painterResource(id = res),
        contentDescription = contentDescription,
        modifier = modifier.size(size).then(mirrorModifier),
        tint = tint,
    )
}

/**
 * A 1.8dp-stroke line icon. Sizes: 16 (iconSm), 20 (iconMd), 24 (iconLg, default).
 * Decorative icons pass `contentDescription = null`; an icon that carries meaning on its own
 * (no text next to it) needs a description, but prefer naming the button that holds it.
 */
@Composable
fun ISMIcon(
    icon: ISMUIIcon,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = ISMSize.iconLg,
    tint: Color = LocalContentColor.current,
    mirror: Boolean = icon.mirrorsInRtl,
) {
    ISMIconPainter(icon.res, contentDescription, modifier, size, tint, mirror)
}

/** A filled ministry icon (features, illustrations). Never mirrored. */
@Composable
fun ISMIcon(
    icon: ISMMinistryIcon,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = ISMSize.iconLg,
    tint: Color = LocalContentColor.current,
) {
    ISMIconPainter(icon.res, contentDescription, modifier, size, tint, false)
}

/** Rounded tile behind an icon: settings rows (30dp), share options (56dp), empty states. */
@Composable
fun ISMIconTile(
    icon: ISMUIIcon,
    modifier: Modifier = Modifier,
    size: Dp = 30.dp,
    iconSize: Dp = ISMSize.iconMd,
    shape: Shape = ISMShapes.sm,
    containerColor: Color = ISMTheme.colors.tintBlue,
    contentColor: Color = ISMTheme.colors.onTintBlue,
    contentDescription: String? = null,
) {
    Box(
        modifier = modifier
            .size(size)
            .clip(shape)
            .background(containerColor),
        contentAlignment = Alignment.Center,
    ) {
        ISMIcon(icon, contentDescription, size = iconSize, tint = contentColor)
    }
}

/** Ministry-icon variant of [ISMIconTile]. */
@Composable
fun ISMIconTile(
    icon: ISMMinistryIcon,
    modifier: Modifier = Modifier,
    size: Dp = 40.dp,
    iconSize: Dp = ISMSize.iconLg,
    shape: Shape = ISMShapes.md,
    containerColor: Color = ISMTheme.colors.tintBlue,
    contentColor: Color = ISMTheme.colors.onTintBlue,
    contentDescription: String? = null,
) {
    Box(
        modifier = modifier
            .size(size)
            .clip(shape)
            .background(containerColor),
        contentAlignment = Alignment.Center,
    ) {
        ISMIcon(icon, contentDescription, size = iconSize, tint = contentColor)
    }
}

/** Decorative round icon medallion (64dp circle, 28dp icon), used by empty states. */
@Composable
internal fun ISMIconCircle(
    icon: ISMUIIcon,
    modifier: Modifier = Modifier,
    size: Dp = 64.dp,
    iconSize: Dp = 28.dp,
    containerColor: Color = ISMTheme.colors.surfaceMuted,
    contentColor: Color = ISMTheme.colors.textSecondary,
) {
    Box(
        modifier = modifier
            .size(size)
            .clip(CircleShape)
            .background(containerColor)
            .clearAndSetSemantics { },
        contentAlignment = Alignment.Center,
    ) {
        ISMIcon(icon, null, size = iconSize, tint = contentColor)
    }
}

@Preview(name = "Iconography", showBackground = true, widthDp = 360)
@Composable
private fun ISMIconographyPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ISMIcon(ISMUIIcon.Search, null, size = ISMSize.iconSm)
                ISMIcon(ISMUIIcon.Settings, null, size = ISMSize.iconMd)
                ISMIcon(ISMUIIcon.ChevronRight, null)
                ISMIcon(ISMUIIcon.ArrowUpRight, null)
                ISMIcon(ISMMinistryIcon.Bible, null)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                ISMIconTile(ISMUIIcon.Bookmark)
                ISMIconTile(ISMUIIcon.Share, size = 56.dp, iconSize = ISMSize.iconLg, shape = ISMShapes.ml)
                ISMIconTile(ISMMinistryIcon.Church)
            }
        }
    }
}
