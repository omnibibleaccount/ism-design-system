import { Accordion } from '../../src/components/Accordion';

export default function Example() {
  return (
    <>
      <Accordion
        defaultValue={['what']}
        items={[
          { id: 'what', question: 'What does ISM do?', answer: 'We make scripture accessible through apps, radio, publishing and NFC share cards.' },
          { id: 'free', question: 'Are your Bible apps free?', answer: 'Yes. Every app in the dot.Bible directory is free to download.' },
        ]}
      />
      <Accordion panel={false} items={[{ id: 'a', question: 'Another question?', answer: <p>Within 5 days.</p> }]} />
    </>
  );
}
