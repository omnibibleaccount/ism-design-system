import { View } from 'react-native';
import { Spinner, Skeleton, SkeletonGroup, SkeletonList, SkeletonCard, SkeletonText } from '../../src/components/Loader';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'flex-end' }}>
        <Spinner size="s" label="Loading menu" />
        <Spinner size="m" />
        <Spinner size="l" label="Loading stations" />
        <View style={{ backgroundColor: '#161819', padding: 8 }}><Spinner tone="onDark" /></View>
        <Spinner tone="ink" decorative />
      </View>
      <Skeleton width={200} />
      <SkeletonGroup label="Loading stations" delay={0}>
        <SkeletonList rows={2} />
      </SkeletonGroup>
      <SkeletonCard />
      <SkeletonText lines={3} />
    </View>
  );
}
