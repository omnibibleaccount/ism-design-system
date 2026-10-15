'use client';
import { Toast, ToastProvider, useToast } from '../../src/components/Toast';

function Buttons() {
  const toast = useToast();
  return (
    <>
      <button type="button" onClick={() => toast.show({ message: 'Verse saved to your library.' })}>Save</button>
      <button
        type="button"
        onClick={() => toast.show({ message: 'Couldn’t send your message. Check your connection.', variant: 'error', action: { label: 'Retry', onClick: () => {} } })}
      >
        Send
      </button>
    </>
  );
}

export default function Example() {
  return (
    <ToastProvider>
      <Buttons />
      <Toast variant="success" onDismiss={() => {}}>Verse saved to your library.</Toast>
      <Toast variant="success" action={{ label: 'Undo', onClick: () => {} }}>Link copied</Toast>
      <Toast variant="error" action={{ label: 'Retry', onClick: () => {} }}>Couldn’t send your message. Check your connection.</Toast>
      <Toast variant="info" compact onDismiss={() => {}}>Amharic Bible downloading for offline use.</Toast>
    </ToastProvider>
  );
}
