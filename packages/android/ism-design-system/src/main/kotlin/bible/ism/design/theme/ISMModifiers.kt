package bible.ism.design.theme

import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.drawOutline
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import bible.ism.design.tokens.ISMLayout
import bible.ism.design.tokens.ISMSize

/** Guarantees a 44dp x 44dp touch area (ISMLayout.tapTarget) around a smaller visual. */
fun Modifier.ismTapTarget(): Modifier =
    this.sizeIn(minWidth = ISMLayout.tapTarget, minHeight = ISMLayout.tapTarget)

/** 44dp minimum height only (rows, wide buttons). */
fun Modifier.ismMinTapHeight(): Modifier = this.sizeIn(minHeight = ISMLayout.tapTarget)

/**
 * Mirrors the content horizontally in right-to-left layouts. Use for glyphs that mean
 * "next" or "back" (chevrons, left/right arrows). Do not use for play, check, close, search.
 */
@Composable
fun Modifier.mirrorInRtl(): Modifier =
    if (LocalLayoutDirection.current == LayoutDirection.Rtl) {
        this.graphicsLayer(scaleX = -1f)
    } else {
        this
    }

/**
 * Focus ring: 2dp ring, 2dp outside the bounds, plus a soft 3dp halo (rules/states.md).
 * Pass `inset = true` inside clipped containers (rows, tabs): the ring is then drawn inside.
 * Pass `width = 0.dp, offset = 0.dp` for a halo-only treatment (text fields draw their own border).
 * Call it BEFORE clip/background in the chain so it is not clipped.
 */
fun Modifier.ismFocusRing(
    visible: Boolean,
    shape: Shape,
    color: Color,
    width: Dp = ISMSize.focusWidth,
    offset: Dp = ISMSize.focusOffset,
    halo: Boolean = true,
    inset: Boolean = false,
): Modifier {
    if (!visible) return this
    return this.drawWithContent {
        drawContent()
        val ringPx = width.toPx()
        val offsetPx = offset.toPx()
        val haloPx = 3.dp.toPx()
        if (halo) {
            val grow = if (inset) -(haloPx / 2f) else haloPx / 2f
            val haloOutline = shape.createOutline(
                Size(size.width + grow * 2f, size.height + grow * 2f),
                layoutDirection,
                this,
            )
            translate(left = -grow, top = -grow) {
                drawOutline(haloOutline, color.copy(alpha = 0.35f), style = Stroke(width = haloPx))
            }
        }
        if (ringPx > 0f) {
            val grow = if (inset) -(offsetPx + ringPx / 2f) else offsetPx + ringPx / 2f
            val ringOutline = shape.createOutline(
                Size(size.width + grow * 2f, size.height + grow * 2f),
                layoutDirection,
                this,
            )
            translate(left = -grow, top = -grow) {
                drawOutline(ringOutline, color, style = Stroke(width = ringPx))
            }
        }
    }
}

/** Snapshot of pointer and keyboard interaction used for pressed, hovered and focused visuals. */
@Immutable
class ISMInteractionState(val pressed: Boolean, val focused: Boolean, val hovered: Boolean)

@Composable
fun MutableInteractionSource.collectISMInteractionState(): ISMInteractionState {
    val pressed by collectIsPressedAsState()
    val focused by collectIsFocusedAsState()
    val hovered by collectIsHoveredAsState()
    return ISMInteractionState(pressed = pressed, focused = focused, hovered = hovered)
}
