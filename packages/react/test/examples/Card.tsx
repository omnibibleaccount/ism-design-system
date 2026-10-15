import { Card, ContentCard, CardMedia, CardBody, CardCta } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';

export default function Example() {
  return (
    <>
      <Card image="/assets/imagery/old-testament.jpg" eyebrow="Explore" title="The Old Testament" subtitle="39 books" />
      <Card title="No photo" cta="" height={200} />
      <Card title="Clickable" onClick={() => {}} />
      <ContentCard variant="flush" href="/radio">
        <CardMedia ratio="1610" src="/x.jpg" alt="A radio tower at dusk" />
        <CardBody>
          <Eyebrow>Broadcast</Eyebrow>
          <h3 className="h3">HD Radio Broadcast</h3>
          <p className="small muted">Scripture readings on the air, wherever listeners tune in.</p>
          <CardCta>Learn more</CardCta>
        </CardBody>
      </ContentCard>
      <ContentCard variant="tight"><h3 className="h4">Text card</h3></ContentCard>
      <ContentCard variant="dark"><h3 className="h4">Dark card</h3></ContentCard>
      <ContentCard variant="pad"><span className="cr-step-num">1</span></ContentCard>
      <ContentCard variant="roomy"><h3 className="h4">Value</h3></ContentCard>
      <ContentCard variant="flat"><CardMedia /></ContentCard>
    </>
  );
}
