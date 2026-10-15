import { InlineSubscribe } from '../../src/components/InlineSubscribe';

const text = {
  buttonLabel: 'Subscribe',
  emptyError: 'Please enter your email address.',
  invalidError: 'Enter a valid email, like name@example.com.',
  successMessage: "You're in. Watch for our next letter.",
};

export default function Example() {
  return (
    <>
      <InlineSubscribe {...text} note="Stories from the field, once a month. Unsubscribe anytime." />
      <InlineSubscribe {...text} defaultValue="name@" error="Enter a valid email, like name@example.com." />
      <InlineSubscribe {...text} loading defaultValue="name@example.com" />
      <div className="on-dark" style={{ background: '#000', padding: 16 }}>
        <InlineSubscribe {...text} note="Stories from the field, once a month. Unsubscribe anytime." />
      </div>
      <InlineSubscribe {...text} done />
    </>
  );
}
