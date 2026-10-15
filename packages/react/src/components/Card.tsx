import { forwardRef, type HTMLAttributes, type AnchorHTMLAttributes, type KeyboardEvent, type MouseEventHandler, type ReactNode } from 'react';
import { cx } from '../utils';

/* ---------- React image-led Card (dot.Bible app, dark marketing sections) ---------- */

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onClick'> {
  /** Photo URL. Without it the card is `--charcoal-900`. */
  image?: string;
  /** Alt text for the photo. Empty by default because the title names the card. @default "" */
  imageAlt?: string;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** 24px semibold white title. */
  title?: string;
  /** 15px, 70% white. */
  subtitle?: string;
  /** CTA pill label shown top-right, rendered "<Label> ↗". Pass `""` to hide it. @default "Explore" */
  cta?: string;
  /** Height in px. @default 360 */
  height?: number;
  /** Makes the card clickable. Renders `role="link"` with `tabIndex={0}` and Enter/Space handling. */
  onClick?: MouseEventHandler<HTMLElement>;
}

/** Large, immersive, image-led tile with a dark gradient overlay so the text always has contrast. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { image, imageAlt = '', eyebrow, title, subtitle, cta = 'Explore', height = 360, onClick, style, className, ...rest },
  ref,
) {
  const clickable = Boolean(onClick);
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };
  return (
    <div
      ref={ref}
      className={className}
      role={clickable ? 'link' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={clickable ? onKeyDown : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255,255,255,.14)',
        background: 'var(--charcoal-900)',
        color: 'var(--white)',
        cursor: clickable ? 'pointer' : undefined,
        ...style,
      }}
      {...rest}
    >
      {image ? <img src={image} alt={imageAlt} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.05) 30%, rgba(0,0,0,.78) 100%)' }}
      />
      {cta ? (
        <span
          style={{
            position: 'absolute',
            top: 16,
            insetInlineEnd: 16,
            padding: '8px 14px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--white)',
            color: 'var(--black)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {cta} <span aria-hidden="true">↗</span>
        </span>
      ) : null}
      <div style={{ position: 'absolute', insetInline: 24, bottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {eyebrow ? (
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 'var(--eyebrow-tracking)', textTransform: 'uppercase', color: 'var(--blue-on-dark)' }}>
            {eyebrow}
          </span>
        ) : null}
        {title ? <span style={{ fontSize: 24, lineHeight: 1.2, fontWeight: 600 }}>{title}</span> : null}
        {subtitle ? <span style={{ fontSize: 15, color: 'rgba(255,255,255,.7)' }}>{subtitle}</span> : null}
      </div>
    </div>
  );
});

/* ---------- Website `.card` family ---------- */

export type ContentCardVariant = 'default' | 'flush' | 'clip' | 'tight' | 'dark' | 'roomy' | 'flat' | 'pad';

const VARIANT: Record<ContentCardVariant, string | undefined> = {
  default: undefined,
  flush: 'cr-card-flush',
  clip: 'cr-card-clip',
  tight: 'cr-card-tight',
  dark: 'cr-card-tight cr-card-dark',
  roomy: 'card-lg cr-card-roomy',
  flat: 'card-flat',
  pad: 'card-flat cr-card-pad',
};

interface ContentCardOwn {
  /**
   * Layout variant. `flush` has edge-to-edge media and a `CardBody`; `clip` overlaps a medallion on the photo;
   * `tight` and `dark` are text cards; `roomy` is a value card; `flat` keeps its shadow on hover (not a link); `pad` is a step or statement card.
   * @default "default"
   */
  variant?: ContentCardVariant;
  children?: ReactNode;
}

export type ContentCardProps = ContentCardOwn &
  (
    | (Omit<HTMLAttributes<HTMLDivElement>, keyof ContentCardOwn> & { href?: undefined })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ContentCardOwn> & { href: string })
  );

/**
 * Website content card (`.card`). With `href` the whole card is one link: keep a single heading inside and no second link or button.
 * Do not nest cards.
 */
export const ContentCard = forwardRef<HTMLDivElement | HTMLAnchorElement, ContentCardProps>(function ContentCard(
  { variant = 'default', className, children, ...rest },
  ref,
) {
  const classes = cx('card', VARIANT[variant], className);
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={classes} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
});

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Photo URL. Without it the `.ph` placeholder shows. */
  src?: string;
  /** Alt text, or `""` if decorative. @default "" */
  alt?: string;
  /** Aspect: `1610` (16:10) or `top` (4:3 bleeding to the card edge, for the `clip` variant). Omit for natural size. */
  ratio?: '1610' | 'top';
}

/** Photo area inside a card; zooms 3% when the card is hovered. */
export function CardMedia({ src, alt = '', ratio, className, children, ...rest }: CardMediaProps) {
  return (
    <div className={cx('media', ratio === '1610' && 'cr-media-1610', ratio === 'top' && 'cr-card-media-top', !src && !children && 'ph', className)} {...rest}>
      {src ? <img className="photo" src={src} alt={alt} /> : children}
    </div>
  );
}

/** Padded text column under `CardMedia` in a `flush` card. */
export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('cr-card-body', className)} {...rest} />;
}

/** Text call to action at the end of a linked card. Pass the arrow as `arrow` (↗ leaves the page). */
export function CardCta({ arrow = '↗', className, children, ...rest }: HTMLAttributes<HTMLSpanElement> & { arrow?: ReactNode }) {
  return (
    <span className={cx('cr-card-cta', className)} {...rest}>
      {children} {arrow ? <span className="arrow" aria-hidden="true">{arrow}</span> : null}
    </span>
  );
}
