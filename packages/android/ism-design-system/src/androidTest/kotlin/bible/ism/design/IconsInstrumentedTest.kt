package bible.ism.design

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import bible.ism.design.icons.ISMLogo
import bible.ism.design.icons.ISMMinistryIcon
import bible.ism.design.icons.ISMUIIcon
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Placeholder instrumented test: every generated icon and logo enum entry must point at a real
 * drawable resource, and the bundled fonts must exist. Run with `./gradlew connectedAndroidTest`.
 */
@RunWith(AndroidJUnit4::class)
class IconsInstrumentedTest {
    private val context = InstrumentationRegistry.getInstrumentation().targetContext

    @Test
    fun libraryResourcesAreMerged() {
        assertTrue(R.drawable.ism_ui_check != 0)
        assertTrue(R.color.ism_horizon_blue != 0)
    }

    @Test
    fun uiIconsExist() {
        for (icon in ISMUIIcon.values()) {
            assertTrue("Missing drawable for ${icon.name}", icon.res != 0)
            // Throws Resources.NotFoundException if the id does not resolve.
            context.resources.getResourceName(icon.res)
        }
    }

    @Test
    fun ministryIconsExist() {
        for (icon in ISMMinistryIcon.values()) {
            assertTrue("Missing drawable for ${icon.name}", icon.res != 0)
            context.resources.getResourceName(icon.res)
        }
    }

    @Test
    fun logosExist() {
        for (logo in ISMLogo.values()) {
            assertTrue("Missing drawable for ${logo.name}", logo.res != 0)
            context.resources.getResourceName(logo.res)
        }
    }

    @Test
    fun fontsExist() {
        val fonts = listOf(
            R.font.inter_regular, R.font.inter_medium, R.font.inter_semibold, R.font.inter_bold,
            R.font.lora_regular, R.font.lora_italic, R.font.lora_semibold, R.font.lora_bold,
        )
        for (id in fonts) {
            context.resources.getResourceName(id)
        }
    }
}
