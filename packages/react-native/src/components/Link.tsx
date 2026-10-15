import { forwardRef, type ReactNode } from 'react';
import { Linking, Pressable, Text as InlineText, View, type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { useTheme } from '../theme';
import { FocusRing, useFocus, useScript } from './internal';

export type LinkVariant = 'inline' | 'standalone' | 'ghost';

export interface LinkProps {
  /** Specific link text ("Read the statement of faith"), never "here". */
  children: ReactNode;
  /** URL opened with `Linking.openURL` when pressed. Use `onPress` alone for in-app navigation. */
  href?: string;
  /** Called on press, before `href` is opened. */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * `inline` sits inside a `<Text>` paragraph and stays underlined; `standalone` is the `.lnk` text link in a list, footer or card
   * (ink colour, underline on press and focus); `ghost` is the semibold blue "See all" link with a 44dp hit area.
   * @default "standalone"
   */
  variant?: LinkVariant;
  /**
   * Show the arrow after the label. `external` is ↗ (goes to another page or site, never mirrored in RTL);
   * `drill` is › (drills into an app screen, mirrored in RTL); `none` shows nothing. Do not mix them.
   * @default "external" when `href` is set and the variant is not `inline`, otherwise "none"
   */
  arrow?: 'external' | 'drill' | 'none';
  /** Use `--blue-on-dark` (white on press) on dark surfaces. Defaults to the theme scheme for colour. @default false */
  onDark?: boolean;
  /** Spoken after the label for links that leave the app, e.g. "(opens in a new tab)". Pass it translated. */
  newTabLabel?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  /** Text style, used by `inline` for size and weight inherited from the paragraph. */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Text link. Standalone links are at least 44dp tall. External links (`href`) show ↗ after the label.
 * Put `inline` links inside a `Text` so they wrap with the sentence.
 */
export const Link = forwardRef<View, LinkProps>(function Link(
  { children, href, onPress, variant = 'standalone', arrow, onDark = false, newTabLabel, disabled = false, accessibilityLabel, accessibilityHint, testID, style, textStyle },
  ref,
) {
  const { colors, opacity } = useTheme();
  const { focused, handlers } = useFocus();
  const s = useScript();
  const kind = arrow ?? (href && variant !== 'inline' ? 'external' : 'none');
  const press = (e: GestureResponderEvent) => {
    onPress?.(e);
    if (href) Linking.openURL(href).catch(() => undefined);
  };
  const hint = [accessibilityHint, newTabLabel].filter(Boolean).join(' ') || undefined;
  const dim = disabled ? opacity['opacity-disabled'] : 1;

  if (variant === 'inline') {
    const ink = onDark ? color['blue-on-dark'] : colors.link;
    // Plain RN Text on purpose: an inline link must inherit font, size and script handling from the paragraph it sits in.
    return (
      <InlineText
        accessibilityRole="link"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={hint}
        accessibilityState={{ disabled }}
        testID={testID}
        onPress={disabled ? undefined : press}
        style={[{ color: ink, textDecorationLine: 'underline', opacity: dim }, textStyle]}
      >
        {children}
        {kind === 'external' ? <InlineText style={{ color: ink }} accessibilityElementsHidden importantForAccessibility="no">{' ↗'}</InlineText> : null}
      </InlineText>
    );
  }

  const ghost = variant === 'ghost';
  const base = onDark ? color['blue-on-dark'] : colors.link;
  return (
    <Pressable
      ref={ref}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      testID={testID}
      disabled={disabled}
      onPress={press}
      onFocus={handlers.onFocus}
      onBlur={handlers.onBlur}
      style={[{ minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, opacity: dim }, style]}
    >
      {({ pressed }) => {
        const fg = ghost ? (pressed ? (onDark ? '#ffffff' : colors.primaryPressed) : base) : onDark ? (pressed ? '#ffffff' : base) : colors.text;
        const underline = !ghost && (pressed || focused);
        return (
          <>
            <Text variant={ghost ? 'web-label' : 'web-small'} style={[{ color: fg, textDecorationLine: underline ? 'underline' : 'none' }, ghost ? { fontSize: 16, ...s.weight('600') } : null, textStyle]}>
              {children}
            </Text>
            {kind === 'external' ? <UiIcon name="arrow-up-right" size={16} color={fg} /> : null}
            {kind === 'drill' ? <UiIcon name="chevron-right" size={16} color={fg} mirrorInRTL /> : null}
            <FocusRing visible={focused} radius={4} color={onDark ? color['blue-on-dark'] : colors.focus} inset={2} />
          </>
        );
      }}
    </Pressable>
  );
});
