import { View } from 'react-native';
import { Avatar, AvatarStack } from '../../src/components/Avatar';

export default function Example() {
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Avatar name="Maria Santos" size={24} />
        <Avatar name="Dawit Alemu" size={32} presence="away" presenceLabel="away" />
        <Avatar name="Musa Okoro" size={40} />
        <Avatar name="Joy Kim" size={56} color="gold" presence="online" presenceLabel="online" />
        <Avatar name="Hana Bekele" size={80} color="peach" />
        <Avatar size={56} />
        <Avatar name="Sam Lee" size={40} presence="offline" presenceLabel="offline" decorative />
      </View>
      <AvatarStack accessibilityLabel="Maria, Dawit, Musa, Joy and 5 more partners" more={5}>
        <Avatar name="Maria Santos" decorative />
        <Avatar name="Dawit Alemu" decorative />
        <Avatar name="Musa Okoro" decorative />
        <Avatar name="Joy Kim" decorative color="gold" />
      </AvatarStack>
    </>
  );
}
