import { View } from 'react-native';
import { StatTile } from '../../src/components/StatTile';

export default function Example() {
  return (
    <>
      <StatTile value="500+" label="Bible languages" />
      <StatTile value={38} label="HD Radio stations" delta={{ direction: 'up', value: '+3', period: 'this quarter', spoken: 'up 3 this quarter' }} spark={[10, 12, 13, 15, 19]} sampleLabel="sample" />
      <StatTile value="1.2M" label="Listeners" delta={{ direction: 'down', value: '-2%', period: 'vs last year' }} spark={[9, 8, 8, 7, 7]} sparkFlat />
      <View style={{ backgroundColor: '#000000', padding: 16 }}>
        <StatTile dark value={12} label="Partners" delta={{ direction: 'up', value: '+1', period: 'this month' }} spark={[1, 2, 2, 3]} />
      </View>
    </>
  );
}
