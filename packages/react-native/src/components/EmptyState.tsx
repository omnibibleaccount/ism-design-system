import { type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';
import { Button } from './Button';

export type EmptyStateVariant = 'noResults' | 'nothingYet' | 'offline';

export interface EmptyStateProps extends Omit<ViewProps, 'children'> {
  /** `noResults` (grey search icon, suggestion chips), `nothingYet` (blue tint, one primary action), `offline` (red tint, secondary "Try again"). @default "nothingYet" */
  variant?: EmptyStateVariant;
  /** What happened: "No saved verses yet". */
  title: string;
  /** One short sentence saying what to do. Never blames the reader. */
  description?: string;
  /** Icon override. Defaults: search, bookmark, wifi-off. */
  icon?: UiIconProps['name'];
  /** Label of the single next-step button. */
  actionLabel?: string;
  /** Called when the next-step button is pressed. */
  onAction?: () => void;
  /** Two to four real searches the reader can tap (`noResults`). */
  suggestions?: readonly string[];
  /** Called with the tapped suggestion. */
  onSuggestionPress?: (suggestion: string) => void;
  /** Extra content under the description, replacing the default action. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_ICON: Record<EmptyStateVariant, UiIconProps['name']> = { noResults: 'search', nothingYet: 'bookmark', offline: 'wifi-off' };

/** Centred panel: 64dp icon circle, title, one sentence and one next step. Offline is announced once as an alert; no-results as a status. */
export function EmptyState({ variant = 'nothingYet', title, description, icon, actionLabel, onAction, suggestions, onSuggestionPress, children, style, ...rest }: EmptyStateProps) {
  const { colors, radius, isDark } = useTheme();
  const circle = variant === 'noResults' ? colors.surfaceMuted : variant === 'offline' ? colors.errorBg : colors.tint;
  const fg = variant === 'noResults' ? colors.textBody : variant === 'offline' ? colors.error : colors.link;
  return (
    <View
      accessible={false}
      accessibilityRole={variant === 'offline' ? 'alert' : undefined}
      accessibilityLiveRegion={variant === 'offline' ? 'assertive' : 'polite'}
      style={[
        { alignItems: 'center', gap: 12, paddingVertical: 40, paddingHorizontal: 28, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'] },
        style,
      ]}
      {...rest}
    >
      <View
        accessibilityElementsHidden importantForAccessibility="no-hide-descendants"
        style={{ width: 64, height: 64, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: circle, marginBottom: 4 }}
      >
        <UiIcon name={icon ?? DEFAULT_ICON[variant]} size={28} color={fg} />
      </View>
      <Text variant="web-h4" accessibilityRole="header" style={{ fontSize: 20, lineHeight: 26, textAlign: 'center' }}>{title}</Text>
      {description ? <Text variant="web-small" tone="body" style={{ textAlign: 'center', maxWidth: 280 }}>{description}</Text> : null}
      {children}
      {suggestions && suggestions.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 4 }}>
          {suggestions.slice(0, 4).map((s) => (
            <Pressable
              key={s} accessibilityRole="button" onPress={() => onSuggestionPress?.(s)}
              style={({ pressed }) => ({
                minHeight: 44, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, alignItems: 'center', justifyContent: 'center',
                borderColor: pressed ? colors.text : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.28)', backgroundColor: colors.surface,
              })}
            >
              <Text variant="web-label" style={{ fontSize: 14 }}>{s}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {actionLabel && !children ? (
        <Button
          variant={variant === 'offline' ? 'secondary' : 'primary'} onPress={onAction} style={{ marginTop: 8 }}
          icon={variant === 'offline' ? <UiIcon name="refresh" /> : undefined}
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
