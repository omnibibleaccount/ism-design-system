import { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';

export interface SegmentOption {
  /** Value reported on select. */
  value: string;
  /** One or two words, no icons or counts. */
  label: string;
  /** Overrides the accessible name. */
  accessibilityLabel?: string;
}

export interface SegmentedControlProps {
  /** Two (or at most three) equal options. */
  options: readonly SegmentOption[];
  /** Selected value. Exactly one segment is always selected: pre-select the default. */
  value: string;
  /** Called with the chosen value. Updates content at once; never submits a form. */
  onValueChange: (value: string) => void;
  /** Accessible name of the group, e.g. "Gift frequency". */
  accessibilityLabel: string;
  /** Use on black or ink surfaces: translucent track, white selected segment. @default false */
  dark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Pill-shaped 2 to 3 option toggle. Selected segment fills charcoal (white on dark); never Horizon Blue. */
export function SegmentedControl({ options, value, onValueChange, accessibilityLabel, dark = false, style, testID }: SegmentedControlProps) {
  const { isDark, radius, size } = useTheme();
  const [focusedValue, setFocusedValue] = useState<string | null>(null);
  const onInk = dark;
  const track = onInk ? 'rgba(255,255,255,0.1)' : isDark ? color['charcoal-800'] : color['gray-100'];
  return (
    <View
      accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel} testID={testID}
      style={[{ flexDirection: 'row', gap: 8, padding: 4, borderRadius: radius['radius-pill'], backgroundColor: track, maxWidth: 420, alignSelf: 'stretch' }, style]}
    >
      {options.map((o) => {
        const on = o.value === value;
        const selectedBg = onInk ? '#ffffff' : isDark ? '#ffffff' : color['charcoal-900'];
        const selectedFg = onInk ? '#000000' : isDark ? '#000000' : '#ffffff';
        const idleFg = onInk || isDark ? '#ffffff' : color['charcoal-900'];
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityLabel={o.accessibilityLabel ?? o.label}
            accessibilityState={{ selected: on, checked: on }}
            onPress={() => { if (!on) onValueChange(o.value); }}
            onFocus={() => setFocusedValue(o.value)}
            onBlur={() => setFocusedValue((v) => (v === o.value ? null : v))}
            style={({ pressed }) => ({
              flex: 1, minHeight: size['control-md'], paddingHorizontal: 12, borderRadius: radius['radius-pill'], borderWidth: 1,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: on ? selectedBg : 'transparent',
              borderColor: focusedValue === o.value ? (isDark || onInk ? color['blue-on-dark'] : color['horizon-blue']) : on ? selectedBg : pressed ? (onInk ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.28)') : 'transparent',
            })}
          >
            <Text variant="web-label" style={{ fontSize: 15, textAlign: 'center', color: on ? selectedFg : idleFg }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
