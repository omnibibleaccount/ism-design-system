package bible.ism.design.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.unit.dp
import bible.ism.design.tokens.ISMRadius

/** Corner shapes from the radius tokens. */
object ISMShapes {
    val xs = RoundedCornerShape(ISMRadius.radiusXs)
    val sm = RoundedCornerShape(ISMRadius.radiusSm)
    val md = RoundedCornerShape(ISMRadius.radiusMd)
    val ml = RoundedCornerShape(ISMRadius.radiusMl)
    val lg = RoundedCornerShape(ISMRadius.radiusLg)
    val xl = RoundedCornerShape(ISMRadius.radiusXl)
    /** Buttons, chips, badges, search fields: fully rounded ends at any height. */
    val pill = RoundedCornerShape(percent = 50)
    /** Bottom sheets: rounded top corners only. */
    val sheet = RoundedCornerShape(
        topStart = ISMRadius.radiusXl,
        topEnd = ISMRadius.radiusXl,
        bottomEnd = 0.dp,
        bottomStart = 0.dp,
    )
}
