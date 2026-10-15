import { SkipLink } from '../../src/components/SkipLink';

export default function Example() {
  return (
    <>
      <SkipLink>Skip to content</SkipLink>
      <SkipLink className="nv-shown" href="#search">Skip to search</SkipLink>
    </>
  );
}
