package bible.ism.design.theme

import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import bible.ism.design.tokens.ISMTextRole
import bible.ism.design.tokens.ISMType

/** Converts a generated [ISMTextRole] token into a Compose [TextStyle] (serif roles use Lora). */
fun ISMTextRole.toTextStyle(): TextStyle = TextStyle(
    fontFamily = if (serif) ISMLora else ISMInter,
    fontSize = fontSize,
    lineHeight = lineHeight,
    fontWeight = fontWeight,
    letterSpacing = letterSpacing,
    fontStyle = if (italic) FontStyle.Italic else FontStyle.Normal,
)

/**
 * Typography roles. The first block is the native app scale taken from the .ap-* classes in
 * packages/web/css/bundle.css (16px body, 17/600 bar title, 32/600 large title). The second
 * block re-exports the web/print roles from tokens.json for marketing-style screens.
 */
@Immutable
class ISMTypography(
    // App scale
    val largeTitle: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 32.sp, lineHeight = 36.8.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = (-0.025).em,
    ),
    val title: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 22.sp, lineHeight = 26.4.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = (-0.02).em,
    ),
    val sheetTitle: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 20.sp, lineHeight = 26.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = (-0.015).em,
    ),
    val headline: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 17.sp, lineHeight = 22.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = (-0.01).em,
    ),
    val body: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 16.sp, lineHeight = 23.2.sp,
        fontWeight = FontWeight.Normal,
    ),
    val bodyMedium: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 16.sp, lineHeight = 23.2.sp,
        fontWeight = FontWeight.Medium,
    ),
    val callout: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 15.sp, lineHeight = 21.sp,
        fontWeight = FontWeight.Normal,
    ),
    val subhead: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 14.sp, lineHeight = 20.sp,
        fontWeight = FontWeight.Normal,
    ),
    val footnote: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 13.sp, lineHeight = 18.sp,
        fontWeight = FontWeight.Normal,
    ),
    val label: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 14.sp, lineHeight = 18.2.sp,
        fontWeight = FontWeight.SemiBold,
    ),
    val button: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 16.sp, lineHeight = 20.sp,
        fontWeight = FontWeight.SemiBold,
    ),
    val overline: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 12.sp, lineHeight = 14.4.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = 0.06.em,
    ),
    val tabLabel: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 11.sp, lineHeight = 14.sp,
        fontWeight = FontWeight.SemiBold, letterSpacing = 0.01.em,
    ),
    val verseReference: TextStyle = TextStyle(
        fontFamily = ISMInter, fontSize = 13.sp, lineHeight = 18.sp,
        fontWeight = FontWeight.SemiBold,
    ),
    /** Bible text in an app card (.ap-verse 17px / 1.55, Lora). */
    val verse: TextStyle = TextStyle(
        fontFamily = ISMLora, fontSize = 17.sp, lineHeight = 26.35.sp,
        fontWeight = FontWeight.Normal,
    ),
    // Web and print roles from tokens.json
    val webH1: TextStyle = ISMType.webH1.toTextStyle(),
    val webH2: TextStyle = ISMType.webH2.toTextStyle(),
    val webH3: TextStyle = ISMType.webH3.toTextStyle(),
    val webH4: TextStyle = ISMType.webH4.toTextStyle(),
    val webLead: TextStyle = ISMType.webLead.toTextStyle(),
    val webBody: TextStyle = ISMType.webBody.toTextStyle(),
    val webSmall: TextStyle = ISMType.webSmall.toTextStyle(),
    val scripture: TextStyle = ISMType.scripture.toTextStyle(),
    val pullQuote: TextStyle = ISMType.pullQuote.toTextStyle(),
)

val LocalISMTypography = staticCompositionLocalOf { ISMTypography() }
