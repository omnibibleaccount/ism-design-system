import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

/** A footer link. */
export interface FooterLink {
  /** Link text, Title Case. */
  label: string;
  /** Destination. */
  href: string;
}

/** A column of links under a small uppercase heading. */
export interface FooterColumn {
  /** Column heading ("About", "Platforms", "Get Involved"). Rendered as an `<h2>`. */
  heading: string;
  /** Links in the column. */
  links: FooterLink[];
}

/** A social network link rendered as a 44px ring. */
export interface FooterSocial {
  /** Network name, used as the link's accessible name: "Instagram". */
  name: string;
  /** Profile URL. */
  href: string;
  /** The network glyph, for example an inline `<svg viewBox="0 0 32 32">`. Give it `aria-hidden="true"`; the link is named by `name`. */
  icon: ReactNode;
}

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Mission sentence in the giving banner. */
  ctaText?: ReactNode;
  /** Label of the banner button (an outline button with ↗). Omit with `ctaHref` to hide the banner. */
  ctaLabel?: ReactNode;
  /** Destination of the banner button. */
  ctaHref?: string;
  /**
   * Component used to render links. Defaults to `'a'`.
   * Pass `next/link` (or any component accepting `href`, `className` and `children`) for client-side routing.
   * @default "a"
   */
  linkComponent?: ElementType;
  /** Logo slot. Defaults to an `<img>` using `logoSrc`; the CSS inverts it to white. */
  logo?: ReactNode;
  /** Path of the default full logo. @default "/ism/assets/logos/Full%20Logo%20Black.svg" */
  logoSrc?: string;
  /** Alt text of the default logo. @default "International Scripture Ministries" */
  logoAlt?: string;
  /** Where the logo links to. @default "/" */
  logoHref?: string;
  /** Accessible name of the logo link. @default "International Scripture Ministries home" */
  logoLabel?: string;
  /** Tagline under the logo. */
  tagline?: ReactNode;
  /** Social links. */
  socials?: FooterSocial[];
  /** Link columns (the README uses three). */
  columns: FooterColumn[];
  /** Accessible name of the columns' `<nav>`. @default "Footer" */
  navLabel?: string;
  /** Legal lines on the left: copyright, nonprofit notice. Each item becomes a paragraph. */
  legal?: ReactNode[];
  /** Legal links on the right (Cookie Policy, Terms, Privacy). */
  legalLinks?: FooterLink[];
  /** Label of the "Cookie settings" button. The button is omitted when this or `onCookieSettings` is missing. */
  cookieSettingsLabel?: ReactNode;
  /** Called when "Cookie settings" is pressed; it should reopen the cookie banner. It is a `<button>` because it opens a dialog. */
  onCookieSettings?: () => void;
  /** Force the phone layout (`.nv-foot-sm`). It also applies automatically below 768px. @default false */
  compact?: boolean;
  /** Extra content rendered at the end of the legal row, for example an inline `LanguageInline`. */
  legalExtra?: ReactNode;
}

/**
 * Site-wide black footer: giving banner, brand column with socials, link columns and the legal row.
 * Data-driven: pass `columns`, `socials` and `legal`. Links render through `linkComponent` (default `'a'`; pass `next/link` in Next.js).
 */
export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  {
    ctaText,
    ctaLabel,
    ctaHref,
    linkComponent,
    logo,
    logoSrc = '/ism/assets/logos/Full%20Logo%20Black.svg',
    logoAlt = 'International Scripture Ministries',
    logoHref = '/',
    logoLabel = 'International Scripture Ministries home',
    tagline,
    socials,
    columns,
    navLabel = 'Footer',
    legal,
    legalLinks,
    cookieSettingsLabel,
    onCookieSettings,
    compact = false,
    legalExtra,
    className,
    ...rest
  },
  ref,
) {
  const Link: ElementType = linkComponent ?? 'a';
  return (
    <footer ref={ref} className={cx('nv-foot', compact && 'nv-foot-sm', className)} {...rest}>
      <div className="nv-foot-glow" aria-hidden="true" />
      {ctaText || ctaLabel ? (
        <div className="nv-foot-in">
          <div className="nv-fcta">
            {ctaText ? <h2 className="nv-fcta-h">{ctaText}</h2> : null}
            {ctaLabel && ctaHref ? (
              <Link className="btn btn-outline-light nv-fcta-btn" href={ctaHref}>
                {ctaLabel} <span className="arrow" aria-hidden="true">↗</span>
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="nv-foot-in nv-foot-body">
        <div className="nv-fmain">
          <div className="nv-fbrand">
            <Link className="nv-flogo" href={logoHref} aria-label={logoLabel}>
              {logo ?? <img src={logoSrc} alt={logoAlt} />}
            </Link>
            {tagline ? <p className="nv-ftag">{tagline}</p> : null}
            {socials && socials.length > 0 ? (
              <div className="nv-socials">
                {socials.map((s) => (
                  <a key={s.name} className="nv-soc" href={s.href} aria-label={s.name}>
                    {s.icon}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <nav className="nv-fnav" aria-label={navLabel}>
            {columns.map((col) => (
              <div className="nv-fcol" key={col.heading}>
                <h2 className="nv-fcol-h">{col.heading}</h2>
                {col.links.map((l) => (
                  <Link key={l.href + l.label} className="lnk" href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="nv-frule" />
        <div className="nv-flegal">
          <div>
            {legal?.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className="nv-flegal-links">
            {legalLinks?.map((l) => (
              <Link key={l.href + l.label} className="lnk" href={l.href}>
                {l.label}
              </Link>
            ))}
            {cookieSettingsLabel && onCookieSettings ? (
              <button type="button" className="lnk" onClick={onCookieSettings}>
                {cookieSettingsLabel}
              </button>
            ) : null}
            {legalExtra}
          </div>
        </div>
      </div>
    </footer>
  );
});
