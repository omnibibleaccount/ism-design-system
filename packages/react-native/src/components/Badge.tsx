import { forwardRef, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color, tracking } from '@ism/tokens/native';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { useTheme } from '../theme';
import { FocusRing, useFocus, useScript } from './internal';

/* ---------- Section tag (React `Badge`) ---------- */

export type BadgeTone = 'outlineDark' | 'outlineLight' | 'solidBlue' | 'accentText';

export interface BadgeProps extends ViewProps {
  /** `outlineDark` on dark, `outlineLight` on light, `solidBlue` filled, `accentText` blue text with no border. @default "outlineDark" */
  tone?: BadgeTone;
  /** The label; rendered uppercase for Latin script. Short and warm: "Trending", "You're almost done!". */
  children: string;
  style?: StyleProp<ViewStyle>;
}

/** Section or promo tag in a thin outlined pill. A label, not a button; use Chip for toggles. */
export function Badge({ tone = 'outlineDark', children, style, ...rest }: BadgeProps) {
  const { radius, colors } = useTheme();
  const s = useScript();
  const t = {
    outlineDark: { fg: '#ffffff', bg: 'transparent', border: 'rgba(255,255,255,0.4)' },
    outlineLight: { fg: '#000000', bg: 'transparent', border: 'rgba(0,0,0,0.28)' },
    solidBlue: { fg: '#ffffff', bg: color['horizon-blue'], border: color['horizon-blue'] },
    accentText: { fg: colors.link, bg: 'transparent', border: 'transparent' },
  }[tone];
  return (
    <View
      style={[{ alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: tone === 'accentText' ? 0 : 14, borderRadius: radius['radius-pill'], borderWidth: 1, backgroundColor: t.bg, borderColor: t.border }, style]}
      {...rest}
    >
      <Text variant="web-eyebrow" numberOfLines={1} style={[s.upper, s.tracking(tracking['eyebrow-tracking'], 12), { color: t.fg }]}>{children}</Text>
    </View>
  );
}

/* ---------- Status badge (.badge) ---------- */

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'gold' | 'partner';
export type StatusSize = 'sm' | 'md';

export interface StatusBadgeProps extends ViewProps {
  /** Status colour. Use only for status and always with a word. @default "neutral" */
  tone?: StatusTone;
  /** Solid fill instead of the subtle tint. @default false */
  solid?: boolean;
  /** `sm` is 24dp with 12dp text (data tables); `md` is 28dp. Omit for the default 24dp with 13dp text. */
  size?: StatusSize;
  /** Leading dot. @default false */
  dot?: boolean;
  /** Leading live (on-air) dot in `--live`. The only use of that colour. @default false */
  live?: boolean;
  /** One word: Draft, New, Live, Pending, Failed, Partner. */
  children: string;
  style?: StyleProp<ViewStyle>;
}

/** Status label shown beside data. Text, not a button; screen readers read the word as is. */
export function StatusBadge({ tone = 'neutral', solid = false, size, dot = false, live = false, children, style, ...rest }: StatusBadgeProps) {
  const { colors, isDark, radius } = useTheme();
  const s = useScript();
  const onSolid = isDark ? '#000000' : '#ffffff';
  const subtle: Record<StatusTone, { bg: string; fg: string; border?: string }> = {
    neutral: { bg: colors.surfaceMuted, fg: isDark ? colors.textSecondary : color['gray-700'] },
    info: { bg: colors.infoBg, fg: colors.info },
    success: { bg: colors.successBg, fg: colors.success },
    warning: { bg: colors.warningBg, fg: colors.warning, border: colors.warningLine },
    error: { bg: colors.errorBg, fg: colors.error },
    gold: { bg: isDark ? colors.warningBg : color['gold-tint'], fg: colors.warning },
    partner: { bg: isDark ? 'rgba(143,125,224,0.16)' : color['violet-tint'], fg: isDark ? color['gradient-violet'] : color['violet-ink'] },
  };
  const strong: Record<StatusTone, { bg: string; fg: string }> = {
    neutral: isDark ? { bg: '#ffffff', fg: '#000000' } : { bg: color['charcoal-900'], fg: '#ffffff' },
    info: { bg: color['horizon-blue'], fg: '#ffffff' },
    success: { bg: colors.success, fg: onSolid },
    warning: { bg: colors.warning, fg: onSolid },
    error: { bg: colors.error, fg: onSolid },
    gold: { bg: color['gradient-gold'], fg: color['charcoal-900'] },
    partner: { bg: color['gradient-violet'], fg: '#ffffff' },
  };
  const p = solid ? strong[tone] : subtle[tone];
  const border = !solid ? (subtle[tone] as { border?: string }).border : undefined;
  return (
    <View
      style={[{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, height: size === 'md' ? 28 : 24, paddingHorizontal: size === 'md' ? 12 : 10, borderRadius: radius['radius-pill'], backgroundColor: p.bg, borderWidth: border ? 1 : 0, borderColor: border }, style]}
      {...rest}
    >
      {dot ? <View accessibilityElementsHidden importantForAccessibility="no" style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: p.fg }} /> : null}
      {live ? <View accessibilityElementsHidden importantForAccessibility="no" style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.live }} /> : null}
      <Text variant="web-label" numberOfLines={1} style={[{ fontSize: size === 'sm' ? 12 : 13, lineHeight: 16, color: p.fg }, s.weight('600')]}>{children}</Text>
    </View>
  );
}

/* ---------- Removable tag (.cr-tag) ---------- */

export interface TagProps extends Omit<ViewProps, 'children'> {
  /** The item name as the user chose it ("Amharic"). */
  children: string;
  /** Called when the remove button is pressed. Afterwards move focus to the next tag or the field. */
  onRemove?: () => void;
  /** Accessible name of the remove button. @default `Remove ${children}` */
  removeLabel?: string;
  /** Applied-filter look (info tint). @default false */
  active?: boolean;
  /** Dim the tag and disable removal. @default false */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Removable applied-filter tag, 32dp tall, with a 24dp remove button whose hit area reaches 44dp. */
export function Tag({ children, onRemove, removeLabel, active = false, disabled = false, style, ...rest }: TagProps) {
  const { colors, isDark, radius, opacity } = useTheme();
  const { focused, handlers } = useFocus();
  const s = useScript();
  const fg = active ? (isDark ? color['blue-on-dark'] : color['horizon-blue-dim']) : colors.text;
  return (
    <View
      style={[{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, height: 32, paddingStart: 12, paddingEnd: 4, borderRadius: radius['radius-pill'], borderWidth: 1, backgroundColor: active ? colors.tint : colors.surface, borderColor: active ? colors.tintLine : color['gray-300'], opacity: disabled ? opacity['opacity-disabled'] : 1 }, style]}
      {...rest}
    >
      <Text variant="web-small" numberOfLines={1} style={[{ fontSize: 14, lineHeight: 18, color: fg }, s.weight('500')]}>{children}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={removeLabel ?? `Remove ${children}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onRemove}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        hitSlop={10}
        style={({ pressed }) => ({ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? (isDark ? colors.surfaceMuted : color['gray-200']) : 'transparent' })}
      >
        <UiIcon name="close" size={12} color={isDark ? colors.textSecondary : active ? color['horizon-blue-dim'] : color['gray-700']} />
        <FocusRing visible={focused} radius={12} color={colors.focus} inset={1} />
      </Pressable>
    </View>
  );
}

/* ---------- Count (.count) ---------- */

export interface CountBadgeProps extends ViewProps {
  /** The number to show. */
  children: ReactNode;
  /** Context read after the number ("unread"). Needed unless the count sits inside a labelled link. */
  hiddenLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Horizon Blue number dot for unread or pending items. Never red. */
export const CountBadge = forwardRef<View, CountBadgeProps>(function CountBadge({ children, hiddenLabel, style, ...rest }, ref) {
  const s = useScript();
  const label = hiddenLabel && (typeof children === 'string' || typeof children === 'number') ? `${children} ${hiddenLabel}` : undefined;
  return (
    <View
      ref={ref}
      accessible={!!label}
      accessibilityLabel={label}
      style={[{ alignSelf: 'flex-start', minWidth: 18, height: 18, paddingHorizontal: 5, borderRadius: 9, backgroundColor: color['horizon-blue'], alignItems: 'center', justifyContent: 'center' }, style]}
      {...rest}
    >
      <Text variant="web-label" style={[{ fontSize: 11, lineHeight: 14, color: '#ffffff', fontVariant: ['tabular-nums'] }, s.weight('700')]}>{children}</Text>
    </View>
  );
});
