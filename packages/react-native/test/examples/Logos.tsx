import { View } from 'react-native';
import { Logo, LogoOnSurface } from '../../src/components/Logos';

export default function Example() {
  return (
    <>
      <LogoOnSurface name="ism-full" accessibilityLabel="International Scripture Ministries" />
      <LogoOnSurface name="ism-mark" height={24} />
      <View style={{ backgroundColor: '#000000' }}>
        <LogoOnSurface name="dotbible-full" surface="dark" accessibilityLabel="dot.Bible" />
      </View>
      <LogoOnSurface name="dotbible-icon" tile accessibilityLabel="dot.Bible" />
      <Logo name="ism-full" height={32} />
    </>
  );
}
