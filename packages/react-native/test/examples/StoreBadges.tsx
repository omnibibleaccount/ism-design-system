import { View } from 'react-native';
import { StoreBadge, StoreBadges } from '../../src/components/StoreBadges';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <StoreBadges appStoreUrl="https://apps.apple.com/" playStoreUrl="https://play.google.com/" />
      <StoreBadges size="sm" appStoreUrl="https://apps.apple.com/" playStoreUrl="https://play.google.com/" />
      <View style={{ backgroundColor: '#000000', padding: 16 }}>
        <StoreBadges onDark onPressAppStore={() => {}} onPressGooglePlay={() => {}} />
      </View>
      <StoreBadges
        appStoreUrl="https://apps.apple.com/" playStoreUrl="https://play.google.com/" qr={<View style={{ flex: 1, backgroundColor: '#000000' }} />}
        qrPrompt="Scan to get dot.Bible on your phone"
      />
      <StoreBadge store="googlePlay" size="sm" labels={{ googlePlayLine1: 'Disponible en', googlePlayLine2: 'Google Play', googlePlayAccessibilityLabel: 'Obtener dot.Bible en Google Play' }} />
    </View>
  );
}
