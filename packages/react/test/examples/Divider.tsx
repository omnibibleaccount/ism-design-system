import { Divider, Rule, OrDivider, VerticalRule, Thread } from '../../src/components/Divider';

export default function Example() {
  return (
    <>
      <Divider />
      <Divider orientation="vertical" length={200} />
      <Rule />
      <Rule tone="strong" />
      <Rule tone="dark" />
      <OrDivider />
      <p style={{ display: 'flex', alignItems: 'center', gap: 16 }}>98.7 FM <VerticalRule /> Amharic <VerticalRule /> Addis Ababa</p>
      <Thread />
    </>
  );
}
