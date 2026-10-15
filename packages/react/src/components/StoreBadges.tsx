import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export type StoreBadgeSize = 'md' | 'sm';
export type StoreName = 'appStore' | 'googlePlay';

/** Visible and accessible strings for the badges. Override for other languages. */
export interface StoreBadgeLabels {
  /** Small first line of the App Store badge. @default "Download on the" */
  appStoreLine1: string;
  /** Big second line of the App Store badge. @default "App Store" */
  appStoreLine2: string;
  /** Accessible name of the App Store link. @default "Download dot.Bible on the App Store" */
  appStoreAriaLabel: string;
  /** Small first line of the Google Play badge. @default "Get it on" */
  googlePlayLine1: string;
  /** Big second line of the Google Play badge. @default "Google Play" */
  googlePlayLine2: string;
  /** Accessible name of the Google Play link. @default "Get dot.Bible on Google Play" */
  googlePlayAriaLabel: string;
}

export const defaultStoreBadgeLabels: StoreBadgeLabels = {
  appStoreLine1: 'Download on the',
  appStoreLine2: 'App Store',
  appStoreAriaLabel: 'Download dot.Bible on the App Store',
  googlePlayLine1: 'Get it on',
  googlePlayLine2: 'Google Play',
  googlePlayAriaLabel: 'Get dot.Bible on Google Play',
};

export interface StoreBadgeLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Which store this badge links to. */
  store: StoreName;
  /** Store page URL. */
  href: string;
  /** `md` is 52px tall, `sm` is 44px (the minimum). @default "md" */
  size?: StoreBadgeSize;
  /** Override the badge text and accessible name. */
  labels?: Partial<StoreBadgeLabels>;
}

/** One black store badge (a link). Used by `StoreBadges` and `AppBanner`. */
export const StoreBadgeLink = forwardRef<HTMLAnchorElement, StoreBadgeLinkProps>(function StoreBadgeLink(
  { store, size = 'md', labels, className, ...rest },
  ref,
) {
  const l = { ...defaultStoreBadgeLabels, ...labels };
  const apple = store === 'appStore';
  return (
    <a
      ref={ref}
      className={cx('mn-store', size === 'sm' && 'mn-store-sm', className)}
      aria-label={apple ? l.appStoreAriaLabel : l.googlePlayAriaLabel}
      {...rest}
    >
      {apple ? (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.8-3.5.8-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.8.8 3.1.7c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.5-3.9zM14.1 5.8c.6-.8 1.1-1.9.9-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 3l14 9-14 9z" />
        </svg>
      )}
      <span>
        <span className="mn-s1">{apple ? l.appStoreLine1 : l.googlePlayLine1}</span>
        <span className="mn-s2">{apple ? l.appStoreLine2 : l.googlePlayLine2}</span>
      </span>
    </a>
  );
});

export interface StoreBadgesProps extends HTMLAttributes<HTMLDivElement> {
  /** App Store URL. */
  appStoreHref: string;
  /** Google Play URL. */
  playStoreHref: string;
  /** Badge size; `sm` is the QR combo size. @default "md" */
  size?: StoreBadgeSize;
  /** Override badge text and accessible names. */
  labels?: Partial<StoreBadgeLabels>;
  /**
   * QR code element (an `<svg>` or `<img>`) for desktop. When given, the combo layout `.mn-qrcombo` is
   * rendered with the QR beside the prompt and badges. Show it on desktop only.
   */
  qr?: ReactNode;
  /** Accessible name of the QR (rendered `role="img"` wrapper). @default "QR code to download dot.Bible" */
  qrLabel?: string;
  /** Prompt next to the QR, e.g. "Scan to get dot.Bible on your phone". Required text when `qr` is set. */
  qrPrompt?: ReactNode;
}

/**
 * Black App Store and Google Play badges for the dot.Bible app, with an optional QR combo for desktop.
 * App Store first, Google Play second.
 */
export const StoreBadges = forwardRef<HTMLDivElement, StoreBadgesProps>(function StoreBadges(
  { appStoreHref, playStoreHref, size = 'md', labels, qr, qrLabel = 'QR code to download dot.Bible', qrPrompt, className, ...rest },
  ref,
) {
  const badgeSize = qr ? 'sm' : size;
  const badges = (
    <div className={cx('mn-stores', !qr && className)} {...(qr ? {} : rest)} ref={qr ? undefined : ref}>
      <StoreBadgeLink store="appStore" href={appStoreHref} size={badgeSize} labels={labels} />
      <StoreBadgeLink store="googlePlay" href={playStoreHref} size={badgeSize} labels={labels} />
    </div>
  );
  if (!qr) return badges;
  return (
    <div ref={ref} className={cx('mn-qrcombo', className)} {...rest}>
      <div className="mn-qr" role="img" aria-label={qrLabel}>{qr}</div>
      <div>
        {qrPrompt ? <p>{qrPrompt}</p> : null}
        {badges}
      </div>
    </div>
  );
});
