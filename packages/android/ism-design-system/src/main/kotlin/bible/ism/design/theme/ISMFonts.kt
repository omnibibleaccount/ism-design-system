package bible.ism.design.theme

import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import bible.ism.design.R

/** Inter: UI text. Weights 400, 500, 600, 700 (bundled in res/font). */
val ISMInter: FontFamily = FontFamily(
    Font(R.font.inter_regular, FontWeight.Normal),
    Font(R.font.inter_medium, FontWeight.Medium),
    Font(R.font.inter_semibold, FontWeight.SemiBold),
    Font(R.font.inter_bold, FontWeight.Bold),
)

/** Lora: Bible text and quotes. Never used for UI copy. */
val ISMLora: FontFamily = FontFamily(
    Font(R.font.lora_regular, FontWeight.Normal),
    Font(R.font.lora_italic, FontWeight.Normal, FontStyle.Italic),
    Font(R.font.lora_semibold, FontWeight.SemiBold),
    Font(R.font.lora_semibold_italic, FontWeight.SemiBold, FontStyle.Italic),
    Font(R.font.lora_bold, FontWeight.Bold),
    Font(R.font.lora_bold_italic, FontWeight.Bold, FontStyle.Italic),
)
