import { View } from 'react-native';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '../../src/components/Checkbox';

export default function Example() {
  const [agree, setAgree] = useState(false);
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <Checkbox label="I agree to the Terms and Privacy Policy" checked={agree} onValueChange={setAgree} />
      <Checkbox label="Select all (3 of 12)" indeterminate />
      <Checkbox label="Send me partner news (optional)" disabled />
      <Checkbox label="Checked and disabled" checked disabled />
      <CheckboxGroup legend="How would you like to partner with ISM?" error="Please choose at least one option.">
        <Checkbox variant="card" label="Church partner" description="Equip your congregation and community" checked={a} onValueChange={setA} />
        <Checkbox variant="card" label="Broadcast partner" description="Carry scripture on your HD channel" checked={b} onValueChange={setB} invalid />
        <Checkbox variant="card" label="Media partner" description="Coming soon" disabled />
      </CheckboxGroup>
    </View>
  );
}
