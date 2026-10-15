import { useState, type ReactNode } from 'react';
import { Image, Linking, Pressable, View, type ImageSourcePropType, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme';
import { Text } from '../Text';

export type StoreBadgeSize = 'md' | 'sm';
export type StoreName = 'appStore' | 'googlePlay';

/** Visible and accessible strings for the badges. Override for other languages. */
export interface StoreBadgeLabels {
  /** @default "Download on the" */
  appStoreLine1: string;
  /** @default "App Store" */
  appStoreLine2: string;
  /** Accessible name. @default "Download dot.Bible on the App Store" */
  appStoreAccessibilityLabel: string;
  /** @default "Get it on" */
  googlePlayLine1: string;
  /** @default "Google Play" */
  googlePlayLine2: string;
  /** Accessible name. @default "Get dot.Bible on Google Play" */
  googlePlayAccessibilityLabel: string;
}

/** English defaults. */
export const defaultStoreBadgeLabels: StoreBadgeLabels = {
  appStoreLine1: 'Download on the',
  appStoreLine2: 'App Store',
  appStoreAccessibilityLabel: 'Download dot.Bible on the App Store',
  googlePlayLine1: 'Get it on',
  googlePlayLine2: 'Google Play',
  googlePlayAccessibilityLabel: 'Get dot.Bible on Google Play',
};

const APPLE_PATH = 'M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.8.8 3.1.7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.5-3.9zM14.1 5.8c.6-.8 1.1-1.9.9-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z';

export interface StoreBadgeProps {
  /** Which store this badge opens. */
  store: StoreName;
  /** Store page URL, opened with `Linking.openURL` when `onPress` is not given. */
  url?: string;
  /** Overrides opening `url`. */
  onPress?: () => void;
  /** `md` is 52dp tall, `sm` is 44dp (never smaller). @default "md" */
  size?: StoreBadgeSize;
  /** On a dark section: adds the white 40% border. Also applied automatically in dark mode. @default false */
  onDark?: boolean;
  /** Replace the drawn glyph with your own image. Decorative. */
  icon?: ImageSourcePropType;
  /** Override badge text and accessible name. */
  labels?: Partial<StoreBadgeLabels>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** One black store badge. Always black with white text; do not restyle as a blue button. */
export function StoreBadge({ store, url, onPress, size = 'md', onDark = false, icon, labels, style, testID }: StoreBadgeProps) {
  const { radius, isDark } = useTheme();
  const [focus, setFocus] = useState(false);
  const l = { ...defaultStoreBadgeLabels, ...labels };
  const apple = store === 'appStore';
  const sm = size === 'sm';
  const glyph = sm ? 24 : 26;
  const light = onDark || isDark;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={apple ? l.appStoreAccessibilityLabel : l.googlePlayAccessibilityLabel}
      onPress={onPress ?? (url ? () => { void Linking.openURL(url); } : undefined)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      testID={testID}
      style={({ pressed }) => [
        {
          flexDirection: 'row', alignItems: 'center', gap: 10, height: sm ? 44 : 52, minWidth: sm ? 150 : 172, paddingStart: sm ? 12 : 14, paddingEnd: sm ? 16 : 20, borderRadius: sm ? radius['radius-sm'] : radius['radius-md'],
          backgroundColor: pressed ? '#232527' : '#000000', borderWidth: 1, borderColor: light ? (pressed ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)') : pressed ? '#232527' : '#000000',
          ...(focus ? { outlineColor: '#046de3', outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' as const } : null),
        } as ViewStyle,
        style,
      ]}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {icon ? (
          <Image source={icon} style={{ width: glyph, height: glyph }} resizeMode="contain" accessibilityIgnoresInvertColors />
        ) : apple ? (
          <Svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="#ffffff"><Path d={APPLE_PATH} /></Svg>
        ) : (
          <Svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} strokeLinejoin="round"><Path d="M5 3l14 9-14 9z" /></Svg>
        )}
      </View>
      <View>
        <Text variant="body-sm" style={{ fontSize: sm ? 10 : 11, lineHeight: sm ? 11 : 12, fontWeight: '500', letterSpacing: 0.11, color: 'rgba(255,255,255,0.85)' }}>{apple ? l.appStoreLine1 : l.googlePlayLine1}</Text>
        <Text variant="web-label" style={{ fontSize: sm ? 16 : 18, lineHeight: sm ? 18 : 21, letterSpacing: -0.18, color: '#ffffff' }}>{apple ? l.appStoreLine2 : l.googlePlayLine2}</Text>
      </View>
    </Pressable>
  );
}

export interface StoreBadgesProps extends ViewProps {
  /** App Store URL. */
  appStoreUrl?: string;
  /** Google Play URL. */
  playStoreUrl?: string;
  /** Overrides opening `appStoreUrl`. */
  onPressAppStore?: () => void;
  /** Overrides opening `playStoreUrl`. */
  onPressGooglePlay?: () => void;
  /** `sm` is the size used beside a QR code. @default "md" */
  size?: StoreBadgeSize;
  /** On a dark section. @default false */
  onDark?: boolean;
  /** Custom glyphs, e.g. bundled images. Decorative. */
  icons?: { appStore?: ImageSourcePropType; googlePlay?: ImageSourcePropType };
  /** Override badge text and accessible names. */
  labels?: Partial<StoreBadgeLabels>;
  /** QR code element for desktop, drawn on a white tile beside the prompt and badges. Show only on desktop and tablets. */
  qr?: ReactNode;
  /** Accessible name of the QR. @default "QR code to download dot.Bible" */
  qrLabel?: string;
  /** Prompt next to the QR: "Scan to get dot.Bible on your phone". */
  qrPrompt?: string;
  style?: StyleProp<ViewStyle>;
}

/** App Store then Google Play badges from props, same size, 12dp apart; optional QR combo for desktop. No remote images needed. */
export function StoreBadges({
  appStoreUrl, playStoreUrl, onPressAppStore, onPressGooglePlay, size, onDark = false, icons, labels, qr, qrLabel = 'QR code to download dot.Bible', qrPrompt, style, ...rest
}: StoreBadgesProps) {
  const { colors, radius, spacing } = useTheme();
  const badgeSize = size ?? (qr ? 'sm' : 'md');
  const badges = (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing['space-3'] }}>
      {appStoreUrl || onPressAppStore ? <StoreBadge store="appStore" url={appStoreUrl} onPress={onPressAppStore} size={badgeSize} onDark={onDark} icon={icons?.appStore} labels={labels} /> : null}
      {playStoreUrl || onPressGooglePlay ? <StoreBadge store="googlePlay" url={playStoreUrl} onPress={onPressGooglePlay} size={badgeSize} onDark={onDark} icon={icons?.googlePlay} labels={labels} /> : null}
    </View>
  );
  if (!qr) return <View {...rest} style={style}>{badges}</View>;
  return (
    <View {...rest} style={[{ flexDirection: 'row', alignItems: 'center', gap: spacing['space-5'] }, style]}>
      <View accessible accessibilityRole="image" accessibilityLabel={qrLabel} style={{ width: 112, height: 112, padding: 6, borderRadius: radius['radius-sm'], backgroundColor: '#ffffff', borderWidth: 1, borderColor: colors.border }}>{qr}</View>
      <View style={{ flex: 1, minWidth: 0, gap: spacing['space-3'] }}>
        {qrPrompt ? <Text variant="web-body" tone={onDark ? 'inverse' : 'primary'} style={{ fontSize: 16, color: onDark ? '#ffffff' : undefined }}>{qrPrompt}</Text> : null}
        {badges}
      </View>
    </View>
  );
}
