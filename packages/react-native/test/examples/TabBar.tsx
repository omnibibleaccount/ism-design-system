import { useState } from 'react';
import { View } from 'react-native';
import { TabBar, type TabBarItem } from '../../src/components/TabBar';

const TABS: TabBarItem[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'bible', label: 'Bible', icon: 'book-open' },
  { key: 'listen', label: 'Listen', icon: 'headphones' },
  { key: 'saved', label: 'Saved', icon: 'bookmark' },
  { key: 'more', label: 'More', icon: 'more-horizontal', dot: true, accessibilityLabel: 'More, new item' },
];

export default function Example() {
  const [key, setKey] = useState('home');
  return (
    <View style={{ gap: 16 }}>
      <TabBar tabs={TABS} activeKey={key} onChange={setKey} safeAreaInsets={{ bottom: 26 }} />
      <TabBar tabs={TABS} activeKey="listen" onChange={() => {}} />
    </View>
  );
}
