import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon, MinistryIcon } from '../Icon';

export type BibleCardVariant = 'card' | 'row';

export interface BibleCardAction {
  /** Link to the destination page. */
  href: string;
  /** Visible tile label in the page language ("Read", "Listen", "Order", "Get the app"). */
  label: string;
}

export interface BibleCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** `card`: full leather cover with tiles and QR share. `row`: compact row for short lists. @default "card" */
  variant?: BibleCardVariant;
  /** Language name in its own script. */
  nativeName: string;
  /** BCP 47 code of the native name, for example "am". */
  nativeLang: string;
  /** Set "rtl" for Arabic-script and Hebrew names. */
  nativeDir?: 'ltr' | 'rtl';
  /** Address line, for example "dot.bible/amharic". In the row variant pass "Amharic · dot.bible/amharic". Short addresses, no https://. */
  url: string;
  /** English name of the language, used in accessible names ("Ways to get the Amharic Bible"). */
  languageName: string;
  /** Read action. The only Horizon Blue tile. */
  read?: BibleCardAction;
  /** Listen action. */
  listen?: BibleCardAction;
  /** Order (print) action. Full card only. */
  order?: BibleCardAction;
  /** Get the app action. Full card only. */
  app?: BibleCardAction;
  /** Accessible name of the tile group (full card), for example "Ways to get the Amharic Bible". */
  actionsLabel?: string;
  /** Row variant: accessible name of the Read tile, for example "Read the Amharic Bible". */
  readLabel?: string;
  /** Row variant: accessible name of the Listen tile, for example "Listen to the Amharic Bible". */
  listenLabel?: string;
  /** Row variant: link to the language page (the gold ↗). */
  pageHref?: string;
  /** Row variant: accessible name of the ↗ link, for example "Open the Amharic language page". */
  pageLabel?: string;
  /** Precomputed QR image URL for the share block. No QR library is bundled. Use this or `qr`. */
  qrSrc?: string;
  /** Precomputed QR as an inline `<svg>` or other node, used instead of `qrSrc`. */
  qr?: ReactNode;
  /** Accessible name of the QR naming the address, for example "QR code for dot.bible/amharic". */
  qrLabel?: string;
  /** Share block title, for example "Share with someone nearby". */
  shareTitle?: ReactNode;
  /** Share block prompt. */
  shareText?: ReactNode;
  /** Visible label of the Copy link button. */
  copyLabel?: ReactNode;
  /** Visible label of the Share button. */
  shareLabel?: ReactNode;
  /** Called when Copy link is pressed. */
  onCopyLink?: () => void;
  /** Called when Share is pressed. */
  onShare?: () => void;
  /** Share status announced politely, for example "Link copied: dot.bible/amharic". */
  status?: ReactNode;
}

/**
 * Black-leather Bible cover presenting one language's Bible. The leather comes from the CSS custom property
 * `--sx-leather` (default `../assets/imagery/leather-black.jpg`); set it on a parent when the asset path differs.
 */
export const BibleCard = forwardRef<HTMLElement, BibleCardProps>(function BibleCard(
  {
    variant = 'card',
    nativeName,
    nativeLang,
    nativeDir,
    url,
    languageName,
    read,
    listen,
    order,
    app,
    actionsLabel,
    readLabel,
    listenLabel,
    pageHref,
    pageLabel,
    qrSrc,
    qr,
    qrLabel,
    shareTitle,
    shareText,
    copyLabel,
    shareLabel,
    onCopyLink,
    onShare,
    status,
    className,
    ...rest
  },
  ref,
) {
  const head = (
    <div className={variant === 'row' ? undefined : 'sx-bible-head'}>
      <p className="sx-bible-native" lang={nativeLang} dir={nativeDir}>{nativeName}</p>
      <p className="sx-bible-url">{url}</p>
    </div>
  );

  if (variant === 'row') {
    return (
      <article ref={ref} className={cx('sx-bible', 'sx-bible-row', className)} {...rest}>
        {head}
        <div className="sx-bible-row-acts">
          {read ? (
            <a className="sx-bible-mini p" href={read.href} aria-label={readLabel ?? read.label}>
              <UiIcon name="book-open" size={24} />
            </a>
          ) : null}
          {listen ? (
            <a className="sx-bible-mini" href={listen.href} aria-label={listenLabel ?? listen.label}>
              <UiIcon name="headphones" size={24} />
            </a>
          ) : null}
          {pageHref ? (
            <a className="sx-bible-go" href={pageHref} aria-label={pageLabel ?? languageName}>{'↗'}</a>
          ) : null}
        </div>
      </article>
    );
  }

  const qrNode = qr ? (
    <div className="sx-qr" role="img" aria-label={qrLabel}>{qr}</div>
  ) : qrSrc ? (
    <div className="sx-qr"><img src={qrSrc} alt={qrLabel ?? ''} /></div>
  ) : null;

  return (
    <article ref={ref} className={cx('sx-bible', className)} aria-live="polite" {...rest}>
      {head}
      <div className="sx-bible-actions" role="group" aria-label={actionsLabel}>
        {read ? (
          <a className="sx-bible-act sx-bible-act-primary" href={read.href}>
            <UiIcon name="book-open" size={24} />
            <span>{read.label}</span>
          </a>
        ) : null}
        {listen ? (
          <a className="sx-bible-act" href={listen.href}>
            <UiIcon name="headphones" size={24} />
            <span>{listen.label}</span>
          </a>
        ) : null}
        {order ? (
          <a className="sx-bible-act" href={order.href}>
            <MinistryIcon name="bible" size={24} />
            <span>{order.label}</span>
          </a>
        ) : null}
        {app ? (
          <a className="sx-bible-act" href={app.href}>
            <MinistryIcon name="smartphone" size={24} />
            <span>{app.label}</span>
          </a>
        ) : null}
      </div>
      <div className="sx-bible-rule" aria-hidden="true" />
      <div className="sx-bible-share">
        {qrNode}
        <div className="sx-bible-share-text">
          {shareTitle ? <p className="sx-bible-share-title">{shareTitle}</p> : null}
          {shareText ? <p className="small sx-bible-share-copy">{shareText}</p> : null}
          <div className="sx-btnrow">
            {copyLabel ? (
              <button type="button" className="btn btn-outline-light btn-sm" onClick={onCopyLink}>{copyLabel}</button>
            ) : null}
            {shareLabel ? (
              <button type="button" className="btn btn-outline-light btn-sm" onClick={onShare}>{shareLabel}</button>
            ) : null}
          </div>
          <p className="small" role="status">{status}</p>
        </div>
      </div>
    </article>
  );
});
