import { View } from 'react-native';
import { Divider, Rule, OrDivider, VerticalRule, Thread, type GradientComponent } from '../../src/components/Divider';
import { Text } from '../../src/Text';

const Fake: GradientComponent = ({ colors, style, children }) => <View style={[{ backgroundColor: colors[0] }, style]}>{children}</View>;

export default function Example() {
  return (
    <>
      <Rule />
      <Rule tone="strong" />
      <View style={{ backgroundColor: '#000000', padding: 8 }}><Rule tone="dark" /></View>
      <OrDivider />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Text>98.7 FM</Text><VerticalRule /><Text>Amharic</Text><VerticalRule /><Text>Addis Ababa</Text>
      </View>
      <Thread />
      <Divider />
      <Divider GradientComponent={Fake} />
      <Divider orientation="vertical" length={120} GradientComponent={Fake} />
    </>
  );
}
