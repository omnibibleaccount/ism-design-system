import { View } from 'react-native';
import { Input } from '../../src/components/Input';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <Input label="Email" type="email" placeholder="you@example.com" hint="We only use it for your receipt." />
      <Input label="Order #" optionalLabel="(optional)" defaultValue="A-1042" />
      <Input label="Gift amount (USD)" type="decimal" size="lg" defaultValue="50" />
      <Input label="Password" type="password" defaultValue="secret" />
      <Input label="Email" type="email" defaultValue="grace@" error="Enter a full email address." />
      <Input label="Partner code" defaultValue="ISM-2026" success="Looks good." />
      <Input label="Name" defaultValue="Maria Santos" disabled />
      <Input label="Account ID" defaultValue="48-221" readOnly />
      <Input label="Prayer request" multiline placeholder="How can we help?" />
      <Input label="Email" type="email" dark placeholder="you@example.com" loading />
    </View>
  );
}
