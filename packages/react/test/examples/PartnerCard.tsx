import { PartnerCard } from '../../src/components/PartnerCard';

export default function Example() {
  return (
    <>
      <PartnerCard href="/partners/grace-community-church" name="Grace Community Church" location="Lagos, Nigeria" badges={['Church partner']} />
      <PartnerCard href="/partners/hope" name="Hope Translation Society" location="Manila, Philippines" badges={['Translation partner', 'Radio partner']} tone="blue" external />
      <PartnerCard href="/partners/vida" name="Radio Vida" location="Lima, Peru" badges={['Radio partner']} tone="violet" initials="RV" />
    </>
  );
}
