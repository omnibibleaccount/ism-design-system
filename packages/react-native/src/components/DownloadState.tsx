import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

/** Where a download is: not on the phone, in progress, saved for offline, or failed. */
export type DownloadStatus = 'idle' | 'downloading' | 'downloaded' | 'error';

/** Circumference of the 44dp ring (r 19). Dash length is progress times this. */
const CIRCUMFERENCE = 119.4;

/** Returns `value`, but updates at most once per `ms` so a fast progress stream does not repaint the ring constantly. */
function useThrottled(value: number, ms: number): number {
  const [shown, setShown] = useState(value);
  const last = useRef(0);
  useEffect(() => {
    const now = Date.now();
    const wait = Math.max(0, last.current + ms - now);
    const t = setTimeout(() => { last.current = Date.now(); setShown(value); }, wait);
    return () => clearTimeout(t);
  }, [value, ms]);
  return shown;
}

export interface DownloadButtonLabels {
  /** "{item}" is replaced by `itemName`. @default "Download {item}" */
  download?: string;
  /** "{percent}" is replaced. @default "Stop download, {percent} percent" */
  stop?: string;
  /** @default "Downloaded, {item}" */
  downloaded?: string;
  /** @default "Retry download" */
  retry?: string;
}

const DEFAULT_LABELS: Required<DownloadButtonLabels> = { download: 'Download {item}', stop: 'Stop download, {percent} percent', downloaded: 'Downloaded, {item}', retry: 'Retry download' };

export interface DownloadButtonProps extends Omit<ViewProps, 'children'> {
  /** Current state. State is shown by icon shape too, never colour alone. @default "idle" */
  status?: DownloadStatus;
  /** Progress 0 to 1 while `downloading`. */
  progress?: number;
  /** Name of the item for the accessible name: "Amharic". */
  itemName: string;
  /** Called on press: start (idle), stop (downloading), manage or open (downloaded), retry (error). */
  onPress?: () => void;
  /** 36dp visual with a 44dp hit area, for dense lists. @default false */
  small?: boolean;
  /** Accessible names; override for translation. */
  labels?: DownloadButtonLabels;
  /** Disable while offline ("Needs a connection"). @default false */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** The 44dp download button in its four states: hairline circle with arrow, progress ring with stop, success tick, error retry. */
export function DownloadButton({ status = 'idle', progress = 0, itemName, onPress, small = false, labels, disabled = false, style, ...rest }: DownloadButtonProps) {
  const { colors, radius, opacity, isDark } = useTheme();
  const [focus, setFocus] = useState(false);
  const l = { ...DEFAULT_LABELS, ...labels };
  const shown = useThrottled(Math.min(Math.max(progress, 0), 1), 250);
  const percent = Math.round(shown * 100);
  const name =
    status === 'downloading' ? l.stop.replace('{percent}', String(percent))
    : status === 'downloaded' ? l.downloaded.replace('{item}', itemName)
    : status === 'error' ? l.retry
    : l.download.replace('{item}', itemName);
  const box = small ? 36 : 44;
  const bg = status === 'downloaded' ? colors.successBg : status === 'error' ? colors.errorBg : 'transparent';
  const border = status === 'idle' ? (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.22)') : 'transparent';
  const accent = isDark ? '#7fa6f7' : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ disabled, busy: status === 'downloading' }}
      accessibilityValue={status === 'downloading' ? { min: 0, max: 100, now: percent } : undefined}
      disabled={disabled}
      hitSlop={small ? 4 : undefined}
      onPress={onPress}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
      style={[
        {
          width: box, height: box, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center', borderWidth: status === 'idle' ? 1 : 0, borderColor: border, backgroundColor: bg,
          opacity: disabled ? opacity['opacity-disabled'] : 1, ...(focus ? { outlineColor: colors.focus, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' as const } : null),
        } as ViewStyle,
        style,
      ]}
    >
      {status === 'downloading' ? (
        <Svg width={box} height={box} viewBox="0 0 44 44">
          <Circle cx={22} cy={22} r={19} fill="none" stroke={isDark ? 'rgba(255,255,255,0.2)' : '#e1e1e4'} strokeWidth={3} />
          <Circle cx={22} cy={22} r={19} fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeDasharray={`${(shown * CIRCUMFERENCE).toFixed(1)} 120`} transform="rotate(-90 22 22)" />
          <Rect x={17} y={17} width={10} height={10} rx={2} fill={accent} />
        </Svg>
      ) : status === 'downloaded' ? (
        <UiIcon name="check" size={20} color={colors.success} />
      ) : status === 'error' ? (
        <UiIcon name="refresh" size={20} color={colors.error} />
      ) : (
        <UiIcon name="download" size={20} color={accent} />
      )}
    </Pressable>
  );
}

export type StorageKind = 'bibles' | 'audio' | 'other';

/** One slice of the storage bar. */
export interface StorageSegment {
  /** Which colour: Bibles Horizon Blue, audio violet, other grey. */
  kind: StorageKind;
  /** Legend label: "Bibles". */
  label: string;
  /** Size in any unit, only used for proportions. */
  value: number;
  /** Text in the legend: "420 MB". */
  valueLabel: string;
}

export interface StorageRowProps extends Omit<ViewProps, 'children'> {
  /** Left headline: "1.2 GB used". */
  usedLabel: string;
  /** Right detail: "of 12 GB". */
  detailLabel?: string;
  /** Slices in order. */
  segments: StorageSegment[];
  /** Capacity in the same unit as segment values; the unfilled part of the bar is the track. Defaults to the sum of segments. */
  total?: number;
  style?: StyleProp<ViewStyle>;
}

/** Storage usage row for Manage downloads: stacked bar with a legend that always shows the numbers. */
export function StorageRow({ usedLabel, detailLabel, segments, total, style, ...rest }: StorageRowProps) {
  const { colors, radius, isDark } = useTheme();
  const sum = segments.reduce((a, s) => a + s.value, 0);
  const cap = Math.max(total ?? sum, sum, 1);
  const fill: Record<StorageKind, string> = { bibles: colors.primary, audio: '#8f7de0', other: isDark ? '#5f6266' : '#c7c8cb' };
  const spoken = [usedLabel, detailLabel, ...segments.map((s) => `${s.label} ${s.valueLabel}`)].filter(Boolean).join(', ');
  return (
    <View {...rest} style={[{ padding: 16, backgroundColor: colors.surface, borderRadius: radius['radius-md'], borderWidth: 1, borderColor: colors.border }, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <Text variant="web-label" style={{ fontSize: 16, flexShrink: 1 }}>{usedLabel}</Text>
        {detailLabel ? <Text variant="web-small" tone="tertiary" style={{ fontSize: 14 }}>{detailLabel}</Text> : null}
      </View>
      <View accessible accessibilityRole="image" accessibilityLabel={spoken} style={{ flexDirection: 'row', gap: 2, height: 10, borderRadius: radius['radius-pill'], backgroundColor: colors.surfaceMuted, overflow: 'hidden', marginTop: 12, marginBottom: 10 }}>
        {segments.map((s) => <View key={s.kind + s.label} style={{ width: `${(s.value / cap) * 100}%`, height: 10, backgroundColor: fill[s.kind] }} />)}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 6 }}>
        {segments.map((s) => (
          <View key={s.kind + s.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: fill[s.kind] }} />
            <Text variant="body-sm" tone="body" style={{ fontSize: 13 }}>{`${s.label} ${s.valueLabel}`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export interface OfflineBannerProps extends Omit<ViewProps, 'children'> {
  /** `offline` is the charcoal banner under the app bar; `online` is the brief success banner. @default "offline" */
  variant?: 'offline' | 'online';
  /** Bold lead: "You’re offline". */
  title: string;
  /** Rest of the line after a dot: "Downloaded Bibles still work". */
  message?: string;
  /** Online variant hides itself after this many ms and calls `onHide`. 0 keeps it. @default 3000 */
  autoHideMs?: number;
  /** Called after the online banner auto-hides. */
  onHide?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Full-width status banner. Announced once through a polite live region; never blocks the screen. */
export function OfflineBanner({ variant = 'offline', title, message, autoHideMs = 3000, onHide, style, ...rest }: OfflineBannerProps) {
  const { colors, isDark } = useTheme();
  const [hidden, setHidden] = useState(false);
  const text = message ? `${title} · ${message}` : title;
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(text);
  }, [text]);
  const hide = useRef(onHide);
  hide.current = onHide;
  useEffect(() => {
    if (variant !== 'online' || autoHideMs <= 0) return undefined;
    const t = setTimeout(() => { setHidden(true); hide.current?.(); }, autoHideMs);
    return () => clearTimeout(t);
  }, [variant, autoHideMs]);
  if (hidden) return null;
  const online = variant === 'online';
  const ink = online ? colors.success : '#ffffff';
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="summary"
      {...rest}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: online ? colors.successBg : isDark ? '#232527' : '#161819' }, style]}
    >
      <UiIcon name={online ? 'check-circle' : 'wifi-off'} size={20} color={ink} />
      <Text variant="web-small" style={{ flex: 1, fontSize: 14, color: ink }}>
        <Text variant="web-label" style={{ fontSize: 14, color: ink }}>{title}</Text>
        {message ? ` · ${message}` : ''}
      </Text>
    </View>
  );
}

export interface DownloadWarningProps extends Omit<ViewProps, 'children'> {
  /** "This Bible isn’t downloaded". */
  title: string;
  /** "Download Español · NBLA to read it without a connection." */
  message: string;
  /** Optional action element under the message, e.g. a small Button. */
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Inline warning shown under the offline banner when the reader opens something that is not downloaded. */
export function DownloadWarning({ title, message, action, style, ...rest }: DownloadWarningProps) {
  const { colors, radius } = useTheme();
  return (
    <View accessibilityRole="alert" {...rest} style={[{ flexDirection: 'row', gap: 10, padding: 14, paddingHorizontal: 16, borderRadius: radius['radius-md'], borderWidth: 1, borderColor: colors.warningLine, backgroundColor: colors.warningBg }, style]}>
      <UiIcon name="alert-triangle" size={20} color={colors.warning} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="web-label" style={{ fontSize: 14, color: colors.warning }}>{title}</Text>
        <Text variant="web-small" style={{ fontSize: 14, lineHeight: 20, color: colors.warning }}>{message}</Text>
        {action ? <View style={{ marginTop: 8 }}>{action}</View> : null}
      </View>
    </View>
  );
}
