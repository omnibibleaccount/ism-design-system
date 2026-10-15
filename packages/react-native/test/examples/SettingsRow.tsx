import { useState } from 'react';
import { View } from 'react-native';
import { SettingsGroup, SettingsRow } from '../../src/components/SettingsRow';

export default function Example() {
  const [numbers, setNumbers] = useState(true);
  const [wifi, setWifi] = useState(false);
  const [bible, setBible] = useState('bsb');
  return (
    <View style={{ gap: 8 }}>
      <SettingsGroup header="Reading" footer="Downloaded Bibles work offline and stay on this phone after you sign out.">
        <SettingsRow type="value" icon="language" label="Language" value="English" onPress={() => {}} />
        <SettingsRow type="toggle" icon="eye" label="Verse numbers" checked={numbers} onCheckedChange={setNumbers} />
        <SettingsRow type="toggle" icon="wifi-off" label="Wi-Fi only" sublabel="Download Bibles on Wi-Fi" checked={wifi} onCheckedChange={setWifi} />
        <SettingsRow type="toggle" icon="download" label="Auto download" checked={false} disabled disabledReason="Needs Wi-Fi" />
      </SettingsGroup>
      <SettingsGroup header="Default Bible" radioGroup>
        <SettingsRow type="radio" label="Berean Standard Bible BSB" checked={bible === 'bsb'} onCheckedChange={() => setBible('bsb')} />
        <SettingsRow type="radio" label="King James Version KJV" checked={bible === 'kjv'} onCheckedChange={() => setBible('kjv')} />
      </SettingsGroup>
      <SettingsGroup separated>
        <SettingsRow danger label="Sign out" onPress={() => {}} />
      </SettingsGroup>
    </View>
  );
}
