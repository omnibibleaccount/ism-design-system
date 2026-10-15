import { Input, Textarea } from '../../src/components/Input';

export default function Example() {
  return (
    <>
      <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" />
      <Input label="Email" type="email" placeholder="you@example.com" error="Enter a full email address." defaultValue="maria@" />
      <Input label="Order #" optional hint="For questions about an ISM Publishing or NFC card order." />
      <Input label="Partner code" success="Looks good." defaultValue="ISM-204" />
      <Input label="Account" readOnly defaultValue="maria@example.com" />
      <Input label="Name" disabled defaultValue="Maria Santos" />
      <Input label="Gift amount (USD)" size="lg" prefix="$" inputMode="decimal" defaultValue="50" />
      <Input label="Email" placeholder="you@example.com" dark />
      <Textarea label="Prayer request" placeholder="How can we help?" rows={5} />
    </>
  );
}
