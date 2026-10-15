import {
  Fragment,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

/** A link inside a submenu (and its mobile drawer twin). */
export interface SiteHeaderChild {
  /** Link title, Title Case: "dot.Bible App". */
  label: string;
  /** Destination URL. */
  href: string;
  /** One-line description shown under the title in the desktop submenu. */
  description?: string;
  /** Marks the link as the current page (`aria-current="page"`). @default false */
  current?: boolean;
}

/** One of the (max five) main links. Give it `children` to make it a submenu. */
export interface SiteHeaderNavItem {
  /** Visible label, a short Title Case noun: "About ISM". */
  label: string;
  /** Destination. Required for plain links. For a submenu it is the section's own page, shown as the first "overview" row. */
  href?: string;
  /** Submenu links. When present the item renders as a caret button that opens a panel. */
  children?: SiteHeaderChild[];
  /** Title of the first "overview" row of the submenu. @default the item's `label` */
  overviewLabel?: string;
  /** One-line description of the overview row. */
  overviewDescription?: string;
  /** Marks this link (or this submenu's section) as the current section: gradient underline and `aria-current="page"`. @default false */
  current?: boolean;
}

export interface SiteHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Main navigation, in order. Keep to five items; put new pages in a submenu. */
  navigation: SiteHeaderNavItem[];
  /**
   * Component used to render every internal link. Defaults to `'a'`.
   * Pass `next/link` (or any component that accepts `href`, `className`, `onClick` and `children`)
   * so client-side routing works.
   * @default "a"
   */
  linkComponent?: ElementType;
  /** Logo slot for the bar. Defaults to an `<img>` using `logoSrc`. The CSS inverts black artwork to white. */
  logo?: ReactNode;
  /** Logo slot for the top of the drawer. Defaults to a decorative `<img>` using `logoSrc`. */
  drawerLogo?: ReactNode;
  /** Path of the default logo image. @default "/ism/assets/logos/Logo%20Black.svg" */
  logoSrc?: string;
  /** Alt text of the default bar logo image. @default "ISM" */
  logoAlt?: string;
  /** Where the logo links to. @default "/" */
  logoHref?: string;
  /** Accessible name of the logo link. @default "International Scripture Ministries home" */
  logoLabel?: string;
  /** Slot for the Give button. Use a white pill: `<a className="btn btn-light btn-sm nv-give" href="/give">`. It is the only button in the bar. */
  give?: ReactNode;
  /** Slot placed before Give, for example a `LanguageSwitcher`. */
  languageSwitcher?: ReactNode;
  /** Slot for the drawer call-to-action area (`.nv-dcta`): "Give online" (`btn-primary btn-lg`) and "Partner with us" (`btn-outline-light btn-lg`). */
  drawerActions?: ReactNode;
  /** Text of the skip link. When omitted no skip link is rendered; render your own as the first focusable element. */
  skipLabel?: ReactNode;
  /** Target of the skip link. @default "#main" */
  skipHref?: string;
  /** Accessible name of the main `<nav>`. @default "Main" */
  navLabel?: string;
  /** Accessible name of the menu button. @default "Open menu" */
  openMenuLabel?: string;
  /** Accessible name of the drawer close button. @default "Close menu" */
  closeMenuLabel?: string;
  /** Accessible name of the drawer dialog. @default "Menu" */
  drawerLabel?: string;
  /** Controlled open state of the mobile drawer. */
  drawerOpen?: boolean;
  /** Initial open state of the drawer when uncontrolled. @default false */
  defaultDrawerOpen?: boolean;
  /** Called when the drawer wants to open or close. */
  onDrawerOpenChange?: (open: boolean) => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function Caret() {
  return <UiIcon name="chevron-down" size={16} className="nv-caret" />;
}

/**
 * The site-wide black header bar: logo, main links (submenus open on click and hover), Give pill and the mobile drawer.
 *
 * Links render through `linkComponent` (default `'a'`); pass `next/link` in Next.js.
 * Submenus close on Esc and outside click and return focus to their button. The drawer is a modal dialog:
 * focus is trapped, Esc and the scrim close it, body scroll is locked and focus returns to the menu button.
 */
export const SiteHeader = forwardRef<HTMLElement, SiteHeaderProps>(function SiteHeader(
  {
    navigation,
    linkComponent,
    logo,
    drawerLogo,
    logoSrc = '/ism/assets/logos/Logo%20Black.svg',
    logoAlt = 'ISM',
    logoHref = '/',
    logoLabel = 'International Scripture Ministries home',
    give,
    languageSwitcher,
    drawerActions,
    skipLabel,
    skipHref = '#main',
    navLabel = 'Main',
    openMenuLabel = 'Open menu',
    closeMenuLabel = 'Close menu',
    drawerLabel = 'Menu',
    drawerOpen,
    defaultDrawerOpen = false,
    onDrawerOpenChange,
    className,
    ...rest
  },
  ref,
) {
  const Link: ElementType = linkComponent ?? 'a';
  const uid = useId();
  const [scrolled, setScrolled] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const [openDrawerRow, setOpenDrawerRow] = useState<number | null>(null);
  const [drawerState, setDrawerState] = useState(defaultDrawerOpen);
  const isControlled = drawerOpen !== undefined;
  const drawerIsOpen = isControlled ? drawerOpen : drawerState;

  const barRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const subButtons = useRef<Array<HTMLButtonElement | null>>([]);

  const setDrawer = useCallback(
    (next: boolean) => {
      if (!isControlled) setDrawerState(next);
      onDrawerOpenChange?.(next);
    },
    [isControlled, onDrawerOpenChange],
  );

  // Scrolled shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Submenu: click outside and Esc
  useEffect(() => {
    if (openSub === null) return;
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenSub(null);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        const btn = subButtons.current[openSub];
        setOpenSub(null);
        btn?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [openSub]);

  // Drawer: scroll lock, initial focus, return focus
  useEffect(() => {
    if (!drawerIsOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const opener = burgerRef.current;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      opener?.focus();
    };
  }, [drawerIsOpen]);

  const onDrawerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setDrawer(false);
      return;
    }
    if (e.key !== 'Tab' || !drawerRef.current) return;
    const nodes = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => !n.hidden && n.offsetParent !== null);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !drawerRef.current.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !drawerRef.current.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  const logoNode = logo ?? <img src={logoSrc} alt={logoAlt} />;
  const drawerLogoNode = drawerLogo ?? <img src={logoSrc} alt="" />;

  return (
    <>
      {skipLabel ? (
        <a className="skip nv-skip" href={skipHref}>
          {skipLabel}
        </a>
      ) : null}
      <header ref={ref} className={cx('hdr', scrolled && 'is-scrolled', className)} {...rest}>
        <div className="nv-hdr-in" ref={barRef}>
          <Link className="nv-logo" href={logoHref} aria-label={logoLabel}>
            {logoNode}
          </Link>
          <nav className="nv-links ism-desk" aria-label={navLabel}>
            {navigation.map((item, i) => {
              const hasSub = !!item.children && item.children.length > 0;
              if (!hasSub) {
                return (
                  <Link key={i} className="navlink" href={item.href} aria-current={item.current ? 'page' : undefined}>
                    {item.label}
                  </Link>
                );
              }
              const open = openSub === i;
              const panelId = `${uid}-sub-${i}`;
              return (
                <span
                  key={i}
                  className="nv-sub-wrap"
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') setOpenSub(i);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType === 'mouse') setOpenSub((cur) => (cur === i ? null : cur));
                  }}
                >
                  <button
                    ref={(el) => {
                      subButtons.current[i] = el;
                    }}
                    className="navlink nv-has-sub"
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => setOpenSub(open ? null : i)}
                  >
                    {item.label}
                    <Caret />
                  </button>
                  <div className="nv-subpanel" id={panelId} hidden={!open}>
                    {item.href ? (
                      <Link className="nv-subitem nv-overview" href={item.href} onClick={() => setOpenSub(null)}>
                        <span className="nv-subitem-txt">
                          <span className="nv-subitem-t">{item.overviewLabel ?? item.label}</span>
                          {item.overviewDescription ? <span className="nv-subitem-d">{item.overviewDescription}</span> : null}
                        </span>
                        <span className="nv-subitem-go" aria-hidden="true">↗</span>
                      </Link>
                    ) : null}
                    {item.children!.map((child, j) => (
                      <Link
                        key={j}
                        className="nv-subitem"
                        href={child.href}
                        aria-current={child.current ? 'page' : undefined}
                        onClick={() => setOpenSub(null)}
                      >
                        <span className="nv-subitem-txt">
                          <span className="nv-subitem-t">{child.label}</span>
                          {child.description ? <span className="nv-subitem-d">{child.description}</span> : null}
                        </span>
                        <span className="nv-subitem-go" aria-hidden="true">↗</span>
                      </Link>
                    ))}
                  </div>
                </span>
              );
            })}
          </nav>
          <div className="nv-actions">
            {languageSwitcher}
            {give}
            <button
              ref={burgerRef}
              className="iconbtn nv-burger ism-burger"
              type="button"
              aria-label={openMenuLabel}
              aria-expanded={drawerIsOpen}
              aria-controls={`${uid}-drawer`}
              onClick={() => setDrawer(true)}
            >
              <UiIcon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>
      {drawerIsOpen ? (
        <>
          <div className="drawer-scrim" onClick={() => setDrawer(false)} />
          <div
            ref={drawerRef}
            className="drawer"
            id={`${uid}-drawer`}
            role="dialog"
            aria-modal="true"
            aria-label={drawerLabel}
            onKeyDown={onDrawerKeyDown}
          >
            <div className="nv-dtop">
              {drawerLogoNode}
              <button ref={closeRef} className="iconbtn" type="button" aria-label={closeMenuLabel} onClick={() => setDrawer(false)}>
                <UiIcon name="close" size={24} />
              </button>
            </div>
            {navigation.map((item, i) => {
              const hasSub = !!item.children && item.children.length > 0;
              if (!hasSub) {
                return (
                  <Link key={i} className="dlink" href={item.href} aria-current={item.current ? 'page' : undefined} onClick={() => setDrawer(false)}>
                    <span>{item.label}</span>
                    <span className="nv-dgo" aria-hidden="true">↗</span>
                  </Link>
                );
              }
              const open = openDrawerRow === i;
              const subId = `${uid}-d-${i}`;
              return (
                <Fragment key={i}>
                  <button
                    className="nv-dparent"
                    type="button"
                    aria-expanded={open}
                    aria-controls={subId}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={() => setOpenDrawerRow(open ? null : i)}
                  >
                    <span>{item.label}</span>
                    <Caret />
                  </button>
                  <div className="nv-dsub" id={subId} hidden={!open}>
                    {item.href ? (
                      <Link href={item.href} onClick={() => setDrawer(false)}>
                        <span>{item.overviewLabel ?? item.label}</span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    ) : null}
                    {item.children!.map((child, j) => (
                      <Link key={j} href={child.href} aria-current={child.current ? 'page' : undefined} onClick={() => setDrawer(false)}>
                        <span>{child.label}</span>
                        <span aria-hidden="true">↗</span>
                      </Link>
                    ))}
                  </div>
                </Fragment>
              );
            })}
            {drawerActions ? <div className="nv-dcta">{drawerActions}</div> : null}
          </div>
        </>
      ) : null}
    </>
  );
});
