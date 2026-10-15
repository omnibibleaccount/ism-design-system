import { Button } from '../../src/components/Button';

export default function Example() {
  return (
    <>
      <Button>Give online</Button>
      <Button variant="outlineLight" size="sm">Learn about ISM</Button>
      <Button variant="ghost" href="/faith" icon="↗">Our statement of faith</Button>
      <Button loading>Sending…</Button>
      <Button disabled>Unavailable</Button>
    </>
  );
}
