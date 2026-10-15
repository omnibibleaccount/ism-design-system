import { useState } from 'react';
import { Chip, ChipGroup } from '../../src/components/Chip';

export default function Example() {
  const [on, setOn] = useState('All');
  return (
    <>
      <ChipGroup accessibilityLabel="Filter resources">
        {['All', 'About ISM', 'Apps', 'Giving'].map((t) => (
          <Chip key={t} selected={on === t} onPress={() => setOn(t)}>{t}</Chip>
        ))}
      </ChipGroup>
      <ChipGroup accessibilityLabel="Amount">
        <Chip>$25</Chip>
        <Chip selected>$50</Chip>
        <Chip disabled>$100</Chip>
      </ChipGroup>
    </>
  );
}
