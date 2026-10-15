import { View } from 'react-native';
import { AppHomeScreen } from '../../src/components/AppHomeScreen';
import type { TabBarItem } from '../../src/components/TabBar';

const TABS: TabBarItem[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'bible', label: 'Bible', icon: 'book-open' },
  { key: 'listen', label: 'Listen', icon: 'headphones' },
  { key: 'saved', label: 'Saved', icon: 'bookmark' },
  { key: 'more', label: 'More', icon: 'more-horizontal' },
];

export default function Example() {
  const languages = {
    title: 'Your languages', seeAllLabel: 'See all', onSeeAll: () => {},
    items: [
      { key: 'am', tile: 'AM', nativeName: 'አማርኛ', nativeLang: 'am', englishName: 'Amharic', subtitle: 'Bible + audio · Downloaded', downloaded: true },
      { key: 'sw', tile: 'SW', nativeName: 'Kiswahili', nativeLang: 'sw', englishName: 'Swahili', subtitle: 'Bible + audio · 312 MB (sample)' },
      { key: 'ur', tile: 'UR', nativeName: 'اردو', nativeLang: 'ur', englishName: 'Urdu', subtitle: 'Bible · 180 MB (sample)', downloadStatus: 'downloading' as const, downloadProgress: 0.62 },
    ],
  };
  return (
    <View style={{ gap: 16 }}>
      <View style={{ height: 720 }}>
        <AppHomeScreen
          notifications={{ label: 'Notifications, new item', dot: true }} account={{ label: 'Account', initial: 'M' }}
          searchPlaceholder="Search 500+ languages" onPressSearch={() => {}}
          continueReading={{ kicker: 'Continue reading · BSB', title: 'John 3', progress: 0.42, progressLabel: '42 percent read', verseNumber: 16, verseText: 'For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life.', continueLabel: 'Continue', onContinue: () => {}, listenLabel: 'Listen', onListen: () => {} }}
          languages={languages}
          player={{ title: 'John 3 · Amharic', playing: true, position: 134, duration: 340, onPlayPause: () => {}, onSkipBack: () => {} }}
          tabs={TABS} activeTabKey="home" onTabChange={() => {}} safeAreaInsets={{ top: 24, bottom: 20 }}
        />
      </View>
      <View style={{ height: 520 }}>
        <AppHomeScreen
          searchPlaceholder="Search 500+ languages" onPressSearch={() => {}}
          startReading={{ title: 'Start reading', hint: 'Begin with John 1', actionLabel: 'Read John 1', onPress: () => {} }}
          tabs={TABS} activeTabKey="home" onTabChange={() => {}}
        />
      </View>
    </View>
  );
}
