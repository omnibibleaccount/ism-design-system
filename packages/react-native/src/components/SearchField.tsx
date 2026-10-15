import { forwardRef, useId, useRef, useState, type ForwardedRef } from 'react';
import { Pressable, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { FieldFocusRing } from './Input';

export interface SearchFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onSubmitEditing' | 'style' | 'editable' | 'placeholderTextColor'> {
  /** Visible label above the field. Always provide one. */
  label?: string;
  /** Helper text under the field, e.g. "Press Enter to see results". */
  hint?: string;
  /** Error message under the field (rare). */
  error?: string;
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Called on every change. */
  onChangeText?: (text: string) => void;
  /** Called when the person presses Search/Enter on the keyboard, with the current text. */
  onSubmit?: (text: string) => void;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** Accessible name of the clear button. @default "Clear search" */
  clearLabel?: string;
  /** Disabled field. @default false */
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** 48dp search input with a magnifier, a round clear button once there is text, and submit on the keyboard's search key. */
export const SearchField = forwardRef<TextInput, SearchFieldProps>(function SearchField(
  { label, hint, error, value, defaultValue, onChangeText, onSubmit, onClear, clearLabel = 'Clear search', disabled = false, style, onFocus, onBlur, accessibilityLabel, testID, ...rest },
  ref,
) {
  const { colors, isDark, radius, size } = useTheme();
  const id = useId();
  const inner = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState(defaultValue ?? '');
  const current = value ?? text;
  const invalid = !!error;
  const message = error ?? hint;

  const setRefs = (node: TextInput | null) => {
    inner.current = node;
    const r = ref as ForwardedRef<TextInput>;
    if (typeof r === 'function') r(node);
    else if (r) r.current = node;
  };
  const change = (t: string) => { setText(t); onChangeText?.(t); };
  const clear = () => { change(''); onClear?.(); inner.current?.focus(); };

  return (
    <View style={[{ gap: 6, alignSelf: 'stretch' }, style]} testID={testID} accessibilityRole="search">
      {label ? <Text variant="web-label" style={{ color: isDark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.72)' }}>{label}</Text> : null}
      <View style={{ height: size.field, justifyContent: 'center' }}>
        <View
          style={{
            flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius['radius-md'],
            borderColor: invalid ? colors.error : focused ? colors.focus : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.22)',
            backgroundColor: disabled ? colors.disabledBg : invalid ? (isDark ? colors.errorBg : '#FFFBFA') : colors.surface,
            paddingStart: 16, paddingEnd: 8, gap: 12,
          }}
        >
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <UiIcon name="search" size={18} color={colors.textTertiary} />
          </View>
          <TextInput
            ref={setRefs}
            {...rest}
            value={current}
            onChangeText={change}
            onSubmitEditing={() => onSubmit?.(current)}
            editable={!disabled}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            enterKeyHint="search"
            clearButtonMode="never"
            accessibilityLabel={accessibilityLabel ?? label}
            accessibilityHint={message}
            accessibilityState={{ disabled }}
            placeholderTextColor={isDark ? color['text-tertiary-dark'] : color['gray-placeholder']}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            style={{
              flex: 1, minWidth: 0, color: disabled ? colors.disabledText : colors.text, fontSize: 16, lineHeight: 22, paddingVertical: 12, textAlign: 'auto',
              ...({ outlineStyle: 'none' } as object),
            }}
          />
          {current.length > 0 && !disabled ? (
            <Pressable
              accessibilityRole="button" accessibilityLabel={clearLabel} onPress={clear}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              style={({ pressed }) => ({
                width: 32, height: 32, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center',
                backgroundColor: pressed ? (isDark ? color['charcoal-700'] : color['gray-200']) : colors.surfaceMuted,
              })}
            >
              <UiIcon name="close" size={14} color={colors.text} />
            </Pressable>
          ) : null}
        </View>
        <FieldFocusRing visible={focused && !disabled} radius={radius['radius-md']} />
      </View>
      {message ? (
        <View nativeID={`${id}-msg`} accessibilityLiveRegion={invalid ? 'assertive' : 'polite'} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {invalid ? <UiIcon name="alert-circle" size={16} color={colors.error} /> : null}
          <Text variant={invalid ? 'web-label' : 'web-small'} style={{ flex: 1, fontSize: 14, color: invalid ? colors.error : colors.textTertiary }}>{message}</Text>
        </View>
      ) : null}
    </View>
  );
});
