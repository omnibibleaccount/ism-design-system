import { forwardRef, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outlineLight';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Label. Verb first, sentence case. */
  children: ReactNode;
  /** `primary` is the ONE main action in a group. `light` and `outlineLight` are for dark surfaces. @default "primary" */
  variant?: ButtonVariant;
  /** Heights 36, 44 and 52dp. Use `sm` only in dense desktop-like toolbars, never as a sole touch target. @default "md" */
  size?: ButtonSize;
  /** Stretch to the container width. @default false */
  block?: boolean;
  /** Show a spinner in place of the leading icon and block presses. Sets busy accessibility state. @default false */
  loading?: boolean;
  /** Optional trailing element, e.g. `<UiIcon name="arrow-right" mirrorInRTL />`. */
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const HEIGHT = { sm: 36, md: 44, lg: 52 } as const;
const PADDING = { sm: 20, md: 26, lg: 32 } as const;

/** Pill-shaped call-to-action with default, pressed, focus, disabled and loading states. */
export const Button = forwardRef<View, ButtonProps>(function Button(
  { children, variant = 'primary', size = 'md', block = false, loading = false, icon, disabled, style, accessibilityState, onPress, ...rest },
  ref,
) {
  const { colors, isDark, opacity, radius } = useTheme();
  const off = !!disabled;
  const palette = (pressed: boolean) => {
    switch (variant) {
      case 'secondary': return { bg: pressed ? 'rgba(0,0,0,0.12)' : 'transparent', fg: isDark ? '#ffffff' : '#000000', border: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.4)' };
      case 'ghost': return { bg: 'transparent', fg: pressed ? colors.primaryPressed : colors.link, border: 'transparent' };
      case 'light': return { bg: pressed ? '#c7c8cb' : '#ffffff', fg: '#000000', border: 'transparent' };
      case 'outlineLight': return { bg: pressed ? 'rgba(255,255,255,0.18)' : 'transparent', fg: '#ffffff', border: 'rgba(255,255,255,0.55)' };
      default: return { bg: pressed ? '#161819' : colors.primary, fg: '#ffffff', border: 'transparent' };
    }
  };
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: off || loading, busy: loading }}
      disabled={off || loading}
      onPress={onPress}
      hitSlop={size === 'sm' ? { top: 4, bottom: 4, left: 0, right: 0 } : undefined}
      style={({ pressed }) => {
        const p = palette(pressed);
        return [
          {
            minHeight: HEIGHT[size], paddingHorizontal: variant === 'ghost' ? 4 : PADDING[size], borderRadius: radius['radius-pill'],
            flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1,
            backgroundColor: p.bg, borderColor: p.border, opacity: off ? opacity['opacity-disabled'] : 1,
            alignSelf: block ? 'stretch' : 'flex-start',
          } as ViewStyle,
          style,
        ];
      }}
      {...rest}
    >
      {({ pressed }) => {
        const fg = palette(pressed).fg;
        return (
          <>
            {loading ? <ActivityIndicator size="small" color={fg} /> : null}
            <Text variant="web-label" style={{ color: fg, fontSize: size === 'sm' ? 14 : size === 'lg' ? 17 : 16 }}>{children}</Text>
            {icon && !loading ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{icon}</View> : null}
          </>
        );
      }}
    </Pressable>
  );
});
