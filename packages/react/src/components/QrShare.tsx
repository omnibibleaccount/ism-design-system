import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type QrShareVariant = 'light' | 'dark';

export interface QrShareProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `light`: secondary buttons on a white card. `dark`: outline-light buttons on charcoal. @default "light" */
  variant?: QrShareVariant;
  /** URL of a precomputed QR code image (black on white, with its own quiet zone). Use this or `children`. No QR library is bundled. */
  qrSrc?: string;
  /** A precomputed QR as an inline `<svg>` (or any node), used instead of `qrSrc`. */
  children?: ReactNode;
  /** Accessible name of the QR naming the address it opens, for example "QR code for dot.bible/burmese". */
  qrLabel: string;
  /** Title, for example "Share with someone nearby". */
  title: ReactNode;
  /** Short prompt naming the language and the short address. */
  text?: ReactNode;
  /** Visible label of the Copy link button. */
  copyLabel: ReactNode;
  /** Visible label of the Copy link button after copying, for example "Copied". Defaults to `copyLabel`. */
  copiedLabel?: ReactNode;
  /** Visible label of the Share button, for example "Share…". */
  shareLabel: ReactNode;
  /** Hide the Share button where the system share sheet is unavailable. @default false */
  hideShare?: boolean;
  /** The link was just copied: swaps the Copy icon to a check and the label to `copiedLabel`. @default false */
  copied?: boolean;
  /** Called when Copy link is pressed. Keep focus on the button. */
  onCopy?: () => void;
  /** Called when Share is pressed. */
  onShare?: () => void;
  /** Status message announced politely, for example "Link copied: dot.bible/urdu". Keeps its height when empty. */
  status?: ReactNode;
}

/** A QR code beside a short prompt with Copy link and Share buttons. Copy link is required beside the QR. */
export const QrShare = forwardRef<HTMLDivElement, QrShareProps>(function QrShare(
  {
    variant = 'light',
    qrSrc,
    children,
    qrLabel,
    title,
    text,
    copyLabel,
    copiedLabel,
    shareLabel,
    hideShare = false,
    copied = false,
    onCopy,
    onShare,
    status,
    className,
    ...rest
  },
  ref,
) {
  const dark = variant === 'dark';
  const btn = cx('btn', dark ? 'btn-outline-light' : 'btn-secondary', 'btn-sm');
  return (
    <div ref={ref} className={cx('sx-share', dark && 'sx-share-dark', className)} {...rest}>
      <div className={cx('sx-qr', !dark && 'sx-qr-line')} role={children ? 'img' : undefined} aria-label={children ? qrLabel : undefined}>
        {children ?? (qrSrc ? <img src={qrSrc} alt={qrLabel} /> : null)}
      </div>
      <div className="sx-share-text">
        <p className="sx-share-title">{title}</p>
        {text ? <p className="small sx-share-copy">{text}</p> : null}
        <div className="sx-btnrow">
          <button type="button" className={btn} onClick={onCopy}>
            <UiIcon name={copied ? 'check' : 'copy'} size={16} />
            <span>{copied ? copiedLabel ?? copyLabel : copyLabel}</span>
          </button>
          {hideShare ? null : (
            <button type="button" className={btn} onClick={onShare}>
              <UiIcon name="share" size={16} />
              {shareLabel}
            </button>
          )}
        </div>
        <p className="sx-share-status" role="status">{status}</p>
      </div>
    </div>
  );
});
