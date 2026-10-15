import { DonationWidget } from '../../src/components/DonationWidget';

export default function Example() {
  return (
    <>
      <DonationWidget onSubmit={() => undefined} />
      <DonationWidget defaultFrequency="once" defaultAmount="other" />
      <DonationWidget submitting />
      <DonationWidget variant="compact" />
      <DonationWidget
        variant="goal"
        goal={{
          title: 'Year-end Bible drive',
          meta: '18 days left',
          raised: 18400,
          target: 25000,
          summary: <><b>$18,400</b> of $25,000 raised · 74%</>,
        }}
      />
      <DonationWidget
        variant="goal"
        dark
        goal={{
          title: 'Year-end Bible drive',
          meta: '18 days left',
          raised: 18400,
          target: 25000,
          summary: <><b>$18,400</b> of $25,000 raised · 74%</>,
          cta: { label: 'Give now', href: '/give' },
        }}
      />
    </>
  );
}
