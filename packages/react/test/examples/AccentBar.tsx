import { AccentBar } from '../../src/components/AccentBar';

export default function Example() {
  return (
    <>
      <div style={{ background: '#000', padding: 16 }}>
        <AccentBar progress={0.6} label="John 3 read" width="100%" />
        <AccentBar progress={0.25} width={320} />
        <AccentBar progress={0} />
      </div>
      <AccentBar light progress={1} label="Reading plan" />
    </>
  );
}
