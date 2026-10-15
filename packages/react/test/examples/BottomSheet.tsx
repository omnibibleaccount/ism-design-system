import { BottomSheet, BottomSheetRow } from '../../src/components/BottomSheet';
import { UiIcon } from '../../src/Icon';

export default function Example() {
  return (
    <div className="ap-screen">
      <BottomSheet
        defaultOpen
        title="Share this verse"
        subtitle="John 3:16 · Berean Standard Bible"
        shareOptions={[
          { label: 'Copy', icon: <UiIcon name="copy" size={24} /> },
          { label: 'Message', icon: <UiIcon name="mail" size={24} /> },
          { label: 'Link', icon: <UiIcon name="link" size={24} /> },
          { label: 'More', icon: <UiIcon name="more-horizontal" size={24} /> },
        ]}
      />
      <BottomSheet defaultOpen expanded title="Translation" subtitle="Pick one">
        <div className="ap-sheet-list">
          <BottomSheetRow label="Language" value="English" drill />
          <BottomSheetRow label="Copy link" icon={<UiIcon name="link" size={20} />} />
        </div>
      </BottomSheet>
      <BottomSheet
        defaultOpen
        variant="action"
        title="John 3:16"
        subtitle="Highlighted in gold"
        actions={[
          { label: 'Copy verse', icon: <UiIcon name="copy" size={20} /> },
          { label: 'Remove highlight', icon: <UiIcon name="trash" size={20} />, destructive: true },
        ]}
      />
    </div>
  );
}
