import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Easing, View, type DimensionValue, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { if (live) setReduce(v); }).catch(() => undefined);
    return () => { live = false; };
  }, []);
  return reduce;
}

export type SpinnerSize = 's' | 'm' | 'l';
export type SpinnerTone = 'default' | 'onDark' | 'ink';

export interface SpinnerProps extends Omit<ViewProps, 'children'> {
  /** 16, 24 or 40dp. S in buttons and inputs, M in menus and cards, L in an empty panel. @default "m" */
  size?: SpinnerSize;
  /** `default` Horizon Blue head; `onDark` white; `ink` black for secondary buttons. Never a status colour. @default "default" */
  tone?: SpinnerTone;
  /** Accessible name saying what is loading: "Loading stations". @default "Loading" */
  label?: string;
  /** Hide from screen readers when the surrounding control already says it is busy (e.g. inside a Button). @default false */
  decorative?: boolean;
}

const DIM = { s: { d: 16, w: 2 }, m: { d: 24, w: 2.5 }, l: { d: 40, w: 3.5 } } as const;

/** Ring spinner that turns once every 0.8s. Under reduced motion it stays a static ring. */
export function Spinner({ size = 'm', tone = 'default', label = 'Loading', decorative = false, style, ...rest }: SpinnerProps) {
  const { isDark, duration } = useTheme();
  const reduce = useReduceMotion();
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) return undefined;
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: duration['duration-spin'], easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [reduce, spin, duration]);
  const { d, w } = DIM[size];
  const track = tone === 'onDark' ? 'rgba(255,255,255,0.22)' : tone === 'ink' ? 'rgba(0,0,0,0.18)' : isDark ? color['charcoal-700'] : color['gray-200'];
  const head = tone === 'onDark' ? '#ffffff' : tone === 'ink' ? '#000000' : isDark ? color['blue-on-dark'] : color['horizon-blue'];
  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'progressbar'}
      accessibilityLabel={decorative ? undefined : label}
      accessibilityLiveRegion={decorative ? undefined : 'polite'}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      style={style}
      {...rest}
    >
      <Animated.View
        style={{
          width: d, height: d, borderRadius: d / 2, borderWidth: w, borderColor: track, borderTopColor: head,
          transform: [{ rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }],
        }}
      />
    </View>
  );
}

export interface SkeletonProps extends Omit<ViewProps, 'children'> {
  /** Width in dp or percent. @default "100%" */
  width?: DimensionValue;
  /** Height in dp. Text lines are 12, title lines 24, media 150. @default 12 */
  height?: number;
  /** Corner radius. 6 for lines, 12 for media, 999 for avatars. @default 6 */
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

const SHIMMER_MS = 1400;

/** One grey block with a shimmer that runs from gray-100 to gray-200 every 1.4s. Static under reduced motion. Hidden from screen readers. */
export function Skeleton({ width = '100%', height = 12, radius = 6, style, ...rest }: SkeletonProps) {
  const { isDark } = useTheme();
  const reduce = useReduceMotion();
  const gid = useId().replace(/:/g, '');
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce || w === 0) return undefined;
    const loop = Animated.loop(Animated.timing(x, { toValue: 1, duration: SHIMMER_MS, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
    loop.start();
    return () => { loop.stop(); x.setValue(0); };
  }, [reduce, w, x]);
  const base = isDark ? color['charcoal-800'] : color['gray-100'];
  const peak = isDark ? color['charcoal-700'] : color['gray-200'];
  const band = Math.max(w * 0.8, 1);
  return (
    <View
      accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={[{ width, height, borderRadius: radius, backgroundColor: base, overflow: 'hidden' }, style]}
      {...rest}
    >
      {w > 0 && !reduce ? (
        <Animated.View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, width: band, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-band, w] }) }] }}>
          <Svg width={band} height={height}>
            <Defs>
              <LinearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={peak} stopOpacity={0} />
                <Stop offset="0.5" stopColor={peak} stopOpacity={1} />
                <Stop offset="1" stopColor={peak} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width={band} height={height} fill={`url(#${gid})`} />
          </Svg>
        </Animated.View>
      ) : null}
    </View>
  );
}

export interface SkeletonGroupProps {
  /** Say what is loading: "Loading stations". Read once by screen readers. */
  label: string;
  /** Wait this long (ms) before showing, so quick loads never flash. @default 300 */
  delay?: number;
  /** Set false when content arrives to remove the busy state and render nothing. @default true */
  loading?: boolean;
  /** The skeleton shapes. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Container for skeleton shapes: sets the busy state and label, and shows after a 300ms delay. Swap it for the real content in one step. */
export function SkeletonGroup({ label, delay = 300, loading = true, children, style }: SkeletonGroupProps) {
  const [shown, setShown] = useState(delay <= 0);
  useEffect(() => {
    if (delay <= 0) return undefined;
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!loading || !shown) return null;
  return (
    <View accessible accessibilityLabel={label} accessibilityState={{ busy: true }} accessibilityLiveRegion="polite" style={style}>
      {children}
    </View>
  );
}

export interface SkeletonTextProps { /** Number of lines including the title. @default 4 */ lines?: number; /** Draw a 24dp title line first. @default true */ title?: boolean; style?: StyleProp<ViewStyle> }

/** Text card skeleton: a title line and body lines of varied width, in a bordered panel. */
export function SkeletonText({ lines = 4, title = true, style }: SkeletonTextProps) {
  const { colors, radius, spacing } = useTheme();
  const widths: DimensionValue[] = ['100%', '92%', '96%', '60%', '85%'];
  return (
    <View style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], padding: spacing['space-5'], gap: spacing['space-3'] }, style]}>
      {title ? <Skeleton height={24} width="55%" /> : null}
      {Array.from({ length: Math.max(lines - (title ? 1 : 0), 1) }, (_, i) => <Skeleton key={i} width={widths[i % widths.length]} />)}
    </View>
  );
}

export interface SkeletonListProps { /** Number of 72dp rows. @default 3 */ rows?: number; style?: StyleProp<ViewStyle> }

/** List skeleton: 72dp rows with a 44dp avatar and two lines each. */
export function SkeletonList({ rows = 3, style }: SkeletonListProps) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], paddingHorizontal: 20, paddingVertical: spacing['space-2'] }, style]}>
      {Array.from({ length: rows }, (_, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 72, borderBottomWidth: i < rows - 1 ? 1 : 0, borderBottomColor: colors.surfaceMuted }}>
          <Skeleton width={44} height={44} radius={999} />
          <View style={{ flex: 1, gap: spacing['space-2'] }}>
            <Skeleton width="60%" />
            <Skeleton width="40%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );
}

export interface SkeletonCardProps { /** Media block height. @default 150 */ mediaHeight?: number; style?: StyleProp<ViewStyle> }

/** Card skeleton: a 150dp media block and three text lines. */
export function SkeletonCard({ mediaHeight = 150, style }: SkeletonCardProps) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], padding: spacing['space-4'], gap: spacing['space-3'] }, style]}>
      <Skeleton height={mediaHeight} radius={radius['radius-md']} />
      <Skeleton width="70%" height={16} />
      <Skeleton width="90%" />
      <Skeleton width="45%" />
    </View>
  );
}
