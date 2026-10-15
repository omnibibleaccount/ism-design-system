import { View } from 'react-native';
import { Alert, AnnouncementBar } from '../../src/components/Alert';

export default function Example() {
  return (
    <View style={{ gap: 12 }}>
      <Alert variant="info" title="Gifts are tax-deductible" link={{ label: 'Read about receipts', onPress: () => undefined }}>You'll get a receipt by email after each gift.</Alert>
      <Alert variant="success" title="Message sent">We'll reply within two business days.</Alert>
      <Alert variant="warning" title="Your card expires soon">Update it before your next monthly gift.</Alert>
      <Alert variant="error" title="We couldn't process your gift">Your card wasn't charged. Please check the details and try again.</Alert>
      <Alert variant="info" compact>This draft has not been published.</Alert>
      <AnnouncementBar message="The Global Bible Network now reaches 500+ languages." link={{ label: 'See where we broadcast', onPress: () => undefined, external: true }} onDismiss={() => undefined} />
    </View>
  );
}
