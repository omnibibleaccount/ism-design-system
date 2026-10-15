import { View } from 'react-native';
import { Card, ContentCard, CardMedia, CardBody, CardCta } from '../../src/components/Card';
import { Eyebrow } from '../../src/components/Eyebrow';
import { Text } from '../../src/Text';
import type { GradientComponent } from '../../src/components/Divider';

const Fake: GradientComponent = ({ colors, style }) => <View style={[{ backgroundColor: colors[1] }, style]} />;

export default function Example() {
  return (
    <>
      <Card eyebrow="Explore" title="The Old Testament" subtitle="Law, history, wisdom and prophets" cta="Explore" height={280} onPress={() => undefined} />
      <Card title="No image, no CTA" height={200} GradientComponent={Fake} />
      <ContentCard href="https://ism.bible/radio" variant="flush">
        <CardMedia ratio="16:10" />
        <CardBody>
          <Eyebrow>Broadcast</Eyebrow>
          <Text variant="web-h3">HD Radio Broadcast</Text>
          <Text variant="web-small" tone="secondary">Scripture readings on the air, wherever listeners tune in.</Text>
          <CardCta>Learn more</CardCta>
        </CardBody>
      </ContentCard>
      <ContentCard variant="tight">
        <Text variant="web-h4">Plain text card</Text>
        <Text variant="web-small" tone="secondary">One sentence of warm, plain body copy.</Text>
      </ContentCard>
      <ContentCard variant="dark" onPress={() => undefined}>
        <Text variant="web-h4" style={{ color: '#ffffff' }}>Dark text card</Text>
      </ContentCard>
      <ContentCard variant="pad"><Text variant="web-h4">Step 1</Text></ContentCard>
    </>
  );
}
