package bible.ism.design.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/** Renders [content] on the light page colour, then on the dark one. Used by @Preview functions. */
@Composable
internal fun ISMPreviewBoard(content: @Composable () -> Unit) {
    Column {
        ISMTheme(darkTheme = false) {
            Box(Modifier.background(ISMTheme.colors.background).padding(16.dp)) { content() }
        }
        ISMTheme(darkTheme = true) {
            Box(Modifier.background(ISMTheme.colors.background).padding(16.dp)) { content() }
        }
    }
}
