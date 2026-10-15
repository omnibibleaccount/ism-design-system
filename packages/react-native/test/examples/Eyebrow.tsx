import { View } from 'react-native';
import { Eyebrow, Overline } from '../../src/components/Eyebrow';
import { Text } from '../../src/Text';

export default function Example() {
  return (
    <>
      <View style={{ gap: 16 }}>
        <Eyebrow>About ISM</Eyebrow>
        <Text variant="web-h2">Scripture for every heart language</Text>
      </View>
      <View style={{ backgroundColor: '#000000', padding: 16 }}>
        <Eyebrow onDark>Join the Mission</Eyebrow>
      </View>
      <Eyebrow lang="am">ስለ እኛ</Eyebrow>
      <Overline>Reading</Overline>
      <Overline onDark>More from ISM</Overline>
    </>
  );
}
