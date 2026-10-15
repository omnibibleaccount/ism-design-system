import { PullQuote, Testimonial, ScriptureQuote } from '../../src/components/Quote';

export default function Example() {
  return (
    <>
      <PullQuote author="Dawit Alemu" byline="Radio Hope listener, Addis Ababa">
        When my grandmother heard the Gospel of John in Amharic on the radio, she wept.
      </PullQuote>
      <Testimonial name="Maria Santos" byline="Partner pastor · Lima, Peru" avatarSrc="/maria.jpg">
        “Our church hands out the NFC Bible cards after every service.”
      </Testimonial>
      <ScriptureQuote reference="John 3:16" translation="BSB" verses={[{ number: 16, text: 'For God so loved the world…' }]} />
      <ScriptureQuote dark reference="Psalm 23:1" translation="BSB">The LORD is my shepherd; I shall not want.</ScriptureQuote>
    </>
  );
}
