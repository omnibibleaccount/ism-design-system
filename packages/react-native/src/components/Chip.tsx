import { forwardRef, type ReactNode } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { Text } from '../Text';
import { useTheme } from '../theme';
import { FocusRing, useFocus } from './internal';

export interface ChipProps extends Omit<PressableProps, 'children' | 'style'> {
  /** One or two words, sentence case ("All", "Amharic", "$50"). Text only: no icons, flags or emoji. */
  children: ReactNode;
  /** Pressed (on) state, reported as selected. Pressed chips are black (white on dark), never Horizon Blue. @default false */
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** 44dp pill toggle for filters and preset values. The parent owns `selected` (single or multiple choice). */
export const Chip = forwardRef<View, ChipProps>(function Chip({ children, selected = false, disabled, accessibilityState, onFocus, onBlur, style, ...rest }, ref) {
  const { colors, opacity, radius, isDark } = useTheme();
  const { focused, handlers } = useFocus();
  const off = !!disabled;
  const border = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.28)';
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: off, selected }}
      disabled={off}
      onFocus={(e) => { handlers.onFocus(); onFocus?.(e); }}
      onBlur={(e) => { handlers.onBlur(); onBlur?.(e); }}
      style={({ pressed }) => [
        {
          minHeight: 44, paddingHorizontal: 18, borderRadius: radius['radius-pill'], borderWidth: 1, alignItems: 'center', justifyContent: 'center',
          backgroundColor: selected ? (pressed ? (isDark ? color['gray-100'] : color['charcoal-900']) : colors.text) : isDark ? colors.surface : '#ffffff',
          borderColor: selected || pressed ? colors.text : border,
          opacity: off ? opacity['opacity-disabled'] : 1,
        } as ViewStyle,
        style,
      ]}
      {...rest}
    >
      <Text variant="web-label" tone={selected ? 'inverse' : 'primary'} style={{ fontSize: 15 }}>{children}</Text>
      <FocusRing visible={focused} radius={radius['radius-pill']} color={colors.focus} />
    </Pressable>
  );
});

export interface ChipGroupProps extends ViewProps {
  /** Names the set ("Filter resources"). Read to screen-reader users; update a visible count or live region when the filter changes. */
  accessibilityLabel: string;
  children: ReactNode;
}

/** Wrapping row of chips with an 8dp gap. */
export function ChipGroup({ children, style, ...rest }: ChipGroupProps) {
  return (
    <View accessible={false} style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, style]} {...rest}>
      {children}
    </View>
  );
}
