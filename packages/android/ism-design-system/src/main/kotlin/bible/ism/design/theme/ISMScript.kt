package bible.ism.design.theme

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.intl.LocaleList
import androidx.compose.ui.text.style.TextDirection
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import bible.ism.design.tokens.ISMScript
import bible.ism.design.tokens.ISMScripts

/**
 * Per-script typography rules from rules/multilingual-rtl.md.
 * Pure Kotlin (no Compose state), so it is unit-testable on the JVM.
 */
object ISMScriptTypography {
    private fun primarySubtag(lang: String): String =
        lang.trim().lowercase().substringBefore('-').substringBefore('_')

    /** The [ISMScript] for a BCP-47 tag; Latin when unknown. */
    fun scriptFor(lang: String): ISMScript {
        val tag = primarySubtag(lang)
        return ISMScripts.all.firstOrNull { it.languages.contains(tag) } ?: ISMScripts.all.first()
    }

    fun isLatin(lang: String): Boolean = scriptFor(lang).id == "latin"

    /** True for ar, fa, ur (script table) and he. */
    fun isRtl(lang: String): Boolean {
        val tag = primarySubtag(lang)
        return tag == "he" || scriptFor(lang).rtl
    }

    /** Line-height multiplier for the script. Body: am/ti 1.65, my 1.9, ar/fa/ur 1.9, Latin 1.5. */
    fun lineHeightMultiplier(lang: String, heading: Boolean = false): Float {
        val script = scriptFor(lang)
        return if (heading) script.lineHeightHeading else script.lineHeightBody
    }
}

/**
 * Applies the script rules to a [TextStyle]: language tag, text direction, and for Ethiopic,
 * Myanmar and Arabic script a taller line-height, zero letter-spacing and no italics.
 * Latin text keeps the line-height of [this] style.
 */
fun TextStyle.forLanguage(lang: String, heading: Boolean = false): TextStyle {
    val withLocale = if (lang.isBlank()) this else copy(localeList = LocaleList(lang))
    val directed = if (ISMScriptTypography.isRtl(lang)) {
        withLocale.copy(textDirection = TextDirection.Rtl)
    } else {
        withLocale
    }
    if (ISMScriptTypography.isLatin(lang)) return directed
    val multiplier = ISMScriptTypography.lineHeightMultiplier(lang, heading)
    return directed.copy(
        lineHeight = (fontSize.value * multiplier).sp,
        letterSpacing = 0.em,
        fontStyle = FontStyle.Normal,
    )
}
