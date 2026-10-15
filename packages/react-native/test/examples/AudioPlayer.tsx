import { useState } from 'react';
import { View } from 'react-native';
import { AudioMiniPlayer, AudioPlayer } from '../../src/components/AudioPlayer';

export default function Example() {
  const [pos, setPos] = useState(134);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  return (
    <View style={{ gap: 16 }}>
      <AudioPlayer
        overline="Now playing · dot.Bible Audio" title="John 3 · Amharic" subtitle="ዮሐንስ 3 · Narrated Bible" subtitleLang="am"
        playing={playing} position={pos} duration={352} speed={speed} onPlayPause={() => setPlaying((p) => !p)} onSeek={setPos} onSpeedChange={setSpeed}
        onSkipBack={() => setPos((p) => Math.max(0, p - 15))} onSkipForward={() => setPos((p) => Math.min(352, p + 15))} onPrevious={() => {}} onNext={() => {}} onOpenChapters={() => {}}
      />
      <AudioPlayer title="John 3 · Amharic" playing={false} loading position={0} duration={352} />
      <AudioMiniPlayer title="John 3 · Amharic" playing position={134} duration={352} onPlayPause={() => {}} onSkipBack={() => {}} onPress={() => {}} />
      <AudioMiniPlayer dark title="John 3 · Amharic" position={134} duration={352} onPlayPause={() => {}} onClose={() => {}} />
    </View>
  );
}
