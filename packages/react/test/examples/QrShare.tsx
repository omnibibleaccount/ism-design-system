import { QrShare } from '../../src/components/QrShare';

export default function Example() {
  return (
    <>
      <QrShare
        qrSrc="/qr/burmese.svg"
        qrLabel="QR code for dot.bible/burmese"
        title="Share with someone nearby"
        text="Point a phone camera at the code to open the Burmese Bible on dot.bible."
        copyLabel="Copy link"
        shareLabel="Share…"
        onCopy={() => {}}
        onShare={() => {}}
      />
      <QrShare
        variant="dark"
        qrLabel="QR code for dot.bible/urdu"
        title="Share with someone nearby"
        copyLabel="Copy link"
        copiedLabel="Copied"
        copied
        shareLabel="Share…"
        status="Link copied: dot.bible/urdu"
      >
        <svg viewBox="-1 -1 27 27" aria-hidden="true"><rect width="25" height="25" fill="#000" /></svg>
      </QrShare>
    </>
  );
}
