import { View } from 'react-native';
import { UiIcon, MinistryIcon, IconTile } from '../../src/components/Iconography';

export default function Example() {
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <UiIcon name="search" size={16} />
        <UiIcon name="menu" size={20} />
        <UiIcon name="chevron-right" size={24} mirrorInRTL />
        <UiIcon name="arrow-up-right" size={20} accessibilityLabel="Opens another page" />
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <MinistryIcon name="translate" size={24} />
        <MinistryIcon name="radio" size={32} />
        <MinistryIcon name="bible" size={48} accessibilityLabel="Bible" />
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <IconTile name="globe" />
        <IconTile name="heart" tone="gold" />
        <IconTile set="ministry" name="church" size={56} accessibilityLabel="Church" />
      </View>
    </>
  );
}
