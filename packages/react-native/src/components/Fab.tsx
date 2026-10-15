import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Pressable, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => { if (alive) setReduce(v); }).catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => { alive = false; sub.remove(); };
  }, []);
  return reduce;
}

/** Height the FAB moves up while a snackbar is showing (the web `.ap-fab-lifted` step, 64dp). */
const LIFT = 64;

export interface FabProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Names the action, since the icon is always +: "New note". Required. */
  label: string;
  /** Move up above a visible snackbar. @default false */
  lifted?: boolean;
  /** Absolute inside the screen (`absolute`, 16dp from the end and 16dp above `bottomOffset`) or in the normal flow (`static`). @default "absolute" */
  placement?: 'absolute' | 'static';
  /** Height of what the FAB must clear: the tab bar (including safe area) and the mini player. Added to the 16dp margin. @default 0 */
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}

/** The floating + button for a screen's one main create action. The screen's one Horizon Blue primary: never beside another. */
export function Fab({ label, lifted = false, placement = 'absolute', bottomOffset = 0, disabled, style, onFocus, onBlur, ...rest }: FabProps) {
  const { colors, radius, opacity, duration } = useTheme();
  const reduce = useReduceMotion();
  const lift = useRef(new Animated.Value(lifted ? -LIFT : 0)).current;
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    Animated.timing(lift, { toValue: lifted ? -LIFT : 0, duration: reduce ? 0 : duration['duration-base'], useNativeDriver: true }).start();
  }, [lifted, reduce, duration, lift]);
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[placement === 'absolute' ? { position: 'absolute', end: 16, bottom: 16 + bottomOffset, zIndex: 5 } : null, { transform: [{ translateY: lift }] }]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: !!disabled }}
        disabled={disabled}
        onFocus={(e) => { setFocus(true); onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); onBlur?.(e); }}
        {...rest}
        style={({ pressed }): StyleProp<ViewStyle> => [
          {
            width: 56, height: 56, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.primaryPressed : colors.primary,
            opacity: disabled ? opacity['opacity-disabled'] : 1, shadowColor: colors.primary, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 12 }, elevation: 8,
            ...(focus ? { outlineColor: colors.focus, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' as const } : null),
          },
          style,
        ]}
      >
        <UiIcon name="plus" size={24} color="#ffffff" />
      </Pressable>
    </Animated.View>
  );
}

export interface PullToRefreshProps extends Omit<ViewProps, 'children'> {
  /** One short line about what is happening: "Checking for new episodes…". */
  text: string;
  style?: StyleProp<ViewStyle>;
}

/** Refresh indicator: a 40dp white disc with a spinning blue arc, under the app bar. Reduced motion shows the static arc and the text. */
export function PullToRefresh({ text, style, ...rest }: PullToRefreshProps) {
  const { colors, spacing } = useTheme();
  const reduce = useReduceMotion();
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduce) { spin.setValue(0); return undefined; }
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [reduce, spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <View accessibilityLiveRegion="polite" accessibilityRole="summary" {...rest} style={[{ alignItems: 'center', gap: spacing['space-2'], height: 84, paddingTop: spacing['space-2'] }, style]}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
        <Animated.View style={{ transform: [{ rotate }] }}><UiIcon name="refresh" size={20} color={colors.primary} /></Animated.View>
      </View>
      <Text variant="body-sm" tone="body" style={{ fontSize: 13 }}>{text}</Text>
    </View>
  );
}

export interface SnackbarProps extends Omit<ViewProps, 'children'> {
  /** Show the snackbar. */
  visible: boolean;
  /** Past tense and verb, one line: "Note deleted". */
  message: string;
  /** One text action: "Undo", "View". */
  actionLabel?: string;
  /** Called by the action. Offer Undo somewhere else too, as the snackbar disappears. */
  onAction?: () => void;
  /** Called when the time runs out. Set `visible` to false in response. */
  onDismiss?: () => void;
  /** Milliseconds before `onDismiss`. Defaults to 5000, or 8000 when there is an action. */
  durationMs?: number;
  /** Height of the tab bar (including safe area) it sits above. It floats 12dp above that. @default 0 */
  bottomOffset?: number;
  style?: StyleProp<ViewStyle>;
}

/** One-line confirmation in charcoal with an optional text action, above the tab bar. Never receives focus; announced politely. */
export function Snackbar({ visible, message, actionLabel, onAction, onDismiss, durationMs, bottomOffset = 0, style, ...rest }: SnackbarProps) {
  const { colors, radius, shadow } = useTheme();
  const reduce = useReduceMotion();
  const fade = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [mounted, setMounted] = useState(visible);
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  const ms = durationMs ?? (actionLabel ? 8000 : 5000);
  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(fade, { toValue: 1, duration: reduce ? 0 : 150, useNativeDriver: true }).start();
      const t = setTimeout(() => dismiss.current?.(), ms);
      return () => clearTimeout(t);
    }
    Animated.timing(fade, { toValue: 0, duration: reduce ? 0 : 150, useNativeDriver: true }).start(({ finished }) => { if (finished) setMounted(false); });
    return undefined;
  }, [visible, ms, reduce, fade]);
  useEffect(() => {
    if (visible) AccessibilityInfo.announceForAccessibility(message);
  }, [visible, message]);
  if (!mounted) return null;
  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityRole="summary"
      {...rest}
      style={[{ position: 'absolute', start: 12, end: 12, bottom: 12 + bottomOffset, zIndex: 5, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingStart: 16, paddingEnd: 6, borderRadius: radius['radius-md'], backgroundColor: '#161819', opacity: fade, ...shadow['shadow-overlay'] }, style]}
    >
      <Text variant="web-body" style={{ flex: 1, fontSize: 15, color: '#ffffff' }}>{message}</Text>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => ({ minHeight: 44, paddingHorizontal: 12, justifyContent: 'center', borderRadius: radius['radius-sm'], backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'transparent' })}>
          <Text variant="web-label" style={{ fontSize: 15, color: '#7fa6f7' }}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
