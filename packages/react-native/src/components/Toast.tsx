import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastOptions {
  /** Past tense, plain, one line where possible: "Verse saved to your library." */
  message: string;
  /** Status dot. Errors are announced assertively. @default "success" */
  variant?: ToastVariant;
  /** One text action: Undo, Retry or View. Never the only path to an important action. */
  actionLabel?: string;
  /** Called when the action is pressed. The toast then closes. */
  onAction?: () => void;
  /** Auto-hide delay in ms. @default 5000 (8000 with an action) */
  duration?: number;
  /** Smaller 44dp variant for narrow frames. @default false */
  compact?: boolean;
}

interface ToastItem extends ToastOptions { id: number }

export interface ToastApi {
  /** Queue a toast. Returns its id. Newest shows on top; at most three are visible (the oldest is dropped). */
  show: (options: ToastOptions) => number;
  /** Close one toast. */
  dismiss: (id: number) => void;
  /** Close all toasts. */
  dismissAll: () => void;
}

const noop: ToastApi = { show: () => -1, dismiss: () => undefined, dismissAll: () => undefined };
const ToastContext = createContext<ToastApi>(noop);

/** Show and dismiss toasts. Needs a `ToastProvider` above; without one the calls do nothing. */
export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const MAX_VISIBLE = 3;

export interface ToastProps extends ToastOptions {
  /** Accessible name of the dismiss button. @default "Dismiss" */
  dismissLabel?: string;
  /** Called by the dismiss button (shown when there is no action). */
  onDismiss?: () => void;
  /** Pause timers while the pointer, finger or focus is on the toast. */
  onPauseChange?: (paused: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

/** The dark toast surface: status dot, message and one action or a dismiss button. Use through `useToast`. */
export function Toast({ message, variant = 'success', actionLabel, onAction, compact = false, dismissLabel = 'Dismiss', onDismiss, onPauseChange, style }: ToastProps) {
  const { radius, shadow } = useTheme();
  const dot = variant === 'error' ? color['error'] : variant === 'info' ? color['horizon-blue'] : color['success'];
  const target = compact ? 40 : 44;
  return (
    <View
      accessible={!actionLabel && !onDismiss}
      accessibilityRole={variant === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion={variant === 'error' ? 'assertive' : 'polite'}
      onTouchStart={() => onPauseChange?.(true)}
      onTouchEnd={() => onPauseChange?.(false)}
      onTouchCancel={() => onPauseChange?.(false)}
      style={[
        {
          flexDirection: 'row', alignItems: 'center', gap: compact ? 10 : 12, width: '100%', maxWidth: 420, minHeight: compact ? 44 : 52,
          paddingVertical: compact ? 2 : 4, paddingEnd: compact ? 2 : 4, paddingStart: compact ? 12 : 16,
          borderRadius: radius['radius-md'], backgroundColor: color['charcoal-900'], ...shadow['shadow-overlay'],
        },
        style,
      ]}
    >
      <View
        accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        style={{ width: compact ? 18 : 24, height: compact ? 18 : 24, borderRadius: 999, backgroundColor: dot, alignItems: 'center', justifyContent: 'center' }}
      >
        <Svg width={compact ? 11 : 14} height={compact ? 11 : 14} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
          {variant === 'success' ? <Path d="M5 12l5 5 9-10" /> : variant === 'error' ? <Path d="M12 6v7M12 17.5v.01" /> : <Path d="M12 11v6M12 7v.01" />}
        </Svg>
      </View>
      <Text variant="web-small" style={{ flex: 1, minWidth: 0, color: '#ffffff', fontSize: compact ? 13 : 15, lineHeight: compact ? 18 : 21, paddingVertical: 8 }}>{message}</Text>
      {actionLabel ? (
        <Pressable
          accessibilityRole="button" onPress={onAction} onFocus={() => onPauseChange?.(true)} onBlur={() => onPauseChange?.(false)}
          style={({ pressed }) => ({ minHeight: target, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 999, backgroundColor: pressed ? 'rgba(255,255,255,0.08)' : 'transparent' })}
        >
          <Text variant="web-label" style={{ color: color['blue-on-dark'], fontSize: compact ? 13 : 15 }}>{actionLabel}</Text>
        </Pressable>
      ) : onDismiss ? (
        <Pressable
          accessibilityRole="button" accessibilityLabel={dismissLabel} onPress={onDismiss} onFocus={() => onPauseChange?.(true)} onBlur={() => onPauseChange?.(false)}
          style={({ pressed }) => ({ width: target, height: target, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? 'rgba(255,255,255,0.08)' : 'transparent' })}
        >
          <UiIcon name="close" size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>
      ) : null}
    </View>
  );
}

interface EntryProps {
  item: ToastItem;
  dismissLabel: string;
  reduceMotion: boolean;
  onClose: (id: number) => void;
}

/** One queued toast: owns its timer (paused on touch/focus), enter (rise 8dp, 200ms) and leave (fade 150ms) animation. */
function ToastEntry({ item, dismissLabel, reduceMotion, onClose }: EntryProps) {
  const { duration } = useTheme();
  const anim = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const [paused, setPaused] = useState(false);
  const closing = useRef(false);
  const total = item.duration ?? (item.actionLabel ? 8000 : 5000);
  const remaining = useRef(total);
  const startedAt = useRef(0);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reduceMotion) { onClose(item.id); return; }
    Animated.timing(anim, { toValue: 0, duration: duration['duration-fast'], useNativeDriver: true }).start(() => onClose(item.id));
  }, [anim, duration, item.id, onClose, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(anim, { toValue: 1, duration: duration['duration-base'], useNativeDriver: true }).start();
  }, [anim, duration, reduceMotion]);

  useEffect(() => {
    if (item.variant === 'error') AccessibilityInfo.announceForAccessibility?.(item.message);
  }, [item.variant, item.message]);

  useEffect(() => {
    if (paused) return undefined;
    startedAt.current = Date.now();
    const t = setTimeout(close, Math.max(remaining.current, 0));
    return () => {
      clearTimeout(t);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, close]);

  return (
    <Animated.View
      style={{
        opacity: anim, width: '100%', alignItems: 'center',
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
      }}
    >
      <Toast
        {...item}
        dismissLabel={dismissLabel}
        onPauseChange={setPaused}
        onDismiss={close}
        onAction={() => { item.onAction?.(); close(); }}
      />
    </Animated.View>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Extra distance from the bottom edge, to clear a sticky Give bar or tab bar. @default 0 */
  bottomOffset?: number;
  /** Accessible name of the dismiss button. @default "Dismiss" */
  dismissLabel?: string;
}

/**
 * Hosts the toast region above your app. One polite live region exists from first render so new toasts are announced;
 * errors are also announced with `announceForAccessibility`. Bottom-centre on phones, bottom-end from 768dp wide.
 */
export function ToastProvider({ children, bottomOffset = 0, dismissLabel = 'Dismiss' }: ToastProviderProps) {
  const { zIndex } = useTheme();
  const { width } = useWindowDimensions();
  const [items, setItems] = useState<ToastItem[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const nextId = useRef(1);
  const wide = width >= 768;

  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { if (live) setReduceMotion(v); }).catch(() => undefined);
    return () => { live = false; };
  }, []);

  const dismiss = useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), []);
  const dismissAll = useCallback(() => setItems([]), []);
  const show = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    setItems((list) => [{ ...options, id }, ...list].slice(0, MAX_VISIBLE));
    return id;
  }, []);
  const api = useMemo<ToastApi>(() => ({ show, dismiss, dismissAll }), [show, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <View
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={{
          position: 'absolute', start: wide ? undefined : 16, end: wide ? 24 : 16, bottom: (wide ? 24 : 16) + bottomOffset, zIndex: zIndex['z-toast'],
          alignItems: wide ? 'flex-end' : 'center', gap: 8, ...(wide ? { width: 420 } : null),
        }}
      >
        {items.map((item) => <ToastEntry key={item.id} item={item} dismissLabel={dismissLabel} reduceMotion={reduceMotion} onClose={dismiss} />)}
      </View>
    </ToastContext.Provider>
  );
}
