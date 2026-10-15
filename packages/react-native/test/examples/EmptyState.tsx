import { View } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';

export default function Example() {
  return (
    <View style={{ gap: 16 }}>
      <EmptyState title="No saved verses yet" description="Tap the bookmark on any verse and it will wait for you here." actionLabel="Start reading" onAction={() => undefined} />
      <EmptyState variant="noResults" title="No results for “psalm 151”" description="Check the spelling, or try one of these:" suggestions={['Psalm 23', 'Psalms', 'dot.Bible app']} />
      <EmptyState variant="offline" title="You're offline" description="Check your connection and try again. Bibles you've downloaded still work." actionLabel="Try again" />
    </View>
  );
}
