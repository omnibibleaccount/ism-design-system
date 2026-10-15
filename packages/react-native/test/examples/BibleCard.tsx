import { View } from 'react-native';
import { BibleCard, BibleCardRow } from '../../src/components/BibleCard';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <BibleCard
        nativeName="አማርኛ" nativeLang="am" url="dot.bible/amharic" actionsLabel="Ways to get the Amharic Bible"
        onRead={() => {}} onListen={() => {}} onOrder={() => {}} onGetApp={() => {}}
        qr={<View style={{ flex: 1, backgroundColor: '#000000' }} />} qrLabel="QR code for dot.bible/amharic"
        shareTitle="Share with someone nearby" shareCopy="Point a phone camera at the code to open the Amharic Bible instantly."
        onCopyLink={() => {}} onShare={() => {}} status="Link copied: dot.bible/amharic"
      />
      <BibleCardRow nativeName="አማርኛ" nativeLang="am" subtitle="Amharic · dot.bible/amharic" readLabel="Read the Amharic Bible" listenLabel="Listen to the Amharic Bible" openLabel="Open the Amharic language page" onRead={() => {}} onListen={() => {}} onOpen={() => {}} />
      <BibleCardRow nativeName="اردو" nativeLang="ur" subtitle="Urdu · dot.bible/urdu" readLabel="Read the Urdu Bible" onRead={() => {}} onOpen={() => {}} openLabel="Open the Urdu language page" />
    </View>
  );
}
