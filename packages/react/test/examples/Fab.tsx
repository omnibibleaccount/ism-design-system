import { Fab, PullToRefresh, Snackbar } from '../../src/components/Fab';

export default function Example() {
  return (
    <div className="ap-screen">
      <PullToRefresh>Checking for new episodes…</PullToRefresh>
      <Fab aria-label="New note" />
      <Fab aria-label="New highlight" lifted />
      <Snackbar message="Note deleted" actionLabel="Undo" />
    </div>
  );
}
