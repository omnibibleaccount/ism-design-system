package bible.ism.design.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.Placeable
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Minimal wrapping row (chips, suggestions). Written by hand so the library does not depend on the
 * experimental FlowRow. Items wrap to a new line when they no longer fit; [centered] centres each
 * line. Placement is layout-direction aware.
 */
@Composable
internal fun ISMWrapRow(
    modifier: Modifier = Modifier,
    horizontalSpacing: Dp = 8.dp,
    verticalSpacing: Dp = 8.dp,
    centered: Boolean = false,
    content: @Composable () -> Unit,
) {
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        val hs = horizontalSpacing.roundToPx()
        val vs = verticalSpacing.roundToPx()
        val maxW = constraints.maxWidth
        val itemConstraints = constraints.copy(minWidth = 0, minHeight = 0)
        val placeables = measurables.map { it.measure(itemConstraints) }

        val rows = mutableListOf<MutableList<Placeable>>()
        var current = mutableListOf<Placeable>()
        var currentWidth = 0
        for (p in placeables) {
            val needed = if (current.isEmpty()) p.width else currentWidth + hs + p.width
            if (current.isNotEmpty() && needed > maxW) {
                rows.add(current)
                current = mutableListOf()
                currentWidth = 0
            }
            currentWidth = if (current.isEmpty()) p.width else currentWidth + hs + p.width
            current.add(p)
        }
        if (current.isNotEmpty()) rows.add(current)

        val rowWidths = rows.map { row ->
            var w = 0
            for (p in row) w += p.width
            w + hs * (row.size - 1)
        }
        val rowHeights = rows.map { row ->
            var h = 0
            for (p in row) if (p.height > h) h = p.height
            h
        }
        var totalHeight = 0
        for (h in rowHeights) totalHeight += h
        if (rows.size > 1) totalHeight += vs * (rows.size - 1)

        var widest = 0
        for (w in rowWidths) if (w > widest) widest = w
        val width = if (constraints.hasBoundedWidth) maxW else widest

        layout(width, totalHeight) {
            var y = 0
            for (i in rows.indices) {
                var x = if (centered) (width - rowWidths[i]) / 2 else 0
                for (p in rows[i]) {
                    p.placeRelative(x, y)
                    x += p.width + hs
                }
                y += rowHeights[i] + vs
            }
        }
    }
}
