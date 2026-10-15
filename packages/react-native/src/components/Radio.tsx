import { createContext, useContext, useState, type ReactNode } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

interface GroupCtx { value?: string; onValueChange?: (v: string) => void; invalid: boolean; disabled: boolean }
const RadioContext = createContext<GroupCtx | null>(null);

export interface RadioProps extends Omit<PressableProps, 'children' | 'style' | 'onPress'> {
  /** Value reported to the group when selected. */
  value: string;
  /** Option label. */
  label: ReactNode;
  /** One-line explanation under the label (card variant) or beside it (row variant, e.g. "(coming soon)"). */
  description?: string;
  /** Selected state when used without a `RadioGroup`. @default false */
  selected?: boolean;
  /** Called when pressed when used without a `RadioGroup`. */
  onSelect?: (value: string) => void;
  /** `row` is a 44dp row; `card` is a bordered row with a description. @default "row" */
  variant?: 'row' | 'card';
  style?: StyleProp<ViewStyle>;
}

/** 20dp radio with a 6dp Horizon Blue ring when selected. Use inside `RadioGroup`. */
export function Radio({ value, label, description, selected, onSelect, variant = 'row', disabled, style, onFocus, onBlur, accessibilityState, ...rest }: RadioProps) {
  const { colors, isDark, radius } = useTheme();
  const group = useContext(RadioContext);
  const [focused, setFocused] = useState(false);
  const off = !!disabled || !!group?.disabled;
  const isOn = group ? group.value === value : !!selected;
  const invalid = !!group?.invalid && !isOn;
  const card = variant === 'card';
  const ring = off ? color['gray-300'] : isOn ? colors.primary : invalid ? colors.error : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
  const fill = off ? colors.disabledBg : invalid ? colors.errorBg : colors.surface;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ ...accessibilityState, disabled: off, selected: isOn, checked: isOn }}
      disabled={off}
      onPress={() => { group?.onValueChange?.(value); onSelect?.(value); }}
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      style={({ pressed }) => [
        card
          ? {
              flexDirection: 'row', alignItems: 'flex-start', gap: 12, minHeight: 44, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderRadius: radius['radius-md'],
              borderColor: off ? (isDark ? colors.border : color['gray-200']) : isOn ? colors.primary : pressed ? 'rgba(0,0,0,0.3)' : colors.border,
              backgroundColor: off ? colors.background : isOn ? colors.tint : colors.surface,
            }
          : { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
        focused ? { borderColor: colors.focus } : null,
        style,
      ]}
      {...rest}
    >
      <View style={{ marginTop: card ? 2 : 0 }}>
        <View
          style={{
            width: 20, height: 20, borderRadius: 10, borderColor: ring, backgroundColor: isOn ? colors.surface : fill,
            borderWidth: isOn ? 6 : 1.5,
          }}
        />
        {focused ? (
          <View pointerEvents="none" style={{ position: 'absolute', top: -4, bottom: -4, start: -4, end: -4, borderWidth: 2, borderRadius: 14, borderColor: colors.focus }} />
        ) : null}
      </View>
      <View style={card ? { flex: 1, gap: 2 } : { flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 6 }}>
        <Text variant={card ? 'web-label' : 'web-body'} style={{ fontSize: 16, lineHeight: 22, color: off ? colors.disabledText : colors.text }}>{label}</Text>
        {description ? <Text variant="web-small" style={{ fontSize: 14, color: colors.textTertiary }}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

export interface RadioGroupProps {
  /** Group question, e.g. "How often would you like to give?". */
  legend: string;
  /** Selected value. */
  value?: string;
  /** Called with the chosen value. */
  onValueChange?: (value: string) => void;
  /** One error line for the whole group, with an icon. Marks every unselected radio invalid. */
  error?: string;
  /** Disable all options. @default false */
  disabled?: boolean;
  /** The `Radio` options. */
  children: ReactNode;
  /** Gap between options. @default 0 */
  gap?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Fieldset equivalent: legend plus exactly one selectable option, announced as a radio group. */
export function RadioGroup({ legend, value, onValueChange, error, disabled = false, children, gap = 0, style, testID }: RadioGroupProps) {
  const { colors } = useTheme();
  return (
    <RadioContext.Provider value={{ value, onValueChange, invalid: !!error, disabled }}>
      <View accessibilityRole="radiogroup" accessibilityLabel={legend} style={[{ alignSelf: 'stretch' }, style]} testID={testID}>
        <Text variant="web-label" accessibilityRole="header" style={{ color: colors.textSecondary, marginBottom: 10 }}>{legend}</Text>
        <View style={{ gap }}>{children}</View>
        {error ? (
          <View accessibilityLiveRegion="assertive" style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
            <UiIcon name="alert-circle" size={16} color={colors.error} />
            <Text variant="web-label" style={{ flex: 1, fontSize: 14, color: colors.error }}>{error}</Text>
          </View>
        ) : null}
      </View>
    </RadioContext.Provider>
  );
}
