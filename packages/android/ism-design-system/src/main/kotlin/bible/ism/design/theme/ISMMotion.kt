package bible.ism.design.theme

import android.content.Context
import android.database.ContentObserver
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import androidx.compose.animation.core.AnimationSpec
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.platform.LocalContext
import bible.ism.design.tokens.ISMMotion

/**
 * True when the user turned animations off (Developer options "Animator duration scale" = off,
 * or battery saver / accessibility "Remove animations"). ISMTheme provides the live value.
 */
val LocalReducedMotion = staticCompositionLocalOf { false }

/** Reads Settings.Global.ANIMATOR_DURATION_SCALE; a scale of 0 means reduced motion. */
fun ismReducedMotion(context: Context): Boolean = try {
    Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
} catch (e: Throwable) {
    false
}

/** Remembers [ismReducedMotion] and updates when the setting changes. */
@Composable
fun rememberReducedMotion(): Boolean {
    val context = LocalContext.current
    val state = remember(context) { mutableStateOf(ismReducedMotion(context)) }
    DisposableEffect(context) {
        val resolver = context.contentResolver
        val observer = object : ContentObserver(Handler(Looper.getMainLooper())) {
            override fun onChange(selfChange: Boolean) {
                state.value = ismReducedMotion(context)
            }
        }
        try {
            resolver.registerContentObserver(
                Settings.Global.getUriFor(Settings.Global.ANIMATOR_DURATION_SCALE),
                false,
                observer,
            )
        } catch (e: Throwable) {
            // Not available (for example in a preview): keep the initial value.
        }
        onDispose {
            try {
                resolver.unregisterContentObserver(observer)
            } catch (e: Throwable) {
                // ignore
            }
        }
    }
    val reduced by state
    return reduced
}

/**
 * Standard ISM animation spec: [durationMillis] with the standard ease, or an instant snap when
 * reduced motion is on. Use for every colour, size and position change.
 */
@Composable
fun <T> ismAnimationSpec(durationMillis: Int = ISMMotion.durationFast): AnimationSpec<T> {
    val reduced = LocalReducedMotion.current
    return if (reduced) {
        snap<T>()
    } else {
        tween<T>(durationMillis = durationMillis, easing = ISMMotion.easeStandard)
    }
}
