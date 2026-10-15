import { View } from 'react-native';
import { useState } from 'react';
import { Radio, RadioGroup } from '../../src/components/Radio';

export default function Example() {
  const [freq, setFreq] = useState('monthly');
  const [partner, setPartner] = useState<string | undefined>(undefined);
  return (
    <View style={{ gap: 24 }}>
      <RadioGroup legend="How often would you like to give?" value={freq} onValueChange={setFreq}>
        <Radio value="once" label="One-time" />
        <Radio value="monthly" label="Monthly" />
        <Radio value="yearly" label="Annually" description="(coming soon)" disabled />
      </RadioGroup>
      <RadioGroup legend="How would you like to partner?" value={partner} onValueChange={setPartner} error="Please choose one option." gap={8}>
        <Radio variant="card" value="church" label="Church partner" description="Equip your congregation and community" />
        <Radio variant="card" value="media" label="Media partner" description="Carry scripture on your HD channel" />
      </RadioGroup>
    </View>
  );
}
