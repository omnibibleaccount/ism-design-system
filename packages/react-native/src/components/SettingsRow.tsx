import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { Pressable, View, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';

export interface SettingsRowProps extends Omit<PressableProps, 'children' | 'style' | 'onPress'> {
  /** What the row does: `value` drills into another screen (value and chevron), `toggle` is an on/off switch, `radio` picks one in place, `action` acts at once with no trailing icon. @default "action" */
  type?: 'value' | 'toggle' | 'radio' | 'action';
  /** Short noun: "Language", "Verse numbers". */
  label: string;
  /** Second line, which makes the row 64dp tall. */
  sublabel?: string;
  /** Leading icon in a 30dp blue-tint tile. Use on every row in a card or on none. */
  icon?: UiIconProps['name'];
  /** `value` rows: the current choice, short, matching the next screen's selected option. */
  value?: string;
  /** `toggle` rows: on or off. `radio` rows: this option is selected. @default false */
  checked?: boolean;
  /** Called when a toggle changes (with the new value) or a radio row is chosen. Toggles take effect at once; never pair with Save. */
  onCheckedChange?: (checked: boolean) => void;
  /** `value` and `action` rows: called on press. */
  onPress?: () => void;
  /** Destructive row such as Sign out: `error` colour, 600 weight, alone in its own group. @default false */
  danger?: boolean;
  /** Says why a disabled row is unavailable ("Needs Wi‑Fi"); shown as the second line and read as the hint. */
  disabledReason?: string;
  /** Draw the hairline above this row, starting 16dp in. `SettingsGroup` sets it after the first row. @default false */
  divider?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** One row of a settings card: at least 52dp, with a toggle, a value and chevron, a radio, or a plain action. */
export function SettingsRow({
  type = 'action', label, sublabel, icon, value, checked = false, onCheckedChange, onPress, danger = false, disabledReason, divider = false, disabled, style, accessibilityLabel, accessibilityState, accessibilityHint, ...rest
}: SettingsRowProps) {
  const { colors, radius, opacity } = useTheme();
  const [focus, setFocus] = useState(false);
  const off = !!disabled;
  const second = off && disabledReason ? disabledReason : sublabel;
  const role = type === 'toggle' ? 'switch' : type === 'radio' ? 'radio' : 'button';
  const name = accessibilityLabel ?? (type === 'value' && value ? `${label}, ${value}` : label);
  const press = () => {
    if (type === 'toggle') onCheckedChange?.(!checked);
    else if (type === 'radio') onCheckedChange?.(true);
    else onPress?.();
  };
  const ink = danger ? colors.error : colors.text;
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityLabel={name}
      accessibilityHint={accessibilityHint ?? (off ? disabledReason : undefined)}
      accessibilityState={{ ...accessibilityState, disabled: off, ...(type === 'toggle' || type === 'radio' ? { checked } : null) }}
      disabled={off}
      onPress={press}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={({ pressed }) => [
        {
          flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: second ? 64 : 52, paddingHorizontal: 16, opacity: off ? opacity['opacity-disabled'] : 1,
          backgroundColor: pressed ? colors.surfaceMuted : 'transparent',
          ...(focus ? { outlineColor: colors.focus, outlineWidth: 2, outlineOffset: -2, outlineStyle: 'solid' as const, borderRadius: radius['radius-md'] } : null),
        } as ViewStyle,
        style,
      ]}
      {...rest}
    >
      {divider ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', top: 0, start: 16, end: 0, height: 1, backgroundColor: colors.border }} /> : null}
      {icon ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 30, height: 30, borderRadius: radius['radius-sm'], backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' }}>
          <UiIcon name={icon} size={20} color={danger ? colors.error : colors.primary} />
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="web-body" style={{ fontSize: 16, lineHeight: 22, color: ink, fontWeight: danger ? '600' : '400' }}>{label}</Text>
        {second ? <Text variant="body-sm" tone="tertiary" style={{ fontSize: 13, lineHeight: 18 }}>{second}</Text> : null}
      </View>
      {type === 'value' ? (
        <>
          {value ? <Text variant="web-small" tone="tertiary" style={{ fontSize: 15 }}>{value}</Text> : null}
          <UiIcon name="chevron-right" size={20} color={colors.textTertiary} mirrorInRTL />
        </>
      ) : null}
      {type === 'toggle' ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 51, height: 31, borderRadius: radius['radius-pill'], backgroundColor: checked ? colors.primary : '#c7c8cb' }}>
          <View style={{ position: 'absolute', top: 2, start: checked ? 22 : 2, width: 27, height: 27, borderRadius: 14, backgroundColor: '#ffffff', shadowColor: '#000000', shadowOpacity: 0.2, shadowRadius: 3, shadowOffset: { width: 0, height: 2 }, elevation: 2 }} />
        </View>
      ) : null}
      {type === 'radio' ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: checked ? colors.primary : '#c7c8cb', backgroundColor: checked ? colors.primary : colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          {checked ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ffffff' }} /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

export interface SettingsGroupProps extends Omit<ViewProps, 'children'> {
  /** Section header, 12dp caps above the card: "Reading". */
  header?: string;
  /** Footer under the card, one sentence about consequences. */
  footer?: string;
  /** `SettingsRow` elements. */
  children: ReactNode;
  /** Group of `radio` rows: announced as a radio group named by `header`. @default false */
  radioGroup?: boolean;
  /** Space above the group, for a separate Sign out card. @default false */
  separated?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Inset settings card with an optional header and footer. Dividers start 16dp in. */
export function SettingsGroup({ header, footer, children, radioGroup = false, separated = false, style, ...rest }: SettingsGroupProps) {
  const { colors, radius } = useTheme();
  const items = Children.toArray(children);
  return (
    <View {...rest} style={[separated ? { marginTop: 20 } : null, style]}>
      {header ? (
        <Text variant="web-overline" tone="tertiary" accessibilityRole="header" style={{ paddingTop: 16, paddingBottom: 8, paddingHorizontal: 32 }}>{header}</Text>
      ) : null}
      <View
        accessibilityRole={radioGroup ? 'radiogroup' : undefined}
        accessibilityLabel={radioGroup ? header : undefined}
        style={{ marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: radius['radius-md'], overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}
      >
        {items.map((child, i) => (isValidElement<SettingsRowProps>(child) ? cloneElement(child as ReactElement<SettingsRowProps>, { divider: i > 0 }) : child))}
      </View>
      {footer ? <Text variant="body-sm" tone="tertiary" style={{ paddingTop: 8, paddingHorizontal: 32, fontSize: 13, lineHeight: 19 }}>{footer}</Text> : null}
    </View>
  );
}
