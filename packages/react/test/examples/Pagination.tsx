import { Pagination, LoadMore } from '../../src/components/Pagination';

export default function Example() {
  return (
    <>
      <Pagination page={5} pageCount={12} />
      <Pagination page={1} pageCount={12} />
      <Pagination page={12} pageCount={12} />
      <Pagination page={2} pageCount={4} />
      <Pagination variant="compact" page={3} pageCount={12} renderStatus={(p, n) => <>Page <b>{p}</b> of {n}</>} />
      <LoadMore shown={12} total={48} status="Showing 12 of 48" label="Load more" loadingLabel="Loading" doneLabel="You've seen them all" />
      <LoadMore shown={24} total={48} loading status="Showing 24 of 48" label="Load more" loadingLabel="Loading" doneLabel="You've seen them all" />
      <LoadMore shown={48} total={48} status="Showing 48 of 48" label="Load more" doneLabel="You've seen them all" />
    </>
  );
}
