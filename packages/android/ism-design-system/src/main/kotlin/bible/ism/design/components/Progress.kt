package bible.ism.design.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.LocalReducedMotion
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.tokens.ISMMotion

private fun percentText(progress: Float): String = "${(progress.coerceIn(0f, 1f) * 100f).toInt()}%"

/**
 * Linear progress. Track gray-200, fill Horizon Blue (never a status colour), 4dp tall or 8dp with
 * [large] when a label sits above. Pass `progress = null` for indeterminate. Width changes animate
 * over 300ms (instant under reduced motion). Fills from the start edge, so it mirrors in RTL.
 * Show [showPercent] only when the number is accurate.
 */
@Composable
fun ISMProgressBar(
    progress: Float?,
    modifier: Modifier = Modifier,
    label: String? = null,
    showPercent: Boolean = false,
    large: Boolean = false,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val fillColor = if (c.isDark) c.link else c.action
    val trackColor = if (c.isDark) c.pressedFill else c.border
    val barHeight = if (large || label != null) 8.dp else 4.dp
    val reduced = LocalReducedMotion.current

    val animated by animateFloatAsState(
        targetValue = (progress ?: 0f).coerceIn(0f, 1f),
        animationSpec = ismAnimationSpec(ISMMotion.durationSlow),
        label = "ismProgress",
    )
    val sweep: Float = if (progress == null && !reduced) {
        rememberInfiniteTransition().animateFloat(
            initialValue = 0f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(durationMillis = 1400),
                repeatMode = RepeatMode.Restart,
            ),
            label = "ismIndeterminate",
        ).value
    } else {
        0f
    }

    val semanticsModifier = Modifier.semantics {
        if (label != null) contentDescription = label
        progressBarRangeInfo = if (progress == null) {
            ProgressBarRangeInfo.Indeterminate
        } else {
            ProgressBarRangeInfo(progress.coerceIn(0f, 1f), 0f..1f)
        }
    }

    Column(modifier = modifier.then(semanticsModifier), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        if (label != null || showPercent) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                if (label != null) {
                    ISMText(label, lang = lang, style = ISMTheme.typography.label, color = c.textBody)
                }
                if (showPercent && progress != null) {
                    ISMText(
                        percentText(progress),
                        style = ISMTheme.typography.label.copy(fontWeight = FontWeight.SemiBold),
                        color = c.textBody,
                    )
                }
            }
        }
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(barHeight)
                .clip(ISMShapes.xs)
                .background(trackColor),
        ) {
            if (progress != null) {
                Box(
                    modifier = Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(animated)
                        .clip(ISMShapes.xs)
                        .background(fillColor),
                )
            } else {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .drawBehind {
                            val w = size.width
                            val blockW = w * 0.35f
                            // Slides from just before the start edge to just past the end edge.
                            val travel = -blockW + (w + blockW) * sweep
                            val x = if (layoutDirection == LayoutDirection.Rtl) w - blockW - travel else travel
                            drawRoundRect(
                                color = fillColor,
                                topLeft = Offset(x, 0f),
                                size = Size(blockW, size.height),
                                cornerRadius = CornerRadius(size.height / 2f),
                            )
                        },
                )
            }
        }
    }
}

/** Fills the parent bar so the indeterminate block can be drawn inside it. */
private fun Modifier.fillMaxSize(): Modifier = this.fillMaxWidth().fillMaxHeight()

/** "Step 1 of 2" with a bar that fills one share per step. Use for two to five steps. */
@Composable
fun ISMStepProgress(
    current: Int,
    total: Int,
    modifier: Modifier = Modifier,
    label: String = "Step $current of $total",
    lang: String = "en",
) {
    val fraction = if (total <= 0) 0f else current.toFloat() / total.toFloat()
    ISMProgressBar(progress = fraction, modifier = modifier, label = label, large = true, lang = lang)
}

/**
 * Ring progress that starts at 12 o'clock with round caps; [content] (for example the percent)
 * is drawn in the centre.
 */
@Composable
fun ISMProgressRing(
    progress: Float,
    modifier: Modifier = Modifier,
    size: Dp = 44.dp,
    strokeWidth: Dp = 3.dp,
    description: String? = null,
    content: @Composable () -> Unit = {},
) {
    val c = ISMTheme.colors
    val fillColor = if (c.isDark) c.link else c.action
    val trackColor = if (c.isDark) c.pressedFill else c.border
    val animated by animateFloatAsState(
        targetValue = progress.coerceIn(0f, 1f),
        animationSpec = ismAnimationSpec(ISMMotion.durationSlow),
        label = "ismRing",
    )
    Box(
        modifier = modifier
            .size(size)
            .semantics {
                if (description != null) contentDescription = description
                progressBarRangeInfo = ProgressBarRangeInfo(progress.coerceIn(0f, 1f), 0f..1f)
            },
        contentAlignment = Alignment.Center,
    ) {
        Canvas(Modifier.size(size)) {
            val strokePx = strokeWidth.toPx()
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
            if (animated > 0f) {
                drawArc(
                    color = fillColor,
                    startAngle = -90f,
                    sweepAngle = 360f * animated,
                    useCenter = false,
                    topLeft = Offset(inset, inset),
                    size = arcSize,
                    style = Stroke(width = strokePx, cap = StrokeCap.Round),
                )
            }
        }
        content()
    }
}

@Preview(name = "Progress", showBackground = true, widthDp = 360)
@Composable
private fun ISMProgressPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ISMProgressBar(progress = 0.4f)
            ISMProgressBar(progress = 0.62f, label = "Downloading", showPercent = true)
            ISMProgressBar(progress = null)
            ISMStepProgress(current = 1, total = 2)
            ISMProgressRing(progress = 0.42f, description = "42 percent") {
                ISMText("42%", style = ISMTheme.typography.tabLabel, color = Color.Unspecified)
            }
        }
    }
}
