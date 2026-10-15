import { View } from 'react-native';
import { SearchField } from '../../src/components/SearchField';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <SearchField label="Search" placeholder="Search programs, FAQs, pages" hint="Press Enter to see results." />
      <SearchField label="Search" defaultValue="tap card" />
      <SearchField label="Search" defaultValue="psalm 151" error="No pages match this search. Try a shorter word." />
      <SearchField label="Search" disabled placeholder="Search programs" />
    </View>
  );
}
