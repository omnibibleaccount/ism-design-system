import { BibleCard } from '../../src/components/BibleCard';

export default function Example() {
  return (
    <>
      <BibleCard
        nativeName="አማርኛ"
        nativeLang="am"
        url="dot.bible/amharic"
        languageName="Amharic"
        actionsLabel="Ways to get the Amharic Bible"
        read={{ href: '/amharic/read', label: 'Read' }}
        listen={{ href: '/amharic/listen', label: 'Listen' }}
        order={{ href: '/amharic/order', label: 'Order' }}
        app={{ href: '/app', label: 'Get the app' }}
        qrSrc="/qr/amharic.svg"
        qrLabel="QR code for dot.bible/amharic"
        shareTitle="Share with someone nearby"
        shareText="Point a phone camera at the code to open the Amharic Bible instantly."
        copyLabel="Copy link"
        shareLabel="Share…"
        status="Link copied: dot.bible/amharic"
        onCopyLink={() => {}}
      />
      <BibleCard
        variant="row"
        nativeName="اردو"
        nativeLang="ur"
        nativeDir="rtl"
        url="Urdu · dot.bible/urdu"
        languageName="Urdu"
        read={{ href: '/urdu/read', label: 'Read' }}
        listen={{ href: '/urdu/listen', label: 'Listen' }}
        readLabel="Read the Urdu Bible"
        listenLabel="Listen to the Urdu Bible"
        pageHref="/urdu"
        pageLabel="Open the Urdu language page"
      />
    </>
  );
}
