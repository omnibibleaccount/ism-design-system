import { SegmentedControl } from '../../src/components/SegmentedControl';

const freq = [
  { value: 'once', label: 'One-time' },
  { value: 'monthly', label: 'Monthly' },
];

export default function Example() {
  return (
    <>
      <SegmentedControl aria-label="Gift frequency" options={freq} defaultValue="monthly" />
      <div className="on-dark" style={{ background: '#000', padding: 16 }}>
        <SegmentedControl dark aria-label="Gift frequency" options={freq} defaultValue="once" />
      </div>
    </>
  );
}
