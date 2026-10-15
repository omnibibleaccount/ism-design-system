import { View } from 'react-native';
import { DownloadButton, DownloadWarning, OfflineBanner, StorageRow } from '../../src/components/DownloadState';
import { Text } from '../../src/Text';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <DownloadButton itemName="Amharic" />
        <DownloadButton itemName="Amharic" status="downloading" progress={0.62} />
        <DownloadButton itemName="Amharic" status="downloaded" />
        <DownloadButton itemName="Amharic" status="error" />
        <DownloadButton itemName="Amharic" small />
        <DownloadButton itemName="Amharic" disabled />
      </View>
      <Text variant="web-small" tone="secondary">193 of 312 MB (sample)</Text>
      <StorageRow
        usedLabel="1.2 GB used" detailLabel="of 12 GB (sample)" total={12000}
        segments={[{ kind: 'bibles', label: 'Bibles', value: 420, valueLabel: '420 MB' }, { kind: 'audio', label: 'Audio', value: 700, valueLabel: '700 MB' }, { kind: 'other', label: 'Other', value: 80, valueLabel: '80 MB' }]}
      />
      <OfflineBanner title={'You’re offline'} message="Downloaded Bibles still work" />
      <OfflineBanner variant="online" title="Back online" autoHideMs={0} />
      <DownloadWarning title={'This Bible isn’t downloaded'} message={'Download Español · NBLA to read it without a connection.'} />
    </View>
  );
}
