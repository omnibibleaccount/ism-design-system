import { View } from 'react-native';
import { Fab, PullToRefresh, Snackbar } from '../../src/components/Fab';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <View style={{ height: 260, backgroundColor: '#f7f7f5', overflow: 'hidden' }}>
        <PullToRefresh text={'Checking for new episodes…'} />
        <Snackbar visible message="Note deleted" actionLabel="Undo" bottomOffset={58} />
        <Fab label="New note" lifted bottomOffset={58} onPress={() => {}} />
      </View>
      <View style={{ height: 120, backgroundColor: '#f7f7f5', overflow: 'hidden' }}>
        <Fab label="New highlight" bottomOffset={20} />
      </View>
      <Fab label="New note" placement="static" disabled />
    </View>
  );
}
