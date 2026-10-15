import { useState } from 'react';
import { Pressable, TextInput, View, type StyleProp, type TextInputProps, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';

/** Device safe-area insets in dp, e.g. from `react-native-safe-area-context` or the platform. */
export interface AppBarSafeAreaInsets {
  /** Status bar / notch height. @default 0 */
  top?: number;
  /** @default 0 */
  bottom?: number;
}

/** An icon action in the bar. Every action is a 44dp target with an accessible name. */
export interface AppBarAction {
  /** Icon from the UI set. */
  icon: UiIconProps['name'];
  /** Accessible name, e.g. "Share". Required: the button has no visible text. */
  label: string;
  /** Called on press. */
  onPress?: () => void;
  /** Show the Horizon Blue notification dot. Extend `label` too, e.g. "Notifications, new item". @default false */
  dot?: boolean;
  /** Mirror the icon in right-to-left layouts. @default false */
  mirrorInRTL?: boolean;
}

export interface AppBarProps extends ViewProps {
  /** Screen title. One line; keep under 20 characters. Becomes the screen heading. */
  title?: string;
  /** `bar` is the 56dp row with centred title; `large` adds a 32dp title below (root screens). @default "bar" */
  variant?: 'bar' | 'large';
  /** Back button text: the parent screen's name, never "Back". Shows the back button when set together with `onBack`. */
  backLabel?: string;
  /** Called by the back button. */
  onBack?: () => void;
  /** Up to three trailing actions. Primary first (Share), More last. Extra actions are dropped: move them into More. */
  actions?: AppBarAction[];
  /** The content has scrolled: glass background and hairline. A root screen at rest has no border. @default false */
  scrolled?: boolean;
  /** Draw on imagery: transparent bar, white title and glass action buttons. Add your own scrim behind. @default false */
  overImage?: boolean;
  /** Large variant: show a search field under the title that calls `onPressSearch`. */
  searchPlaceholder?: string;
  /** Called when the search field in the large variant is pressed; swap to `search` mode in response. */
  onPressSearch?: () => void;
  /** Replace the bar by the search bar (field, Clear, Cancel). */
  search?: AppBarSearch;
  /** Safe-area insets; the bar pads its top by `top`. No extra dependency needed. */
  safeAreaInsets?: AppBarSafeAreaInsets;
  style?: StyleProp<ViewStyle>;
}

/** Controlled search mode of the bar. */
export interface AppBarSearch {
  /** Current query. */
  value: string;
  /** Called as the query changes. */
  onChangeText: (text: string) => void;
  /** Placeholder, e.g. "Search books and verses". */
  placeholder?: string;
  /** Cancel text. @default "Cancel" */
  cancelLabel?: string;
  /** Cancel pressed; return focus to the search trigger. */
  onCancel?: () => void;
  /** Accessible name of the field. @default "Search" */
  fieldLabel?: string;
  /** Accessible name of the clear button. @default "Clear search" */
  clearLabel?: string;
  /** Submit pressed on the keyboard. */
  onSubmit?: TextInputProps['onSubmitEditing'];
  /** Auto focus the field. @default true */
  autoFocus?: boolean;
}

function ringStyle(color: string, on: boolean, offset = 2): ViewStyle {
  return on ? { outlineColor: color, outlineWidth: 2, outlineOffset: offset, outlineStyle: 'solid' } : {};
}

interface BarButtonProps extends AppBarAction {
  glass?: boolean;
  testID?: string;
}

/** 44dp icon button of the app bar. */
export function AppBarButton({ icon, label, onPress, dot, mirrorInRTL, glass, testID }: BarButtonProps) {
  const { colors, radius, isDark } = useTheme();
  const [focus, setFocus] = useState(false);
  const ink = glass ? '#ffffff' : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      testID={testID}
      style={({ pressed }): ViewStyle => ({
        width: 44, height: 44, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center',
        backgroundColor: glass ? 'rgba(0,0,0,0.35)' : pressed ? colors.surfaceMuted : 'transparent', ...ringStyle(colors.focus, focus),
      })}
    >
      <UiIcon name={icon} size={24} color={ink} mirrorInRTL={mirrorInRTL} />
      {dot ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', top: 6, end: 6, width: 13, height: 13, borderRadius: 7, backgroundColor: isDark ? '#7fa6f7' : colors.primary, borderWidth: 2, borderColor: isDark ? colors.background : colors.surface}} /> : null}
    </Pressable>
  );
}

/** The top bar of an app screen: back, centred title and up to three icon actions; optional large title, search field or search mode. */
export function AppBar({
  title, variant = 'bar', backLabel, onBack, actions = [], scrolled = false, overImage = false, searchPlaceholder, onPressSearch, search, safeAreaInsets, style, ...rest
}: AppBarProps) {
  const { colors, radius, isDark, spacing } = useTheme();
  const top = safeAreaInsets?.top ?? 0;
  const [searchFocus, setSearchFocus] = useState(false);
  const shown = actions.slice(0, 3);
  const glassBg = isDark ? 'rgba(22,24,25,0.94)' : 'rgba(255,255,255,0.94)';
  const container: ViewStyle = {
    paddingTop: top,
    backgroundColor: overImage ? 'transparent' : scrolled ? glassBg : 'transparent',
    borderBottomWidth: scrolled && !overImage ? 1 : 0, borderBottomColor: isDark ? 'rgba(255,255,255,0.12)' : '#e1e1e4',
  };
  const titleColor = overImage ? '#ffffff' : colors.text;
  const backColor = overImage ? '#ffffff' : isDark ? '#7fa6f7' : colors.link;

  if (search) {
    return (
      <View {...rest} accessibilityRole="search" style={[container, style]}>
        <View style={{ height: 64, flexDirection: 'row', alignItems: 'center', gap: 10, paddingStart: 16 }}>
          <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingStart: 14, paddingEnd: 12, borderRadius: radius['radius-md'], backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary, ...(searchFocus ? { shadowColor: colors.focus, shadowOpacity: 0.35, shadowRadius: 0, shadowOffset: { width: 0, height: 0 } } : null) }}>
            <UiIcon name="search" size={20} color={colors.textSecondary} />
            <TextInput
              value={search.value}
              onChangeText={search.onChangeText}
              placeholder={search.placeholder}
              placeholderTextColor={colors.textTertiary}
              accessibilityLabel={search.fieldLabel ?? 'Search'}
              autoFocus={search.autoFocus ?? true}
              returnKeyType="search"
              onSubmitEditing={search.onSubmit}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              style={{ flex: 1, minWidth: 0, padding: 0, fontSize: 16, color: colors.text }}
            />
            {search.value.length > 0 ? (
              <Pressable accessibilityRole="button" accessibilityLabel={search.clearLabel ?? 'Clear search'} onPress={() => search.onChangeText('')} hitSlop={10} style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#c7c8cb', alignItems: 'center', justifyContent: 'center' }}>
                <UiIcon name="close" size={16} color="#ffffff" />
              </Pressable>
            ) : null}
          </View>
          <Pressable accessibilityRole="button" onPress={search.onCancel} style={{ minHeight: 44, justifyContent: 'center', paddingStart: 2, paddingEnd: 16 }}>
            <Text variant="web-label" style={{ fontSize: 16, color: backColor, fontWeight: '500' }}>{search.cancelLabel ?? 'Cancel'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const hasBack = !!(backLabel && onBack);
  const large = variant === 'large';
  return (
    <View {...rest} style={[container, style]}>
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6 }}>
        {!large ? (
          <View style={{ minWidth: hasBack ? 84 : shown.length * 44, flexDirection: 'row', justifyContent: 'flex-start' }}>
            {hasBack ? (
              <Pressable accessibilityRole="button" accessibilityLabel={backLabel} onPress={onBack} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingEnd: 6, borderRadius: radius['radius-pill'] }}>
                <UiIcon name="chevron-left" size={24} color={backColor} mirrorInRTL />
                <Text variant="web-body" numberOfLines={1} style={{ fontSize: 16, fontWeight: '500', color: backColor }}>{backLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : hasBack ? (
          <Pressable accessibilityRole="button" accessibilityLabel={backLabel} onPress={onBack} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingEnd: 6 }}>
            <UiIcon name="chevron-left" size={24} color={backColor} mirrorInRTL />
            <Text variant="web-body" numberOfLines={1} style={{ fontSize: 16, fontWeight: '500', color: backColor }}>{backLabel}</Text>
          </Pressable>
        ) : null}
        {!large ? (
          <Text variant="web-h4" accessibilityRole="header" numberOfLines={1} style={{ flex: 1, minWidth: 0, textAlign: 'center', fontSize: 17, lineHeight: 22, letterSpacing: -0.17, color: titleColor }}>{title}</Text>
        ) : <View style={{ flex: 1 }} />}
        <View style={{ minWidth: shown.length * 44, flexDirection: 'row', justifyContent: 'flex-end' }}>
          {shown.map((a) => <AppBarButton key={a.label} {...a} glass={overImage} />)}
        </View>
      </View>
      {large ? (
        <>
          <Text variant="web-h2" accessibilityRole="header" numberOfLines={1} style={{ fontSize: 32, lineHeight: 37, letterSpacing: -0.8, paddingHorizontal: 20, paddingBottom: spacing['space-3'], color: titleColor }}>{title}</Text>
          {searchPlaceholder ? (
            <View style={{ paddingHorizontal: 16, paddingBottom: spacing['space-3'] }}>
              <Pressable
                accessibilityRole="search"
                accessibilityLabel={searchPlaceholder}
                onPress={onPressSearch}
                style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingStart: 14, paddingEnd: 12, borderRadius: radius['radius-md'], backgroundColor: pressed ? colors.border : colors.surfaceMuted })}
              >
                <UiIcon name="search" size={20} color={colors.textSecondary} />
                <Text variant="web-body" tone="tertiary" numberOfLines={1} style={{ fontSize: 16, flex: 1 }}>{searchPlaceholder}</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
