import { forwardRef, useEffect, useRef, useState, type ElementType, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../utils';

export type AnchorNavVariant = 'side' | 'bar';

/** One in-page link. */
export interface AnchorNavItem {
  /** Id of the section element the link points to (without `#`). */
  id: string;
  /** Link text. Identical to the section heading. */
  label: string;
}

export interface AnchorNavProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
  /** The sections, in page order. Maximum 8. */
  items: AnchorNavItem[];
  /** `side` is the sticky "On this page" list for long reading pages; `bar` is the sticky horizontal bar under the header. @default "side" */
  variant?: AnchorNavVariant;
  /** Visible heading of the side list ("On this page"). Side variant only. */
  heading?: ReactNode;
  /** Product name at the start of the bar ("dot.Bible App"). Bar variant only. */
  title?: ReactNode;
  /** Optional single action at the end of the bar, for example a `btn btn-primary btn-sm` link. Bar variant only. */
  action?: ReactNode;
  /** Accessible name of the `<nav>`. @default "On this page" */
  label?: string;
  /** Id of the active section (controlled). When omitted the active section follows the scroll position. */
  current?: string;
  /** Called when the section in view changes. */
  onCurrentChange?: (id: string) => void;
  /**
   * Component used to render links. Defaults to `'a'`.
   * Pass `next/link` (or any component accepting `href`, `className`, `onClick`, `aria-current` and `children`).
   * @default "a"
   */
  linkComponent?: ElementType;
  /** Height in px of the sticky offset used by the scroll spy (header plus bar). @default 140 */
  scrollOffset?: number;
}

/**
 * In-page navigation. The active item follows scroll position (IntersectionObserver) and is marked `aria-current="true"`.
 * On click the target heading receives focus (`tabindex="-1"`). Scrolling is a plain hash jump, so
 * `prefers-reduced-motion` is respected. Give sections `scroll-margin-top` of 96px (side) or 140px (bar).
 */
export const AnchorNav = forwardRef<HTMLDivElement, AnchorNavProps>(function AnchorNav(
  { items, variant = 'side', heading, title, action, label = 'On this page', current, onCurrentChange, linkComponent, scrollOffset = 140, className, ...rest },
  ref,
) {
  const Link: ElementType = linkComponent ?? 'a';
  const [spy, setSpy] = useState<string | undefined>(undefined);
  const [stuck, setStuck] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);
  const active = current ?? spy;
  const cb = useRef(onCurrentChange);
  cb.current = onCurrentChange;

  useEffect(() => {
    if (current !== undefined || typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) visible.add(en.target.id);
          else visible.delete(en.target.id);
        }
        const first = items.find((it) => visible.has(it.id));
        if (first) {
          setSpy(first.id);
          cb.current?.(first.id);
        }
      },
      { rootMargin: `-${scrollOffset}px 0px -55% 0px` },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items, current, scrollOffset]);

  useEffect(() => {
    if (variant !== 'bar') return;
    const onScroll = () => {
      const el = barRef.current;
      if (el) setStuck(el.getBoundingClientRect().top <= 73);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  const onClick = (id: string) => (_e: MouseEvent<HTMLAnchorElement>) => {
    // Let the hash jump happen, then move focus to the target for keyboard and screen reader users.
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }, 0);
  };

  if (variant === 'bar') {
    return (
      <div
        ref={(node) => {
          barRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={cx('nv-abar', stuck && 'nv-stuck', className)}
        {...rest}
      >
        {title ? <span className="nv-abar-title">{title}</span> : null}
        <nav className="nv-abar-links" aria-label={label}>
          {items.map((it) => (
            <Link key={it.id} className="nv-alink" href={`#${it.id}`} aria-current={active === it.id ? 'true' : undefined} onClick={onClick(it.id)}>
              {it.label}
            </Link>
          ))}
        </nav>
        {action}
      </div>
    );
  }

  return (
    <div ref={ref} className={cx('nv-otp-wrap', className)} {...rest}>
      <nav aria-label={label}>
        {heading ? <p className="overline nv-otp-h">{heading}</p> : null}
        <ul className="nv-otp">
          {items.map((it) => (
            <li key={it.id}>
              <Link href={`#${it.id}`} aria-current={active === it.id ? 'true' : undefined} onClick={onClick(it.id)}>
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
});
