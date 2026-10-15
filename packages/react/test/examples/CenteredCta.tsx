import { CenteredCta, CtaBanner } from '../../src/components/CenteredCta';
import { Button } from '../../src/components/Button';

export default function Example() {
  return (
    <>
      <CenteredCta
        eyebrow="Become a partner"
        title={<>Own a station? Help us reach your <span className="em">city</span>.</>}
        actions={
          <>
            <Button href="/partner">Become a partner</Button>
            <Button variant="outlineLight" href="/contact">Talk to our team</Button>
          </>
        }
      />
      <CtaBanner title="Still have a question?" text="Our team replies personally." action={<Button href="/contact">Contact us</Button>} />
    </>
  );
}
