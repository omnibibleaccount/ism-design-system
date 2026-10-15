package bible.ism.design.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.LocalReducedMotion
import bible.ism.design.tokens.ISMMotion

/** Spinner sizes: S inside buttons and inputs, M in menus and cards, L in an empty panel. */
enum class ISMSpinnerSize(val diameter: Dp, val stroke: Dp) {
    Small(16.dp, 2.dp),
    Medium(24.dp, 2.5.dp),
    Large(40.dp, 3.5.dp),
}

/** Rotation in degrees. Fixed at 0 under reduced motion (the arc stays still). */
@Composable
private fun rememberSpinRotation(): Float {
    val reduced = LocalReducedMotion.current
    val rotation: Float = if (reduced) {
        0f
    } else {
        val transition = rememberInfiniteTransition()
        transition.animateFloat(
            initialValue = 0f,
            targetValue = 360f,
            animationSpec = infiniteRepeatable(
                animation = tween(durationMillis = ISMMotion.durationSpin, easing = LinearEasing),
                repeatMode = RepeatMode.Restart,
            ),
            label = "ismSpin",
        ).value
    }
    return rotation
}

/**
 * Raw spinner: a track ring plus a 90 degree head that turns once every 0.8s.
 * Used inside buttons. Prefer [ISMSpinner] elsewhere.
 */
@Composable
internal fun ISMSpinnerArc(
    diameter: Dp,
    stroke: Dp,
    headColor: Color,
    trackColor: Color,
    modifier: Modifier = Modifier,
) {
    val rotation = rememberSpinRotation()
    Canvas(modifier = modifier.size(diameter)) {
        val strokePx = stroke.toPx()
        val inset = strokePx / 2f
        val arcSize = Size(this.size.width - strokePx, this.size.height - strokePx)
        drawArc(
            color = trackColor,
            startAngle = 0f,
            sweepAngle = 360f,
            useCenter = false,
            topLeft = Offset(inset, inset),
            size = arcSize,
            style = Stroke(width = strokePx),
        )
        drawArc(
            color = headColor,
            startAngle = -135f + rotation,
            sweepAngle = 90f,
            useCenter = false,
            topLeft = Offset(inset, inset),
            size = arcSize,
            style = Stroke(width = strokePx, cap = StrokeCap.Round),
        )
    }
}

/**
 * Loading spinner. Never coloured with a status colour. With [contentDescription] it is announced
 * politely to screen readers; without it the spinner is decorative (the surrounding text says what is loading).
 */
@Composable
fun ISMSpinner(
    modifier: Modifier = Modifier,
    size: ISMSpinnerSize = ISMSpinnerSize.Medium,
    onDark: Boolean = ISMTheme.colors.isDark,
    contentDescription: String? = null,
) {
    val semanticsModifier = if (contentDescription != null) {
        Modifier.semantics {
            this.contentDescription = contentDescription
            liveRegion = LiveRegionMode.Polite
        }
    } else {
        Modifier.clearAndSetSemantics { }
    }
    ISMSpinnerArc(
        diameter = size.diameter,
        stroke = size.stroke,
        headColor = if (onDark) Color.White else ISMTheme.colors.action,
        trackColor = if (onDark) Color(0x38FFFFFF) else ISMTheme.colors.border,
        modifier = modifier.then(semanticsModifier),
    )
}

/**
 * Shimmering placeholder that holds the shape of content while it loads (gray-100 to gray-200,
 * 1.4s). Lines are 12dp tall with a 6dp radius. Static under reduced motion.
 */
@Composable
fun ISMSkeleton(
    modifier: Modifier = Modifier,
    height: Dp = 12.dp,
    shape: Shape = RoundedCornerShape(6.dp),
) {
    val base = ISMTheme.colors.surfaceMuted
    val highlight = ISMTheme.colors.border
    val reduced = LocalReducedMotion.current
    val progress: Float = if (reduced) {
        0f
    } else {
        val transition = rememberInfiniteTransition()
        transition.animateFloat(
            initialValue = 0f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(durationMillis = 1400, easing = ISMMotion.easeStandard),
                repeatMode = RepeatMode.Restart,
            ),
            label = "ismShimmer",
        ).value
    }
    Box(
        modifier = modifier
            .height(height)
            .clip(shape)
            .background(base)
            .drawBehind {
                if (!reduced) {
                    val w = this.size.width
                    val startX = -w + 2f * w * progress
                    drawRect(
                        brush = Brush.horizontalGradient(
                            colors = listOf(base, highlight, base),
                            startX = startX,
                            endX = startX + w,
                        ),
                    )
                }
            }
            .clearAndSetSemantics { },
    )
}

/** A skeleton list row: 44dp avatar circle and two text lines. Use three to five for a list. */
@Composable
fun ISMSkeletonRow(modifier: Modifier = Modifier) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(72.dp)
            .padding(horizontal = 20.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        ISMSkeleton(modifier = Modifier.size(44.dp), height = 44.dp, shape = CircleShape)
        Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.weight(1f)) {
            ISMSkeleton(modifier = Modifier.fillMaxWidth())
            ISMSkeleton(modifier = Modifier.width(120.dp))
        }
    }
}

@Preview(name = "Loader", showBackground = true, widthDp = 360)
@Composable
private fun ISMLoaderPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.Bottom) {
                ISMSpinner(size = ISMSpinnerSize.Small)
                ISMSpinner(size = ISMSpinnerSize.Medium, contentDescription = "Loading")
                ISMSpinner(size = ISMSpinnerSize.Large)
            }
            ISMSkeletonRow()
            ISMSkeletonRow()
        }
    }
}
