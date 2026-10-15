import { View } from 'react-native';
import { Badge, StatusBadge, Tag, CountBadge } from '../../src/components/Badge';

export default function Example() {
  return (
    <>
      <View style={{ gap: 8 }}>
        <Badge tone="outlineLight">Trending</Badge>
        <Badge tone="solidBlue">500+ languages</Badge>
        <Badge tone="accentText">You're almost done!</Badge>
        <View style={{ backgroundColor: '#000000', padding: 8 }}><Badge>Get a sneak peek</Badge></View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <StatusBadge>Draft</StatusBadge>
        <StatusBadge tone="info" dot>New</StatusBadge>
        <StatusBadge tone="success" live>Live</StatusBadge>
        <StatusBadge tone="warning" size="sm">Pending</StatusBadge>
        <StatusBadge tone="error" solid>Failed</StatusBadge>
        <StatusBadge tone="gold" size="md">Partner</StatusBadge>
        <StatusBadge tone="partner" solid>Partner</StatusBadge>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Tag onRemove={() => undefined}>Amharic</Tag>
        <Tag active onRemove={() => undefined}>HD Radio</Tag>
        <Tag disabled>dot.Bible app</Tag>
        <CountBadge hiddenLabel="unread">3</CountBadge>
      </View>
    </>
  );
}
