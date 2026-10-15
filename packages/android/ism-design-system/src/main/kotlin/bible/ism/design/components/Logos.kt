package bible.ism.design.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import bible.ism.design.icons.ISMLogo
import bible.ism.design.theme.ISMPreviewBoard
import bible.ism.design.theme.ISMTheme

/**
 * ISM / dot.Bible logo. Black ink on light surfaces, white on dark (set [onDark], which defaults
 * to the current theme). Never recolour. Width follows the drawable's aspect ratio.
 *
 * @param contentDescription Describe the destination when the logo is a link
 * ("International Scripture Ministries home"); pass null when decorative.
 */
@Composable
fun ISMLogoImage(
    logo: ISMLogo,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    height: Dp = 32.dp,
    onDark: Boolean = ISMTheme.colors.isDark,
) {
    Image(
        painter = painterResource(id = logo.res),
        contentDescription = contentDescription,
        modifier = modifier.height(height),
        contentScale = ContentScale.Fit,
        alignment = Alignment.CenterStart,
        colorFilter = if (onDark) ColorFilter.tint(Color.White) else null,
    )
}

@Preview(name = "Logos", showBackground = true, widthDp = 360)
@Composable
private fun ISMLogoImagePreview() {
    ISMPreviewBoard {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            ISMLogoImage(ISMLogo.IsmFull, "International Scripture Ministries home")
            ISMLogoImage(ISMLogo.DotbibleFull, "dot.Bible home", height = 28.dp)
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.padding(top = 4.dp)) {
                ISMLogoImage(ISMLogo.IsmMark, null, height = 40.dp)
                ISMLogoImage(ISMLogo.DotbibleIcon, null, height = 40.dp)
            }
        }
    }
}
