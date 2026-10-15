import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import type { UiIconName } from '@ism/tokens/icons';

export type EmptyStateVariant = 'nothing' | 'noResults' | 'error';

const ICON_CLASS: Record<EmptyStateVariant, string> = {
  nothing: 'fb-eicon',
  noResults: 'fb-eicon fb-eicon-neutral',
  error: 'fb-eicon fb-eicon-error',
};
const DEFAULT_ICON: Record<EmptyStateVariant, UiIconName> = {
  nothing: 'bookmark',
  noResults: 'search',
  error: 'wifi-off',
};

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * `nothing`: first-time empty collection (blue icon, one primary button).
   * `noResults`: search with no hits (neutral icon, suggestion chips; announced politely).
   * `error`: offline or failed load (red tint, secondary "Try again"; announced once with `role="alert"`).
   * @default "nothing"
   */
  variant?: EmptyStateVariant;
  /** Heading text, for example "No saved verses yet". */
  title: ReactNode;
  /** Heading level that fits the page outline. @default 3 */
  headingLevel?: 2 | 3 | 4;
  /** The one short sentence: what happened and what to do. Never blame the reader. */
  children?: ReactNode;
  /** Override the 28px icon. Defaults to bookmark, search or wifi-off by variant. Hidden from assistive tech. */
  icon?: ReactNode;
  /** Label of the single next-step button, for example "Start reading" or "Try again". */
  actionLabel?: ReactNode;
  /** Click handler of the next-step button. */
  onAction?: () => void;
  /** Render the next step as a link to this URL instead of a button. */
  actionHref?: string;
  /** Trailing icon of the action, for example a refresh icon on "Try again". Defaults to a refresh icon for `error`. */
  actionIcon?: ReactNode;
  /** `noResults` only: two to four `.chip` suggestions (real searches the reader can tap). */
  chips?: ReactNode;
}

/** Centred panel that explains why there is nothing to show and offers one next step. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { variant = 'nothing', title, headingLevel = 3, children, icon, actionLabel, onAction, actionHref, actionIcon, chips, className, role, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as 'h3';
  const liveRole = role ?? (variant === 'error' ? 'alert' : variant === 'noResults' ? 'status' : undefined);
  const btnClass = cx('btn', variant === 'error' ? 'btn-secondary' : 'btn-primary', 'fb-empty-act');
  const trailing = actionIcon ?? (variant === 'error' ? <UiIcon name="refresh" size={20} /> : null);
  const actionContent = (
    <>
      {actionLabel}
      {trailing ? (
        <span className="arrow" aria-hidden="true">
          {trailing}
        </span>
      ) : null}
    </>
  );
  return (
    <div ref={ref} className={cx('fb-empty', className)} role={liveRole} {...rest}>
      <span className={ICON_CLASS[variant]}>{icon ?? <UiIcon name={DEFAULT_ICON[variant]} size={28} />}</span>
      <Heading className="fb-empty-title">{title}</Heading>
      {children ? <p className="fb-empty-text">{children}</p> : null}
      {variant === 'noResults' && chips ? <div className="fb-empty-chips">{chips}</div> : null}
      {actionLabel && actionHref ? (
        <a className={btnClass} href={actionHref}>
          {actionContent}
        </a>
      ) : actionLabel ? (
        <button className={btnClass} type="button" onClick={onAction}>
          {actionContent}
        </button>
      ) : null}
    </div>
  );
});
