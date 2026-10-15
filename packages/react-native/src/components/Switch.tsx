import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';

export interface SwitchProps extends Omit<PressableProps, 'children' | 'style' | 'onPress'> {
  /** On or off (controlled). */
  value: boolean;
  /** Called with the next value. A switch acts at once: never pair it with a Save button. */
  onValueChange?: (next: boolean) => void;
  /** Title of the setting: what is on ("Verse of the day"), not the action. Rendered with the row layout. */
  label?: string;
  /** One plain line on what happens. Say why when disabled ("Turn on notifications first"). */
  description?: string;
  /** Show only the 46x28dp track, without a row. Give it an `accessibilityLabel`. @default false */
  bare?: boolean;
  /** Draw the row without its own bottom divider (use inside `SwitchGroup`, which adds dividers). */
  style?: StyleProp<ViewStyle>;
}

const TRACK_W = 46;
const TRACK_H = 28;
const KNOB = 22;
const TRAVEL = 18;

/** 46x28dp toggle in a 44dp row with a title and description; the whole row is the tap target. */
export function Switch({ value, onValueChange, label, description, bare = false, disabled, style, onFocus, onBlur, accessibilityLabel, accessibilityState, ...rest }: SwitchProps) {
  const { colors, isRTL, opacity, duration } = useTheme();
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [focused, setFocused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const off = !!disabled;

  useEffect(() => {
    let live = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => { if (live) setReduce(v); }).catch(() => undefined);
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (reduce) { progress.setValue(value ? 1 : 0); return; }
    Animated.timing(progress, { toValue: value ? 1 : 0, duration: duration['duration-fast'], useNativeDriver: true }).start();
  }, [value, reduce, progress, duration]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, isRTL ? -TRAVEL : TRAVEL] });

  const track = (pressed: boolean): ReactNode => (
    <View style={{ width: TRACK_W, height: TRACK_H }}>
      <View
        style={{
          width: TRACK_W, height: TRACK_H, borderRadius: 999,
          backgroundColor: value ? (pressed ? colors.primaryPressed : colors.primary) : pressed ? color['gray-500'] : color['gray-300'],
        }}
      >
        <Animated.View
          style={{
            position: 'absolute', top: 3, start: 3, width: KNOB, height: KNOB, borderRadius: KNOB / 2, backgroundColor: '#ffffff',
            shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 1.5, shadowOffset: { width: 0, height: 1 }, elevation: 2,
            transform: [{ translateX }],
          }}
        />
      </View>
      {focused ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: -4, bottom: -4, start: -4, end: -4, borderWidth: 2, borderRadius: 999, borderColor: colors.focus }} />
      ) : null}
    </View>
  );

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={description}
      accessibilityState={{ ...accessibilityState, disabled: off, checked: value }}
      disabled={off}
      onPress={() => onValueChange?.(!value)}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      hitSlop={bare ? { top: 8, bottom: 8, left: 4, right: 4 } : undefined}
      style={[
        bare
          ? { alignSelf: 'flex-start' }
          : { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20, minHeight: 44 },
        { opacity: off ? opacity['opacity-disabled'] : 1 },
        style,
      ]}
      {...rest}
    >
      {({ pressed }) => (
        <>
          {!bare && label ? (
            <View style={{ flex: 1, gap: 2 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Text variant="web-label" style={{ fontSize: 16, lineHeight: 22, color: off ? colors.disabledText : colors.text }}>{label}</Text>
              {description ? <Text variant="web-small" style={{ fontSize: 14, color: colors.textTertiary }}>{description}</Text> : null}
            </View>
          ) : null}
          {track(pressed)}
        </>
      )}
    </Pressable>
  );
}

export interface SwitchGroupProps {
  /** `Switch` rows. Keep groups to about 3 to 6 rows. */
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** White panel with a hairline border that groups related settings rows, with dividers between them. */
export function SwitchGroup({ children, style, testID }: SwitchGroupProps) {
  const { colors, radius } = useTheme();
  const rows = (Array.isArray(children) ? children : [children]).filter(Boolean);
  return (
    <View
      testID={testID}
      style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], paddingHorizontal: 24, paddingVertical: 4 }, style]}
    >
      {rows.map((row, i) => (
        <View key={i} style={{ paddingVertical: 18, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderBottomColor: colors.surfaceMuted }}>{row}</View>
      ))}
    </View>
  );
}
