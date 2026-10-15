import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export type LinkVariant = 'inline' | 'reveal' | 'ghost' | 'onDark' | 'ink';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * `inline` is a plain link in copy; `reveal` is `.lnk` (underline grows on hover); `ghost` is the "See all" link-button;
   * `onDark` is for dark surfaces; `ink` is `.lnk` in black at content width.
   * @default "inline"
   */
  variant?: LinkVariant;
  /** Link goes to another site or page: adds the hidden "(opens in a new tab)" text, `target="_blank"` and `rel="noopener"`. @default false */
  external?: boolean;
  /** Show the trailing arrow glyph (decorative, `aria-hidden`). Pass `true` for ↗ or a node for another glyph. Used on reveal and ghost links. */
  arrow?: boolean | ReactNode;
  /** Visually hidden text announced for external links. Override to translate. @default "(opens in a new tab)" */
  newTabLabel?: string;
  children?: ReactNode;
}

const VARIANT: Record<LinkVariant, string | undefined> = {
  inline: undefined,
  reveal: 'lnk',
  ghost: 'btn btn-ghost',
  onDark: 'cr-link-dark',
  ink: 'lnk cr-link-ink',
};

/** Text link. The ↗ means "goes to another page"; do not use for actions that change data. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'inline', external = false, arrow, newTabLabel = '(opens in a new tab)', className, children, ...rest },
  ref,
) {
  const glyph = arrow === true ? '↗' : arrow || null;
  const extra = external ? { target: '_blank', rel: 'noopener' } : {};
  return (
    <a ref={ref} className={cx(VARIANT[variant], className) || undefined} {...extra} {...rest}>
      {children}
      {glyph ? (
        <>
          {' '}
          <span className="arrow" aria-hidden="true">{glyph}</span>
        </>
      ) : null}
      {external ? <span className="dp-vh"> {newTabLabel}</span> : null}
    </a>
  );
});
