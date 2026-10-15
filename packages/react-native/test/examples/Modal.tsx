import { View } from 'react-native';
import { useState } from 'react';
import { Modal, ConfirmDialog } from '../../src/components/Modal';
import { Button } from '../../src/components/Button';

export default function Example() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Button onPress={() => setOpen(true)}>Get the app</Button>
      <Button variant="secondary" onPress={() => setConfirm(true)}>Remove partner</Button>
      <Modal
        visible={open} onClose={() => setOpen(false)} title="Get the dot.Bible app"
        footer={<><Button variant="secondary" size="sm" onPress={() => setOpen(false)}>Not now</Button><Button size="sm" onPress={() => setOpen(false)}>Send link</Button></>}
      >
        Read and listen in 500+ languages, even offline.
      </Modal>
      <ConfirmDialog
        visible={confirm} onCancel={() => setConfirm(false)} onConfirm={() => setConfirm(false)} destructive
        title="Remove this partner?" description="Grace Fellowship will lose access to the partner dashboard." confirmLabel="Remove partner"
      />
    </View>
  );
}
