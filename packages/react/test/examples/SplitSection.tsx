import { SplitSection } from '../../src/components/SplitSection';
import { Button } from '../../src/components/Button';

export default function Example() {
  const actions = (
    <>
      <Button variant="outlineLight" href="/about">Learn about ISM</Button>
      <Button variant="ghost" href="/statement-of-faith" icon="↗">Our statement of faith</Button>
    </>
  );
  return (
    <>
      <SplitSection
        imageSrc="/ism/assets/imagery/print-photo-friends.jpg"
        imageAlt="Two friends reading their Bibles together"
        eyebrow="About ISM"
        title={<>A ministry built on one <span className="em">simple</span> conviction.</>}
        lead="Everyone deserves to read, hear and understand the Bible in their own language."
        actions={actions}
      />
      <SplitSection reverse imageSrc="/ism/assets/imagery/print-photo-friends.jpg" imageAlt="" title="Reversed" />
    </>
  );
}
