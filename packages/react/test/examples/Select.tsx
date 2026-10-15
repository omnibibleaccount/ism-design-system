import { Select } from '../../src/components/Select';

const topics = [
  { value: 'general', label: 'General question' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'broadcast', label: 'Broadcast partner' },
  { value: 'orders', label: 'Publishing or NFC order' },
  { value: 'prayer', label: 'Prayer request' },
];

export default function Example() {
  return (
    <>
      <Select label="Topic" placeholder="Choose a topic" options={topics} />
      <Select label="Topic" options={topics} defaultValue="partnership" name="topic" hint="We reply within two days." />
      <Select label="Topic" placeholder="Choose a topic" options={topics} error="Please choose a topic." required />
      <Select label="Topic" options={topics} optional disabled />
    </>
  );
}
