import { View } from 'react-native';
import { Toast, ToastProvider, useToast } from '../../src/components/Toast';
import { Button } from '../../src/components/Button';

function Trigger() {
  const toast = useToast();
  return (
    <View style={{ gap: 8 }}>
      <Button variant="secondary" onPress={() => toast.show({ message: 'Link copied', actionLabel: 'Undo' })}>Copy link</Button>
      <Button variant="secondary" onPress={() => toast.show({ message: "Couldn't send your message. Check your connection.", variant: 'error', actionLabel: 'Retry' })}>Send</Button>
    </View>
  );
}

export default function Example() {
  return (
    <ToastProvider>
      <View style={{ gap: 12, minHeight: 360 }}>
        <Trigger />
        <Toast message="Verse saved to your library." onDismiss={() => undefined} />
        <Toast message="Link copied" variant="info" actionLabel="Undo" />
        <Toast message="Couldn't send your message. Check your connection." variant="error" actionLabel="Retry" />
        <Toast message="Amharic Bible downloading for offline use." compact onDismiss={() => undefined} />
      </View>
    </ToastProvider>
  );
}
