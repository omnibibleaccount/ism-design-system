import { View } from 'react-native';
import { LanguageCard, LanguageList, LanguageRow } from '../../src/components/LanguageRow';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <LanguageList>
        <LanguageRow nativeName="አማርኛ" nativeLang="am" englishName="Amharic" formats={['read', 'listen', 'print', 'app']} onPress={() => {}} />
        <LanguageRow nativeName="اردو" nativeLang="ur" englishName="Urdu" formats={['app', 'read']} onPress={() => {}} />
        <LanguageRow nativeName="မြန်မာဘာသာ" nativeLang="my" englishName="Burmese" formats={['read', 'listen']} onPress={() => {}} />
        <LanguageRow nativeName="Kiswahili" nativeLang="sw" englishName="Swahili" formats={['read']} disabled />
      </LanguageList>
      <LanguageCard nativeName="አማርኛ" nativeLang="am" englishName="Amharic" meta="Amharic · Ethiopia · 57M speakers (sample)" formats={['read', 'listen', 'print', 'app']} onPress={() => {}} />
    </View>
  );
}
