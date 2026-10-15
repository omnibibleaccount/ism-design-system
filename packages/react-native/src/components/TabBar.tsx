import { useState } from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';

/** One top-level section. */
export interface TabBarItem {
  /** Stable key, returned by `onChange`. */
  key: string;
  /** One short word, title case: "Home". Labels never truncate; translate with the app. */
  label: string;
  /** Outline icon from the UI set. The active tab keeps the outline icon. */
  icon: UiIconProps['name'];
  /** Something new: shows the 9dp Horizon Blue dot. Extend `accessibilityLabel` too. @default false */
  dot?: boolean;
  /** Accessible name when it differs from the label, e.g. "More, new item". */
  accessibilityLabel?: string;
  testID?: string;
}

export interface TabBarProps extends ViewProps {
  /** Three to five tabs. dot.Bible uses exactly five in this order: Home, Bible, Listen, Saved, More. */
  tabs: TabBarItem[];
  /** Key of the current tab. Exactly one is active at all times. */
  activeKey: string;
  /** Called with the key of the tab pressed. Tabs only navigate; never put actions here. */
  onChange: (key: string) => void;
  /** Safe-area insets. The bar adds `bottom` below the tabs so the home indicator never overlaps them. */
  safeAreaInsets?: { top?: number; bottom?: number };
  /** Accessible name of the navigation region. @default "Main" */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** The bottom tab bar: equal-width tabs with a 24dp icon over an 11dp label. Colour is never the only cue. */
export function TabBar({ tabs, activeKey, onChange, safeAreaInsets, accessibilityLabel = 'Main', style, ...rest }: TabBarProps) {
  const { colors, radius, isDark } = useTheme();
  const [focus, setFocus] = useState<string | null>(null);
  const inactive = isDark ? colors.textSecondary : colors.textTertiary;
  const ringColor = isDark ? '#161819' : colors.surface;
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      {...rest}
      style={[{ flexDirection: 'row', paddingTop: 6, paddingHorizontal: 4, paddingBottom: safeAreaInsets?.bottom ?? 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.12)' : '#e1e1e4' }, style]}
    >
      {tabs.map((t) => {
        const active = t.key === activeKey;
        const ink = active ? colors.link : inactive;
        return (
          <Pressable
            key={t.key}
            accessibilityRole="tab"
            accessibilityLabel={t.accessibilityLabel ?? t.label}
            accessibilityState={{ selected: active }}
            onPress={() => onChange(t.key)}
            onFocus={() => setFocus(t.key)}
            onBlur={() => setFocus(null)}
            testID={t.testID}
            style={({ pressed }): ViewStyle => ({
              flex: 1, minWidth: 0, minHeight: 52, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: radius['radius-md'],
              backgroundColor: pressed ? colors.surfaceMuted : 'transparent',
              ...(focus === t.key ? { outlineColor: colors.focus, outlineWidth: 2, outlineOffset: -2, outlineStyle: 'solid' } : null),
            })}
          >
            <View style={{ height: 24 }}>
              <UiIcon name={t.icon} size={24} color={ink} />
              {t.dot ? (
                <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', top: -4, end: -7, width: 13, height: 13, borderRadius: 7, backgroundColor: isDark ? '#7fa6f7' : colors.primary, borderWidth: 2, borderColor: ringColor }} />
              ) : null}
            </View>
            <Text variant="web-label" style={{ fontSize: 11, lineHeight: 14, letterSpacing: 0.11, color: ink, textAlign: 'center', fontWeight: '600' }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
