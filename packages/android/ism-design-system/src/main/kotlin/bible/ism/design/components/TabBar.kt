package bible.ism.design.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMUIIcon
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMShapes
import bible.ism.design.theme.ISMText
import bible.ism.design.theme.ISMTheme
import bible.ism.design.theme.collectISMInteractionState
import bible.ism.design.theme.ismAnimationSpec
import bible.ism.design.theme.ismFocusRing

/**
 * One tab. [showDot] marks "something new" (a 9dp blue dot, never red); [badgeCount] shows a number
 * instead (0 to 9, above that "9+"). [badgeDescription] is spoken with the tab ("New", "3 new").
 */
class ISMTabItem(
    val label: String,
    val icon: ISMUIIcon,
    val showDot: Boolean = false,
    val badgeCount: Int? = null,
    val badgeDescription: String? = null,
)

/**
 * Bottom tab bar: tabs share the width equally (five in dot.Bible: Home, Bible, Listen, Saved,
 * More), exactly one is active, and every label stays visible so colour is not the only cue. Tabs
 * are at least 52dp tall. Use outline icons for all states. Set [applyNavigationBarInsets] to pad
 * for the gesture bar when drawing edge to edge.
 */
@Composable
fun ISMTabBar(
    items: List<ISMTabItem>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
    applyNavigationBarInsets: Boolean = false,
    lang: String = "en",
) {
    val c = ISMTheme.colors
    val insets = if (applyNavigationBarInsets) Modifier.windowInsetsPadding(WindowInsets.navigationBars) else Modifier
    Column(modifier = modifier.fillMaxWidth().background(c.surface).then(insets)) {
        ISMDivider()
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .selectableGroup()
                .padding(horizontal = 4.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(0.dp),
        ) {
            for (index in items.indices) {
                ISMTab(
                    item = items[index],
                    selected = index == selectedIndex,
                    onClick = { onSelect(index) },
                    lang = lang,
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}

@Composable
private fun ISMTab(
    item: ISMTabItem,
    selected: Boolean,
    onClick: () -> Unit,
    lang: String,
    modifier: Modifier = Modifier,
) {
    val c = ISMTheme.colors
    val interactionSource = remember { MutableInteractionSource() }
    val interaction = interactionSource.collectISMInteractionState()
    val contentColor = if (selected) c.link else c.textSecondary
    val container by animateColorAsState(
        targetValue = if (interaction.pressed) c.hoverFill else Color.Transparent,
        animationSpec = ismAnimationSpec(),
        label = "ismTabContainer",
    )
    val shape = ISMShapes.md
    val badgeText = item.badgeDescription
    Column(
        modifier = modifier
            .sizeIn(minHeight = 52.dp)
            .ismFocusRing(
                visible = interaction.focused,
                shape = shape,
                color = c.focusRing,
                inset = true,
            )
            .clip(shape)
            .background(container)
            .selectable(
                selected = selected,
                interactionSource = interactionSource,
                indication = null,
                role = Role.Tab,
                onClick = onClick,
            )
            .semantics(mergeDescendants = true) {
                if (badgeText != null && (item.showDot || item.badgeCount != null)) {
                    stateDescription = badgeText
                }
            }
            .padding(vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(3.dp, Alignment.CenterVertically),
    ) {
        Box(modifier = Modifier.size(24.dp)) {
            ISMIcon(item.icon, null, tint = contentColor)
            if (item.badgeCount != null) {
                ISMCountBadge(
                    count = item.badgeCount,
                    max = 9,
                    modifier = Modifier.align(Alignment.TopEnd).offset(x = 8.dp, y = (-6).dp),
                )
            } else if (item.showDot) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .offset(x = 7.dp, y = (-4).dp)
                        .size(13.dp)
                        .background(c.surface, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Box(
                        modifier = Modifier
                            .size(9.dp)
                            .background(if (c.isDark) c.link else c.action, CircleShape),
                    )
                }
            }
        }
        ISMText(
            text = item.label,
            lang = lang,
            style = ISMTheme.typography.tabLabel,
            color = contentColor,
            textAlign = TextAlign.Center,
            maxLines = 1,
        )
    }
}

@Preview(name = "TabBar", showBackground = true, widthDp = 360)
@Composable
private fun ISMTabBarPreview() {
    ISMPreviewBoard {
        val items = listOf(
            ISMTabItem("Home", ISMUIIcon.Home),
            ISMTabItem("Bible", ISMUIIcon.BookOpen),
            ISMTabItem("Listen", ISMUIIcon.Headphones, showDot = true, badgeDescription = "New"),
            ISMTabItem("Saved", ISMUIIcon.Bookmark, badgeCount = 3, badgeDescription = "3 new"),
            ISMTabItem("More", ISMUIIcon.MoreHorizontal),
        )
        ISMTabBar(items = items, selectedIndex = 1, onSelect = {})
    }
}
