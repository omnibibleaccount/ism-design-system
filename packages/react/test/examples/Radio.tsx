import { Radio, RadioGroup } from '../../src/components/Radio';

export default function Example() {
  return (
    <>
      <RadioGroup legend="How often would you like to give?" defaultValue="monthly">
        <Radio value="once">One-time</Radio>
        <Radio value="monthly">Monthly</Radio>
        <Radio value="annual" disabled description="(coming soon)">Annually</Radio>
      </RadioGroup>
      <RadioGroup legend="Partnership type" cards defaultValue="church">
        <Radio card value="church" description="Equip your congregation and community">Church partner</Radio>
        <Radio card value="broadcast" description="Carry scripture on your HD channel">Broadcast partner</Radio>
      </RadioGroup>
      <RadioGroup legend="How did you hear about ISM?" error="Please choose one option." required>
        <Radio value="radio">HD Radio broadcast</Radio>
        <Radio value="app">The dot.Bible app</Radio>
        <Radio value="friend">A friend or church</Radio>
      </RadioGroup>
      <RadioGroup legend="Size" horizontal>
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l">Large</Radio>
      </RadioGroup>
    </>
  );
}
