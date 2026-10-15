import { Hero } from '../../src/components/Hero';
import { Button } from '../../src/components/Button';

export default function Example() {
  return (
    <>
      <Hero
        eyebrow="International Scripture Ministries"
        title={<>God’s Word, within reach of <span className="em">every</span> language on earth.</>}
        lead="We make scripture accessible to anyone, anywhere."
        actions={
          <>
            <Button size="lg" href="/join" icon="↗">Join the Mission</Button>
            <Button variant="outlineDark" size="lg" href="#programs">Explore our programs</Button>
          </>
        }
        languages={[
          { href: '/es', label: 'Español', lang: 'es' },
          { href: '/sw', label: 'Kiswahili', lang: 'sw', tone: 'gold' },
          { href: '/ko', label: '한국어', lang: 'ko', tone: 'violet' },
        ]}
      />
      <Hero inset title="Inset hero" />
    </>
  );
}
