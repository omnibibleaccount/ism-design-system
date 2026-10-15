import { View } from 'react-native';
import { ActionSheet, BottomSheet, BottomSheetListRow, BottomSheetShareRow } from '../../src/components/BottomSheet';
import { Text } from '../../src/Text';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ height: 360, backgroundColor: '#f7f7f5', overflow: 'hidden' }}>
        <Text>Reader behind the sheet</Text>
        <BottomSheet visible onClose={() => {}} title="Share this verse" subtitle="John 3:16 · Berean Standard Bible" safeAreaInsets={{ bottom: 20 }}>
          <BottomSheetShareRow options={[{ icon: 'copy', label: 'Copy' }, { icon: 'share', label: 'Share' }, { icon: 'link', label: 'Copy link' }, { icon: 'mail', label: 'Email' }]} />
        </BottomSheet>
      </View>
      <View style={{ height: 420, backgroundColor: '#f7f7f5', overflow: 'hidden' }}>
        <BottomSheet visible expanded onClose={() => {}} title="Translation">
          <BottomSheetListRow icon="book-open" label="Berean Standard Bible" value="BSB" drillIn divider={false} />
          <BottomSheetListRow icon="language" label="Language" value="English" drillIn />
          <BottomSheetListRow icon="copy" label="Copy verse" />
        </BottomSheet>
      </View>
      <View style={{ height: 320, backgroundColor: '#f7f7f5', overflow: 'hidden' }}>
        <ActionSheet
          visible onClose={() => {}} title="John 3:16" subtitle="Highlighted in gold"
          actions={[{ label: 'Copy verse', icon: 'copy', onPress: () => {} }, { label: 'Add a note', icon: 'edit', onPress: () => {} }, { label: 'Remove highlight', icon: 'trash', onPress: () => {}, destructive: true }]}
        />
      </View>
    </View>
  );
}
