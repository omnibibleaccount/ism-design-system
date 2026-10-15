import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { StoreBadgeLink, type StoreBadgeLabels } from './StoreBadges';

export type AppBannerVariant = 'smartBanner' | 'promo' | 'strip';

export interface AppBannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * `smartBanner` is the dismissible "Open in app" bar for the top of mobile pages, `promo` is the inline
   * card with QR and store badges for desktop, `strip` is the slim end-of-article strip.
   * @default "smartBanner"
   */
  variant?: AppBannerVariant;
  /** URL of the dot.Bible icon (black logo, rendered white by the CSS). @default "/ism/assets/logos/dot.bible%20Icon%20Black.svg" */
  iconSrc?: string;
  /** Smart banner: app name, e.g. "dot.Bible". Promo: brand line, e.g. "dot.Bible · free". */
  name?: ReactNode;
  /** Smart banner: sub-line, e.g. "Read offline in 500+ languages". */
  subtitle?: ReactNode;
  /** Smart banner: URL of the Open button. Strip: URL of the "Get the app" link. */
  href?: string;
  /** Smart banner: label of the Open button, e.g. "Open". Strip: label of the link, e.g. "Get the app". */
  actionLabel?: ReactNode;
  /** Smart banner: accessible name of the region. @default "Get the dot.Bible app" */
  regionLabel?: string;
  /** Smart banner: accessible name of the dismiss button. @default "Dismiss" */
  dismissLabel?: string;
  /** Smart banner: called when the reader dismisses the banner. Remember the choice for the visit. */
  onDismiss?: () => void;
  /** Promo: heading, e.g. "Take the Bible with you, even offline." */
  heading?: ReactNode;
  /** Promo: one or two sentences under the heading. */
  description?: ReactNode;
  /** Promo: QR code element (`<svg>`). Hidden on phones by the CSS. */
  qr?: ReactNode;
  /** Promo: accessible name of the QR. @default "QR code to download dot.Bible" */
  qrLabel?: string;
  /** Promo: App Store URL. */
  appStoreHref?: string;
  /** Promo: Google Play URL. */
  playStoreHref?: string;
  /** Promo: override store badge text and accessible names. */
  storeLabels?: Partial<StoreBadgeLabels>;
  /** Promo: photo URL, e.g. `/ism/assets/imagery/deck-photo-tap-hand.png`. */
  imageSrc?: string;
  /** Promo: alt text of the photo (real description, e.g. "A hand holding a phone"). */
  imageAlt?: string;
  /** Strip: the message; wrap the lead in `<b>`. Falls back to `children`. */
  children?: ReactNode;
}

/** Promotes the dot.Bible app: smart banner, promo card or slim strip. Use only one per view. */
export const AppBanner = forwardRef<HTMLElement, AppBannerProps>(function AppBanner(
  {
    variant = 'smartBanner',
    iconSrc = '/ism/assets/logos/dot.bible%20Icon%20Black.svg',
    name,
    subtitle,
    href,
    actionLabel,
    regionLabel = 'Get the dot.Bible app',
    dismissLabel = 'Dismiss',
    onDismiss,
    heading,
    description,
    qr,
    qrLabel = 'QR code to download dot.Bible',
    appStoreHref,
    playStoreHref,
    storeLabels,
    imageSrc,
    imageAlt = '',
    className,
    children,
    ...rest
  },
  ref,
) {
  const [dismissed, setDismissed] = useState(false);

  if (variant === 'smartBanner') {
    if (dismissed) return null;
    const dismiss = () => {
      setDismissed(true);
      onDismiss?.();
      // Move focus to the page's first heading so keyboard users are not left on a removed control.
      if (typeof document !== 'undefined') {
        const h = document.querySelector<HTMLElement>('h1');
        if (h) {
          if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
          h.focus();
        }
      }
    };
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cx('mn-sbanner', className)}
        role="region"
        aria-label={regionLabel}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        <button className="mn-sb-x" type="button" aria-label={dismissLabel} onClick={dismiss}>
          <UiIcon name="close" size={18} />
        </button>
        <span className="mn-apptile"><img src={iconSrc} alt="" /></span>
        <span className="mn-sb-text">
          <span className="mn-sb-name">{name}</span>
          <span className="mn-sb-sub">{subtitle}</span>
        </span>
        <a className="btn btn-primary btn-sm mn-sb-open" href={href}>{actionLabel}</a>
      </div>
    );
  }

  if (variant === 'promo') {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={cx('card card-lg card-flat mn-promo', className)} {...(rest as HTMLAttributes<HTMLDivElement>)}>
        <div className="mn-promo-body">
          <div className="mn-promo-brand">
            <span className="mn-apptile mn-apptile-md"><img src={iconSrc} alt="" /></span>
            {name}
          </div>
          <h3 className="h3">{heading}</h3>
          <p className="muted">{description}</p>
          <div className="mn-promo-get">
            {qr ? <div className="mn-qr mn-qr-sm" role="img" aria-label={qrLabel}>{qr}</div> : null}
            <div className="mn-promo-badges">
              {appStoreHref ? <StoreBadgeLink store="appStore" size="sm" href={appStoreHref} labels={storeLabels} /> : null}
              {playStoreHref ? <StoreBadgeLink store="googlePlay" size="sm" href={playStoreHref} labels={storeLabels} /> : null}
            </div>
          </div>
        </div>
        {imageSrc ? (
          <div className="media mn-promo-media"><img className="photo" src={imageSrc} alt={imageAlt} /></div>
        ) : null}
      </div>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={cx('mn-strip', className)} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      <span className="mn-apptile mn-apptile-sm"><img src={iconSrc} alt="" /></span>
      <p>{children}</p>
      <a className="btn btn-ghost btn-sm" href={href}>
        {actionLabel} <span className="arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  );
});
