import { View } from 'react-native';
import { PullQuote, Testimonial, ScriptureQuote } from '../../src/components/Quote';

export default function Example() {
  return (
    <>
      <PullQuote author="Dawit Alemu" byline="Radio Hope listener, Addis Ababa">
        When my grandmother heard the Gospel of John in Amharic on the radio, she wept.
      </PullQuote>
      <Testimonial name="Maria Santos" byline="Partner pastor · Lima, Peru">
        “Our church hands out the NFC Bible cards after every service.”
      </Testimonial>
      <ScriptureQuote reference="John 3:16" translation="BSB" verses={[{ number: 16, text: 'For God so loved the world that He gave His one and only Son.' }, { number: 17, text: 'For God did not send His Son into the world to condemn the world.' }]} />
      <View style={{ backgroundColor: '#000000', padding: 16 }}>
        <ScriptureQuote dark reference="Psalm 23:1" translation="BSB">The LORD is my shepherd; I shall not want.</ScriptureQuote>
      </View>
      <ScriptureQuote quoteLang="ar" reference="يوحنا 3:16">هكذا أحب الله العالم</ScriptureQuote>
    </>
  );
}
