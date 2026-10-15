import { AppHomeScreen } from '../../src/components/AppHomeScreen';
import type { TabBarItem } from '../../src/components/TabBar';
import { UiIcon } from '../../src/Icon';

const tabs: TabBarItem[] = [
  { id: 'home', label: 'Home', icon: <UiIcon name="home" size={24} /> },
  { id: 'bible', label: 'Bible', icon: <UiIcon name="book-open" size={24} /> },
  { id: 'listen', label: 'Listen', icon: <UiIcon name="headphones" size={24} /> },
  { id: 'saved', label: 'Saved', icon: <UiIcon name="bookmark" size={24} /> },
  { id: 'more', label: 'More', icon: <UiIcon name="menu" size={24} /> },
];

export default function Example() {
  return (
    <>
      <AppHomeScreen
        statusBar={<span>9:41</span>}
        accountInitial="M"
        searchPlaceholder="Search 500+ languages"
        continueCard={{
          kicker: 'Continue reading · BSB',
          title: 'John 3',
          percent: 42,
          percentLabel: '42 percent read',
          verseNumber: '16',
          preview: 'For God so loved the world…',
          actionLabel: 'Continue',
          secondaryLabel: 'Listen',
        }}
        languagesHeading="Your languages"
        seeAllLabel="See all"
        seeAllHref="/languages"
        languages={[
          { id: 'am', tile: 'AM', name: 'Amharic', nativeName: 'አማርኛ', nativeLang: 'am', subtitle: 'Bible + audio · Downloaded', href: '/am' },
          { id: 'sw', tile: 'SW', name: 'Kiswahili', subtitle: 'Bible + audio · Downloaded', href: '/sw' },
          { id: 'es', tile: 'ES', name: 'Español', subtitle: 'Bible · 210 MB', status: 'idle' },
        ]}
        player={{ title: 'John 3 · Amharic', time: '2:14 / 5:40', progress: 0.39, progressLabel: '2:14 of 5:40' }}
        tabs={tabs}
      />
      <AppHomeScreen
        dark
        accountInitial="M"
        searchPlaceholder="Search 500+ languages"
        continueCard={{ kicker: 'Start reading', title: 'John 1', preview: 'In the beginning was the Word…', actionLabel: 'Start reading' }}
        tabs={tabs}
      />
    </>
  );
}
