import {
  ConnectionBanner,
  DownloadRow,
  DownloadState,
  NotDownloadedWarning,
  StorageRow,
} from '../../src/components/DownloadState';

export default function Example() {
  return (
    <>
      <div className="ap-grp">
        <DownloadRow name="Amharic" nativeName="አማርኛ" nativeLang="am" subtitle="312 MB · Bible + audio" />
        <DownloadRow name="Kiswahili" status="downloading" progress={0.62} subtitle="193 of 312 MB" />
        <DownloadRow name="Hausa" status="paused" progress={0.3} subtitle="94 of 312 MB · Paused" />
        <DownloadRow name="Español" status="downloaded" subtitle="Bible + audio · Downloaded" />
        <DownloadRow name="Français" status="error" subtitle="Download failed · Tap to retry" />
        <DownloadRow name="Português" subtitle="Needs a connection" disabled />
      </div>
      <DownloadState small itemName="Amharic" />
      <StorageRow
        title="Storage"
        used="1.4 GB used (sample)"
        segments={[
          { kind: 'bibles', label: 'Bibles 740 MB', percent: 46 },
          { kind: 'audio', label: 'Audio 480 MB', percent: 30 },
          { kind: 'other', label: 'Other 140 MB', percent: 9 },
        ]}
      />
      <ConnectionBanner title="You’re offline" message="Downloaded Bibles still work" />
      <ConnectionBanner kind="online" title="Back online" />
      <NotDownloadedWarning title="This Bible isn’t downloaded" message="Download Español · NBLA to read it without a connection." />
    </>
  );
}
