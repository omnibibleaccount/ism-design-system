import { BackToTop } from '../../src/components/BackToTop';

export default function Example() {
  return (
    <>
      <BackToTop />
      <BackToTop dark threshold={0} fixed={false} />
    </>
  );
}
