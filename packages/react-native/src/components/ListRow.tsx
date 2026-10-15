import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Linking, Pressable, Switch, View, type GestureResponderEvent, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import type { UiIconName } from '@ism/tokens/icons-all';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { useTheme } from '../theme';
import { FocusRing, useFocus } from './internal';
import { Overline } from './Eyebrow';
import { IconTile } from './Iconography';

/* ---------- Audio row (React `ListRow`) ---------- */

export interface ListRowProps extends Omit<ViewProps, 'children'> {
  /** Shown in a 40dp round tile. Decorative. */
  icon?: ReactNode;
  /** Chapter or teaching name, one line. */
  title: string;
  /** Duration, for example "9:12". */
  meta?: string;
  /** Listened fraction, 0 to 1. @default 0.15 */
  progress?: number;
  /** Dark surface styling. Set `false` on light surfaces. Defaults to the theme scheme. */
  dark?: boolean;
  /** Called when the play button is pressed. */
  onPlay?: () => void;
  /** Accessible name of the play button. Pass it translated. @default "Play" */
  playLabel?: string;
  /** Icon inside the play button. @default the `play` UI icon */
  playIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Audio Bible chapter or teaching row: icon, title, progress line (solid Horizon Blue, as built), duration and play. */
export function ListRow({ icon, title, meta, progress = 0.15, dark, onPlay, playLabel = 'Play', playIcon, style, ...rest }: ListRowProps) {
  const theme = useTheme();
  const isDark = dark ?? theme.isDark;
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const ink = isDark ? '#ffffff' : color['charcoal-900'];
  const soft = isDark ? color['text-tertiary-dark'] : color['gray-600'];
  const { focused, handlers } = useFocus();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingVertical: 12, paddingHorizontal: 20 }, style]} {...rest}>
      {icon ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : color['blue-tint'] }}>
          {icon}
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
        <Text variant="web-small" numberOfLines={1} style={{ fontSize: 16, color: ink }}>{title}</Text>
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={title}
          accessibilityValue={{ min: 0, max: 100, now: pct }}
          style={{ height: 3, borderRadius: 2, overflow: 'hidden', backgroundColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)' }}
        >
          <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, width: `${pct}%`, borderRadius: 2, backgroundColor: color['horizon-blue'] }} />
        </View>
      </View>
      {meta ? <Text variant="web-small" style={{ fontSize: 14, color: soft, fontVariant: ['tabular-nums'] }}>{meta}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playLabel}
        onPress={onPlay}
        onFocus={handlers.onFocus}
        onBlur={handlers.onBlur}
        style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
      >
        {playIcon ?? <UiIcon name="play" size={20} color={ink} />}
        <FocusRing visible={focused} radius={22} color={isDark ? color['blue-on-dark'] : color['horizon-blue']} inset={2} />
      </Pressable>
    </View>
  );
}

/* ---------- Settings / menu rows (.cr-lr) ---------- */

export interface ListItemProps {
  /** UI icon name for the leading blue-tint tile (decorative). Use `leading` for anything else. */
  icon?: UiIconName;
  /** Gold tint for the icon tile. Keep one leading style per group. @default false */
  iconGold?: boolean;
  /** Custom leading node, e.g. an `Avatar` (decorative beside the title). Replaces `icon`. */
  leading?: ReactNode;
  /** Row title, one line. A short noun: "Language". */
  title: string;
  /** One extra fact under the title. */
  meta?: string;
  /** Let the meta wrap to two lines, then ellipsis. @default false */
  twoLine?: boolean;
  /** Current value in the end slot ("Amharic"). */
  value?: string;
  /** End-slot affordance: `drill` is › (opens an app screen, mirrored in RTL), `out` is ↗ (goes to another page). */
  end?: 'drill' | 'out';
  /** URL opened with `Linking.openURL`; makes the row a link. */
  href?: string;
  /** Press handler. Makes the row a button (or a link when `end` is set). */
  onPress?: (event: GestureResponderEvent) => void;
  /** Spoken after the title for rows that open a new tab or app ("(opens in a new tab)"). Pass it translated. */
  newTabLabel?: string;
  /** Row has no leading icon (inside an inset group), so its divider starts at 20dp. @default false */
  noIcon?: boolean;
  /** Dim the row and block interaction. @default false */
  disabled?: boolean;
  /** Switch row: current state. The whole row toggles; the switch is the only control. */
  checked?: boolean;
  /** Passing this makes the row a switch row. */
  onCheckedChange?: (checked: boolean) => void;
  accessibilityLabel?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/** One 56dp+ row: leading tile or avatar, title, meta and end slot. Never nest another link or button inside it. */
export function ListItem({ icon, iconGold = false, leading, title, meta, twoLine = false, value, end, href, onPress, newTabLabel, disabled = false, checked, onCheckedChange, accessibilityLabel, testID, style }: ListItemProps) {
  const { colors, opacity, isDark } = useTheme();
  const { focused, handlers } = useFocus();
  const isSwitch = !!onCheckedChange;
  const interactive = !!(href || onPress || isSwitch);
  const role = isSwitch ? 'switch' : href || end ? 'link' : onPress ? 'button' : undefined;
  const press = (e: GestureResponderEvent) => {
    if (disabled) return;
    if (isSwitch) onCheckedChange?.(!checked);
    onPress?.(e);
    if (href) Linking.openURL(href).catch(() => undefined);
  };
  const lead = leading ? (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{leading}</View>
  ) : icon ? (
    <IconTile name={icon} tone={iconGold ? 'gold' : 'blue'} />
  ) : null;
  const dim = disabled ? opacity['opacity-disabled'] : 1;
  const body = (pressed: boolean) => (
    <View
      style={[{ flexDirection: 'row', alignItems: twoLine ? 'flex-start' : 'center', gap: 14, minHeight: 56, paddingHorizontal: 20, paddingVertical: twoLine ? 16 : 12, opacity: dim, backgroundColor: pressed ? (isDark ? colors.surfaceMuted : colors.background) : 'transparent' }, style]}
    >
      {lead}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text variant="web-small" numberOfLines={1} style={{ fontSize: 16, lineHeight: 24 }}>{title}</Text>
        {meta ? <Text variant="web-small" tone="tertiary" numberOfLines={twoLine ? 2 : 1} style={{ fontSize: 14, lineHeight: 21 }}>{meta}</Text> : null}
      </View>
      {value !== undefined || end || isSwitch ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {value !== undefined ? <Text variant="web-small" tone="tertiary" style={{ fontSize: 14 }}>{value}</Text> : null}
          {end === 'drill' ? <UiIcon name="chevron-right" size={20} color={colors.textTertiary} mirrorInRTL /> : null}
          {end === 'out' ? <UiIcon name="arrow-up-right" size={16} color={colors.textTertiary} /> : null}
          {isSwitch ? (
            <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Switch value={!!checked} disabled trackColor={{ true: color['horizon-blue'], false: isDark ? color['charcoal-700'] : color['gray-300'] }} thumbColor="#ffffff" />
            </View>
          ) : null}
        </View>
      ) : null}
      <FocusRing visible={focused} radius={-1} color={colors.focus} inset={0} />
    </View>
  );
  if (!interactive) return <View testID={testID} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel}>{body(false)}</View>;
  return (
    <Pressable
      testID={testID}
      accessibilityRole={role}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={newTabLabel}
      accessibilityState={{ disabled, checked: isSwitch ? !!checked : undefined }}
      disabled={disabled}
      onPress={press}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
    >
      {({ pressed }) => body(pressed)}
    </Pressable>
  );
}

function withSeparators(children: ReactNode, inset: boolean, line: string): ReactNode[] {
  const items = Children.toArray(children).filter(Boolean);
  const out: ReactNode[] = [];
  items.forEach((child, i) => {
    if (i > 0) {
      const prev = items[i - 1];
      const noIcon = (c: unknown) => isValidElement(c) && !!(c as ReactElement<ListItemProps>).props.noIcon;
      const start = !inset ? 0 : noIcon(child) && noIcon(prev) ? 20 : 74;
      out.push(<View key={`sep-${i}`} accessibilityElementsHidden importantForAccessibility="no" style={{ height: 1, marginStart: start, backgroundColor: line }} />);
    }
    out.push(child);
  });
  return out;
}

export interface ListProps extends ViewProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Bordered list with a hairline between rows (for web-like pages). */
export function List({ children, style, ...rest }: ListProps) {
  const { colors, isDark, radius } = useTheme();
  return (
    <View style={[{ borderRadius: radius['radius-lg'], borderWidth: 1, borderColor: isDark ? colors.border : color['gray-200'], backgroundColor: colors.surface, overflow: 'hidden' }, style]} {...rest}>
      {withSeparators(children, false, isDark ? colors.border : color['gray-100'])}
    </View>
  );
}

export interface ListGroupProps extends ViewProps {
  /** Group heading, shown as an overline and used as the group's accessible name. */
  title: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Inset grouped card with an overline heading, for app screens and settings. Dividers are inset past the icon tile. */
export function ListGroup({ title, children, style, ...rest }: ListGroupProps) {
  const { colors, isDark, radius } = useTheme();
  return (
    <View style={[{ gap: 8 }, style]} {...rest}>
      <View style={{ paddingHorizontal: 20 }}>
        <Overline>{title}</Overline>
      </View>
      <View accessible={false} accessibilityLabel={title} style={{ borderRadius: radius['radius-lg'], borderWidth: 1, borderColor: isDark ? colors.border : color['gray-200'], backgroundColor: colors.surface, overflow: 'hidden' }}>
        {withSeparators(children, true, isDark ? colors.border : color['gray-200'])}
      </View>
    </View>
  );
}
