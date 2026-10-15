import { Checkbox, CheckboxGroup } from '../../src/components/Checkbox';

export default function Example() {
  return (
    <>
      <Checkbox>
        I agree to the <a href="/terms">Terms</a>
      </Checkbox>
      <Checkbox defaultChecked>Send me partner news and prayer updates (optional)</Checkbox>
      <Checkbox indeterminate>3 of 12 languages</Checkbox>
      <Checkbox disabled>Not available yet</Checkbox>
      <Checkbox error="Please accept the Terms to continue.">I agree to the Terms and Privacy Policy</Checkbox>
      <CheckboxGroup legend="How would you like to partner with ISM?" cards>
        <Checkbox card defaultChecked description="Equip your congregation and community">Church partner</Checkbox>
        <Checkbox card description="Carry scripture on your HD channel">Broadcast partner</Checkbox>
        <Checkbox card disabled description="Opens in 2027">Publishing partner</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup legend="Topics" error="Choose at least one topic.">
        <Checkbox>Prayer</Checkbox>
        <Checkbox>News</Checkbox>
      </CheckboxGroup>
    </>
  );
}
