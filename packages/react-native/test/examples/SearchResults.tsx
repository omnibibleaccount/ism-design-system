import { useState } from 'react';
import { View } from 'react-native';
import { SearchResults } from '../../src/components/SearchResults';

export default function Example() {
  const [q, setQ] = useState('swa');
  return (
    <View style={{ gap: 24 }}>
      <SearchResults
        scrollable={false} query={q} onChangeQuery={setQ} placeholder="Search languages, verses" onCancel={() => {}}
        summary="2 languages, 1 verse, 1 page"
        groups={[
          { key: 'l', title: 'Languages', kind: 'language', items: [
            { key: 'sw', tile: 'SW', title: 'Swahili', subtitle: 'Kiswahili · Bible + audio', onPress: () => {} },
            { key: 'sw2', tile: 'SW', title: 'Swahili (Congo)', subtitle: 'Kiswahili cha Kongo · Bible', onPress: () => {} },
          ] },
          { key: 'v', title: 'Verses', kind: 'verse', items: [{ key: 'v1', tile: 'Jn', title: 'John 3:16', subtitle: '… God so loved the world …', onPress: () => {} }] },
          { key: 'p', title: 'Pages', kind: 'page', items: [{ key: 'p1', tile: 'ISM', title: 'Swahili Bible project', subtitle: 'ism.bible', external: true, externalHint: 'Opens the website', onPress: () => {} }] },
        ]}
      />
      <SearchResults
        scrollable={false} query="" onChangeQuery={() => {}} placeholder="Search languages, verses"
        recent={['Amharic', 'John 3', 'Psalm 23']} onClearRecent={() => {}} onRemoveRecent={() => {}} suggestions={['John', 'Amharic']}
      />
      <SearchResults
        scrollable={false} query="xqz" onChangeQuery={() => {}}
        noResults={{ title: 'No results for “xqz”', hint: 'Check the spelling, or try a book name like “John” or a language like “Amharic”.', actionLabel: 'Browse all languages' }}
      />
    </View>
  );
}
