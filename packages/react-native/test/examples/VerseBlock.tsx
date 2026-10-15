import { View } from 'react-native';
import { VerseBlock, VerseCitation, VerseOfTheDay } from '../../src/components/VerseBlock';
import { Text } from '../../src/Text';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <VerseBlock
        text="For God so loved the world that He gave His one and only Son, that everyone who believes in Him shall not perish but have eternal life."
        reference="John 3:16" translation="BSB" onShare={() => {}} onCopy={() => {}} onBookmark={() => {}}
      />
      <VerseBlock text="Your word is a lamp to my feet and a light to my path." reference="Psalm 119:105" translation="BSB" bookmarked onShare={() => {}} onCopy={() => {}} onBookmark={() => {}} />
      <VerseBlock text="እግዚአብሔር ዓለሙን እንዲሁ ወዶአልና" reference="ዮሐንስ 3:16" translation="Amharic" lang="am" onCopy={() => {}} />
      <VerseBlock text="اللہ نے دنیا سے ایسی محبت رکھی" reference="Yuhanna 3:16" translation="Urdu" lang="ur" onCopy={() => {}} />
      <VerseOfTheDay
        text="Your word is a lamp to my feet and a light to my path." reference="Psalm 119:105" translation="BSB" onShare={() => {}} onBookmark={() => {}}
        footer={<>Read the whole chapter in the dot.Bible app <VerseCitation dark external>Psalm 119</VerseCitation></>}
      />
      <Text>See <VerseCitation>John 3:3</VerseCitation> and <VerseCitation external>Psalm 23</VerseCitation>.</Text>
    </View>
  );
}
