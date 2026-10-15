package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme

/**
 * Centred panel explaining why a list, search or screen is empty, with ONE next step.
 *
 * - "Nothing yet": [actionLabel] as the primary button ([primaryAction] = true).
 * - Offline or error: pass [primaryAction] = false so the button is secondary and never competes
 *   with the page's primary action.
 * - No results: pass [suggestions] (real searches); tapping one calls [onSuggestionClick].
 * Replace the list in place; keep the page header and filters visible.
 */
@Composable
fun ISMEmptyState(
    title: String,
    message: String,
    modifier: Modifier = Modifier,
    icon: ISMUIIcon = ISMUIIcon.Search,
    brandIcon: Boolean = false,
    actionLabel: String? = null,
    onAction: (() -> Unit)? = null,
    primaryAction: Boolean = true,
    suggestions: List<String> = emptyList(),
    onSuggestionClick: (String) -> Unit = {},
    bordered: Boolean = true,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val shape = ISMShapes.lg
    val panel = if (bordered) {
        Modifier
            .background(c.surface, shape)
            .border(1.dp, c.border, shape)
            .padding(horizontal = 28.dp, vertical = 40.dp)
    } else {
        Modifier.padding(horizontal = 36.dp, vertical = 24.dp)
    }
    Column(
        modifier = modifier.fillMaxWidth().then(panel),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        ISMIconCircle(
            icon = icon,
            containerColor = if (brandIcon) c.tintBlue else c.surfaceMuted,
            contentColor = if (brandIcon) c.onTintBlue else c.textSecondary,
        )
        ISMText(
            text = title,
            lang = lang,
            style = ISMTheme.typography.sheetTitle,
            heading = true,
            textAlign = TextAlign.Center,
            modifier = Modifier.semantics { heading() },
        )
        ISMText(
            text = message,
            lang = lang,
            style = ISMTheme.typography.callout,
            color = c.textBody,
            textAlign = TextAlign.Center,
            modifier = Modifier.widthIn(max = 280.dp),
        )
        if (suggestions.isNotEmpty()) {
            ISMWrapRow(centered = true) {
                for (s in suggestions) {
                    ISMChip(text = s, selected = false, onClick = { onSuggestionClick(s) }, dense = false, lang = lang)
                }
            }
        }
        if (actionLabel != null && onAction != null) {
            ISMButton(
                text = actionLabel,
                onClick = onAction,
                variant = if (primaryAction) ISMButtonVariant.Primary else ISMButtonVariant.Secondary,
                lang = lang,
                modifier = Modifier.padding(top = 8.dp),
            )
        }
    }
}

@Preview(name = "EmptyState", showBackground = true, widthDp = 360)
@Composable
private fun ISMEmptyStatePreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            ISMEmptyState(
                title = "No results",
                message = "Try a book name or a verse, like John 3:16.",
                suggestions = listOf("John 3:16", "Psalm 23", "Romans"),
            )
            ISMEmptyState(
                title = "Nothing saved yet",
                message = "Bookmark a verse and it will show up here.",
                icon = ISMUIIcon.Bookmark,
                brandIcon = true,
                actionLabel = "Open the Bible",
                onAction = {},
            )
        }
    }
}
