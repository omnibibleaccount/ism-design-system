import { CookieBanner } from '../../src/components/CookieBanner';

export default function Example() {
  return (
    <CookieBanner
      static
      open
      onAccept={() => {}}
      onDecline={() => {}}
      title="A note on cookies"
      learnMoreHref="/cookies"
      learnMoreLabel="Learn more"
      acceptLabel="Accept All"
      declineLabel="Reject Non-Essential"
    >
      We use cookies to enhance your experience and analyze traffic. By clicking ‘Accept All’, you consent to our use of cookies.
    </CookieBanner>
  );
}
