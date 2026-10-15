import { View, type StyleProp, type ViewStyle } from 'react-native';
import { color, tracking } from '@ism/tokens/native';
import { Text, type TextProps } from '../Text';
import { useTheme } from '../theme';
import { useScript } from './internal';

export interface EyebrowProps extends Omit<TextProps, 'variant' | 'tone' | 'style'> {
  /** One to three words ("About ISM"). Write in normal case; it is uppercased for Latin script only. */
  children: string;
  /** Force the on-dark colours (website `.sec-ink` sections). Defaults to the theme scheme. */
  onDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Website section label: 12dp semibold uppercase in a thin blue square-cornered frame. One per section or card.
 * Decorative context; the headline must make sense without it. For app lists use `Overline`.
 */
export function Eyebrow({ children, onDark, style, lang, ...rest }: EyebrowProps) {
  const { isDark } = useTheme();
  const s = useScript(lang);
  const dark = onDark ?? isDark;
  return (
    <View
      style={[{ alignSelf: 'flex-start', paddingVertical: 7, paddingHorizontal: 12, borderWidth: 1, borderRadius: 0, borderColor: dark ? 'rgba(111,150,245,0.7)' : 'rgba(4,109,227,0.55)', backgroundColor: dark ? 'rgba(255,255,255,0.06)' : 'transparent' }, style]}
    >
      <Text variant="web-eyebrow" lang={lang} style={[s.upper, s.tracking(tracking['eyebrow-tracking'], 12), { color: dark ? color['blue-on-dark'] : color['horizon-blue-dim'] }]} {...rest}>{children}</Text>
    </View>
  );
}

export interface OverlineProps extends Omit<TextProps, 'variant' | 'tone'> {
  /** Names a group of rows, a menu or a table ("Reading", "More from ISM"). */
  children: string;
  /** Force the on-dark colour. Defaults to the theme scheme. */
  onDark?: boolean;
}

/** Quiet 12dp uppercase heading for a list, menu, table or form group. Sits 8dp above its list. */
export function Overline({ children, onDark, style, lang, ...rest }: OverlineProps) {
  const { isDark, colors } = useTheme();
  const s = useScript(lang);
  const dark = onDark ?? isDark;
  return (
    <Text variant="web-overline" lang={lang} style={[s.upper, s.tracking(tracking['overline-tracking'], 12), { color: dark ? colors.textTertiary : color['gray-600'] }, style]} {...rest}>
      {children}
    </Text>
  );
}
