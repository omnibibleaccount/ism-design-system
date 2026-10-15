package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.tokens.ISMGradients

/**
 * Quiet 1dp hairline. [strong] is for a total row or page-end rule. Pass [label] ("or") for a
 * labelled divider. Decorative: invisible to screen readers.
 */
@Composable
fun ISMDivider(
    modifier: Modifier = Modifier,
    strong: Boolean = false,
    label: String? = null,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val lineColor = if (strong) c.textPrimary else c.border
    if (label == null) {
        Box(modifier.fillMaxWidth().height(1.dp).background(lineColor))
    } else {
        Row(
            modifier = modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(Modifier.weight(1f).height(1.dp).background(lineColor))
            ISMText(label, lang = lang, style = ISMTheme.typography.subhead, color = c.textSecondary)
            Box(Modifier.weight(1f).height(1.dp).background(lineColor))
        }
    }
}

/** Vertical 1dp rule inside a Row with a 16dp gap. */
@Composable
fun ISMVerticalDivider(modifier: Modifier = Modifier) {
    Box(modifier.fillMaxHeight().width(1.dp).background(ISMTheme.colors.border))
}

/**
 * The signature gradient thread (blue, violet, gold; 2dp). Use at most once per section and never
 * as a list separator. The gradient always runs left to right.
 */
@Composable
fun ISMThread(modifier: Modifier = Modifier) {
    val stops = ISMGradients.line.stops.toTypedArray()
    Box(
        modifier
            .fillMaxWidth()
            .height(2.dp)
            .background(Brush.horizontalGradient(*stops), RoundedCornerShape(percent = 50)),
    )
}

@Preview(name = "Divider", showBackground = true, widthDp = 360)
@Composable
private fun ISMDividerPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ISMDivider()
            ISMDivider(strong = true)
            ISMDivider(label = "or")
            ISMThread()
            Row(Modifier.height(24.dp).padding(horizontal = 8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                ISMText("One")
                ISMVerticalDivider()
                ISMText("Two")
            }
        }
    }
}
