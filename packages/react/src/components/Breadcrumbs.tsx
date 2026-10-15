import { forwardRef, useEffect, useId, useRef, useState, type ElementType, type HTMLAttributes, Fragment } from 'react';
import { cx } from '../utils';

/** One level of the trail. */
export interface BreadcrumbItem {
  /** Page title in Title Case, as in the header: "About ISM". */
  label: string;
  /** Link target. Omit on the last item: the current page is plain text. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** The trail from "Home" down to the current page. The last item is the current page and is not linked. */
  items: BreadcrumbItem[];
  /**
   * Component used to render links. Defaults to `'a'`.
   * Pass `next/link` (or any component accepting `href`, `className` and `children`) for client-side routing.
   * @default "a"
   */
  linkComponent?: ElementType;
  /** Use on dark (`--black` / `--charcoal-900`) heroes. @default false */
  dark?: boolean;
  /** Trails longer than this fold the middle into a "…" menu, keeping the first item and the last two. @default 4 */
  maxItems?: number;
  /** Accessible name of the `<nav>`. @default "Breadcrumb" */
  label?: string;
  /** Builds the accessible name of the "…" button from the number of hidden levels. @default (n) => `Show ${n} more levels` */
  moreLabel?: (hiddenCount: number) => string;
}

/**
 * Breadcrumb trail for interior pages: `nav > ol.nv-bc`. The last item is `aria-current="page"` text.
 * Long trails fold into a "…" menu that closes on Esc and outside click and returns focus to its button.
 * Links render through `linkComponent` (default `'a'`; pass `next/link` in Next.js).
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, linkComponent, dark = false, maxItems = 4, label = 'Breadcrumb', moreLabel = (n) => `Show ${n} more levels`, className, ...rest },
  ref,
) {
  const Link: ElementType = linkComponent ?? 'a';
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const fold = items.length > maxItems;
  const first = fold ? [items[0]] : items.slice(0, -1);
  const hidden = fold ? items.slice(1, items.length - 2) : [];
  const tail = fold ? items.slice(items.length - 2, -1) : [];
  const current = items[items.length - 1];

  const crumb = (item: BreadcrumbItem, key: string) => (
    <li key={key}>
      {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
      <span className="nv-bc-sep" aria-hidden="true">/</span>
    </li>
  );

  return (
    <nav ref={ref} aria-label={label} className={className} {...rest}>
      <ol className={cx('nv-bc', dark && 'nv-bc-dark')}>
        {first.map((item, i) => crumb(item, `a${i}`))}
        {fold ? (
          <li ref={wrapRef}>
            <button
              ref={buttonRef}
              type="button"
              className="nv-bc-more"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={moreLabel(hidden.length)}
              onClick={() => setOpen(!open)}
            >
              …
            </button>
            <span className="nv-bc-sep" aria-hidden="true">/</span>
            <div className="nv-bc-menu" id={menuId} hidden={!open}>
              {hidden.map((item, i) => (
                <Fragment key={i}>
                  {item.href ? (
                    <Link href={item.href} onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </Fragment>
              ))}
            </div>
          </li>
        ) : null}
        {tail.map((item, i) => crumb(item, `t${i}`))}
        {current ? (
          <li>
            <span aria-current="page">{current.label}</span>
          </li>
        ) : null}
      </ol>
    </nav>
  );
});
