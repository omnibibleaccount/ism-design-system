import { Button, Eyebrow } from '@ism/ui';

export default function Page() {
  return (
    <main className="wrap" style={{ paddingBlock: 64 }}>
      <Eyebrow>Design system</Eyebrow>
      <h1 className="h1">ISM Design System in Next.js</h1>
      <p className="lead">Server-rendered components with the shared tokens and CSS.</p>
      <p style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <Button href="https://ism.bible" icon="↗">Visit ism.bible</Button>
        <Button variant="outlineLight">Learn about ISM</Button>
      </p>
    </main>
  );
}
