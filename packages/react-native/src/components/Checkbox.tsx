import { useState, type ReactNode } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

export interface CheckboxProps extends Omit<PressableProps, 'children' | 'style' | 'onPress'> {
  /** Label next to the box. May contain a nested `<Text tone="link">`. */
  label: ReactNode;
  /** One-line explanation under the label. Only shown in the `card` variant. */
  description?: string;
  /** Checked state (controlled). @default false */
  checked?: boolean;
  /** Shows a dash and reports `mixed` to screen readers. Use with a summary, e.g. "3 of 12". @default false */
  indeterminate?: boolean;
  /** Called with the next checked value. */
  onValueChange?: (next: boolean) => void;
  /** `inline` is a 44dp row for consent; `card` is a bordered row for choosing among 2 to 7 options. @default "inline" */
  variant?: 'inline' | 'card';
  /** Marks the box invalid (error border and fill). Put the message in a `CheckboxGroup` or beside the control. @default false */
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** 20dp checkbox with 6dp corners: unchecked, checked, indeterminate, disabled, invalid and focus states. */
export function Checkbox({
  label, description, checked = false, indeterminate = false, onValueChange, variant = 'inline', invalid = false, disabled, style, onFocus, onBlur, accessibilityState, ...rest
}: CheckboxProps) {
  const { colors, isDark, radius } = useTheme();
  const [focused, setFocused] = useState(false);
  const off = !!disabled;
  const on = checked || indeterminate;
  const card = variant === 'card';

  const boxFill = off ? (on ? color['gray-300'] : colors.disabledBg)
    : on ? colors.primary : invalid ? colors.errorBg : colors.surface;
  const boxBorder = off ? color['gray-300'] : on ? colors.primary : invalid ? colors.error : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ ...accessibilityState, disabled: off, checked: indeterminate ? 'mixed' : checked }}
      disabled={off}
      onPress={() => onValueChange?.(indeterminate ? true : !checked)}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      style={({ pressed }) => [
        card
          ? {
              flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 44, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderRadius: radius['radius-md'],
              borderColor: off ? (isDark ? colors.border : color['gray-200']) : checked ? colors.primary : pressed ? 'rgba(0,0,0,0.3)' : colors.border,
              backgroundColor: off ? colors.background : checked ? colors.tint : colors.surface,
            }
          : { flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 44, paddingTop: 12 },
        focused ? { borderColor: colors.focus } : null,
        style,
      ]}
      {...rest}
    >
      <View style={{ marginTop: card ? 2 : 1 }}>
        <View
          style={{
            width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: boxFill === colors.primary ? colors.primary : boxBorder, backgroundColor: boxFill,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {on ? (
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
              <Path d={indeterminate ? 'M6 12h12' : 'M5 12l5 5 9-10'} />
            </Svg>
          ) : null}
        </View>
        {focused ? (
          <View pointerEvents="none" style={{ position: 'absolute', top: -4, bottom: -4, start: -4, end: -4, borderWidth: 2, borderRadius: 10, borderColor: colors.focus }} />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant={card ? 'web-label' : 'web-body'} style={{ fontSize: 16, lineHeight: 22, color: off ? colors.disabledText : colors.text }}>{label}</Text>
        {card && description ? <Text variant="web-small" style={{ fontSize: 14, color: colors.textTertiary }}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

export interface CheckboxGroupProps {
  /** Group question, shown above the options. */
  legend: string;
  /** One error line for the group, shown under the options with an icon. */
  error?: string;
  /** The `Checkbox` rows. */
  children: ReactNode;
  /** Gap between rows. Use 8 for card rows, 0 for inline. @default 8 */
  gap?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Fieldset equivalent: legend, rows and one error line, announced as a group. */
export function CheckboxGroup({ legend, error, children, gap = 8, style, testID }: CheckboxGroupProps) {
  const { colors } = useTheme();
  return (
    <View style={[{ alignSelf: 'stretch' }, style]} testID={testID}>
      <Text variant="web-label" accessibilityRole="header" style={{ color: colors.textSecondary, marginBottom: 10 }}>{legend}</Text>
      <View style={{ gap }}>{children}</View>
      {error ? (
        <View accessibilityLiveRegion="assertive" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <UiIcon name="alert-circle" size={16} color={colors.error} />
          <Text variant="web-label" style={{ flex: 1, fontSize: 14, color: colors.error }}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
