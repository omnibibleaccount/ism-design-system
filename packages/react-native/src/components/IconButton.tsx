import { forwardRef } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import type { UiIconName } from '@ism/tokens/icons-all';
import { UiIcon } from '../Icon';
import { useTheme } from '../theme';
import { FocusRing, useFocus } from './internal';

export type IconButtonVariant = 'light' | 'dark' | 'solid';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'children' | 'style' | 'accessibilityLabel'> {
  /** UI line icon name, e.g. "menu", "search", "close". */
  name: UiIconName;
  /** Names the action: "Open menu", "Close", "Play ISM Radio". Required, short verb phrase in the user's language. */
  accessibilityLabel: string;
  /** `light` for light surfaces, `dark` for dark surfaces (header, drawer), `solid` is the group's one primary (Play). @default "light" */
  variant?: IconButtonVariant;
  /** 36dp visual (hit area extended to 44), 44dp, or 52dp. @default "md" */
  size?: IconButtonSize;
  /** Toggle state (play/pause, bookmark). Reported as the selected accessibility state. Omit for plain buttons. */
  selected?: boolean;
  /** Menu button state; reported as expanded. Omit for plain buttons. */
  expanded?: boolean;
  /** Flip the icon in RTL (next/back arrows and chevrons). @default false */
  mirrorInRTL?: boolean;
  style?: StyleProp<ViewStyle>;
}

const DIAMETER = { sm: 36, md: 44, lg: 52 } as const;

/**
 * Round icon-only button with a hairline ring and one 20dp line icon. Always a 44dp touch target
 * (`sm` extends its hit area). Needs an `accessibilityLabel`.
 */
export const IconButton = forwardRef<View, IconButtonProps>(function IconButton(
  { name, accessibilityLabel, variant = 'light', size = 'md', selected, expanded, mirrorInRTL = false, disabled, accessibilityState, onFocus, onBlur, style, ...rest },
  ref,
) {
  const { colors, opacity, isDark } = useTheme();
  const { focused, handlers } = useFocus();
  const d = DIAMETER[size];
  const off = !!disabled;
  const palette = (pressed: boolean) => {
    if (variant === 'dark') return { bg: pressed ? 'rgba(255,255,255,0.1)' : 'transparent', border: pressed ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.3)', fg: '#ffffff' };
    if (variant === 'solid') return { bg: pressed ? color['horizon-blue-dim'] : color['horizon-blue'], border: pressed ? color['horizon-blue-dim'] : color['horizon-blue'], fg: '#ffffff' };
    return isDark
      ? { bg: pressed ? colors.surfaceMuted : colors.surface, border: pressed ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.3)', fg: colors.text }
      : { bg: pressed ? color['gray-100'] : '#ffffff', border: pressed ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.22)', fg: '#000000' };
  };
  const ringColor = variant === 'dark' ? color['blue-on-dark'] : colors.focus;
  const slop = Math.max(0, Math.ceil((44 - d) / 2));
  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ ...accessibilityState, disabled: off, selected, expanded }}
      disabled={off}
      hitSlop={slop ? { top: slop, bottom: slop, left: slop, right: slop } : undefined}
      onFocus={(e) => { handlers.onFocus(); onFocus?.(e); }}
      onBlur={(e) => { handlers.onBlur(); onBlur?.(e); }}
      style={({ pressed }) => {
        const p = palette(pressed);
        return [{ width: d, height: d, borderRadius: d / 2, borderWidth: 1, borderColor: p.border, backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center', opacity: off ? opacity['opacity-disabled'] : 1 }, style];
      }}
      {...rest}
    >
      {({ pressed }) => (
        <>
          <UiIcon name={name} size={20} color={palette(pressed).fg} mirrorInRTL={mirrorInRTL} />
          <FocusRing visible={focused} radius={d / 2} color={ringColor} inset={3} />
        </>
      )}
    </Pressable>
  );
});
