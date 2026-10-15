'use client';
import { useState } from 'react';
import { Modal } from '../../src/components/Modal';
import { Button } from '../../src/components/Button';

export default function Example() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Get the app</Button>
      <Button variant="outlineLight" onClick={() => setConfirm(true)}>Remove partner</Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Get the dot.Bible app"
        footer={
          <>
            <Button variant="outlineLight" size="sm" onClick={() => setOpen(false)}>Not now</Button>
            <Button size="sm" onClick={() => setOpen(false)}>Send link</Button>
          </>
        }
      >
        <p>Read and listen in 500+ languages, even offline.</p>
      </Modal>
      <Modal
        open={confirm}
        onOpenChange={setConfirm}
        variant="confirm"
        title="Remove this partner?"
        description="Grace Fellowship will lose access to the partner dashboard."
        footer={
          <>
            <Button variant="outlineLight" size="sm" onClick={() => setConfirm(false)}>Cancel</Button>
            <button className="btn btn-sm fb-danger" type="button" onClick={() => setConfirm(false)}>Remove partner</button>
          </>
        }
      />
    </>
  );
}
