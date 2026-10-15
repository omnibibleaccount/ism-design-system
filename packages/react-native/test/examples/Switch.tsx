import { View } from 'react-native';
import { useState } from 'react';
import { Switch, SwitchGroup } from '../../src/components/Switch';

export default function Example() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <View style={{ gap: 16 }}>
      <SwitchGroup>
        <Switch label="Verse of the day" description="Get one verse each morning at 7:00" value={a} onValueChange={setA} />
        <Switch label="Download on Wi-Fi only" description="Save mobile data when adding languages" value={b} onValueChange={setB} />
        <Switch label="Play audio automatically" description="Turn on notifications first" value={false} disabled />
      </SwitchGroup>
      <Switch bare value accessibilityLabel="Dark mode" />
    </View>
  );
}
