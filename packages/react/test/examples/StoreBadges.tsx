import { StoreBadges } from '../../src/components/StoreBadges';

const qr = (
  <svg width="112" height="112" viewBox="0 0 8 8" aria-hidden="true">
    <path d="M0 0h3v3H0zM5 0h3v3H5zM0 5h3v3H0zM4 4h1v1H4zM6 5h2v1H6zM5 7h1v1H5z" />
  </svg>
);

export default function Example() {
  return (
    <>
      <StoreBadges appStoreHref="https://apps.apple.com/" playStoreHref="https://play.google.com/" />
      <StoreBadges size="sm" appStoreHref="https://apps.apple.com/" playStoreHref="https://play.google.com/" />
      <div className="on-dark">
        <StoreBadges appStoreHref="https://apps.apple.com/" playStoreHref="https://play.google.com/" />
      </div>
      <StoreBadges
        appStoreHref="https://apps.apple.com/"
        playStoreHref="https://play.google.com/"
        qr={qr}
        qrPrompt="Scan to get dot.Bible on your phone"
      />
    </>
  );
}
