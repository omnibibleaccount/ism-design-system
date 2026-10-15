import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Logo, type LogoProps } from '../Icon';
import { useTheme } from '../theme';

export { Logo } from '../Icon';
export type { LogoProps } from '../Icon';

const MIN_HEIGHT = { 'ism-full': 28, 'ism-mark': 24, 'dotbible-full': 28, 'dotbible-icon': 32 } as const;

export interface LogoOnSurfaceProps extends Omit<LogoProps, 'color'> {
  /** Surface the logo sits on. `light` gives black ink, `dark` gives white ink. Defaults to the theme scheme. */
  surface?: 'light' | 'dark';
  /** Keep the clear space (a quarter of the logo height) around the logo free of other content. @default true */
  clearSpace?: boolean;
  /** Put the dot.Bible icon on a white tile with `radius-md`, as in app tiles. Only applies to `dotbible-icon`. @default false */
  tile?: boolean;
  /** Clamp the height up to the minimum size for the logo (ISM mark 24, dot.Bible icon 32, full logos 28). @default true */
  enforceMinSize?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * A logo with the correct ink for its surface, clear space and the minimum size from the Logos rules.
 * Logos are black or white only: never pass a brand colour. One logo per view.
 * Give `accessibilityLabel` ("International Scripture Ministries", "dot.Bible") when the logo is not next to the name in text.
 */
export function LogoOnSurface({ name, height = 32, surface, clearSpace = true, tile = false, enforceMinSize = true, accessibilityLabel, style, testID }: LogoOnSurfaceProps) {
  const { isDark, radius } = useTheme();
  const dark = (surface ?? (isDark ? 'dark' : 'light')) === 'dark';
  const h = enforceMinSize ? Math.max(height, MIN_HEIGHT[name]) : height;
  const pad = clearSpace ? Math.round(h / 4) : 0;
  const asTile = tile && name === 'dotbible-icon';
  return (
    <View
      testID={testID}
      style={[{ alignSelf: 'flex-start', padding: pad }, asTile ? { backgroundColor: '#ffffff', borderRadius: radius['radius-md'] } : null, style]}
    >
      <Logo name={name} height={h} color={asTile ? '#000000' : dark ? '#ffffff' : '#000000'} accessibilityLabel={accessibilityLabel} />
    </View>
  );
}
