import { View } from 'react-native';
import { IconButton } from '../../src/components/IconButton';

export default function Example() {
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <IconButton name="search" accessibilityLabel="Search" />
        <IconButton name="share" accessibilityLabel="Share verse" size="sm" />
        <IconButton name="chevron-right" accessibilityLabel="Next chapter" mirrorInRTL size="lg" />
        <IconButton name="play" accessibilityLabel="Play ISM Radio" variant="solid" />
        <IconButton name="bookmark" accessibilityLabel="Bookmark" selected />
        <IconButton name="menu" accessibilityLabel="Open menu" expanded={false} />
        <IconButton name="close" accessibilityLabel="Close" disabled />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, backgroundColor: '#000000', padding: 8 }}>
        <IconButton name="menu" accessibilityLabel="Open menu" variant="dark" />
        <IconButton name="search" accessibilityLabel="Search" variant="dark" disabled />
      </View>
    </>
  );
}
