import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { Button } from './Button';

export interface PageIntroProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow label (programme or section name). Not a heading. */
  eyebrow?: ReactNode;
  /** Headline, rendered as the page's single `<h1>` styled `.h2`. Wrap at most one word in `<span className="em">`. */
  title: ReactNode;
  /** One-sentence lead. */
  lead?: ReactNode;
  /** Optional buttons below the lead (a primary and a secondary `Button`). */
  actions?: ReactNode;
}

/** Opening block of an inner page: eyebrow, h1 headline, lead and optional actions. Use once per page. */
export const PageIntro = forwardRef<HTMLElement, PageIntroProps>(function PageIntro(
  { eyebrow, title, lead, actions, className, children, ...rest },
  ref,
) {
  return (
    <header ref={ref} className={cx('dp-intro', className)} {...rest}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h1 className="h2">{title}</h1>
      {lead ? <p className="lead">{lead}</p> : null}
      {actions ? <div className="dp-hero-actions">{actions}</div> : null}
      {children}
    </header>
  );
});

export interface SectionHeadingRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Eyebrow label above the heading. */
  eyebrow?: ReactNode;
  /** Section heading, rendered as an `<h2>`. Wrap at most one word in `<span className="em">`. */
  title: ReactNode;
  /** Text of the ghost link, for example "See all". Make it specific when several appear on a page. Omit to hide the link. */
  linkLabel?: ReactNode;
  /** Target of the ghost link. Required for the link to render. */
  linkHref?: string;
  /** The link opens another page: appends the ↗ arrow. Leave false for an in-page anchor. @default false */
  linkExternalPage?: boolean;
  /** Visually hidden suffix that makes the link text specific, for example "programmes". */
  linkHiddenSuffix?: string;
}

/** Section heading row: eyebrow and h2 on the left, a ghost "See all" link aligned to the bottom right. */
export const SectionHeadingRow = forwardRef<HTMLDivElement, SectionHeadingRowProps>(function SectionHeadingRow(
  { eyebrow, title, linkLabel, linkHref, linkExternalPage = false, linkHiddenSuffix, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('dp-sechead', className)} {...rest}>
      <div className="dp-sechead-text">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="h2">{title}</h2>
      </div>
      {linkHref && linkLabel ? (
        <Button variant="ghost" href={linkHref} icon={linkExternalPage ? '↗' : undefined}>
          {linkLabel}
          {linkHiddenSuffix ? <span className="dp-vh"> {linkHiddenSuffix}</span> : null}
        </Button>
      ) : null}
    </div>
  );
});
