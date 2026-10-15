import { forwardRef, type ReactNode } from 'react';
import { Image, Linking, Pressable, View, type GestureResponderEvent, type ImageSourcePropType, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color, tracking } from '@ism/tokens/native';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { useTheme } from '../theme';
import { FocusRing, useFocus, useScript } from './internal';
import type { GradientComponent } from './Divider';

function usePress(href: string | undefined, onPress: ((e: GestureResponderEvent) => void) | null | undefined) {
  return href || onPress
    ? (e: GestureResponderEvent) => {
        onPress?.(e);
        if (href) Linking.openURL(href).catch(() => undefined);
      }
    : undefined;
}

/* ---------- Image-led Card ---------- */

export interface CardProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Photo: a URL or an image source. Without it the card is `charcoal-900`. */
  image?: string | ImageSourcePropType;
  /** Alt text. Empty by default because the title names the card. @default "" */
  imageAlt?: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** 24dp semibold white title. */
  title?: string;
  /** 15dp, 70% white. */
  subtitle?: string;
  /** Label of the white CTA pill shown top-right, followed by ↗. Omit (or pass "") to hide the pill. Pass it in the UI language, e.g. "Explore". */
  cta?: string;
  /** Height in dp. @default 360 */
  height?: number;
  /** URL opened with `Linking.openURL` on press. */
  href?: string;
  /**
   * Gradient view such as `LinearGradient`. Paints the dark bottom overlay (5% to 78% black). Without it a flat 40% black scrim
   * (`overlay-photo`) keeps the text legible.
   */
  GradientComponent?: GradientComponent;
  style?: StyleProp<ViewStyle>;
}

/** Large, immersive, image-led tile with a dark overlay so the text always has contrast. Pressable (a link) when `onPress` or `href` is set. */
export const Card = forwardRef<View, CardProps>(function Card(
  { image, imageAlt = '', eyebrow, title, subtitle, cta, height = 360, href, onPress, GradientComponent: Gradient, style, onFocus, onBlur, ...rest },
  ref,
) {
  const { radius, colors } = useTheme();
  const { focused, handlers } = useFocus();
  const s = useScript();
  const press = usePress(href, onPress);
  const photo = image ? (typeof image === 'string' ? { uri: image } : image) : null;
  const label = [eyebrow, title, subtitle].filter(Boolean).join('. ');
  return (
    <Pressable
      ref={ref}
      accessible
      accessibilityRole={press ? 'link' : undefined}
      accessibilityLabel={label || undefined}
      disabled={!press}
      onPress={press}
      onFocus={(e) => { handlers.onFocus(); onFocus?.(e); }}
      onBlur={(e) => { handlers.onBlur(); onBlur?.(e); }}
      style={[{ height, borderRadius: radius['radius-lg'], borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', backgroundColor: color['charcoal-900'] }, style]}
      {...rest}
    >
      <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, borderRadius: radius['radius-lg'] - 1, overflow: 'hidden' }}>
        {photo ? <Image source={photo} accessible={!!imageAlt} accessibilityLabel={imageAlt || undefined} accessibilityIgnoresInvertColors resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : null}
        {Gradient ? (
          <Gradient colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.78)']} locations={[0.3, 1]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0 }} />
        ) : (
          <View style={{ position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
        )}
      </View>
      {cta ? (
        <View style={{ position: 'absolute', top: 16, end: 16, flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius['radius-pill'], backgroundColor: '#ffffff' }}>
          <Text variant="web-label" style={{ color: '#000000' }}>{cta}</Text>
          <UiIcon name="arrow-up-right" size={16} color="#000000" />
        </View>
      ) : null}
      <View style={{ position: 'absolute', start: 24, end: 24, bottom: 24, gap: 8 }}>
        {eyebrow ? <Text variant="web-eyebrow" style={[s.upper, s.tracking(tracking['eyebrow-tracking'], 12), { color: color['blue-on-dark'] }]}>{eyebrow}</Text> : null}
        {title ? <Text variant="web-h3" style={{ color: '#ffffff', letterSpacing: s.latin ? undefined : 0 }}>{title}</Text> : null}
        {subtitle ? <Text variant="web-small" style={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</Text> : null}
      </View>
      <FocusRing visible={focused} radius={radius['radius-lg']} color={colors.focus} />
    </Pressable>
  );
});

/* ---------- Website `.card` family ---------- */

export type ContentCardVariant = 'default' | 'flush' | 'clip' | 'tight' | 'dark' | 'roomy' | 'flat' | 'pad';

export interface ContentCardProps extends Omit<PressableProps, 'children' | 'style'> {
  /**
   * `flush` has edge-to-edge media and a `CardBody`; `clip` clips media to the rounded corners; `tight` and `dark` are text cards;
   * `roomy` is a value card; `flat` keeps its shadow when pressed (not a link); `pad` is a step or statement card.
   * @default "default"
   */
  variant?: ContentCardVariant;
  /** URL opened with `Linking.openURL`. The whole card is then one link: keep a single heading inside and no second link or button. */
  href?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Grouped content container: 20dp radius, hairline border, card shadow. Do not nest cards. */
export const ContentCard = forwardRef<View, ContentCardProps>(function ContentCard(
  { variant = 'default', href, onPress, children, style, onFocus, onBlur, ...rest },
  ref,
) {
  const { colors, radius, shadow, isDark } = useTheme();
  const { focused, handlers } = useFocus();
  const press = usePress(href, onPress);
  const darkCard = variant === 'dark';
  const flush = variant === 'flush' || variant === 'clip';
  const padding = flush ? 0 : variant === 'roomy' ? 32 : variant === 'pad' ? 32 : 24;
  const gap = flush ? 0 : variant === 'tight' || darkCard ? 12 : variant === 'roomy' ? 20 : 16;
  const rest0 = isDark ? shadow['shadow-card-dark'] : shadow['shadow-card-light'];
  const base: ViewStyle = {
    borderRadius: radius['radius-lg'], borderWidth: 1, padding, gap,
    backgroundColor: darkCard ? color['charcoal-900'] : colors.surface,
    borderColor: darkCard ? color['charcoal-900'] : colors.border,
    overflow: flush ? 'hidden' : 'visible',
  };
  const cardShadow = (pressed: boolean): ViewStyle => {
    const t = pressed && variant !== 'flat' && variant !== 'pad' ? shadow['shadow-lift'] : rest0;
    return { shadowColor: t.shadowColor, shadowOffset: t.shadowOffset, shadowOpacity: t.shadowOpacity, shadowRadius: t.shadowRadius, elevation: t.elevation };
  };
  if (!press) {
    return (
      <View ref={ref} style={[base, cardShadow(false), style]} {...(rest as ViewProps)}>
        {children}
      </View>
    );
  }
  return (
    <Pressable
      ref={ref}
      accessibilityRole="link"
      onPress={press}
      onFocus={(e) => { handlers.onFocus(); onFocus?.(e); }}
      onBlur={(e) => { handlers.onBlur(); onBlur?.(e); }}
      style={({ pressed }) => [base, cardShadow(pressed), pressed && variant !== 'flat' && variant !== 'pad' && !darkCard ? { borderColor: 'rgba(0,0,0,0.2)' } : null, style]}
      {...rest}
    >
      {children}
      <FocusRing visible={focused} radius={radius['radius-lg']} color={colors.focus} />
    </Pressable>
  );
});

export interface CardMediaProps extends ViewProps {
  /** Photo: a URL or an image source. Without it a charcoal placeholder shows. */
  src?: string | ImageSourcePropType;
  /** Alt text, or "" if decorative. @default "" */
  alt?: string;
  /** `16:10` (masonry) or `4:3` (program, top). @default "16:10" */
  ratio?: '16:10' | '4:3';
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Edge-to-edge photo at the top of a `flush` card. Square corners; the card clips it. */
export function CardMedia({ src, alt = '', ratio = '16:10', children, style, ...rest }: CardMediaProps) {
  const photo = src ? (typeof src === 'string' ? { uri: src } : src) : null;
  return (
    <View style={[{ aspectRatio: ratio === '4:3' ? 4 / 3 : 16 / 10, backgroundColor: color['charcoal-900'], overflow: 'hidden' }, style]} {...rest}>
      {photo ? <Image source={photo} accessible={!!alt} accessibilityLabel={alt || undefined} accessibilityIgnoresInvertColors resizeMode="cover" style={{ width: '100%', height: '100%' }} /> : children}
    </View>
  );
}

/** Padded text column under `CardMedia` in a `flush` card (24dp padding, 10dp gap). */
export function CardBody({ style, ...rest }: ViewProps) {
  return <View style={[{ padding: 24, gap: 10 }, style]} {...rest} />;
}

export interface CardCtaProps {
  /** Short text: "Learn more", "Subscribe". */
  children: string;
  /** `external` ↗ goes to another page; `none` shows no arrow. @default "external" */
  arrow?: 'external' | 'none';
}

/** Text call to action at the end of a linked card. Decorative arrow; the card itself is the link. */
export function CardCta({ children, arrow = 'external' }: CardCtaProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Text variant="web-label" style={{ fontSize: 15, color: colors.text }}>{children}</Text>
      {arrow === 'external' ? <UiIcon name="arrow-up-right" size={16} color={colors.text} /> : null}
    </View>
  );
}
