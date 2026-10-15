import { AppBanner } from '../../src/components/AppBanner';

export default function Example() {
  return (
    <>
      <AppBanner name="dot.Bible" subtitle="Read offline in 500+ languages" actionLabel="Open" href="https://dot.bible/app" />
      <AppBanner
        variant="promo"
        name="dot.Bible · free"
        heading="Take the Bible with you, even offline."
        description="Read and listen in 500+ languages. Download a book once and keep reading where there is no signal."
        qr={<svg width="72" height="72" viewBox="0 0 8 8" aria-hidden="true"><path d="M0 0h3v3H0zM5 0h3v3H5zM0 5h3v3H0z" /></svg>}
        appStoreHref="https://apps.apple.com/"
        playStoreHref="https://play.google.com/"
        imageSrc="/ism/assets/imagery/deck-photo-tap-hand.png"
        imageAlt="A hand holding a phone"
      />
      <AppBanner variant="strip" href="https://dot.bible/app" actionLabel="Get the app">
        <b>Keep reading in the dot.Bible app.</b> Free, offline, 500+ languages.
      </AppBanner>
    </>
  );
}
