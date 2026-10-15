import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import type { UiIconName } from '@ism/tokens/icons';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const VARIANT_CLASS: Record<AlertVariant, string> = {
  info: 'alert-info',
  success: 'alert-ok',
  warning: 'alert-warn',
  error: 'alert-err',
};
const VARIANT_ICON: Record<AlertVariant, UiIconName> = {
  info: 'info',
  success: 'check-circle',
  warning: 'alert-triangle',
  error: 'alert-circle',
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Status. Never restyle colours per page; use one of the four variants.
   * @default "info"
   */
  variant?: AlertVariant;
  /** Bold title that says what happened in plain words. Omit for the compact one-line form. */
  title?: ReactNode;
  /** One sentence that says what to do next, with at most one text link (use `<a className="fb-alert-link">`). */
  children?: ReactNode;
  /** One-line form without a title, for example a draft notice. @default false */
  compact?: boolean;
  /**
   * Live-region role. Defaults to `alert` for errors (announced at once) and `status` for the other variants.
   * Insert the alert into the DOM when the event happens; a pre-rendered hidden alert is not announced.
   */
  role?: 'alert' | 'status';
}

/** Inline status banner with icon, optional title and one sentence. */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', title, compact = false, role, className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('alert', VARIANT_CLASS[variant], 'fb-alert', compact && 'small', className)}
      role={role ?? (variant === 'error' ? 'alert' : 'status')}
      {...rest}
    >
      <UiIcon name={VARIANT_ICON[variant]} size={20} className="fb-alert-ico" />
      <div>
        {title && !compact ? <strong className="fb-alert-title">{title}</strong> : null}
        {children}
      </div>
    </div>
  );
});

export interface AnnouncementBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The one short fact the bar announces. */
  children: ReactNode;
  /** Optional link text after the message, for example "See where we broadcast ↗". */
  linkLabel?: ReactNode;
  /** Destination of the link. Required for the link to render. */
  linkHref?: string;
  /** Full-bleed above the header (square corners). @default true */
  flush?: boolean;
  /** Accessible name of the region. @default "Announcement" */
  label?: string;
  /** Accessible name of the dismiss button. @default "Dismiss announcement" */
  dismissLabel?: string;
  /** Called when the reader dismisses the bar. Persist the choice here if you need more than the visit. */
  onDismiss?: () => void;
  /** Hide the dismiss button. @default false */
  dismissible?: boolean;
  /**
   * When set, the dismissal is remembered for the visit in `sessionStorage` under this key,
   * so the bar stays hidden on the next page. Nothing else is stored and no cookie is written.
   */
  storageKey?: string;
}

/** Dark, dismissible site-wide announcement bar that sits above the header. Show one at a time. */
export const AnnouncementBar = forwardRef<HTMLDivElement, AnnouncementBarProps>(function AnnouncementBar(
  {
    children,
    linkLabel,
    linkHref,
    flush = true,
    label = 'Announcement',
    dismissLabel = 'Dismiss announcement',
    onDismiss,
    dismissible = true,
    storageKey,
    className,
    ...rest
  },
  ref,
) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!storageKey) return;
    try {
      if (window.sessionStorage.getItem(storageKey) === '1') setHidden(true);
    } catch {
      /* storage unavailable: show the bar */
    }
  }, [storageKey]);
  if (hidden) return null;
  const dismiss = () => {
    setHidden(true);
    if (storageKey) {
      try {
        window.sessionStorage.setItem(storageKey, '1');
      } catch {
        /* ignore */
      }
    }
    onDismiss?.();
  };
  return (
    <div
      ref={ref}
      className={cx('fb-announce', flush && 'fb-announce-flush', className)}
      role="region"
      aria-label={label}
      {...rest}
    >
      <span>{children}</span>
      {linkHref && linkLabel ? (
        <a className="fb-announce-link" href={linkHref}>
          {linkLabel}
        </a>
      ) : null}
      {dismissible ? (
        <button className="fb-x" type="button" aria-label={dismissLabel} onClick={dismiss}>
          <UiIcon name="close" size={20} />
        </button>
      ) : null}
    </div>
  );
});
