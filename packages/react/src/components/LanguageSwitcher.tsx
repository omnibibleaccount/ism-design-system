import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import type { Direction } from '../direction';

/** A language the site is available in. */
export interface SiteLanguage {
  /** Language code, for example "en", "am", "ur". Also used for the `lang` attribute and (uppercased) the button text. */
  code: string;
  /** English name ("Amharic"). Searchable, shown small under the native name. */
  name: string;
  /** Name in its own script ("አማርኛ"). Shown as the main row text. */
  nativeName: string;
  /** Reading direction of the language. RTL rows right-align and use the Naskh stack. @default "ltr" */
  dir?: Direction;
}

export type LanguageSwitcherPresentation = 'menu' | 'sheet';

interface LanguageCommon {
  /** The languages offered. Sort them: current first, then by readers on the site, not alphabetically. */
  languages: SiteLanguage[];
  /** Code of the current language. */
  value: string;
  /**
   * Called with the chosen language. The component never sets `html lang`/`dir`, cookies or routes itself:
   * do that here (or give `hrefFor` and let the link navigate).
   */
  onChange?: (language: SiteLanguage) => void;
  /** Builds the URL of the same page in another language. When omitted, rows are buttons. */
  hrefFor?: (language: SiteLanguage) => string;
  /**
   * Component used to render language links when `hrefFor` is given. Defaults to `'a'`.
   * Pass `next/link` (or any component accepting `href`, `className`, `onClick` and `children`).
   * @default "a"
   */
  linkComponent?: ElementType;
}

export interface LanguageSwitcherProps extends LanguageCommon, Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'children' | 'title'> {
  /** `menu` is the 320px dropdown under the header button; `sheet` is the full-width bottom sheet for phones. @default "menu" */
  presentation?: LanguageSwitcherPresentation;
  /** Show the search field. @default true when there are more than 8 languages */
  searchable?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the menu wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the button, built from the current language's name. @default (l) => `Language: ${l.name}` */
  buttonLabel?: (current: SiteLanguage) => string;
  /** Accessible name of the dialog. @default "Choose a language" */
  dialogLabel?: string;
  /** Visible heading above the list in the menu ("Site language"). */
  heading?: ReactNode;
  /** Visible title of the sheet ("Choose a language"). Falls back to `dialogLabel`. */
  title?: ReactNode;
  /** Placeholder of the search field ("Search languages"). */
  searchPlaceholder?: string;
  /** Accessible name of the search field. @default "Search languages" */
  searchLabel?: string;
  /** Accessible name of the language list. @default "Languages" */
  listLabel?: string;
  /** Accessible name of the sheet close button. @default "Close" */
  closeLabel?: string;
  /** Content of the empty-search message (announced with `role="status"`), for example "This site isn't in Oromo yet." plus a dot.Bible link. Receives the query. */
  renderEmpty?: (query: string) => ReactNode;
  /** Footer of the menu, for example "Scripture in 500+ languages" and a `dot.Bible ↗` link. */
  footer?: ReactNode;
}

const norm = (s: string) => s.toLocaleLowerCase();

/**
 * Header language picker: a globe button showing the 2-letter code that opens a searchable list of languages
 * written in their own script. Sets nothing globally; report the choice through `onChange` or `hrefFor`.
 *
 * Keyboard: focus starts in search (or the current row without search); Up/Down move through rows, Enter picks,
 * Esc closes and returns focus to the button. The `sheet` presentation is a modal dialog with a focus trap.
 * Rows carry `lang` (and `dir="rtl"`) so screen readers pronounce each name.
 */
export const LanguageSwitcher = forwardRef<HTMLSpanElement, LanguageSwitcherProps>(function LanguageSwitcher(
  {
    languages,
    value,
    onChange,
    hrefFor,
    linkComponent,
    presentation = 'menu',
    searchable,
    open,
    defaultOpen = false,
    onOpenChange,
    buttonLabel = (l) => `Language: ${l.name}`,
    dialogLabel = 'Choose a language',
    heading,
    title,
    searchPlaceholder,
    searchLabel = 'Search languages',
    listLabel = 'Languages',
    closeLabel = 'Close',
    renderEmpty,
    footer,
    className,
    ...rest
  },
  ref,
) {
  const Link: ElementType = linkComponent ?? 'a';
  const uid = useId();
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const isOpen = open ?? innerOpen;
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const showSearch = searchable ?? languages.length > 8;
  const sheet = presentation === 'sheet';
  const current = languages.find((l) => l.code === value) ?? languages[0];

  const setOpen = (next: boolean) => {
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  const results = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return languages;
    return languages.filter((l) => norm(l.name).includes(q) || norm(l.nativeName).includes(q) || norm(l.code).startsWith(q));
  }, [languages, query]);

  const options = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

  // Focus on open; close on outside click; scroll lock for the sheet; return focus on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      if (showSearch) searchRef.current?.focus();
      else (panelRef.current?.querySelector<HTMLElement>('[aria-selected="true"]') ?? options()[0])?.focus();
    } else {
      setQuery('');
      if (wasOpen.current) buttonRef.current?.focus();
      wasOpen.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!sheet && wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    let prev = '';
    if (sheet) {
      prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', onDown);
      if (sheet) document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sheet]);

  const choose = (lang: SiteLanguage) => {
    onChange?.(lang);
    setOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (e.key === 'Tab' && sheet && panelRef.current) {
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const opts = options();
    if (opts.length === 0) return;
    const i = opts.indexOf(document.activeElement as HTMLElement);
    e.preventDefault();
    if (e.key === 'ArrowDown') {
      opts[i < 0 ? 0 : Math.min(i + 1, opts.length - 1)].focus();
    } else if (i <= 0) {
      if (showSearch) searchRef.current?.focus();
    } else {
      opts[i - 1].focus();
    }
  };

  const rowClass = sheet ? 'nv-sheet-row' : 'nv-lopt';

  const row = (l: SiteLanguage) => {
    const selected = l.code === current?.code;
    const dir = l.dir === 'rtl' ? 'rtl' : undefined;
    const body = (
      <>
        <span>
          <span className="nv-nm">{l.nativeName}</span>
          <span className="nv-en" dir={dir ? 'ltr' : undefined} lang={dir ? 'en' : undefined}>{l.name}</span>
        </span>
        {selected ? <UiIcon name="check" className="nv-check" /> : null}
      </>
    );
    const common = { className: rowClass, role: 'option', 'aria-selected': selected, lang: l.code, dir };
    return hrefFor ? (
      <Link key={l.code} {...common} href={hrefFor(l)} onClick={() => choose(l)}>
        {body}
      </Link>
    ) : (
      <button key={l.code} {...common} type="button" onClick={() => choose(l)}>
        {body}
      </button>
    );
  };

  const search = showSearch ? (
    <div className="nv-lsearch">
      <UiIcon name="search" size={18} />
      <input
        ref={searchRef}
        className="input"
        type="search"
        value={query}
        placeholder={searchPlaceholder}
        aria-label={searchLabel}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && results[0]) {
            e.preventDefault();
            options()[0]?.click();
          }
        }}
      />
    </div>
  ) : null;

  const list = (
    <>
      <div className="nv-llist" role="listbox" aria-label={listLabel}>
        {results.map(row)}
      </div>
      <p className="nv-lempty" role="status" hidden={results.length > 0}>
        {results.length === 0 ? renderEmpty?.(query) : null}
      </p>
    </>
  );

  const panelId = `${uid}-lang`;

  return (
    <span
      ref={(node) => {
        wrapRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx('nv-lang-wrap', className)}
      {...rest}
    >
      <button
        ref={buttonRef}
        type="button"
        className="nv-langbtn"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-label={current ? buttonLabel(current) : undefined}
        onClick={() => setOpen(!isOpen)}
      >
        <UiIcon name="globe" className="nv-ico" size={18} />
        {current ? current.code.split('-')[0].toUpperCase() : null}
        <UiIcon name="chevron-down" size={16} className="nv-caret" />
      </button>
      {sheet ? (
        isOpen ? (
          <>
            <div className="drawer-scrim" onClick={() => setOpen(false)} />
            <div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="true"
              aria-label={dialogLabel}
              className="nv-sheet"
              style={{ position: 'fixed', insetInline: 0, bottom: 0, zIndex: 'var(--z-drawer)', maxHeight: '90vh' }}
              onKeyDown={onKeyDown}
            >
              <div className="nv-sheet-grip" />
              <div className="nv-sheet-head">
                <span className="nv-sheet-title">{title ?? dialogLabel}</span>
                <button type="button" className="nv-sheet-close" aria-label={closeLabel} onClick={() => setOpen(false)}>
                  <UiIcon name="close" />
                </button>
              </div>
              {search}
              {list}
              {footer ? <div className="nv-lfoot">{footer}</div> : null}
            </div>
          </>
        ) : null
      ) : (
        <div ref={panelRef} className="nv-langmenu" id={panelId} role="dialog" aria-label={dialogLabel} hidden={!isOpen} onKeyDown={onKeyDown}>
          {search}
          {heading ? <div className="overline nv-lhead">{heading}</div> : null}
          {list}
          {footer ? <div className="nv-lfoot">{footer}</div> : null}
        </div>
      )}
    </span>
  );
});

export interface LanguageInlineProps extends LanguageCommon, Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'children'> {
  /** How many languages to list before folding the rest behind the "More" button. @default 6 */
  visibleCount?: number;
  /** Text of the "More" button. When omitted (or when nothing is folded) no button is rendered. */
  moreLabel?: ReactNode;
  /** Accessible name of the `<nav>`. @default "Language" */
  label?: string;
}

/**
 * Footer inline language row (`nav.nv-finline`): the main languages as links, the current one white and
 * `aria-current="true"`, and a "More ⌄" button that reveals the rest. Sets nothing globally.
 */
export const LanguageInline = forwardRef<HTMLElement, LanguageInlineProps>(function LanguageInline(
  { languages, value, onChange, hrefFor, linkComponent, visibleCount = 6, moreLabel, label = 'Language', className, ...rest },
  ref,
) {
  const Link: ElementType = linkComponent ?? 'a';
  const [expanded, setExpanded] = useState(false);
  const folded = languages.length > visibleCount;
  const shown = expanded || !folded || !moreLabel ? languages : languages.slice(0, visibleCount);
  return (
    <nav ref={ref} className={cx('nv-finline', className)} aria-label={label} {...rest}>
      {shown.map((l) => {
        const props = { lang: l.code, dir: l.dir === 'rtl' ? 'rtl' : undefined, 'aria-current': l.code === value ? ('true' as const) : undefined };
        return hrefFor ? (
          <Link key={l.code} {...props} href={hrefFor(l)} onClick={() => onChange?.(l)}>
            {l.nativeName}
          </Link>
        ) : (
          <a key={l.code} {...props} href={`#${l.code}`} onClick={(e) => { e.preventDefault(); onChange?.(l); }}>
            {l.nativeName}
          </a>
        );
      })}
      {folded && moreLabel && !expanded ? (
        <button type="button" className="lnk nv-finline-more" aria-expanded={expanded} onClick={() => setExpanded(true)}>
          {moreLabel}
          <UiIcon name="chevron-down" size={16} className="nv-caret" />
        </button>
      ) : null}
    </nav>
  );
});
