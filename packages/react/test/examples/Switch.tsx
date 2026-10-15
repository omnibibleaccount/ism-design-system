import { Switch, SwitchGroup } from '../../src/components/Switch';

export default function Example() {
  return (
    <>
      <SwitchGroup>
        <Switch label="Verse of the day" description="Get one verse each morning at 7:00" defaultChecked />
        <Switch label="Download on Wi-Fi only" description="Save mobile data when adding languages" />
        <Switch label="Play audio automatically" description="Turn on notifications first" disabled />
      </SwitchGroup>
      <Switch label="Reminders" />
    </>
  );
}
