import { View } from 'react-native';
import { useState } from 'react';
import { SegmentedControl } from '../../src/components/SegmentedControl';

export default function Example() {
  const [f, setF] = useState('monthly');
  const [m, setM] = useState('listen');
  return (
    <View style={{ gap: 16 }}>
      <SegmentedControl accessibilityLabel="Gift frequency" value={f} onValueChange={setF} options={[{ value: 'once', label: 'One-time' }, { value: 'monthly', label: 'Monthly' }]} />
      <View style={{ backgroundColor: '#000000', padding: 16 }}>
        <SegmentedControl dark accessibilityLabel="Mode" value={m} onValueChange={setM} options={[{ value: 'listen', label: 'Listen' }, { value: 'read', label: 'Read' }, { value: 'watch', label: 'Watch' }]} />
      </View>
    </View>
  );
}
