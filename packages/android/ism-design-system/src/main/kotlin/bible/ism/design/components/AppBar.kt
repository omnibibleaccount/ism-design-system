package bible.ism.design.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.max
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme

/** A trailing action in the app bar. Each renders as a 44dp icon button. */
class ISMAppBarAction(
    val icon: ISMUIIcon,
    val contentDescription: String,
    val onClick: () -> Unit,
    val enabled: Boolean = true,
)

/**
 * Top bar of an app screen: a 56dp row with an optional back button (chevron plus the PARENT
 * screen name, never "Back"), a centred one-line title that ellipsizes, and at most three
 * trailing actions (primary first, More last; extra actions are dropped, move them into More).
 *
 * - [scrolled] adds the hairline and a slightly translucent surface; a root screen at rest has none.
 * - [largeTitle] shows the 32sp title under the row (use with an empty [title] or the collapsed one).
 * - Set [applyStatusBarInsets] when drawing edge to edge.
 * - The back chevron mirrors in right-to-left layouts.
 */
@Composable
fun ISMAppBar(
    modifier: Modifier = Modifier,
    title: String? = null,
    largeTitle: String? = null,
    backLabel: String? = null,
    onBack: (() -> Unit)? = null,
    backDescription: String? = null,
    actions: List<ISMAppBarAction> = emptyList(),
    scrolled: Boolean = false,
    applyStatusBarInsets: Boolean = false,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val shownActions = actions.take(3)
    val sideWidth = max(84.dp, 44.dp * shownActions.size)
    val insets = if (applyStatusBarInsets) Modifier.windowInsetsPadding(WindowInsets.statusBars) else Modifier
    val containerColor = if (scrolled) c.surface.copy(alpha = 0.94f) else androidx.compose.ui.graphics.Color.Transparent

    Column(modifier = modifier.fillMaxWidth().background(containerColor).then(insets)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .padding(horizontal = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Leading slot: a fixed 84dp-wide area so the title stays centred.
            Box(modifier = Modifier.width(sideWidth), contentAlignment = Alignment.CenterStart) {
                if (onBack != null) {
                    Row(
                        modifier = Modifier
                            .sizeIn(minHeight = 44.dp, minWidth = 44.dp)
                            .clip(ISMShapes.pill)
                            .clickable(
                                role = Role.Button,
                                onClickLabel = backDescription,
                                onClick = onBack,
                            )
                            .padding(start = 6.dp, end = 6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        ISMIcon(ISMUIIcon.ChevronLeft, if (backLabel == null) backDescription else null, tint = c.link)
                        if (backLabel != null) {
                            ISMText(
                                text = backLabel,
                                lang = lang,
                                style = ISMTheme.typography.bodyMedium,
                                color = c.link,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    }
                }
            }
            Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
                if (title != null) {
                    ISMText(
                        text = title,
                        lang = lang,
                        style = ISMTheme.typography.headline,
                        heading = true,
                        textAlign = TextAlign.Center,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.semantics { heading() },
                    )
                }
            }
            Row(
                modifier = Modifier.width(sideWidth),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                for (action in shownActions) {
                    ISMIconButton(
                        icon = action.icon,
                        contentDescription = action.contentDescription,
                        onClick = action.onClick,
                        enabled = action.enabled,
                    )
                }
            }
        }
        if (largeTitle != null) {
            ISMText(
                text = largeTitle,
                lang = lang,
                style = ISMTheme.typography.largeTitle.copy(fontWeight = FontWeight.SemiBold),
                heading = true,
                modifier = Modifier
                    .padding(start = 20.dp, end = 20.dp, bottom = 12.dp)
                    .semantics { heading() },
            )
        }
        if (scrolled) ISMDivider()
    }
}

@Preview(name = "AppBar", showBackground = true, widthDp = 360)
@Composable
private fun ISMAppBarPreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            ISMAppBar(
                title = "Psalm 23",
                backLabel = "Bible",
                onBack = {},
                actions = listOf(
                    ISMAppBarAction(ISMUIIcon.Share, "Share", {}),
                ),
            )
            ISMAppBar(largeTitle = "Saved", actions = listOf(ISMAppBarAction(ISMUIIcon.Search, "Search", {})))
            ISMAppBar(
                title = "Settings",
                scrolled = true,
                actions = listOf(ISMAppBarAction(ISMUIIcon.MoreHorizontal, "More options", {})),
            )
        }
    }
}
