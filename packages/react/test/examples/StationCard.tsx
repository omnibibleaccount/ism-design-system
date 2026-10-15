import { StationCard } from '../../src/components/StationCard';

export default function Example() {
  return (
    <>
      <StationCard
        name="KISM"
        frequency="98.7 FM · HD2"
        imageSrc="/ism/assets/imagery/deck-photo-headphones.jpg"
        imageAlt="A listener wearing headphones"
        location="Nairobi, Kenya"
        languages={['Swahili', 'English']}
        nowLabel="Now:"
        now="The Gospel of John, read aloud"
        actionLabel="Listen live"
        actionHref="/radio/kism"
      />
      <StationCard
        name="Radio Vida"
        frequency="101.3 FM"
        status="offAir"
        imageSrc="/ism/assets/imagery/deck-photo-headphones.jpg"
        imageAlt="A listener wearing headphones"
        location="Lima, Peru"
        languages={['Spanish']}
        now="Back on air at 6:00 am local time"
        actionLabel="Past broadcasts"
        actionHref="/radio/vida"
      />
    </>
  );
}
