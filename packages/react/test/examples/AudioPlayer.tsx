import { AudioPlayer } from '../../src/components/AudioPlayer';

export default function Example() {
  const common = { title: 'John 3 · Amharic', coverSrc: '/ism/assets/imagery/deck-photo-headphones.jpg', position: 134, duration: 352 };
  return (
    <>
      <AudioPlayer
        {...common}
        playing
        speed={1}
        nowPlaying="Now playing · dot.Bible Audio"
        subtitle={<><span lang="am">ዮሐንስ 3</span> · Narrated Bible</>}
        onPlayPause={() => {}}
        onSeek={() => {}}
        onSpeedChange={() => {}}
        onPrevious={() => {}}
        onNext={() => {}}
        onChapterList={() => {}}
      />
      <AudioPlayer {...common} loading />
      <AudioPlayer variant="mini" {...common} playing onPlayPause={() => {}} onSeek={() => {}} />
      <AudioPlayer variant="miniDark" {...common} pausedLabel="Paused" onClose={() => {}} />
    </>
  );
}
