import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { if (live) setReduce(v); }).catch(() => undefined);
    return () => { live = false; };
  }, []);
  return reduce;
}

const clamp = (v: number, max: number) => Math.min(Math.max(v, 0), max);

export interface ProgressBarProps extends Omit<ViewProps, 'children'> {
  /** Current value from 0 to `max`. Ignored when `indeterminate`. */
  value?: number;
  /** Total. @default 100 */
  max?: number;
  /** Work of unknown length (longer than about 2 seconds). Leaves the value out of the accessibility info. @default false */
  indeterminate?: boolean;
  /** Task name: verb and object, "Downloading Amharic audio Bible". Also the accessible name. */
  label?: string;
  /** Right-hand text such as "68%". Defaults to the percent when `label` is set and the bar is determinate. Pass `null` to hide. */
  valueText?: string | null;
  /** Hint line below: amount and time, "412 MB of 600 MB". */
  hint?: string;
  /** Accessible name when no visible `label`. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Linear progress: 4dp track, or 8dp with a label row. Fill animates 0.3s; indeterminate bar loops every 1.4s. */
export function ProgressBar({ value = 0, max = 100, indeterminate = false, label, valueText, hint, accessibilityLabel, style, ...rest }: ProgressBarProps) {
  const { colors, isDark, radius, duration, isRTL } = useTheme();
  const reduce = useReduceMotion();
  const [w, setW] = useState(0);
  const pct = max > 0 ? clamp(value, max) / max : 0;
  const fill = useRef(new Animated.Value(pct)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const large = !!label;
  const trackColor = isDark ? color['charcoal-700'] : color['gray-200'];
  const barColor = isDark ? color['blue-on-dark'] : colors.primary;
  const shown = valueText === undefined ? (large && !indeterminate ? `${Math.round(pct * 100)}%` : null) : valueText;

  useEffect(() => {
    if (indeterminate) return;
    if (reduce) { fill.setValue(pct); return; }
    Animated.timing(fill, { toValue: pct, duration: duration['duration-slow'], easing: Easing.out(Easing.ease), useNativeDriver: false }).start();
  }, [pct, indeterminate, reduce, fill, duration]);

  useEffect(() => {
    if (!indeterminate || reduce || w === 0) return undefined;
    const loop = Animated.loop(Animated.timing(slide, { toValue: 1, duration: 1400, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: true }));
    loop.start();
    return () => { loop.stop(); slide.setValue(0); };
  }, [indeterminate, reduce, w, slide]);

  const bar = w * 0.35;
  const dir = isRTL ? -1 : 1;
  return (
    <View style={[{ gap: 8, alignSelf: 'stretch' }, style]} {...rest}>
      {label || shown ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          {label ? <Text variant="web-label" style={{ flex: 1, fontSize: 15 }}>{label}</Text> : null}
          {shown ? <Text variant="web-small" tone="body" style={{ fontVariant: ['tabular-nums'] }}>{shown}</Text> : null}
        </View>
      ) : null}
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityValue={indeterminate ? undefined : { min: 0, max, now: clamp(value, max), text: shown ?? undefined }}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        style={{ height: large ? 8 : 4, borderRadius: radius['radius-xs'], backgroundColor: trackColor, overflow: 'hidden' }}
      >
        {indeterminate ? (
          reduce ? (
            <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, width: '35%', borderRadius: radius['radius-xs'], backgroundColor: barColor }} />
          ) : (
            <Animated.View
              style={{
                position: 'absolute', top: 0, bottom: 0, start: 0, width: bar, borderRadius: radius['radius-xs'], backgroundColor: barColor,
                transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [-bar * dir, (w + 0) * dir] }) }],
              }}
            />
          )
        ) : (
          <Animated.View
            style={{
              height: '100%', borderRadius: radius['radius-xs'], backgroundColor: barColor,
              width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }}
          />
        )}
      </View>
      {hint ? <Text variant="web-small" style={{ fontSize: 14, color: colors.textTertiary }}>{hint}</Text> : null}
    </View>
  );
}

export interface ProgressRingProps extends Omit<ViewProps, 'children'> {
  /** Current value from 0 to `max`. */
  value: number;
  /** Total. @default 100 */
  max?: number;
  /** `lg` is 64dp with a 6dp stroke and the percent inside; `inline` is 24dp with a 3dp stroke and `label` beside it. @default "lg" */
  size?: 'lg' | 'inline';
  /** Accessible name. Also shown beside the ring when `size="inline"`. */
  label: string;
  /** Show the percent in the middle of the large ring. @default true */
  showValue?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Circular progress starting at 12 o'clock with round caps. The SVG is hidden from screen readers; the wrapper carries the progressbar role. */
export function ProgressRing({ value, max = 100, size = 'lg', label, showValue = true, style, ...rest }: ProgressRingProps) {
  const { colors, isDark } = useTheme();
  const lg = size === 'lg';
  const d = lg ? 64 : 24;
  const stroke = lg ? 6 : 3;
  const r = lg ? 28 : 9.5;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? clamp(value, max) / max : 0;
  const track = isDark ? color['charcoal-700'] : color['gray-200'];
  const bar = isDark ? color['blue-on-dark'] : colors.primary;
  const percent = `${Math.round(pct * 100)}%`;
  return (
    <View
      accessible accessibilityRole="progressbar" accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: clamp(value, max), text: percent }}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'flex-start' }, style]}
      {...rest}
    >
      <View style={{ width: d, height: d, alignItems: 'center', justifyContent: 'center' }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
          <Circle
            cx={d / 2} cy={d / 2} r={r} fill="none" stroke={bar} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${circ}`} strokeDashoffset={circ * (1 - pct)}
          />
        </Svg>
        {lg && showValue ? <Text variant="web-label" style={{ fontSize: 15, fontVariant: ['tabular-nums'] }}>{percent}</Text> : null}
      </View>
      {!lg ? <Text variant="web-small" tone="body">{label}</Text> : null}
    </View>
  );
}

export interface StepProgressProps extends Omit<ViewProps, 'children'> {
  /** Completed or current step, 1-based. */
  step: number;
  /** Total number of steps (two to five). */
  steps: number;
  /** Visible label, localized: "Step 1 of 2". Also the accessible name. */
  label: string;
  style?: StyleProp<ViewStyle>;
}

/** Step progress for multi-step forms: label at the start, bar filling one share per step. */
export function StepProgress({ step, steps, label, style, ...rest }: StepProgressProps) {
  const { radius, isDark, colors } = useTheme();
  const pct = steps > 0 ? clamp(step, steps) / steps : 0;
  return (
    <View
      accessible accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: steps, now: clamp(step, steps), text: label }}
      style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, maxWidth: 560, alignSelf: 'stretch' }, style]}
      {...rest}
    >
      <Text variant="web-label" style={{ fontSize: 15 }}>{label}</Text>
      <View style={{ flex: 1, height: 4, borderRadius: radius['radius-xs'], backgroundColor: isDark ? color['charcoal-700'] : color['gray-200'], overflow: 'hidden' }}>
        <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: radius['radius-xs'], backgroundColor: isDark ? color['blue-on-dark'] : colors.primary }} />
      </View>
    </View>
  );
}
