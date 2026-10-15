import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo, Animated, PanResponder, Pressable, View, findNodeHandle, useWindowDimensions,
  type StyleProp, type View as RNView, type ViewProps, type ViewStyle,
} from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';

/** Tracks the system reduced-motion setting. Starts false so server rendering is stable. */
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

/** Drives `progress` 0 to 1 when `visible` turns true and back when false; `mounted` stays true until the exit finishes. */
function useOverlayTransition(visible: boolean, enterMs: number, exitMs: number) {
  const progress = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const [mounted, setMounted] = useState(visible);
  const reduce = useReduceMotion();
  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, { toValue: 1, duration: reduce ? 120 : enterMs, useNativeDriver: true }).start();
    } else {
      Animated.timing(progress, { toValue: 0, duration: reduce ? 120 : exitMs, useNativeDriver: true }).start(({ finished }) => { if (finished) setMounted(false); });
    }
  }, [visible, reduce, enterMs, exitMs, progress]);
  return { progress, mounted, reduce };
}

const FILL: ViewStyle = { position: 'absolute', top: 0, bottom: 0, start: 0, end: 0 };

export interface BottomSheetProps extends Omit<ViewProps, 'children'> {
  /** Show the sheet. It animates in and out; unmounts after the exit. */
  visible: boolean;
  /** Called by the scrim, the Close button and a drag down. The sheet only hides when you set `visible` to false. */
  onClose: () => void;
  /** Task title: "Share this verse". Gets focus when the sheet opens. */
  title: string;
  /** Source line under the title: "John 3:16 · Berean Standard Bible". */
  subtitle?: string;
  /** Sheet content: share tiles, list rows, a verse preview. */
  children?: ReactNode;
  /** Expanded height (top 96dp, heavier scrim) instead of the content-height peek. Controlled. @default false */
  expanded?: boolean;
  /** Called when the reader drags up (to expand). */
  onExpandedChange?: (expanded: boolean) => void;
  /** Accessible name of the Close button. @default "Close" */
  closeLabel?: string;
  /** Safe-area insets; `bottom` is added under the content. */
  safeAreaInsets?: { top?: number; bottom?: number };
  style?: StyleProp<ViewStyle>;
}

/**
 * A panel that slides up for focused tasks. Fills its positioned parent (put it last inside the screen) with a scrim behind it.
 * Drag the header down to close or up to expand; reduced motion fades instead of sliding. Do not stack sheets.
 */
export function BottomSheet({ visible, onClose, title, subtitle, children, expanded = false, onExpandedChange, closeLabel = 'Close', safeAreaInsets, style, ...rest }: BottomSheetProps) {
  const { colors, radius, spacing, duration, isDark, opacity } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const { progress, mounted, reduce } = useOverlayTransition(visible, duration['duration-slow'], duration['duration-base']);
  const dragY = useRef(new Animated.Value(0)).current;
  const titleRef = useRef<RNView>(null);
  const cb = useRef({ onClose, onExpandedChange, expanded });
  cb.current = { onClose, onExpandedChange, expanded };

  useEffect(() => {
    if (!visible) return undefined;
    const t = setTimeout(() => {
      const node = titleRef.current ? findNodeHandle(titleRef.current) : null;
      if (node) AccessibilityInfo.setAccessibilityFocus(node);
    }, 350);
    return () => clearTimeout(t);
  }, [visible]);

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_e, g) => Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
        onPanResponderMove: (_e, g) => dragY.setValue(g.dy > 0 ? g.dy : g.dy / 4),
        onPanResponderRelease: (_e, g) => {
          if (g.dy > 80 || g.vy > 0.8) {
            dragY.setValue(0);
            cb.current.onClose();
            return;
          }
          if (g.dy < -40 && !cb.current.expanded) cb.current.onExpandedChange?.(true);
          Animated.spring(dragY, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
        },
        onPanResponderTerminate: () => Animated.spring(dragY, { toValue: 0, useNativeDriver: true }).start(),
      }),
    [dragY],
  );

  if (!mounted) return null;
  const slide = progress.interpolate({ inputRange: [0, 1], outputRange: [reduce ? 0 : windowHeight, 0] });
  const translateY = Animated.add(slide, dragY);
  const bottomInset = safeAreaInsets?.bottom ?? 0;
  const scrimColor = expanded ? opacity['scrim-sheet'] : opacity['scrim-peek'];

  return (
    <View pointerEvents="box-none" style={[FILL, { zIndex: 6 }]}>
      <Animated.View pointerEvents="auto" style={[FILL, { backgroundColor: scrimColor, opacity: progress }]}>
        <Pressable accessible={false} importantForAccessibility="no" accessibilityElementsHidden onPress={onClose} style={FILL} />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        accessibilityLabel={title}
        {...rest}
        style={[
          {
            position: 'absolute', start: 0, end: 0, bottom: 0, ...(expanded ? { top: 96 } : { maxHeight: windowHeight - 96 }),
            backgroundColor: colors.surface, borderTopStartRadius: radius['radius-xl'], borderTopEndRadius: radius['radius-xl'],
            paddingTop: 8, paddingHorizontal: 20, paddingBottom: bottomInset + spacing['space-4'], gap: 14,
            shadowColor: '#000000', shadowOpacity: 0.28, shadowRadius: 22, shadowOffset: { width: 0, height: -18 }, elevation: 12,
            opacity: reduce ? progress : 1, transform: [{ translateY }],
          },
          style,
        ]}
      >
        <View {...pan.panHandlers} style={{ gap: 14 }}>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: radius['radius-pill'], backgroundColor: isDark ? '#373737' : '#c7c8cb' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing['space-3'] }}>
            <View ref={titleRef} accessible accessibilityRole="header" style={{ flex: 1, minWidth: 0 }}>
              <Text variant="web-h3" style={{ fontSize: 20, lineHeight: 26, letterSpacing: -0.3 }}>{title}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={closeLabel}
              onPress={onClose}
              hitSlop={4}
              style={({ pressed }) => ({ width: 36, height: 36, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.border : colors.surfaceMuted })}
            >
              <UiIcon name="close" size={20} />
            </Pressable>
          </View>
          {subtitle ? <Text variant="body-sm" tone="tertiary" style={{ fontSize: 14, marginTop: -10 }}>{subtitle}</Text> : null}
        </View>
        {children}
      </Animated.View>
    </View>
  );
}

export interface ShareOption {
  /** Icon from the UI set. */
  icon: UiIconProps['name'];
  /** Visible and accessible label: "Copy". */
  label: string;
  onPress?: () => void;
}

export interface BottomSheetShareRowProps extends ViewProps {
  /** Up to four options per row; extra options wrap to the next row. */
  options: ShareOption[];
  style?: StyleProp<ViewStyle>;
}

/** Share tiles: 56dp tinted tiles with Horizon Blue icons, four per row. */
export function BottomSheetShareRow({ options, style, ...rest }: BottomSheetShareRowProps) {
  const { colors, radius } = useTheme();
  const [focus, setFocus] = useState<string | null>(null);
  return (
    <View {...rest} style={[{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 }, style]}>
      {options.map((o) => (
        <View key={o.label} style={{ width: '25%', paddingHorizontal: 4 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={o.label}
            onPress={o.onPress}
            onFocus={() => setFocus(o.label)}
            onBlur={() => setFocus(null)}
            style={{ alignItems: 'center', gap: 8, borderRadius: radius['radius-ml'], ...(focus === o.label ? { outlineColor: colors.focus, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' as const } : null) }}
          >
            {({ pressed }) => (
              <>
                <View style={{ width: 56, height: 56, borderRadius: radius['radius-ml'], backgroundColor: pressed ? colors.tintLine : colors.tint, alignItems: 'center', justifyContent: 'center' }}>
                  <UiIcon name={o.icon} size={24} color={colors.primary} />
                </View>
                <Text variant="body-sm" accessibilityElementsHidden importantForAccessibility="no" style={{ fontSize: 12, fontWeight: '500', textAlign: 'center' }}>{o.label}</Text>
              </>
            )}
          </Pressable>
        </View>
      ))}
    </View>
  );
}

export interface BottomSheetListRowProps {
  /** Leading icon. */
  icon?: UiIconProps['name'];
  /** Row label. */
  label: string;
  /** Current value, e.g. "BSB". Shown in tertiary text before the chevron. */
  value?: string;
  /** Opens another screen: shows the chevron. Rows that act immediately have none. @default false */
  drillIn?: boolean;
  onPress?: () => void;
  /** Draw the hairline above the row. @default true */
  divider?: boolean;
  testID?: string;
}

/** Sheet list row, at least 52dp. Announces label and value together. */
export function BottomSheetListRow({ icon, label, value, drillIn = false, onPress, divider = true, testID }: BottomSheetListRowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 52, borderTopWidth: divider ? 1 : 0, borderTopColor: colors.border, backgroundColor: pressed ? colors.surfaceMuted : 'transparent' })}
    >
      {icon ? <UiIcon name={icon} size={20} color={colors.textBody} /> : null}
      <Text variant="web-body" style={{ flex: 1, fontSize: 16 }}>{label}</Text>
      {value ? <Text variant="web-small" tone="tertiary" style={{ fontSize: 15 }}>{value}</Text> : null}
      {drillIn ? <UiIcon name="chevron-right" size={20} color={colors.textTertiary} mirrorInRTL /> : null}
    </Pressable>
  );
}

export interface ActionSheetAction {
  /** Verb-first command: "Copy verse". */
  label: string;
  icon?: UiIconProps['name'];
  onPress: () => void;
  /** Destructive: `error` colour, 600 weight. Only one, and last. @default false */
  destructive?: boolean;
}

export interface ActionSheetProps extends Omit<ViewProps, 'children'> {
  /** Show the sheet. */
  visible: boolean;
  /** Called by the scrim and Cancel. */
  onClose: () => void;
  /** Bold head line, e.g. "John 3:16". */
  title?: string;
  /** Muted line under the head, e.g. "Highlighted in gold". */
  subtitle?: string;
  /** Two to five commands on one item. */
  actions: ActionSheetAction[];
  /** @default "Cancel" */
  cancelLabel?: string;
  /** Safe-area insets; `bottom` lifts the sheet above the home indicator. */
  safeAreaInsets?: { top?: number; bottom?: number };
  style?: StyleProp<ViewStyle>;
}

/** iOS-style action sheet: an inset card of commands and a separate Cancel card. Cancel is blue, never red. */
export function ActionSheet({ visible, onClose, title, subtitle, actions, cancelLabel = 'Cancel', safeAreaInsets, style, ...rest }: ActionSheetProps) {
  const { colors, radius, shadow, duration } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const { progress, mounted, reduce } = useOverlayTransition(visible, duration['duration-slow'], duration['duration-base']);
  if (!mounted) return null;
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [reduce ? 0 : windowHeight / 3, 0] });
  const row = (a: ActionSheetAction, first: boolean) => {
    const ink = a.destructive ? colors.error : colors.text;
    return (
      <Pressable
        key={a.label}
        accessibilityRole="button"
        onPress={a.onPress}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingHorizontal: 18, borderTopWidth: first && !title ? 0 : 1, borderTopColor: colors.border, backgroundColor: pressed ? colors.surfaceMuted : 'transparent' })}
      >
        {a.icon ? <UiIcon name={a.icon} size={20} color={a.destructive ? colors.error : colors.textBody} /> : null}
        <Text variant="web-body" style={{ fontSize: 17, color: ink, fontWeight: a.destructive ? '600' : '400' }}>{a.label}</Text>
      </Pressable>
    );
  };
  return (
    <View pointerEvents="box-none" style={[FILL, { zIndex: 6 }]}>
      <Animated.View style={[FILL, { backgroundColor: 'rgba(0,0,0,0.42)', opacity: progress }]}>
        <Pressable accessible={false} importantForAccessibility="no" accessibilityElementsHidden onPress={onClose} style={FILL} />
      </Animated.View>
      <Animated.View
        accessibilityViewIsModal
        accessibilityLabel={title}
        {...rest}
        style={[{ position: 'absolute', start: 10, end: 10, bottom: 10 + (safeAreaInsets?.bottom ?? 0), gap: 8, opacity: reduce ? progress : 1, transform: [{ translateY }] }, style]}
      >
        <View style={{ backgroundColor: colors.surface, borderRadius: radius['radius-lg'], overflow: 'hidden', ...shadow['shadow-overlay'] }}>
          {title || subtitle ? (
            <View accessibilityRole="header" accessible style={{ alignItems: 'center', gap: 2, paddingVertical: 14, paddingHorizontal: 16 }}>
              {title ? <Text variant="web-label" style={{ fontSize: 14 }}>{title}</Text> : null}
              {subtitle ? <Text variant="body-sm" tone="tertiary" style={{ fontSize: 13 }}>{subtitle}</Text> : null}
            </View>
          ) : null}
          {actions.map((a, i) => row(a, i === 0))}
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => ({ minHeight: 56, alignItems: 'center', justifyContent: 'center', borderRadius: radius['radius-lg'], backgroundColor: pressed ? colors.surfaceMuted : colors.surface })}
        >
          <Text variant="web-label" style={{ fontSize: 17, color: colors.link }}>{cancelLabel}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
