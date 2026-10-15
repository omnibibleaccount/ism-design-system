import { StatTile } from '../../src/components/StatTile';

export default function Example() {
  return (
    <>
      <StatTile value="38" label="HD Radio stations" sample delta={{ direction: 'up', value: '+3', period: 'this quarter', spoken: 'up 3 this quarter' }} spark={[26, 22, 20, 16, 10]} />
      <StatTile value="12" label="New partners" delta={{ direction: 'down', value: '-2', period: 'vs last year' }} spark={[10, 12, 11, 9, 8]} sparkFlat />
      <StatTile value="500+" label="Bible languages" />
      <StatTile dark value="1.2M" label="Listeners" delta={{ direction: 'up', value: '+8%', period: 'this year' }} />
    </>
  );
}
