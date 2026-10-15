import type { ComponentType, ReactNode } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color, gradient } from '@ism/tokens/native';
import { Text } from '../Text';
import { useTheme } from '../theme';

/** Props a gradient view receives. Compatible with `expo-linear-gradient` and `react-native-linear-gradient`. */
export interface GradientProps {
  colors: [string, string, ...string[]];
  locations?: [number, number, ...number[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * A linear-gradient view component. React Native has no gradient primitive and this package takes no extra dependency, so pass
 * `LinearGradient` from `expo-linear-gradient` or `react-native-linear-gradient`. Without it the component falls back to a solid
 * colour from the gradient tokens (`gradient-violet`).
 */
export type GradientComponent = ComponentType<GradientProps>;

/** Solid stand-in used when no `GradientComponent` is given: the `gradient-violet` token. */
export const GRADIENT_FALLBACK_COLOR: string = color['gradient-violet'];

type GradientToken = keyof typeof gradient;

/** Props for a gradient token, optionally mirrored horizontally (RTL) or turned vertical. */
export function gradientProps(token: GradientToken, opts: { rtl?: boolean; vertical?: boolean } = {}): Omit<GradientProps, 'style' | 'children'> {
  const g = gradient[token];
  const colors = [...g.colors] as [string, string, ...string[]];
  const locations = [...g.locations] as [number, number, ...number[]];
  if (opts.vertical) return { colors, locations, start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } };
  const flip = (p: { x: number; y: number }) => ({ x: opts.rtl ? 1 - p.x : p.x, y: p.y });
  return { colors, locations, start: flip(g.start), end: flip(g.end) };
}

export interface GradientFillProps {
  token: GradientToken;
  GradientComponent?: GradientComponent;
  style?: StyleProp<ViewStyle>;
  vertical?: boolean;
}

/** Fills its box with a gradient token via `GradientComponent`, or the solid fallback colour. Decorative. */
export function GradientFill({ token, GradientComponent: Gradient, style, vertical }: GradientFillProps) {
  const { isRTL } = useTheme();
  if (Gradient) return <Gradient {...gradientProps(token, { rtl: isRTL, vertical })} style={style} />;
  return <View style={[{ backgroundColor: GRADIENT_FALLBACK_COLOR }, style]} />;
}

export interface DividerProps extends Omit<ViewProps, 'children'> {
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Length in dp along the main axis. @default 72 */
  length?: number;
  /** Thickness in dp across. @default 2 */
  thickness?: number;
  /** Gradient view such as `LinearGradient` from expo-linear-gradient. Without it a solid `gradient-violet` colour is used. */
  GradientComponent?: GradientComponent;
}

/**
 * Pill-ended accent bar painted with `gradient-signature`. Decorative and hidden from screen readers; use at most once per section.
 * Provide `GradientComponent` for the real gradient; the solid violet fallback is never Horizon Blue.
 */
export function Divider({ orientation = 'horizontal', length = 72, thickness = 2, GradientComponent: Gradient, style, ...rest }: DividerProps) {
  const { radius } = useTheme();
  const horizontal = orientation === 'horizontal';
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: horizontal ? length : thickness, height: horizontal ? thickness : length, borderRadius: radius['radius-pill'], overflow: 'hidden', flexGrow: 0, flexShrink: 0 }, style]}
      {...rest}
    >
      <GradientFill token="gradient-signature" GradientComponent={Gradient} vertical={!horizontal} style={{ flex: 1 }} />
    </View>
  );
}

export interface RuleProps extends Omit<ViewProps, 'children'> {
  /** `strong` for a total row or page-end rule; `dark` for dark surfaces. @default "hairline" */
  tone?: 'hairline' | 'strong' | 'dark';
}

/** Quiet 1dp rule between groups inside a card, form or panel. Space it with the parent's `gap`. */
export function Rule({ tone = 'hairline', style, ...rest }: RuleProps) {
  const { colors, isDark } = useTheme();
  const bg = tone === 'dark' ? color['border-hairline-dark'] : tone === 'strong' ? (isDark ? '#ffffff' : color['charcoal-900']) : isDark ? colors.border : color['gray-200'];
  return <View accessibilityRole="none" style={[{ height: 1, alignSelf: 'stretch', backgroundColor: bg }, style]} {...rest} />;
}

export interface OrDividerProps extends Omit<ViewProps, 'children'> {
  /** The one lowercase word between the lines. @default "or" */
  children?: string;
}

/** Two hairlines with a word between, for two alternative ways to do one thing. */
export function OrDivider({ children = 'or', style, ...rest }: OrDividerProps) {
  const { colors, isDark } = useTheme();
  const line = { flex: 1, height: 1, backgroundColor: isDark ? colors.border : color['gray-200'] } as const;
  return (
    <View accessible accessibilityRole="none" accessibilityLabel={children} style={[{ flexDirection: 'row', alignItems: 'center', gap: 14 }, style]} {...rest}>
      <View style={line} />
      <Text variant="web-small" tone="tertiary" style={{ fontSize: 13 }} accessibilityElementsHidden importantForAccessibility="no">{children}</Text>
      <View style={line} />
    </View>
  );
}

/** 1 by 24dp vertical rule between short inline facts, inside a row with a 16dp gap. Decorative. */
export function VerticalRule({ style, ...rest }: Omit<ViewProps, 'children'>) {
  const { colors, isDark } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: 1, height: 24, alignSelf: 'center', flexShrink: 0, backgroundColor: isDark ? colors.border : color['gray-300'] }, style]}
      {...rest}
    />
  );
}

export interface ThreadProps extends Omit<ViewProps, 'children'> {
  /** Gradient view such as `LinearGradient`. Without it a solid `gradient-violet` colour is used. */
  GradientComponent?: GradientComponent;
}

/** The signature 2dp gradient line (`gradient-line`), full width of its box. Decorative; at most once per section. */
export function Thread({ GradientComponent: Gradient, style, ...rest }: ThreadProps) {
  const { radius } = useTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ height: 2, alignSelf: 'stretch', borderRadius: radius['radius-pill'], overflow: 'hidden' }, style]}
      {...rest}
    >
      <GradientFill token="gradient-line" GradientComponent={Gradient} style={{ flex: 1 }} />
    </View>
  );
}
