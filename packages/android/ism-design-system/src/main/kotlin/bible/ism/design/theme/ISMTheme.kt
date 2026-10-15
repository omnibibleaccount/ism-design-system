package bible.ism.design.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.remember
import bible.ism.design.tokens.ISMSpacing

/**
 * Entry point. Wrap your app (or a preview) once:
 *
 * ```
 * ISMTheme { MyScreen() }
 * ```
 *
 * It provides [LocalISMColors], [LocalISMTypography], [LocalReducedMotion], and bridges the
 * same colours into MaterialTheme so Material3 parts (SnackbarHost, Text, Icon) match.
 */
@Composable
fun ISMTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = remember(darkTheme) { if (darkTheme) darkISMColors() else lightISMColors() }
    val typography = remember { ISMTypography() }
    val reducedMotion = rememberReducedMotion()
    val materialScheme = remember(colors) {
        if (darkTheme) {
            darkColorScheme(
                primary = colors.action,
                onPrimary = colors.onAction,
                background = colors.background,
                onBackground = colors.textPrimary,
                surface = colors.surface,
                onSurface = colors.textPrimary,
                error = colors.error,
                outline = colors.fieldBorder,
            )
        } else {
            lightColorScheme(
                primary = colors.action,
                onPrimary = colors.onAction,
                background = colors.background,
                onBackground = colors.textPrimary,
                surface = colors.surface,
                onSurface = colors.textPrimary,
                error = colors.error,
                outline = colors.fieldBorder,
            )
        }
    }
    MaterialTheme(colorScheme = materialScheme) {
        CompositionLocalProvider(
            LocalISMColors provides colors,
            LocalISMTypography provides typography,
            LocalReducedMotion provides reducedMotion,
            LocalContentColor provides colors.textPrimary,
            LocalTextStyle provides typography.body,
        ) {
            content()
        }
    }
}

/** Accessors: `ISMTheme.colors.action`, `ISMTheme.typography.body`. */
object ISMTheme {
    val colors: ISMSemanticColors
        @Composable
        @ReadOnlyComposable
        get() = LocalISMColors.current

    val typography: ISMTypography
        @Composable
        @ReadOnlyComposable
        get() = LocalISMTypography.current

    val shapes: ISMShapes
        get() = ISMShapes

    val spacing: ISMSpacing
        get() = ISMSpacing
}
