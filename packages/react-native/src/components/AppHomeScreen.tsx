import type { ReactNode } from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { directionFor } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { Logo, UiIcon } from '../Icon';
import { AppBarButton, type AppBarSafeAreaInsets } from './AppBar';
import { AudioMiniPlayer, type AudioMiniPlayerProps } from './AudioPlayer';
import { Button } from './Button';
import { DownloadButton, type DownloadStatus } from './DownloadState';
import { TabBar, type TabBarItem } from './TabBar';

/** The Continue reading card. */
export interface HomeContinueReading {
  /** Kicker: "Continue reading · BSB". */
  kicker: string;
  /** Chapter title: "John 3". */
  title: string;
  /** Share of the book read, 0 to 1. Shown in the ring. */
  progress: number;
  /** Text equivalent of the ring: "42 percent read". */
  progressLabel: string;
  /** Verse number of the preview. */
  verseNumber?: number | string;
  /** The next verse, exactly as published, shown in Lora. */
  verseText: string;
  /** BCP-47 language of the verse. */
  verseLang?: string;
  /** Continue: the screen's one Horizon Blue primary. */
  continueLabel: string;
  onContinue: () => void;
  /** Listen (secondary). Hidden when `listenLabel` is omitted. */
  listenLabel?: string;
  onListen?: () => void;
}

/** First run: shown instead of the continue card when nothing has been read yet. Keep one primary. */
export interface HomeStartReading {
  /** "Start reading". */
  title: string;
  /** Line under the title, e.g. "Begin with John 1". */
  hint?: string;
  /** Button label: "Read John 1". */
  actionLabel: string;
  onPress: () => void;
}

/** One language row on the home screen. */
export interface HomeLanguage {
  /** Stable key. */
  key: string;
  /** Native-script name first. */
  nativeName: string;
  /** BCP-47 tag of the native name. */
  nativeLang: string;
  /** English name, shown after the native name. */
  englishName: string;
  /** Two-letter tile text: "AM". */
  tile: string;
  /** Line under the name: "Bible + audio · Downloaded" or the size "Bible + audio · 312 MB". */
  subtitle: string;
  /** On the phone: shows the chevron. Otherwise the download button shows. @default false */
  downloaded?: boolean;
  /** Download state of a language that is not downloaded. @default "idle" */
  downloadStatus?: DownloadStatus;
  /** Progress 0 to 1 while downloading. */
  downloadProgress?: number;
  /** Opens the language. */
  onPress?: () => void;
  /** Starts, stops or retries the download. */
  onDownload?: () => void;
}

export interface AppHomeScreenProps extends ViewProps {
  /** Screen title for assistive technology (the wordmark is decorative): "Home". @default "Home" */
  screenTitle?: string;
  /** Text of the wordmark. Shown with a Horizon Blue dot after "dot". @default "dot.Bible" */
  wordmark?: string;
  /** Notifications button; the dot is Horizon Blue, never red. */
  notifications?: { label: string; dot?: boolean; onPress?: () => void };
  /** Account avatar button. */
  account?: { label: string; initial: string; onPress?: () => void };
  /** Search field text: "Search 500+ languages". */
  searchPlaceholder: string;
  /** Opens SearchResults. */
  onPressSearch: () => void;
  /** Continue card. Replaced by `startReading` on first run. */
  continueReading?: HomeContinueReading;
  /** First-run card. */
  startReading?: HomeStartReading;
  /** Group of language rows under a header. */
  languages?: { title: string; seeAllLabel?: string; onSeeAll?: () => void; items: HomeLanguage[] };
  /** Mini player; leave out when nothing is playing (content then scrolls straight under the tab bar). */
  player?: Omit<AudioMiniPlayerProps, 'dark'>;
  /** Tabs, with `activeTabKey` set to Home. */
  tabs: TabBarItem[];
  /** Current tab. */
  activeTabKey: string;
  /** Tab pressed. */
  onTabChange: (key: string) => void;
  /** Safe-area insets: top pads the bar, bottom pads the tab bar. */
  safeAreaInsets?: AppBarSafeAreaInsets;
  /** Extra content between the language group and the bottom, for app-specific blocks. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function ProgressRing({ progress, label }: { progress: number; label: string }) {
  const { colors, isDark } = useTheme();
  const p = Math.min(Math.max(progress, 0), 1);
  const c = 2 * Math.PI * 19;
  const ink = isDark ? '#7fa6f7' : '#0455ad';
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={44} height={44} viewBox="0 0 44 44" style={{ position: 'absolute' }}>
        <Circle cx={22} cy={22} r={19} fill="none" stroke={isDark ? 'rgba(255,255,255,0.2)' : '#e1e1e4'} strokeWidth={4} />
        <Circle cx={22} cy={22} r={19} fill="none" stroke={colors.primary} strokeWidth={4} strokeDasharray={`${(p * c).toFixed(1)} ${c.toFixed(1)}`} transform="rotate(-90 22 22)" />
      </Svg>
      <Text variant="web-label" style={{ fontSize: 11, lineHeight: 14, fontWeight: '700', color: ink }}>{`${Math.round(p * 100)}%`}</Text>
    </View>
  );
}

function ContinueCard({ data }: { data: HomeContinueReading }) {
  const { colors, radius, isDark, lang } = useTheme();
  const verseLang = data.verseLang ?? lang;
  return (
    <View style={{ marginHorizontal: 16, paddingTop: 14, paddingHorizontal: 16, paddingBottom: 16, gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="web-label" style={{ fontSize: 11, lineHeight: 14, letterSpacing: 1.54, textTransform: 'uppercase', color: isDark ? '#7fa6f7' : '#0455ad', marginBottom: 4 }}>{data.kicker}</Text>
          <Text variant="web-h4" accessibilityRole="header" style={{ fontSize: 22, lineHeight: 26, letterSpacing: -0.44 }}>{data.title}</Text>
        </View>
        <ProgressRing progress={data.progress} label={data.progressLabel} />
      </View>
      <Text variant="scripture" lang={verseLang} numberOfLines={3} style={{ fontSize: 15, lineHeight: 23, writingDirection: directionFor(verseLang) }}>
        {data.verseNumber !== undefined ? <Text variant="web-label" style={{ fontSize: 9, color: colors.textTertiary }}>{`${data.verseNumber} `}</Text> : null}
        {data.verseText}
      </Text>
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        <Button onPress={data.onContinue}>{data.continueLabel}</Button>
        {data.listenLabel ? <Button variant="secondary" onPress={data.onListen}>{data.listenLabel}</Button> : null}
      </View>
    </View>
  );
}

function StartCard({ data }: { data: HomeStartReading }) {
  const { colors, radius } = useTheme();
  return (
    <View style={{ marginHorizontal: 16, padding: 16, gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'] }}>
      <Text variant="web-h4" accessibilityRole="header" style={{ fontSize: 22, lineHeight: 26, letterSpacing: -0.44 }}>{data.title}</Text>
      {data.hint ? <Text variant="web-small" tone="secondary">{data.hint}</Text> : null}
      <Button onPress={data.onPress}>{data.actionLabel}</Button>
    </View>
  );
}

function LanguageItem({ item, divider }: { item: HomeLanguage; divider: boolean }) {
  const { colors, radius, isDark } = useTheme();
  const showDownload = !item.downloaded;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 64, paddingEnd: showDownload ? 8 : 0 }}>
      {divider ? <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', top: 0, start: 16, end: 0, height: 1, backgroundColor: colors.border }} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.nativeName}, ${item.englishName}, ${item.subtitle}`}
        onPress={item.onPress}
        style={({ pressed }) => ({ flex: 1, minWidth: 0, minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, backgroundColor: pressed ? colors.surfaceMuted : 'transparent' })}
      >
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 36, height: 36, borderRadius: radius['radius-sm'], backgroundColor: colors.tint, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="web-label" style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#7fa6f7' : '#0455ad' }}>{item.tile}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="web-body" numberOfLines={1} style={{ fontSize: 16, lineHeight: 22 }}>
            <Text variant="web-body" lang={item.nativeLang} style={{ fontSize: 16, writingDirection: directionFor(item.nativeLang) }}>{item.nativeName}</Text>
            <Text variant="web-body" tone="tertiary" style={{ fontSize: 16 }}>{`  ${item.englishName}`}</Text>
          </Text>
          <Text variant="body-sm" tone="tertiary" numberOfLines={1} style={{ fontSize: 13, lineHeight: 18 }}>{item.subtitle}</Text>
        </View>
        {item.downloaded ? <UiIcon name="chevron-right" size={20} color={colors.textTertiary} mirrorInRTL /> : null}
      </Pressable>
      {showDownload ? <DownloadButton itemName={item.englishName} status={item.downloadStatus ?? 'idle'} progress={item.downloadProgress} onPress={item.onDownload} /> : null}
    </View>
  );
}

/**
 * The dot.Bible home screen composed from the App UI parts: wordmark bar, search, Continue reading, grouped languages, mini player and tab bar.
 * One Horizon Blue primary (Continue). 16dp side margins throughout. Content only; the host app supplies the data and navigation.
 */
export function AppHomeScreen({
  screenTitle = 'Home', wordmark = 'dot.Bible', notifications, account, searchPlaceholder, onPressSearch, continueReading, startReading, languages, player, tabs, activeTabKey, onTabChange, safeAreaInsets, children, style, ...rest
}: AppHomeScreenProps) {
  const { colors, radius } = useTheme();
  const top = safeAreaInsets?.top ?? 0;
  const dotAt = wordmark.indexOf('.');
  const before = dotAt >= 0 ? wordmark.slice(0, dotAt) : wordmark;
  const after = dotAt >= 0 ? wordmark.slice(dotAt + 1) : '';
  return (
    <View {...rest} style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      <View style={{ paddingTop: top }}>
        <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', paddingStart: 16, paddingEnd: 6 }}>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
            <Logo name="dotbible-icon" height={28} />
            <Text variant="web-h3" style={{ fontSize: 22, lineHeight: 26, letterSpacing: -0.55 }}>
              {before}
              {dotAt >= 0 ? <Text variant="web-h3" style={{ fontSize: 22, color: colors.primary }}>.</Text> : null}
              {after}
            </Text>
          </View>
          {notifications ? <AppBarButton icon="mail" label={notifications.label} dot={notifications.dot} onPress={notifications.onPress} /> : null}
          {account ? (
            <Pressable accessibilityRole="button" accessibilityLabel={account.label} onPress={account.onPress} hitSlop={4} style={{ width: 36, height: 36, marginStart: 4, marginEnd: 10, borderRadius: 18, backgroundColor: '#161819', alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="web-label" style={{ fontSize: 14, color: '#ffffff' }}>{account.initial}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 16, gap: 16 }}>
        <Text variant="web-label" accessibilityRole="header" style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>{screenTitle}</Text>
        <View style={{ paddingHorizontal: 16 }}>
          <Pressable
            accessibilityRole="search"
            accessibilityLabel={searchPlaceholder}
            onPress={onPressSearch}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, paddingStart: 14, paddingEnd: 12, borderRadius: radius['radius-md'], backgroundColor: pressed ? colors.border : colors.surfaceMuted })}
          >
            <UiIcon name="search" size={20} color={colors.textSecondary} />
            <Text variant="web-body" tone="tertiary" numberOfLines={1} style={{ flex: 1, fontSize: 16 }}>{searchPlaceholder}</Text>
          </Pressable>
        </View>
        {continueReading ? <ContinueCard data={continueReading} /> : startReading ? <StartCard data={startReading} /> : null}
        {languages && languages.items.length > 0 ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, paddingHorizontal: 20 }}>
              <Text variant="web-overline" tone="tertiary" accessibilityRole="header">{languages.title}</Text>
              {languages.onSeeAll ? (
                <Pressable accessibilityRole="button" onPress={languages.onSeeAll} style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Text variant="web-label" style={{ fontSize: 15, color: colors.link }}>{languages.seeAllLabel}</Text>
                  <UiIcon name="chevron-right" size={16} color={colors.link} mirrorInRTL />
                </Pressable>
              ) : null}
            </View>
            <View style={{ marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: radius['radius-md'], overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
              {languages.items.map((item, i) => <LanguageItem key={item.key} item={item} divider={i > 0} />)}
            </View>
          </View>
        ) : null}
        {children}
      </ScrollView>
      {player ? <AudioMiniPlayer dark {...player} style={[{ marginHorizontal: 8, marginBottom: 8 }, player.style]} /> : null}
      <TabBar tabs={tabs} activeKey={activeTabKey} onChange={onTabChange} safeAreaInsets={safeAreaInsets} />
    </View>
  );
}
