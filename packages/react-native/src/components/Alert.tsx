import { type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<ViewProps, 'children'> {
  /** Status. Never restyle colours per screen. @default "info" */
  variant?: AlertVariant;
  /** Bold title saying what happened. Omit for a compact one-line alert. */
  title?: string;
  /** The sentence that says what to do next. */
  children?: ReactNode;
  /** At most one text link (no buttons inside an alert). */
  link?: { label: string; onPress: () => void; accessibilityHint?: string };
  /** One line, no title, 14dp text. @default false */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ICON: Record<AlertVariant, UiIconProps['name']> = {
  info: 'info', success: 'check-circle', warning: 'alert-triangle', error: 'alert-circle',
};

/** Inline status banner: icon, bold title, one sentence and an optional link. Errors are announced assertively, the rest politely. */
export function Alert({ variant = 'info', title, children, link, compact = false, style, ...rest }: AlertProps) {
  const { colors, radius } = useTheme();
  const palette = {
    info: { fg: colors.info, bg: colors.infoBg, line: colors.infoLine },
    success: { fg: colors.success, bg: colors.successBg, line: colors.successLine },
    warning: { fg: colors.warning, bg: colors.warningBg, line: colors.warningLine },
    error: { fg: colors.error, bg: colors.errorBg, line: colors.errorLine },
  }[variant];
  const isError = variant === 'error';
  return (
    <View
      accessible
      accessibilityRole={isError ? 'alert' : undefined}
      accessibilityLiveRegion={isError ? 'assertive' : 'polite'}
      style={[
        {
          flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: compact ? 12 : 16, paddingHorizontal: 18,
          borderRadius: radius['radius-md'], borderWidth: 1, backgroundColor: palette.bg, borderColor: palette.line,
        },
        style,
      ]}
      {...rest}
    >
      <View style={{ marginTop: 1 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <UiIcon name={ICON[variant]} size={20} color={palette.fg} />
      </View>
      <View style={{ flex: 1 }}>
        {title && !compact ? <Text variant="web-label" style={{ color: palette.fg, fontSize: 16, lineHeight: 22, marginBottom: 2 }}>{title}</Text> : null}
        {children ? <Text variant="web-small" style={{ color: palette.fg, fontSize: compact ? 14 : 15, lineHeight: compact ? 20 : 22 }}>{children}</Text> : null}
        {link ? (
          <Pressable
            accessibilityRole="link" accessibilityHint={link.accessibilityHint} onPress={link.onPress}
            hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} style={{ alignSelf: 'flex-start', marginTop: 4, minHeight: 20 }}
          >
            <Text variant="web-label" style={{ color: palette.fg, fontSize: 15, textDecorationLine: 'underline' }}>{link.label}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export interface AnnouncementBarProps extends Omit<ViewProps, 'children'> {
  /** One short fact. */
  message: string;
  /** One link. `external` adds the ↗ glyph for links that leave the screen. */
  link?: { label: string; onPress: () => void; external?: boolean };
  /** Shows the close button. Remember the dismissal for the session in your app. */
  onDismiss?: () => void;
  /** Accessible name of the region. @default "Announcement" */
  regionLabel?: string;
  /** Accessible name of the close button. @default "Dismiss announcement" */
  dismissLabel?: string;
  /** Square corners for a full-bleed bar above the header. @default true */
  flush?: boolean;
}

/** Dark, dismissible 48dp announcement bar for one site-wide message. */
export function AnnouncementBar({ message, link, onDismiss, regionLabel = 'Announcement', dismissLabel = 'Dismiss announcement', flush = true, style, ...rest }: AnnouncementBarProps) {
  const { radius, isDark } = useTheme();
  return (
    <View
      accessible={false} accessibilityLabel={regionLabel}
      style={[
        {
          minHeight: 48, paddingVertical: 4, paddingHorizontal: 56, backgroundColor: color['charcoal-900'], alignItems: 'center', justifyContent: 'center',
          borderRadius: flush ? 0 : radius['radius-md'], overflow: 'hidden', borderWidth: isDark ? 1 : 0, borderColor: color['charcoal-700'],
        },
        style,
      ]}
      {...rest}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: 16, rowGap: 4 }}>
        <Text variant="web-small" style={{ color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>{message}</Text>
        {link ? (
          <Pressable accessibilityRole="link" onPress={link.onPress} hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text variant="web-label" style={{ color: color['blue-on-dark'], fontSize: 15 }}>{link.label}</Text>
            {link.external ? <UiIcon name="arrow-up-right" size={16} color={color['blue-on-dark']} /> : null}
          </Pressable>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button" accessibilityLabel={dismissLabel} onPress={onDismiss}
          style={({ pressed }) => ({
            position: 'absolute', end: 4, top: 2, width: 44, height: 44, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
            backgroundColor: pressed ? 'rgba(255,255,255,0.08)' : 'transparent',
          })}
        >
          <UiIcon name="close" size={20} color="rgba(255,255,255,0.75)" />
        </Pressable>
      ) : null}
      <View pointerEvents="none" style={{ position: 'absolute', start: 0, end: 0, bottom: 0, height: 2, backgroundColor: color['horizon-blue'] }} />
    </View>
  );
}
