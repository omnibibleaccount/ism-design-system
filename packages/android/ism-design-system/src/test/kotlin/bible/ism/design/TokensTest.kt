package bible.ism.design

import androidx.compose.ui.graphics.toArgb
import bible.ism.design.theme.ISMScriptTypography
import bible.ism.design.theme.darkISMColors
import bible.ism.design.theme.lightISMColors
import bible.ism.design.tokens.ISMColors
import bible.ism.design.tokens.ISMLayout
import bible.ism.design.tokens.ISMMotion
import bible.ism.design.tokens.ISMOpacity
import bible.ism.design.tokens.ISMRadius
import bible.ism.design.tokens.ISMScripts
import bible.ism.design.tokens.ISMSize
import bible.ism.design.tokens.ISMSpacing
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** JVM tests for generated token constants and the pure theme helpers. */
class TokensTest {

    @Test
    fun horizonBlueIsTheActionColour() {
        assertEquals(0xFF046DE3.toInt(), ISMColors.horizonBlue.toArgb())
        assertEquals(ISMColors.horizonBlue.toArgb(), ISMColors.actionPrimary.toArgb())
    }

    @Test
    fun tapTargetIs44() {
        assertEquals(44f, ISMLayout.tapTarget.value, 0f)
        assertEquals(44f, ISMSize.controlMd.value, 0f)
        assertEquals(36f, ISMSize.controlSm.value, 0f)
        assertEquals(52f, ISMSize.controlLg.value, 0f)
        assertEquals(48f, ISMSize.field.value, 0f)
    }

    @Test
    fun spacingScaleStartsAtFour() {
        assertEquals(4f, ISMSpacing.space1.value, 0f)
        assertEquals(16f, ISMSpacing.space4.value, 0f)
        assertEquals(24f, ISMSpacing.space5.value, 0f)
    }

    @Test
    fun radiiMatchTheScale() {
        assertEquals(12f, ISMRadius.radiusMd.value, 0f)
        assertEquals(20f, ISMRadius.radiusLg.value, 0f)
        assertEquals(999f, ISMRadius.radiusPill.value, 0f)
    }

    @Test
    fun disabledOpacityIs45Percent() {
        assertEquals(0.45f, ISMOpacity.opacityDisabled, 0f)
    }

    @Test
    fun motionDurations() {
        assertEquals(150, ISMMotion.durationFast)
        assertEquals(800, ISMMotion.durationSpin)
    }

    @Test
    fun lightAndDarkSemanticSetsDiffer() {
        val light = lightISMColors()
        val dark = darkISMColors()
        assertFalse(light.isDark)
        assertTrue(dark.isDark)
        assertEquals(ISMColors.offWhite.toArgb(), light.background.toArgb())
        assertEquals(ISMColors.black.toArgb(), dark.background.toArgb())
        // Blue text on dark uses blue-on-dark, never Horizon Blue (rules/accessibility.md).
        assertEquals(ISMColors.blueOnDark.toArgb(), dark.link.toArgb())
        assertEquals(ISMColors.horizonBlue.toArgb(), light.link.toArgb())
        // The primary button fill is the same on both.
        assertEquals(light.action.toArgb(), dark.action.toArgb())
    }

    @Test
    fun scriptLineHeights() {
        assertEquals(1.5f, ISMScriptTypography.lineHeightMultiplier("en"), 0f)
        assertEquals(1.65f, ISMScriptTypography.lineHeightMultiplier("am"), 0f)
        assertEquals(1.65f, ISMScriptTypography.lineHeightMultiplier("ti"), 0f)
        assertEquals(1.9f, ISMScriptTypography.lineHeightMultiplier("my"), 0f)
        assertEquals(1.9f, ISMScriptTypography.lineHeightMultiplier("ar"), 0f)
        assertEquals(1.9f, ISMScriptTypography.lineHeightMultiplier("fa-IR"), 0f)
        assertEquals(1.9f, ISMScriptTypography.lineHeightMultiplier("ur"), 0f)
        assertEquals(1.4f, ISMScriptTypography.lineHeightMultiplier("ar", heading = true), 0f)
    }

    @Test
    fun rtlLanguages() {
        assertTrue(ISMScriptTypography.isRtl("ar"))
        assertTrue(ISMScriptTypography.isRtl("fa"))
        assertTrue(ISMScriptTypography.isRtl("ur-PK"))
        assertTrue(ISMScriptTypography.isRtl("he"))
        assertFalse(ISMScriptTypography.isRtl("en"))
        assertFalse(ISMScriptTypography.isRtl("am"))
        assertFalse(ISMScriptTypography.isRtl("my"))
    }

    @Test
    fun unknownLanguageFallsBackToLatin() {
        assertTrue(ISMScriptTypography.isLatin("xx"))
        assertEquals(4, ISMScripts.all.size)
    }
}
