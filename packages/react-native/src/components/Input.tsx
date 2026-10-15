import { forwardRef, useId, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

/** Semantic field type. Sets `keyboardType`, `autoComplete`, `textContentType`, capitalisation and autocorrect together. */
export type InputType =
  | 'text' | 'name' | 'email' | 'tel' | 'url' | 'number' | 'decimal'
  | 'password' | 'new-password' | 'one-time-code' | 'search' | 'postal-code';

type TypeProps = Pick<TextInputProps, 'keyboardType' | 'autoComplete' | 'textContentType' | 'autoCapitalize' | 'autoCorrect' | 'inputMode' | 'returnKeyType' | 'secureTextEntry'>;

/** Native keyboard and autofill props for a semantic input type (the equivalent of web `type`, `inputmode` and `autocomplete`). */
export function inputTypeProps(type: InputType): TypeProps {
  switch (type) {
    case 'name': return { autoComplete: 'name', textContentType: 'name', autoCapitalize: 'words', autoCorrect: false };
    case 'email': return { keyboardType: 'email-address', autoComplete: 'email', textContentType: 'emailAddress', autoCapitalize: 'none', autoCorrect: false };
    case 'tel': return { keyboardType: 'phone-pad', autoComplete: 'tel', textContentType: 'telephoneNumber', autoCapitalize: 'none', autoCorrect: false };
    case 'url': return { keyboardType: 'url', autoComplete: 'off', textContentType: 'URL', autoCapitalize: 'none', autoCorrect: false };
    case 'number': return { keyboardType: 'number-pad', autoCapitalize: 'none', autoCorrect: false };
    case 'decimal': return { keyboardType: 'decimal-pad', autoCapitalize: 'none', autoCorrect: false };
    case 'password': return { autoComplete: 'current-password', textContentType: 'password', autoCapitalize: 'none', autoCorrect: false, secureTextEntry: true };
    case 'new-password': return { autoComplete: 'new-password', textContentType: 'newPassword', autoCapitalize: 'none', autoCorrect: false, secureTextEntry: true };
    case 'one-time-code': return { keyboardType: 'number-pad', autoComplete: 'one-time-code', textContentType: 'oneTimeCode', autoCapitalize: 'none', autoCorrect: false };
    case 'postal-code': return { autoComplete: 'postal-code', textContentType: 'postalCode', autoCapitalize: 'characters', autoCorrect: false };
    case 'search': return { keyboardType: 'default', returnKeyType: 'search', autoComplete: 'off', autoCapitalize: 'none', autoCorrect: false };
    default: return {};
  }
}

/** Focus colour at 35% for the 3dp halo around a focused field (web `--shadow-focus`). */
export function focusHalo(isDark: boolean): string {
  return isDark ? 'rgba(127,166,247,0.35)' : 'rgba(4,109,227,0.35)';
}

/** Absolutely positioned 3dp halo drawn outside a control while it has focus. Decorative. */
export function FieldFocusRing({ visible, radius }: { visible: boolean; radius: number }) {
  const { isDark } = useTheme();
  if (!visible) return null;
  return (
    <View
      pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
      style={{ position: 'absolute', top: -3, bottom: -3, start: -3, end: -3, borderWidth: 3, borderRadius: radius + 3, borderColor: focusHalo(isDark) }}
    />
  );
}

export interface InputProps extends Omit<TextInputProps, 'editable' | 'style' | 'placeholderTextColor'> {
  /** Visible label above the field. Always provide one; the placeholder is only an example. */
  label?: string;
  /** Appended to the label for optional fields, e.g. "(optional)". Pass the localized word. */
  optionalLabel?: string;
  /** Helper text under the field. Hidden while `error` or `success` is shown. */
  hint?: string;
  /** Error message under the field. Sets the error border and fill, and announces the message. */
  error?: string;
  /** Success message under the field. Show only where a check really ran. */
  success?: string;
  /** Semantic type that sets keyboard, autofill and capitalisation. Explicit props override it. @default "text" */
  type?: InputType;
  /** Field height: 48dp default or 60dp for the one or two big fields of a flow. @default "md" */
  size?: 'md' | 'lg';
  /** Greyed out, not focusable. @default false */
  disabled?: boolean;
  /** Focusable and copyable but not editable; shows a lock icon. @default false */
  readOnly?: boolean;
  /** Trailing spinner for async validation. @default false */
  loading?: boolean;
  /** Translucent field for black surfaces. @default false */
  dark?: boolean;
  /** Accessible name of the password show toggle. @default "Show password" */
  showPasswordLabel?: string;
  /** Accessible name of the password hide toggle. @default "Hide password" */
  hidePasswordLabel?: string;
  /** Element at the start of the field (decorative). */
  startAdornment?: ReactNode;
  /** Style of the outer container. */
  style?: StyleProp<ViewStyle>;
}

/** 48dp text field with label, hint, error and success messages, focus ring, disabled and read-only states. */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label, optionalLabel, hint, error, success, type = 'text', size = 'md', disabled = false, readOnly = false, loading = false, dark = false,
    showPasswordLabel = 'Show password', hidePasswordLabel = 'Hide password', startAdornment, style, multiline,
    onFocus, onBlur, accessibilityLabel, accessibilityHint, accessibilityState, testID, secureTextEntry, ...rest
  },
  ref,
) {
  const { colors, isDark, radius, size: sizes } = useTheme();
  const id = useId();
  const [focused, setFocused] = useState(false);
  const preset = inputTypeProps(type);
  const secure = secureTextEntry ?? preset.secureTextEntry ?? false;
  const [revealed, setRevealed] = useState(false);
  const invalid = !!error;
  const ok = !!success && !invalid;
  const lg = size === 'lg';
  const onDark = dark || false;
  const field = lg ? sizes['field-lg'] : sizes.field;
  const message = error ?? success ?? hint;
  const hasMessage = !!message;

  const fill = disabled ? colors.disabledBg
    : readOnly ? (isDark ? color['charcoal-800'] : color['off-white'])
    : invalid ? (onDark ? 'rgba(255,255,255,0.06)' : isDark ? colors.errorBg : '#FFFBFA')
    : onDark ? 'rgba(255,255,255,0.06)' : colors.surface;
  const borderColor = invalid ? colors.error
    : ok ? colors.success
    : focused && !disabled && !readOnly ? colors.focus
    : disabled || readOnly ? (isDark ? color['charcoal-700'] : color['gray-200'])
    : onDark ? 'rgba(255,255,255,0.3)'
    : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.22)';
  const textColor = disabled ? colors.disabledText : onDark || isDark ? '#ffffff' : '#000000';
  const labelColor = onDark || isDark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.72)';

  const trailing: ReactNode[] = [];
  if (loading) trailing.push(<ActivityIndicator key="spin" size="small" color={colors.textSecondary} />);
  else if (invalid) trailing.push(<UiIcon key="err" name="alert-circle" size={20} color={colors.error} />);
  else if (ok) trailing.push(<UiIcon key="ok" name="check-circle" size={20} color={colors.success} />);
  else if (readOnly) trailing.push(<UiIcon key="lock" name="lock" size={20} color={colors.textTertiary} />);

  return (
    <View style={[{ gap: 6, alignSelf: 'stretch' }, style]} testID={testID}>
      {label ? (
        <Text variant="web-label" nativeID={`${id}-label`} style={{ color: labelColor, fontSize: lg ? 17 : 14 }}>
          {label}
          {optionalLabel ? <Text variant="web-small" style={{ color: colors.textTertiary, fontSize: lg ? 17 : 14 }}>{` ${optionalLabel}`}</Text> : null}
        </Text>
      ) : null}
      <View style={{ minHeight: multiline ? 144 : field, justifyContent: 'center' }}>
        <View
          style={{
            minHeight: multiline ? 144 : field, flexDirection: 'row', alignItems: multiline ? 'flex-start' : 'center',
            borderWidth: 1, borderRadius: radius['radius-md'], borderColor, backgroundColor: fill,
            paddingHorizontal: 16, paddingVertical: multiline ? 13 : 0, gap: 10,
            opacity: 1,
          }}
        >
          {startAdornment ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{startAdornment}</View> : null}
          <TextInput
            ref={ref}
            {...preset}
            {...rest}
            multiline={multiline}
            secureTextEntry={secure && !revealed}
            editable={!disabled && !readOnly}
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={accessibilityHint ?? message}
            accessibilityState={{ ...accessibilityState, disabled }}
            placeholderTextColor={onDark || isDark ? color['text-tertiary-dark'] : color['gray-placeholder']}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            style={{
              flex: 1, minWidth: 0, color: textColor, fontSize: lg ? 20 : 16, lineHeight: lg ? 26 : 22, paddingVertical: multiline ? 0 : 12,
              textAlign: 'auto', textAlignVertical: multiline ? 'top' : 'center', minHeight: multiline ? 118 : undefined,
              // react-native-web draws its own outline on focus; the halo below replaces it
              ...({ outlineStyle: 'none' } as object),
            }}
          />
          {secure && !disabled ? (
            <Pressable
              accessibilityRole="button" accessibilityLabel={revealed ? hidePasswordLabel : showPasswordLabel}
              onPress={() => setRevealed((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ minWidth: 28, minHeight: sizes['control-md'], alignItems: 'center', justifyContent: 'center' }}
            >
              <UiIcon name="eye" size={20} color={revealed ? colors.link : colors.textSecondary} />
            </Pressable>
          ) : null}
          {trailing.length ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">{trailing}</View> : null}
        </View>
        <FieldFocusRing visible={focused && !disabled && !readOnly} radius={radius['radius-md']} />
      </View>
      {hasMessage ? (
        <View
          nativeID={`${id}-msg`}
          accessibilityLiveRegion={invalid ? 'assertive' : 'polite'}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          {invalid ? <UiIcon name="alert-circle" size={16} color={colors.error} /> : null}
          <Text
            variant={invalid || ok ? 'web-label' : 'web-small'}
            style={{ flex: 1, fontSize: 14, color: invalid ? colors.error : ok ? colors.success : colors.textTertiary }}
          >
            {message}
          </Text>
        </View>
      ) : null}
    </View>
  );
});
