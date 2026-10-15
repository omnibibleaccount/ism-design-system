import { PageIntro, SectionHeadingRow } from '../../src/components/PageIntro';
import { Button } from '../../src/components/Button';

export default function Example() {
  return (
    <>
      <PageIntro
        eyebrow="HD Radio Broadcast"
        title={<>Scripture on the <span className="em">airwaves</span>.</>}
        lead="Clear, continuous scripture readings on HD Radio."
        actions={<Button href="/listen">Find a station</Button>}
      />
      <SectionHeadingRow
        eyebrow="What we do"
        title={<>Four ways scripture <span className="em">travels</span>.</>}
        linkHref="/programs"
        linkLabel="See all"
        linkHiddenSuffix="programmes"
        linkExternalPage
      />
    </>
  );
}
