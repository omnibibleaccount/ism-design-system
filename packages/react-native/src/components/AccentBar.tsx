import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { GradientFill, type GradientComponent } from './Divider';

export interface AccentBarProps extends Omit<ViewProps, 'children'> {
  /** Fraction filled, 0 to 1. @default 0.4 */
  progress?: number;
  /** Track width in dp, or a percentage such as "100%". @default 200 */
  width?: number | `${number}%`;
  /** Light track (`rgba(0,0,0,.12)`) for white or off-white surfaces. The default track (`rgba(255,255,255,.18)`) is for dark surfaces. @default false */
  light?: boolean;
  /**
   * Names what is progressing ("John 3 read"). When given the bar is exposed as a progressbar with its value;
   * without it the bar is hidden from screen readers, so show the value in text beside it.
   */
  label?: string;
  /**
   * Gradient view such as `LinearGradient` from expo-linear-gradient or react-native-linear-gradient. The fill is `gradient-signature`.
   * Without it the fill is a solid `gradient-violet` colour (never Horizon Blue).
   */
  GradientComponent?: GradientComponent;
  style?: StyleProp<ViewStyle>;
}

/** 3dp passive progress line with a gradient fill. Not for uploads or form steps; use Progress. Do not animate on load. */
export function AccentBar({ progress = 0.4, width = 200, light = false, label, GradientComponent: Gradient, style, ...rest }: AccentBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const a11y = label
    ? { accessible: true, accessibilityRole: 'progressbar' as const, accessibilityLabel: label, accessibilityValue: { min: 0, max: 100, now: pct } }
    : { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const };
  return (
    <View
      {...a11y}
      style={[{ width, height: 3, borderRadius: 2, overflow: 'hidden', backgroundColor: light ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.18)' }, style]}
      {...rest}
    >
      <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, width: `${pct}%`, borderRadius: 2, overflow: 'hidden' }}>
        <GradientFill token="gradient-signature" GradientComponent={Gradient} style={{ flex: 1 }} />
      </View>
    </View>
  );
}
