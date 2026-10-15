import { NewsletterCard } from '../../src/components/NewsletterCard';

export default function Example() {
  return (
    <>
      <NewsletterCard />
      <NewsletterCard invalid />
      <NewsletterCard submitting />
      <NewsletterCard success />
    </>
  );
}
