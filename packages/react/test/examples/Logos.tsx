import { Logo, LogoPattern } from '../../src/components/Logos';

export default function Example() {
  return (
    <>
      <Logo />
      <Logo variant="ismMark" height={24} />
      <Logo variant="dotbible" alt="dot.Bible" />
      <Logo variant="dotbibleIcon" height={32} />
      <div style={{ background: '#000', padding: 16 }}>
        <Logo inverse alt="ISM home" src="/ism/assets/logos/" />
        <LogoPattern inverse opacity={0.12} />
      </div>
    </>
  );
}
