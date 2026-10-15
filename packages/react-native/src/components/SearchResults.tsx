import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { AppBar, type AppBarSafeAreaInsets } from './AppBar';
import { Button } from './Button';

/** Which kind of thing a result is; sets the tile colour. Groups appear in the order Languages, Verses, Pages. */
export type SearchResultKind = 'language' | 'verse' | 'page';

/** One result row. */
export interface SearchResultItem {
  /** Stable key. */
  key: string;
  /** Title. The characters matching the query are highlighted. */
  title: string;
  /** Second line: "Kiswahili · Bible + audio", or a verse snippet with ellipses. */
  subtitle?: string;
  /** Two-letter tile text, e.g. "SW". Verse results can leave it out to show the reference. */
  tile?: string;
  /** Opens the website: ends with the arrow instead of the chevron. @default false */
  external?: boolean;
  /** Spoken hint for external rows, e.g. "Opens the website". */
  externalHint?: string;
  onPress?: () => void;
}

/** A group of results of one kind. */
export interface SearchResultGroup {
  /** Stable key. */
  key: string;
  /** Header: "Languages". */
  title: string;
  /** Tile colour. */
  kind: SearchResultKind;
  /** All items; the first five are shown. */
  items: SearchResultItem[];
  /** Total count shown in Horizon Blue. Defaults to `items.length`. */
  count?: number;
  /** Label of the "See all" action shown when there are more than five items. @default "See all" */
  seeAllLabel?: string;
  /** Called by "See all". */
  onSeeAll?: () => void;
}

export interface SearchResultsProps extends ViewProps {
  /** Current query. */
  query: string;
  /** Called as the query changes. */
  onChangeQuery: (text: string) => void;
  /** Field placeholder: "Search languages, verses". */
  placeholder?: string;
  /** Cancel pressed; return focus to the search trigger. */
  onCancel?: () => void;
  /** @default "Cancel" */
  cancelLabel?: string;
  /** @default "Search" */
  fieldLabel?: string;
  /** @default "Clear search" */
  clearLabel?: string;
  /** Recent searches, newest first, at most five shown. Shown while the query is empty. */
  recent?: string[];
  /** Title above recents. @default "Recent" */
  recentTitle?: string;
  /** Called when a recent search is chosen. */
  onSelectRecent?: (query: string) => void;
  /** Called to remove one recent search. */
  onRemoveRecent?: (query: string) => void;
  /** Clear all recents action. */
  onClearRecent?: () => void;
  /** @default "Clear" */
  clearRecentLabel?: string;
  /** Accessible name of a remove button; "{query}" is replaced. @default "Remove {query}" */
  removeRecentLabel?: string;
  /** "Try" suggestions shown as chips while the query is empty. */
  suggestions?: string[];
  /** @default "Try" */
  suggestionsTitle?: string;
  /** Result groups. */
  groups?: SearchResultGroup[];
  /** Polite live-region summary read when results change: "2 languages, 14 verses, 1 page". */
  summary?: string;
  /** No-results state, shown when the query is non-empty and `groups` has no items. One secondary action, no blue primary. */
  noResults?: { title: string; hint: string; actionLabel?: string; onAction?: () => void };
  /** Safe-area insets for the search bar. */
  safeAreaInsets?: AppBarSafeAreaInsets;
  /** Wrap results in a ScrollView. @default true */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Split `text` around the first case-insensitive match of `query` so only the match is highlighted. */
export function splitMatch(text: string, query: string): { before: string; match: string; after: string } {
  const q = query.trim();
  const i = q ? text.toLocaleLowerCase().indexOf(q.toLocaleLowerCase()) : -1;
  if (i < 0) return { before: text, match: '', after: '' };
  return { before: text.slice(0, i), match: text.slice(i, i + q.length), after: text.slice(i + q.length) };
}

function GroupHeader({ title, count, action }: { title: string; count?: number; action?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, paddingTop: 14, paddingBottom: 4, paddingHorizontal: 20 }}>
      <Text variant="web-overline" tone="tertiary" accessibilityRole="header">{title}</Text>
      {count !== undefined ? <Text variant="web-label" style={{ fontSize: 12, color: colors.link }}>{String(count)}</Text> : action}
    </View>
  );
}

function ResultRow({ item, kind, query }: { item: SearchResultItem; kind: SearchResultKind; query: string }) {
  const { colors, radius, isDark } = useTheme();
  const [focus, setFocus] = useState(false);
  const tileBg = kind === 'language' ? colors.tint : kind === 'verse' ? (isDark ? 'rgba(232,201,135,0.12)' : '#fdf3e4') : colors.surfaceMuted;
  const tileInk = kind === 'language' ? (isDark ? '#7fa6f7' : '#0455ad') : kind === 'verse' ? (isDark ? '#e8c987' : colors.warning) : colors.textBody;
  const { before, match, after } = splitMatch(item.title, query);
  return (
    <Pressable
      accessibilityRole={item.external ? 'link' : 'button'}
      accessibilityHint={item.external ? item.externalHint : undefined}
      onPress={item.onPress}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={({ pressed }): ViewStyle => ({
        flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingVertical: 6, paddingHorizontal: 20, backgroundColor: pressed ? colors.surfaceMuted : 'transparent',
        ...(focus ? { outlineColor: colors.focus, outlineWidth: 2, outlineOffset: -2, outlineStyle: 'solid' } : null),
      })}
    >
      {item.tile ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 36, height: 36, borderRadius: radius['radius-sm'], backgroundColor: tileBg, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="web-label" style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.24, color: tileInk }}>{item.tile}</Text>
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="web-body" numberOfLines={1} style={{ fontSize: 16, lineHeight: 22 }}>
          {before}
          {match ? <Text variant="web-label" style={{ fontSize: 16, color: isDark ? '#7fa6f7' : '#0455ad', backgroundColor: isDark ? 'rgba(127,166,247,0.2)' : 'rgba(4,109,227,0.14)' }}>{match}</Text> : null}
          {after}
        </Text>
        {item.subtitle ? <Text variant="body-sm" tone="tertiary" numberOfLines={2} style={{ fontSize: 13, lineHeight: 18 }}>{item.subtitle}</Text> : null}
      </View>
      {item.external ? (
        <Text variant="web-body" accessibilityElementsHidden importantForAccessibility="no" tone="tertiary" style={{ fontSize: 16 }}>{'↗'}</Text>
      ) : (
        <UiIcon name="chevron-right" size={20} color={colors.textTertiary} mirrorInRTL />
      )}
    </Pressable>
  );
}

/** The in-app search screen: focused field with Cancel, recents and suggestions, grouped results with highlighted matches, and a helpful no-results state. */
export function SearchResults({
  query, onChangeQuery, placeholder, onCancel, cancelLabel, fieldLabel, clearLabel, recent = [], recentTitle = 'Recent', onSelectRecent, onRemoveRecent, onClearRecent, clearRecentLabel = 'Clear',
  removeRecentLabel = 'Remove {query}', suggestions = [], suggestionsTitle = 'Try', groups = [], summary, noResults, safeAreaInsets, scrollable = true, style, ...rest
}: SearchResultsProps) {
  const { colors, radius } = useTheme();
  const empty = query.trim().length === 0;
  const hasResults = groups.some((g) => g.items.length > 0);

  const recents = empty && recent.length > 0 ? (
    <View>
      <GroupHeader
        title={recentTitle}
        action={onClearRecent ? (
          <Pressable accessibilityRole="button" onPress={onClearRecent} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 4 }}>
            <Text variant="web-label" style={{ fontSize: 15, color: colors.link }}>{clearRecentLabel}</Text>
          </Pressable>
        ) : undefined}
      />
      {recent.slice(0, 5).map((r) => (
        <View key={r} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable accessibilityRole="button" onPress={() => onSelectRecent?.(r)} style={({ pressed }) => ({ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingStart: 20, backgroundColor: pressed ? colors.surfaceMuted : 'transparent' })}>
            <UiIcon name="clock" size={20} color={colors.textTertiary} />
            <Text variant="web-body" numberOfLines={1} style={{ fontSize: 16, flex: 1 }}>{r}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={removeRecentLabel.replace('{query}', r)} onPress={() => onRemoveRecent?.(r)} style={{ width: 44, height: 44, marginEnd: 8, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center' }}>
            <UiIcon name="close" size={20} color={colors.textTertiary} />
          </Pressable>
        </View>
      ))}
    </View>
  ) : null;

  const chips = empty && suggestions.length > 0 ? (
    <View>
      <GroupHeader title={suggestionsTitle} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingVertical: 4 }}>
        {suggestions.map((s) => (
          <Pressable
            key={s}
            accessibilityRole="button"
            hitSlop={4}
            onPress={() => onChangeQuery(s)}
            style={({ pressed }) => ({ minHeight: 36, paddingHorizontal: 14, justifyContent: 'center', borderRadius: radius['radius-pill'], borderWidth: 1, borderColor: colors.border, backgroundColor: pressed ? colors.surfaceMuted : colors.surface })}
          >
            <Text variant="web-label" style={{ fontSize: 14 }}>{s}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  ) : null;

  const results = !empty && hasResults ? groups.filter((g) => g.items.length > 0).map((g) => (
    <View key={g.key}>
      <GroupHeader title={g.title} count={g.count ?? g.items.length} />
      {g.items.slice(0, 5).map((item) => <ResultRow key={item.key} item={item} kind={g.kind} query={query} />)}
      {g.items.length > 5 ? (
        <Pressable accessibilityRole="button" onPress={g.onSeeAll} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 20 }}>
          <Text variant="web-label" style={{ fontSize: 15, color: colors.link }}>{g.seeAllLabel ?? 'See all'}</Text>
        </Pressable>
      ) : null}
    </View>
  )) : null;

  const none = !empty && !hasResults && noResults ? (
    <View accessibilityLiveRegion="polite" style={{ alignItems: 'center', gap: 12, paddingHorizontal: 36, paddingTop: 48, paddingBottom: 48 }}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
        <UiIcon name="search" size={24} color={colors.textTertiary} />
      </View>
      <Text variant="web-h4" accessibilityRole="header" style={{ fontSize: 20, lineHeight: 26, textAlign: 'center' }}>{noResults.title}</Text>
      <Text variant="web-small" tone="body" style={{ textAlign: 'center' }}>{noResults.hint}</Text>
      {noResults.actionLabel ? <Button variant="secondary" size="sm" onPress={noResults.onAction}>{noResults.actionLabel}</Button> : null}
    </View>
  ) : null;

  const content = (
    <>
      {recents}
      {chips}
      {results}
      {none}
    </>
  );

  return (
    <View {...rest} style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      <AppBar
        safeAreaInsets={safeAreaInsets}
        search={{ value: query, onChangeText: onChangeQuery, placeholder, onCancel, cancelLabel, fieldLabel, clearLabel }}
      />
      {summary ? (
        <Text variant="body-sm" accessibilityLiveRegion="polite" style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>{summary}</Text>
      ) : null}
      {scrollable ? <ScrollView keyboardShouldPersistTaps="handled">{content}</ScrollView> : content}
    </View>
  );
}
