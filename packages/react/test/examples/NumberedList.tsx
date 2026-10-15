import { NumberedList } from '../../src/components/NumberedList';

export default function Example() {
  return (
    <>
      <NumberedList
        items={[
          { title: 'Digital — the dot.Bible app directory', description: 'Free Bible apps, searchable by language.' },
          { title: 'Audio — HD radio broadcasts', description: 'Scripture readings on the airwaves.' },
        ]}
      />
      <NumberedList
        variant="steps"
        headingLevel={3}
        items={[
          { title: 'Unlock the phone', description: 'NFC reading is on by default on most phones.' },
          { title: 'Tap the card', description: 'Hold it against the back of the phone.' },
        ]}
      />
    </>
  );
}
