import { View } from 'react-native';
import { AccentBar } from '../../src/components/AccentBar';
import type { GradientComponent } from '../../src/components/Divider';

const Fake: GradientComponent = ({ colors, style, children }) => <View style={[{ backgroundColor: colors[0] }, style]}>{children}</View>;

export default function Example() {
  return (
    <>
      <View style={{ backgroundColor: '#000000', padding: 16, gap: 12 }}>
        <AccentBar progress={0.6} label="John 3 read" />
        <AccentBar progress={0} width="100%" />
        <AccentBar progress={1} width="100%" GradientComponent={Fake} />
      </View>
      <AccentBar light progress={0.25} width={320} label="Reading plan" />
    </>
  );
}
