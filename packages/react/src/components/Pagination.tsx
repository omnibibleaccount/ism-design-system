import { forwardRef, type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type PaginationVariant = 'numbered' | 'compact';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'children'> {
  /** Current page, 1-based. */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** `numbered` shows page buttons with Previous / Next; `compact` shows round arrows around "Page 3 of 12". @default "numbered" */
  variant?: PaginationVariant;
  /** Builds the URL of a page. Use real `?page=` URLs so pages can be shared. @default (n) => `?page=${n}` */
  hrefFor?: (page: number) => string;
  /**
   * Called when a page link is clicked, with the target page and the click event.
   * Call `event.preventDefault()` for client-side paging without a navigation.
   */
  onPageChange?: (page: number, event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Component used to render page links. Defaults to `'a'`.
   * Pass `next/link` (or any component accepting `href`, `className`, `onClick`, `aria-*` and `children`).
   * @default "a"
   */
  linkComponent?: ElementType;
  /** Accessible name of the `<nav>`. @default "Pagination" */
  label?: string;
  /** Visible text of the Previous link (numbered). Leave empty for an arrow-only look. @default "Previous" */
  previousLabel?: ReactNode;
  /** Visible text of the Next link (numbered). @default "Next" */
  nextLabel?: ReactNode;
  /** Accessible name of the round Previous arrow (compact). @default "Previous page" */
  previousAriaLabel?: string;
  /** Accessible name of the round Next arrow (compact). @default "Next page" */
  nextAriaLabel?: string;
  /**
   * Renders the compact status ("Page 3 of 12", current number bold). Receives the page and the count.
   * Without it only the bold current number and the total are shown, separated by a slash.
   */
  renderStatus?: (page: number, pageCount: number) => ReactNode;
}

type Slot = number | 'gap';

/** Page numbers to show: first, last, current ±1, with `…` gaps. Never more than 7 numbers. */
export function paginationRange(page: number, pageCount: number): Slot[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const set = new Set<number>([1, pageCount, page - 1, page, page + 1]);
  if (page <= 2) [2, 3].forEach((n) => set.add(n));
  if (page >= pageCount - 1) [pageCount - 2, pageCount - 1].forEach((n) => set.add(n));
  const nums = [...set].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const out: Slot[] = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push('gap');
    out.push(n);
  });
  return out;
}

/**
 * Page navigation for long lists. Numbered (default) or compact. Previous and Next stay in place and are
 * disabled (`aria-disabled`) at the ends. The current page is `aria-current="page"`; gaps are hidden from assistive tech.
 * Links render through `linkComponent` (default `'a'`; pass `next/link` in Next.js).
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    variant = 'numbered',
    hrefFor = (n) => `?page=${n}`,
    onPageChange,
    linkComponent,
    label = 'Pagination',
    previousLabel = 'Previous',
    nextLabel = 'Next',
    previousAriaLabel = 'Previous page',
    nextAriaLabel = 'Next page',
    renderStatus,
    className,
    ...rest
  },
  ref,
) {
  const Link: ElementType = linkComponent ?? 'a';
  const hasPrev = page > 1;
  const hasNext = page < pageCount;
  const click = (n: number) => (e: MouseEvent<HTMLAnchorElement>) => onPageChange?.(n, e);

  if (variant === 'compact') {
    const round = (enabled: boolean, target: number, name: string, icon: 'arrow-left' | 'arrow-right') =>
      enabled ? (
        <Link className="nv-pg-round" href={hrefFor(target)} aria-label={name} onClick={click(target)}>
          <UiIcon name={icon} className="nv-ico" />
        </Link>
      ) : (
        <span className="nv-pg-round" aria-label={name} aria-disabled="true">
          <UiIcon name={icon} className="nv-ico" />
        </span>
      );
    return (
      <nav ref={ref} className={cx('nv-pg-compact', className)} aria-label={label} {...rest}>
        {round(hasPrev, page - 1, previousAriaLabel, 'arrow-left')}
        <span className="nv-pg-status" aria-live="polite">
          {renderStatus ? (
            renderStatus(page, pageCount)
          ) : (
            <>
              <b>{page}</b> / {pageCount}
            </>
          )}
        </span>
        {round(hasNext, page + 1, nextAriaLabel, 'arrow-right')}
      </nav>
    );
  }

  return (
    <nav ref={ref} className={cx('nv-pg', className)} aria-label={label} {...rest}>
      {hasPrev ? (
        <Link className="nv-pg-nav" href={hrefFor(page - 1)} onClick={click(page - 1)}>
          <UiIcon name="arrow-left" className="nv-ico" />
          {previousLabel}
        </Link>
      ) : (
        <span className="nv-pg-nav" aria-disabled="true">
          <UiIcon name="arrow-left" className="nv-ico" />
          {previousLabel}
        </span>
      )}
      <span className="nv-pg-space" />
      {paginationRange(page, pageCount).map((slot, i) =>
        slot === 'gap' ? (
          <span key={`g${i}`} className="nv-pg-gap" aria-hidden="true">…</span>
        ) : (
          <Link
            key={slot}
            className="nv-pg-btn"
            href={hrefFor(slot)}
            aria-current={slot === page ? 'page' : undefined}
            onClick={click(slot)}
          >
            {slot}
          </Link>
        ),
      )}
      <span className="nv-pg-space" />
      {hasNext ? (
        <Link className="nv-pg-nav" href={hrefFor(page + 1)} onClick={click(page + 1)}>
          {nextLabel}
          <UiIcon name="arrow-right" className="nv-ico" />
        </Link>
      ) : (
        <span className="nv-pg-nav" aria-disabled="true">
          {nextLabel}
          <UiIcon name="arrow-right" className="nv-ico" />
        </span>
      )}
    </nav>
  );
});

export interface LoadMoreProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Number of items currently shown. Drives the progress bar. */
  shown: number;
  /** Total number of items. */
  total: number;
  /** Status text, for example "Showing 12 of 48". Always say how many are shown. */
  status: ReactNode;
  /** Button label: "Load more". */
  label: ReactNode;
  /** Button label while loading: "Loading". Defaults to `label`. */
  loadingLabel?: ReactNode;
  /** Text shown instead of the button when everything is loaded: "You've seen them all". */
  doneLabel: ReactNode;
  /** Show the spinner, set `aria-busy` and block interaction. @default false */
  loading?: boolean;
  /** Called when the button is pressed. Append items in place, move focus to the first new item and announce the result. */
  onLoadMore?: () => void;
}

/** "Load more" block with a progress bar (`--gradient-line`), for feeds people scan once. Shows `doneLabel` when `shown >= total`. */
export const LoadMore = forwardRef<HTMLDivElement, LoadMoreProps>(function LoadMore(
  { shown, total, status, label, loadingLabel, doneLabel, loading = false, onLoadMore, className, ...rest },
  ref,
) {
  const done = shown >= total;
  const pct = total > 0 ? Math.min(100, Math.round((shown / total) * 100)) : 0;
  return (
    <div ref={ref} className={cx('nv-more', className)} {...rest}>
      <span className="small muted">{status}</span>
      <div className="nv-bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      {done ? (
        <span className="nv-done">{doneLabel}</span>
      ) : (
        <button className="btn btn-secondary" type="button" aria-busy={loading || undefined} disabled={loading} onClick={onLoadMore}>
          {loading ? <span className="nv-spin-dark" aria-hidden="true" /> : null}
          {loading ? loadingLabel ?? label : label}
        </button>
      )}
    </div>
  );
});
