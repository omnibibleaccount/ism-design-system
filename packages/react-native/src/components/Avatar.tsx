import { Children, useState, type ReactNode } from 'react';
import { Image, View, type ImageSourcePropType, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { useTheme } from '../theme';
import { useScript } from './internal';

export type AvatarSize = 24 | 32 | 40 | 56 | 80;
export type AvatarColor = 'blue' | 'violet' | 'gold' | 'ink' | 'peach';
export type AvatarPresence = 'online' | 'away' | 'offline';

const COLORS: AvatarColor[] = ['blue', 'violet', 'gold', 'ink', 'peach'];
const FONT = { 24: 10, 32: 12, 40: 15, 56: 20, 80: 28 } as const;

/** Picks an initials colour from a name so a person always keeps the same one. */
export function avatarColor(name: string): AvatarColor {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

/** One or two uppercase initials from a name. */
export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = Array.from(parts[0])[0] ?? '';
  const last = parts.length > 1 ? Array.from(parts[parts.length - 1])[0] ?? '' : '';
  return (first + last).toUpperCase();
}

export interface AvatarProps extends Omit<ViewProps, 'children'> {
  /** Photo: a URL or an image source. When omitted (or it fails to load) initials or the person icon show. */
  src?: string | ImageSourcePropType;
  /** The person's name. Used for the accessible name and default initials and colour. */
  name?: string;
  /** Override the initials, one or two letters. */
  initials?: string;
  /** Diameter in dp. 40 in list rows, 56 in testimonials, 80 on profiles, 24 to 32 in dense UI. @default 40 */
  size?: AvatarSize;
  /** Initials background. Defaults to a colour picked from `name`. */
  color?: AvatarColor;
  /** The avatar sits beside the person's visible name, so it is hidden from screen readers. @default false */
  decorative?: boolean;
  /** Live presence dot. Only use when presence is real. */
  presence?: AvatarPresence;
  /** Word for the presence state ("away"), added to the accessible name. Never show presence by the dot alone. */
  presenceLabel?: string;
  /** Accessible name of the person-icon fallback when there is no photo or name. @default "No photo" */
  fallbackLabel?: string;
  /** Ring colour around the presence dot and stacked avatars. Defaults to the surface colour. */
  ringColor?: string;
  style?: StyleProp<ViewStyle>;
}

/** Circular picture of a person: photo, initials or person icon, with an optional presence dot. Always circular. */
export function Avatar({ src, name, initials, size = 40, color: tone, decorative = false, presence, presenceLabel, fallbackLabel = 'No photo', ringColor, style, ...rest }: AvatarProps) {
  const { colors } = useTheme();
  const s = useScript();
  const [failed, setFailed] = useState(false);
  const text = initials ?? (name ? avatarInitials(name) : '');
  const label = [name, presence ? presenceLabel : undefined].filter(Boolean).join(', ') || (text ? text : fallbackLabel);
  const palette: Record<AvatarColor, { bg: string; fg: string }> = {
    blue: { bg: color['horizon-blue'], fg: '#ffffff' },
    violet: { bg: color['gradient-violet'], fg: '#ffffff' },
    gold: { bg: color['gradient-gold'], fg: color['charcoal-900'] },
    ink: { bg: color['charcoal-900'], fg: '#ffffff' },
    peach: { bg: color['gradient-peach'], fg: color['charcoal-900'] },
  };
  const photo = src && !failed ? (typeof src === 'string' ? { uri: src } : src) : null;
  const pick = palette[tone ?? avatarColor(name ?? text)];
  const bg = photo ? colors.surfaceMuted : text ? pick.bg : color['gray-200'];
  const dotSize = Math.max(8, Math.round(size * 0.28));
  const dotColor = presence === 'away' ? color['gradient-gold'] : presence === 'offline' ? color['gray-300'] : colors.success;
  const hidden = decorative;
  return (
    <View
      accessible={!hidden}
      accessibilityRole={hidden ? undefined : 'image'}
      accessibilityLabel={hidden ? undefined : label}
      accessibilityElementsHidden={hidden}
      importantForAccessibility={hidden ? 'no-hide-descendants' : 'yes'}
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, style]}
      {...rest}
    >
      <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
        {photo ? (
          <Image source={photo} accessibilityIgnoresInvertColors onError={() => setFailed(true)} style={{ width: size, height: size }} resizeMode="cover" />
        ) : text ? (
          <Text variant="web-label" style={[{ fontSize: FONT[size], lineHeight: FONT[size] * 1.2, color: pick.fg, includeFontPadding: false }, s.weight('600')]} numberOfLines={1}>{text}</Text>
        ) : (
          <UiIcon name="user" size={size >= 56 ? 28 : 16} color={color['gray-600']} />
        )}
      </View>
      {presence ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ position: 'absolute', end: 0, bottom: 0, width: dotSize + 4, height: dotSize + 4, borderRadius: (dotSize + 4) / 2, backgroundColor: dotColor, borderWidth: 2, borderColor: ringColor ?? colors.surface }}
        />
      ) : null}
    </View>
  );
}

export interface AvatarStackProps extends Omit<ViewProps, 'children'> {
  /** One accessible name for the whole stack listing names and the count ("Maria, Dawit and 5 more partners"). */
  accessibilityLabel: string;
  /** Avatars to show; give each `decorative` and the same `size`. */
  children: ReactNode;
  /** Maximum faces before the count tile. Show at most four. @default 4 */
  max?: number;
  /** People not shown, rendered as the "+N" tile. Defaults to the avatars cut by `max`. */
  more?: number;
  /** Size of the stacked avatars and the count tile. @default 40 */
  size?: AvatarSize;
}

/** Overlapping group of avatars (10dp overlap, 2dp ring) with a "+N" count tile. */
export function AvatarStack({ children, max = 4, more, size = 40, accessibilityLabel, style, ...rest }: AvatarStackProps) {
  const { colors, radius } = useTheme();
  const s = useScript();
  const all = Children.toArray(children);
  const shown = all.slice(0, Math.min(max, 4));
  const extra = more ?? Math.max(0, all.length - shown.length);
  const ring = { borderWidth: 2, borderColor: colors.surface, borderRadius: radius['radius-pill'] } as const;
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={[{ flexDirection: 'row', alignSelf: 'flex-start' }, style]} {...rest}>
      {shown.map((child, i) => (
        <View key={i} style={[ring, { marginStart: i === 0 ? 0 : -14 }]}>{child}</View>
      ))}
      {extra > 0 ? (
        <View style={[ring, { marginStart: shown.length ? -14 : 0 }]}>
          <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color['gray-100'], alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="web-label" style={[{ fontSize: size === 32 ? 11 : 13, color: color['charcoal-900'] }, s.weight('600')]}>{`+${extra}`}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
