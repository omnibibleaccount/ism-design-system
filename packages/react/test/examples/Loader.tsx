import { Loader, Skeleton, SkeletonList, SkeletonText, SkeletonCard } from '../../src/components/Loader';
import { Button } from '../../src/components/Button';

export default function Example() {
  return (
    <>
      <Loader size="s" />
      <Loader size="m" label="Loading stations" />
      <Loader size="l" />
      <div style={{ background: '#161819', padding: 16 }}>
        <Loader tone="dark" />
      </div>
      <Loader tone="ink" />
      <Button loading>Sending…</Button>
      <SkeletonList label="Loading stations" rows={3} />
      <SkeletonText label="Loading Psalm 23" />
      <SkeletonCard label="Loading stories" />
      <Skeleton width="60%" />
    </>
  );
}
