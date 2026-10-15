import { Link } from '../../src/components/Link';
import { Text } from '../../src/Text';
import { View } from 'react-native';

export default function Example() {
  return (
    <>
      <Text>
        Read our <Link variant="inline" onPress={() => undefined}>privacy policy</Link> for details, or see the{' '}
        <Link variant="inline" href="https://ism.bible" arrow="external">statement of faith</Link>.
      </Text>
      <Link href="https://ism.bible/prayer">Get prayer updates</Link>
      <Link variant="ghost" href="https://dot.bible" newTabLabel="(opens in a new tab)">Browse the directory</Link>
      <Link variant="ghost" arrow="drill" onPress={() => undefined}>See all</Link>
      <Link disabled>Unavailable</Link>
      <View style={{ backgroundColor: '#000000', padding: 16 }}>
        <Link onDark variant="ghost" href="https://ism.bible/cookies">Cookie policy</Link>
      </View>
    </>
  );
}
