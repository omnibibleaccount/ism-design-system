import { View } from 'react-native';
import { ProgressBar, ProgressRing, StepProgress } from '../../src/components/Progress';

export default function Example() {
  return (
    <View style={{ gap: 20 }}>
      <ProgressBar value={42} accessibilityLabel="Reading plan" />
      <ProgressBar value={68} label="Downloading Amharic audio Bible" hint="412 MB of 600 MB · about 2 minutes left" />
      <ProgressBar indeterminate accessibilityLabel="Loading" />
      <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
        <ProgressRing value={50} label="Uploading photo" />
        <ProgressRing value={50} size="inline" label="Reading plan · day 15 of 30" />
      </View>
      <StepProgress step={1} steps={2} label="Step 1 of 2" />
    </View>
  );
}
