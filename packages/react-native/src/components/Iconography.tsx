import { View, type StyleProp, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { UiIcon, MinistryIcon } from '../Icon';
import type { UiIconName, MinistryIconName } from '@ism/tokens/icons-all';
import { useTheme } from '../theme';

export { UiIcon, MinistryIcon } from '../Icon';
export type { UiIconProps, MinistryIconProps } from '../Icon';

interface IconTileBase {
  /** `blue` is the default tile (blue tint); `gold` is the second leading style. One style per group. @default "blue" */
  tone?: 'blue' | 'gold';
  /** Tile edge in dp. 40 matches list rows. @default 40 */
  size?: number;
  /** Accessible label. Leave empty when the tile sits beside a visible title (it is then hidden from screen readers). */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
export type IconTileProps = IconTileBase &
  ({ /** UI line icon (default set). */ set?: 'ui'; /** Icon name. */ name: UiIconName } | { /** Filled ministry icon. */ set: 'ministry'; /** Icon name. */ name: MinistryIconName });

/**
 * An icon inside a tinted tile (`radius-md`, 40dp) as used for leading icons in list rows and feature lists.
 * Do not mix UI line icons and ministry icons in one row of tiles.
 */
export function IconTile(props: IconTileProps) {
  const { tone = 'blue', size = 40, accessibilityLabel, style, testID } = props;
  const { isDark, colors, radius } = useTheme();
  const bg = tone === 'gold' ? (isDark ? colors.warningBg : color['gold-tint']) : colors.tint;
  const fg = tone === 'gold' ? colors.warning : isDark ? color['blue-on-dark'] : color['horizon-blue-dim'];
  const inner = Math.round(size * 0.5);
  return (
    <View
      testID={testID}
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}
      style={[{ width: size, height: size, borderRadius: radius['radius-md'], backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      {props.set === 'ministry' ? <MinistryIcon name={props.name} size={Math.max(24, inner)} color={fg} /> : <UiIcon name={props.name} size={inner >= 24 ? 24 : 20} color={fg} />}
    </View>
  );
}
