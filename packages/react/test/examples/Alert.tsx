import { Alert, AnnouncementBar } from '../../src/components/Alert';

export default function Example() {
  return (
    <>
      <Alert variant="error" title="We couldn’t process your gift">
        Your card wasn’t charged. Please check the details and try again.
      </Alert>
      <Alert variant="info" title="Gifts are tax-deductible">
        You’ll get a receipt by email after each gift.
      </Alert>
      <Alert variant="success" title="Message sent">
        We’ll reply within two business days.{' '}
        <a className="fb-alert-link" href="/contact">View message</a>
      </Alert>
      <Alert variant="warning" title="Your card expires soon">Update it before your next gift.</Alert>
      <Alert variant="info" compact>This page is a draft.</Alert>
      <AnnouncementBar linkHref="/global-bible-network" linkLabel="See where we broadcast ↗" storageKey="ism-announce">
        The Global Bible Network now reaches 500+ languages.
      </AnnouncementBar>
    </>
  );
}
