import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../utils';

export interface SkipLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** Visible text, which is also the accessible name. Translate it per site language, for example "Skip to content". */
  children: ReactNode;
  /**
   * Fragment link to the main landmark. The target should be `<main id="main" tabIndex={-1}>`.
   * @default "#main"
   */
  href?: string;
}

/**
 * First focusable element on every page: an off-screen link that appears as a white pill on the first Tab
 * and jumps past the navigation. Render it first in `body`, before the header and the cookie banner.
 * After activation focus moves to the target so the next Tab lands inside the content.
 */
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { href = '#main', className, onClick, children, ...rest },
  ref,
) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !href.startsWith('#') || href.length < 2) return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  };
  return (
    <a ref={ref} className={cx('skip nv-skip', className)} href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
});
