import { EmptyState } from '../../src/components/EmptyState';

export default function Example() {
  return (
    <>
      <EmptyState title="No saved verses yet" actionLabel="Start reading">
        Tap the bookmark on any verse and it will wait for you here.
      </EmptyState>
      <EmptyState
        variant="noResults"
        title="No results for “psalm 151”"
        chips={
          <>
            <button className="chip" type="button">Psalm 23</button>
            <button className="chip" type="button">Psalms</button>
            <button className="chip" type="button">dot.Bible app</button>
          </>
        }
      >
        Check the spelling, or try one of these:
      </EmptyState>
      <EmptyState variant="error" title="You’re offline" actionLabel="Try again" onAction={() => {}}>
        Check your connection and try again. Bibles you’ve downloaded still work.
      </EmptyState>
    </>
  );
}
