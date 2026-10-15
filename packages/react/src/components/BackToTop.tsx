import { forwardRef, useCallback, useEffect, useState, type ButtonHTMLAttributes } from 'react';
import { cx } from '../utils';

export interface BackToTopProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'hidden'> {
  /**
   * Scroll distance in px after which the button appears. Defaults to two screen heights.
   * Set `0` to always show it.
   */
  threshold?: number;
  /** Accessible name (the button has no visible text). @default "Back to top" */
  label?: string;
  /** Charcoal variant for use over black sections (footer, dark heroes). @default false */
  dark?: boolean;
  /** Pin to the bottom-right corner (`.nv-btt-fixed`). One per page. @default true */
  fixed?: boolean;
  /**
   * CSS selector of the element that receives focus after scrolling: the skip link target.
   * @default "main[tabindex='-1'], #main"
   */
  focusTarget?: string;
}

/**
 * 48px round button that appears after a scroll threshold, scrolls to the top and moves focus to
 * the start of the content. Jumps instead of smooth-scrolling when `prefers-reduced-motion` is set.
 * Hidden with the `hidden` attribute so it is not in the tab order.
 */
export const BackToTop = forwardRef<HTMLButtonElement, BackToTopProps>(function BackToTop(
  { threshold, label = 'Back to top', dark = false, fixed = true, focusTarget = "main[tabindex='-1'], #main", className, onClick, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const limit = threshold ?? window.innerHeight * 2;
      setVisible(window.scrollY >= limit);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [threshold]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      const target = document.querySelector<HTMLElement>(focusTarget);
      target?.focus({ preventScroll: true });
    },
    [onClick, focusTarget],
  );

  return (
    <button
      ref={ref}
      type="button"
      className={cx('nv-btt', fixed && 'nv-btt-fixed', dark && 'nv-btt-dark', className)}
      aria-label={label}
      hidden={!visible}
      onClick={handleClick}
      {...rest}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
});
