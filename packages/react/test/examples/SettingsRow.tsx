import { SettingsGroup, SettingsRow } from '../../src/components/SettingsRow';
import { UiIcon } from '../../src/Icon';

export default function Example() {
  return (
    <div className="ap-screen">
      <SettingsGroup heading="Reading" footer="Downloaded Bibles work offline and stay on this phone after you sign out.">
        <SettingsRow kind="value" icon={<UiIcon name="language" size={18} />} label="Language" value="English" />
        <SettingsRow kind="toggle" icon={<UiIcon name="text-size" size={18} />} label="Verse numbers" checked onCheckedChange={() => undefined} />
        <SettingsRow kind="toggle" icon={<UiIcon name="wifi-off" size={18} />} label="Wi‑Fi only" subtitle="Needs Wi‑Fi" disabled />
      </SettingsGroup>
      <SettingsGroup heading="Default Bible" choiceGroup>
        <SettingsRow kind="radio" label="Berean Standard Bible BSB" checked />
        <SettingsRow kind="radio" label="Amharic Standard AMH" />
      </SettingsGroup>
      <SettingsGroup gap>
        <SettingsRow destructive icon={<UiIcon name="user" size={18} />} label="Sign out" />
      </SettingsGroup>
    </div>
  );
}
