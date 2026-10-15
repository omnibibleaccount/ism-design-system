import { View } from 'react-native';
import { ReadingView, TextSizeControl } from '../../src/components/ReadingView';
import { Text } from '../../src/Text';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <ReadingView
        accessibilityLabel="John 3, Berean Standard Bible"
        scrollable={false}
        bookLabel="The Gospel of John" chapterTitle="John 3" translationLabel="BSB"
        onPressPicker={() => {}} onPressTranslation={() => {}} onPressListen={() => {}}
        blocks={[
          { type: 'heading', text: 'Jesus and Nicodemus' },
          { type: 'paragraph', verses: [
            { number: 1, text: 'Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.' },
            { number: 2, text: 'He came to Jesus at night and said, “Rabbi, we know that You are a teacher who has come from God.”' },
            { number: 3, text: 'Jesus replied, “Truly, truly, I tell you, no one can see the kingdom of God unless he is born again.”', highlighted: true, footnotes: ['a'] },
          ] },
        ]}
        footnotes={[{ marker: 'a', reference: '3:3', note: <>Or <Text variant="web-small" style={{ fontStyle: 'italic', fontSize: 14 }}>born from above</Text>; also in verse 7</> }]}
      />
      <ReadingView
        scrollable={false} lang="am" chapterTitle="ዮሐንስ 3" translationLabel="AMH" pickerOpen textSize={22}
        blocks={[{ type: 'paragraph', verses: [{ number: 16, text: 'እግዚአብሔር ዓለሙን እንዲሁ ወዶአልና' }] }]}
      />
      <TextSizeControl value={19} onChange={() => {}} />
    </View>
  );
}
