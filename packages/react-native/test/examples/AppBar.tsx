import { useState } from 'react';
import { View } from 'react-native';
import { AppBar } from '../../src/components/AppBar';

export default function Example() {
  const [q, setQ] = useState('swa');
  return (
    <View style={{ gap: 16 }}>
      <AppBar title="John 3" backLabel="Books" onBack={() => {}} actions={[{ icon: 'share', label: 'Share' }, { icon: 'more-horizontal', label: 'More' }]} safeAreaInsets={{ top: 24 }} />
      <AppBar variant="large" title="Bible" actions={[{ icon: 'mail', label: 'Notifications, new item', dot: true }]} searchPlaceholder="Search books and verses" onPressSearch={() => {}} />
      <AppBar title="Saved" scrolled actions={[{ icon: 'search', label: 'Search' }]} />
      <AppBar overImage title="7 days in the Psalms" backLabel="Plans" onBack={() => {}} actions={[{ icon: 'share', label: 'Share' }]} style={{ backgroundColor: '#161819' }} />
      <AppBar search={{ value: q, onChangeText: setQ, placeholder: 'Search languages, verses', onCancel: () => {}, autoFocus: false }} />
    </View>
  );
}
