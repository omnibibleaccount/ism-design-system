import { CtaBand } from '../../src/components/CtaBand';
import { Button } from '../../src/components/Button';

export default function Example() {
  return (
    <CtaBand
      eyebrow="Join the Mission"
      title={<>Put scripture in someone’s hands <span className="em">today</span>.</>}
      actions={
        <>
          <Button variant="solidWhite" size="lg" href="/give">Give online</Button>
          <Button variant="outlineDark" size="lg" href="/partner">Become a partner</Button>
        </>
      }
      columns={[
        { title: 'Pray with us', text: 'Join a community praying for translators and listeners.' },
        { title: 'Give with purpose', text: 'Fund apps, airtime and printed Bibles.' },
        { title: 'Share the Word', text: 'Hand out NFC cards and recommend the app.' },
      ]}
    />
  );
}
