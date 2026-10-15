import { useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator, Image, PanResponder, Pressable, View, useWindowDimensions,
  type AccessibilityActionEvent, type GestureResponderEvent, type ImageSourcePropType, type LayoutChangeEvent, type StyleProp, type ViewProps, type ViewStyle,
} from 'react-native';
import { directionFor } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

/** Playback speeds in the order the speed button cycles. */
export const AUDIO_SPEEDS = [1, 1.25, 1.5, 0.75] as const;

/** Format seconds as m:ss (h:mm:ss from one hour). */
export function formatAudioTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export interface AudioPlayerLabels {
  /** Name of the player region. @default "Audio player" */
  player?: string;
  /** Name of the seek slider. @default "Seek" */
  seek?: string;
  /** @default "Play" */
  play?: string;
  /** @default "Pause" */
  pause?: string;
  /** Name of the busy play button. @default "Loading" */
  loading?: string;
  /** Prefix of the speed button name, followed by the value. @default "Playback speed" */
  speed?: string;
  /** Names of skip buttons; "{seconds}" is replaced. @default "Back {seconds} seconds" */
  back?: string;
  /** @default "Forward {seconds} seconds" */
  forward?: string;
  /** @default "Previous chapter" */
  previous?: string;
  /** @default "Next chapter" */
  next?: string;
  /** @default "Chapter list" */
  chapters?: string;
  /** Mini player close button. @default "Close player" */
  close?: string;
  /** Mini player meta prefix when paused. @default "Paused" */
  paused?: string;
}

const DEFAULT_LABELS: Required<AudioPlayerLabels> = {
  player: 'Audio player', seek: 'Seek', play: 'Play', pause: 'Pause', loading: 'Loading', speed: 'Playback speed', back: 'Back {seconds} seconds',
  forward: 'Forward {seconds} seconds', previous: 'Previous chapter', next: 'Next chapter', chapters: 'Chapter list', close: 'Close player', paused: 'Paused',
};

/** Default spoken form of a position, e.g. "2 minutes 14 seconds". Replace through `formatValueText` for other languages. */
function defaultValueText(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const part = (n: number, one: string) => `${n} ${one}${n === 1 ? '' : 's'}`;
  return m > 0 ? `${part(m, 'minute')} ${part(r, 'second')}` : part(r, 'second');
}

function ringStyle(color: string, on: boolean, offset = 2): ViewStyle {
  return on ? { outlineColor: color, outlineWidth: 2, outlineOffset: offset, outlineStyle: 'solid' } : {};
}

interface AudioSeekBarProps {
  /** Position in seconds. */
  position: number;
  /** Duration in seconds. */
  duration: number;
  /** Called with a new position in seconds while dragging or adjusting. */
  onSeek?: (seconds: number) => void;
  /** Name of the slider. */
  label: string;
  /** Spoken value, e.g. "2 minutes 14 seconds". */
  valueText: string;
  /** Seconds moved by the accessibility increment and decrement actions. @default 5 */
  step?: number;
  testID?: string;
}

/** 6dp seek track with an 18dp knob: a PanResponder slider exposing adjustable semantics. Time runs left to right in every language. */
export function AudioSeekBar({ position, duration, onSeek, label, valueText, step = 5, testID }: AudioSeekBarProps) {
  const { colors, isDark } = useTheme();
  const track = isDark ? 'rgba(255,255,255,0.2)' : '#e1e1e4';
  const [width, setWidth] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const [focused, setFocused] = useState(false);
  const geo = useRef({ width: 0, duration: 0, start: 0, onSeek });
  geo.current = { width, duration, start: geo.current.start, onSeek };
  const clampPos = (v: number) => Math.min(Math.max(0, v), Math.max(0, duration));

  const pan = useMemo(() => {
    const toSeconds = (fraction: number) => Math.min(Math.max(0, fraction), 1) * geo.current.duration;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e: GestureResponderEvent) => {
        const w = geo.current.width || 1;
        const fraction = e.nativeEvent.locationX / w;
        geo.current.start = fraction;
        const v = toSeconds(fraction);
        setDrag(v);
        geo.current.onSeek?.(v);
      },
      onPanResponderMove: (_e, g) => {
        const w = geo.current.width || 1;
        const v = toSeconds(geo.current.start + g.dx / w);
        setDrag(v);
        geo.current.onSeek?.(v);
      },
      onPanResponderRelease: () => setDrag(null),
      onPanResponderTerminate: () => setDrag(null),
    });
  }, []);

  const shown = drag ?? position;
  const fraction = duration > 0 ? Math.min(Math.max(shown / duration, 0), 1) : 0;
  const onAction = (e: AccessibilityActionEvent) => {
    if (e.nativeEvent.actionName === 'increment') onSeek?.(clampPos(position + step));
    if (e.nativeEvent.actionName === 'decrement') onSeek?.(clampPos(position - step));
  };

  return (
    <Pressable
      testID={testID}
      accessible
      focusable
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: Math.round(duration), now: Math.round(shown), text: valueText }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={onAction}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ height: 44, justifyContent: 'center', direction: 'ltr', ...ringStyle(colors.focus, focused, 0) }}
    >
      <View {...pan.panHandlers} style={{ height: 44, justifyContent: 'center' }}>
        <View pointerEvents="none" style={{ height: 6, borderRadius: 999, backgroundColor: track }}>
          <View style={{ position: 'absolute', start: 0, top: 0, bottom: 0, width: `${fraction * 100}%`, borderRadius: 999, backgroundColor: colors.primary }} />
          <View style={{ position: 'absolute', top: -6, start: `${fraction * 100}%`, width: 18, height: 18, marginStart: -9, borderRadius: 9, backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.primary, shadowColor: '#000000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 2 }} />
        </View>
      </View>
    </Pressable>
  );
}

interface CtrlProps {
  icon: 'skip-back' | 'skip-forward' | 'replay' | 'forward' | 'list' | 'close';
  label: string;
  onPress?: () => void;
  badge?: string;
  size?: number;
  color?: string;
  bordered?: boolean;
  testID?: string;
}

/** Quiet transport button (48dp, 44dp in the mini player). Never mirrored: transport glyphs keep their direction. */
function Ctrl({ icon, label, onPress, badge, size = 48, color, bordered, testID }: CtrlProps) {
  const { colors, radius } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={testID}
      style={({ pressed }): ViewStyle => ({
        width: size, height: size, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center',
        borderWidth: bordered ? 1 : 0, borderColor: colors.border, backgroundColor: pressed ? (colors.surfaceMuted) : 'transparent', ...ringStyle(colors.focus, focused),
      })}
    >
      <UiIcon name={icon} size={24} color={color ?? colors.text} />
      {badge ? <Text variant="web-label" accessibilityElementsHidden importantForAccessibility="no" style={{ position: 'absolute', fontSize: 8, lineHeight: 10, fontWeight: '700', color: color ?? colors.text, marginTop: 3 }}>{badge}</Text> : null}
    </Pressable>
  );
}

interface PlayButtonProps {
  playing: boolean;
  loading?: boolean;
  onPress?: () => void;
  size: 68 | 52 | 44;
  invert?: boolean;
  labels: Required<AudioPlayerLabels>;
  testID?: string;
}

/** The one Horizon Blue control: play or pause, with a busy spinner. */
function PlayButton({ playing, loading, onPress, size, invert, labels, testID }: PlayButtonProps) {
  const { colors, radius } = useTheme();
  const [focused, setFocused] = useState(false);
  const fg = invert ? '#000000' : '#ffffff';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={loading ? labels.loading : playing ? labels.pause : labels.play}
      accessibilityState={{ busy: !!loading }}
      onPress={loading ? undefined : onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={testID}
      style={({ pressed }): ViewStyle => ({
        width: size, height: size, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center',
        backgroundColor: invert ? (pressed ? '#e1e1e4' : '#ffffff') : pressed ? colors.primaryPressed : colors.primary, ...ringStyle(colors.focus, focused),
      })}
    >
      {loading ? <ActivityIndicator size="small" color={fg} /> : <UiIcon name={playing ? 'pause' : 'play'} size={size === 68 ? 32 : 24} color={fg} />}
    </Pressable>
  );
}

function Cover({ source, size, radiusValue }: { source?: ImageSourcePropType; size: number | `${number}%`; radiusValue: number }) {
  const { colors } = useTheme();
  const box: ViewStyle = { width: size, aspectRatio: 1, borderRadius: radiusValue, overflow: 'hidden', backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' };
  return (
    <View style={box} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {source ? <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" accessibilityIgnoresInvertColors /> : <UiIcon name="headphones" size={48} color={colors.link} />}
    </View>
  );
}

interface PlayerState {
  /** Audio is playing. @default false */
  playing?: boolean;
  /** Audio is buffering; the play button shows a spinner and is busy. @default false */
  loading?: boolean;
  /** Position in seconds. */
  position: number;
  /** Duration in seconds. */
  duration: number;
  /** Seconds skipped by the skip buttons. @default 15 */
  skipSeconds?: number;
  /** Called by the play/pause button. Never autoplay. */
  onPlayPause?: () => void;
  /** Called by the back-skip button. */
  onSkipBack?: () => void;
  /** Called by the forward-skip button. */
  onSkipForward?: () => void;
  /** Accessible names; override for translation. */
  labels?: AudioPlayerLabels;
  /** Cover artwork. Decorative. A neutral tile is drawn when omitted. */
  cover?: ImageSourcePropType;
}

export interface AudioPlayerProps extends PlayerState, ViewProps {
  /** Title, "Book chapter · Language", e.g. "John 3 · Amharic". */
  title: string;
  /** Native-name subtitle, e.g. "ዮሐንስ 3 · Narrated Bible". */
  subtitle?: string;
  /** Language of the subtitle (sets `lang` behaviour: script line-height and direction), e.g. "am". */
  subtitleLang?: string;
  /** Small caption above the title. @default none */
  overline?: string;
  /** Current speed multiplier. @default 1 */
  speed?: number;
  /** Called with the next speed in the cycle 1x, 1.25x, 1.5x, 0.75x. */
  onSpeedChange?: (speed: number) => void;
  /** Called while dragging or adjusting the seek bar, with seconds. */
  onSeek?: (seconds: number) => void;
  /** Previous chapter. Hides the button when omitted. */
  onPrevious?: () => void;
  /** Next chapter. Hides the button when omitted. */
  onNext?: () => void;
  /** Opens the chapter list. Hides the button when omitted. */
  onOpenChapters?: () => void;
  /** Spoken form of a position for the slider. Defaults to English "2 minutes 14 seconds". */
  formatValueText?: (seconds: number) => string;
  style?: StyleProp<ViewStyle>;
}

/** Full audio Bible player. Controlled and presentational: the app owns playback state and passes it in. */
export function AudioPlayer({
  title, subtitle, subtitleLang, overline, cover, playing = false, loading = false, position, duration, speed = 1, skipSeconds = 15, onPlayPause, onSkipBack, onSkipForward, onSpeedChange,
  onSeek, onPrevious, onNext, onOpenChapters, formatValueText = defaultValueText, labels, style, ...rest
}: AudioPlayerProps) {
  const theme = useTheme();
  const { colors, radius, shadow, isDark, spacing } = theme;
  const { width } = useWindowDimensions();
  const stacked = width < 768;
  const l = { ...DEFAULT_LABELS, ...labels };
  const speedText = `${speed}x`;
  const nextSpeed = () => {
    const i = AUDIO_SPEEDS.indexOf(speed as (typeof AUDIO_SPEEDS)[number]);
    onSpeedChange?.(AUDIO_SPEEDS[(i + 1) % AUDIO_SPEEDS.length]);
  };
  const skip = (t: string) => t.replace('{seconds}', String(skipSeconds));
  return (
    <View
      accessibilityLabel={l.player}
      {...rest}
      style={[{ flexDirection: stacked ? 'column' : 'row', alignItems: stacked ? 'stretch' : 'center', gap: spacing['space-6'], padding: stacked ? spacing['space-5'] : 28, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], ...(isDark ? shadow['shadow-card-dark'] : shadow['shadow-card-light']) }, style]}
    >
      <Cover source={cover} size={stacked ? '100%' : 240} radiusValue={radius['radius-ml']} />
      <View style={{ flex: 1, minWidth: 0, gap: 22 }}>
        <View style={{ gap: 4 }}>
          {overline ? <Text variant="web-overline" tone="secondary">{overline}</Text> : null}
          <Text variant="print-h4" accessibilityRole="header" style={{ fontSize: 26, lineHeight: 32 }}>{title}</Text>
          {subtitle ? <Text variant="web-small" tone="secondary" lang={subtitleLang} style={{ fontSize: 16, writingDirection: subtitleLang ? directionFor(subtitleLang) : undefined }}>{subtitle}</Text> : null}
        </View>
        <View>
          <AudioSeekBar position={position} duration={duration} onSeek={onSeek} label={l.seek} valueText={formatValueText(position)} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', direction: 'ltr' }}>
            <Text variant="body-sm" tone="secondary" style={{ fontSize: 13, fontVariant: ['tabular-nums'] }}>{formatAudioTime(position)}</Text>
            <Text variant="body-sm" tone="secondary" style={{ fontSize: 13, fontVariant: ['tabular-nums'] }}>{`−${formatAudioTime(Math.max(0, duration - position))}`}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing['space-2'], direction: 'ltr' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${l.speed}, ${speedText}`}
            onPress={nextSpeed}
            style={({ pressed }) => ({ minHeight: 44, minWidth: 52, paddingHorizontal: 12, borderRadius: radius['radius-pill'], borderWidth: 1, borderColor: pressed ? colors.text : '#c7c8cb', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface })}
          >
            <Text variant="web-label">{speedText}</Text>
          </Pressable>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {onPrevious ? <Ctrl icon="skip-back" label={l.previous} onPress={onPrevious} /> : null}
            <Ctrl icon="replay" label={skip(l.back)} badge={String(skipSeconds)} onPress={onSkipBack} />
            <PlayButton playing={playing} loading={loading} onPress={onPlayPause} size={68} labels={l} />
            <Ctrl icon="forward" label={skip(l.forward)} badge={String(skipSeconds)} onPress={onSkipForward} />
            {onNext ? <Ctrl icon="skip-forward" label={l.next} onPress={onNext} /> : null}
          </View>
          {onOpenChapters ? <Ctrl icon="list" label={l.chapters} onPress={onOpenChapters} bordered /> : <View style={{ width: 44 }} />}
        </View>
      </View>
    </View>
  );
}

export interface AudioMiniPlayerProps extends PlayerState, ViewProps {
  /** Title, e.g. "John 3 · Amharic". */
  title: string;
  /** Dark variant: charcoal surface, white play button, light-blue progress. @default false */
  dark?: boolean;
  /** Opens the full player when the title area is pressed. */
  onPress?: () => void;
  /** Paused players swap the skip button for a Close button that calls this. */
  onClose?: () => void;
  /** Override the meta line, e.g. "2:14 / 5:52". Defaults to position and duration. */
  meta?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** 72dp mini player docked at the bottom of a screen while audio keeps playing. */
export function AudioMiniPlayer({
  title, dark = false, cover, playing = false, loading = false, position, duration, skipSeconds = 15, onPlayPause, onSkipBack, onPress, onClose, meta, labels, style, ...rest
}: AudioMiniPlayerProps) {
  const { colors, radius, shadow, isDark } = useTheme();
  const l = { ...DEFAULT_LABELS, ...labels };
  const onDark = dark || isDark;
  const fraction = duration > 0 ? Math.min(Math.max(position / duration, 0), 1) : 0;
  const ink = onDark ? '#ffffff' : colors.text;
  const metaText = `${formatAudioTime(position)} / ${formatAudioTime(duration)}`;
  const text = (
    <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
      <Text variant="web-label" numberOfLines={1} style={{ fontSize: 15, color: ink }}>{title}</Text>
      <Text variant="body-sm" style={{ fontSize: 13, color: onDark ? 'rgba(255,255,255,0.68)' : colors.textSecondary }}>
        {meta ?? (playing ? metaText : `${l.paused} · ${metaText}`)}
      </Text>
    </View>
  );
  return (
    <View
      {...rest}
      style={[{ height: 72, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, borderRadius: radius['radius-ml'], borderWidth: 1, borderColor: onDark ? 'rgba(255,255,255,0.12)' : '#e1e1e4', backgroundColor: onDark ? '#161819' : '#ffffff', overflow: 'hidden', ...shadow['shadow-overlay'] }, style]}
    >
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: Math.round(duration), now: Math.round(position), text: `${formatAudioTime(position)} / ${formatAudioTime(duration)}` }}
        style={{ position: 'absolute', top: 0, start: 0, height: 3, width: `${fraction * 100}%`, backgroundColor: onDark ? '#7fa6f7' : colors.primary }}
      />
      <Cover source={cover} size={48} radiusValue={radius['radius-sm']} />
      {onPress ? <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={{ flex: 1, minWidth: 0, minHeight: 44, justifyContent: 'center' }}>{text}</Pressable> : text}
      {playing || loading ? (
        <Ctrl icon="replay" label={l.back.replace('{seconds}', String(skipSeconds))} badge={String(skipSeconds)} size={44} color={ink} onPress={onSkipBack} />
      ) : onClose ? (
        <Ctrl icon="close" label={l.close} size={44} color={ink} onPress={onClose} />
      ) : (
        <Ctrl icon="replay" label={l.back.replace('{seconds}', String(skipSeconds))} badge={String(skipSeconds)} size={44} color={ink} onPress={onSkipBack} />
      )}
      <PlayButton playing={playing} loading={loading} onPress={onPlayPause} size={44} invert={onDark} labels={l} />
    </View>
  );
}
