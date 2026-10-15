import { VideoPlayer } from '../../src/components/VideoPlayer';

export default function Example() {
  return (
    <>
      <VideoPlayer
        posterSrc="/ism/assets/imagery/print-photo-friends.jpg"
        title="Reading John together, across three countries"
        summary="Friends in Kenya, Peru and the Philippines meet on a video call to read John 3 in their own languages."
        duration={252}
        durationLabel="4 minutes 12 seconds"
        captionsChip="12 languages"
      />
      <VideoPlayer
        posterSrc="/ism/assets/imagery/print-photo-friends.jpg"
        title="Reading John together, across three countries"
        duration={252}
        defaultState="playing"
        currentTime={84}
        buffered={130}
        caption="For God so loved the world…"
      />
      <VideoPlayer title="Paused, muted, captions off" duration={252} defaultState="paused" currentTime={10} muted captionsOn={false} />
    </>
  );
}
