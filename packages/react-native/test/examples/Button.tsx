import { Button } from '../../src/components/Button';
import { UiIcon } from '../../src/Icon';

export default function Example() {
  return (
    <>
      <Button>Give online</Button>
      <Button variant="secondary" size="sm">Learn about ISM</Button>
      <Button variant="ghost" icon={<UiIcon name="arrow-up-right" />}>Our statement of faith</Button>
      <Button loading>Sending…</Button>
      <Button disabled>Unavailable</Button>
    </>
  );
}
