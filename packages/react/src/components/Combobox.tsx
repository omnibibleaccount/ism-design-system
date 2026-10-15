import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { FieldError, FieldHint, joinIds } from './Input';

export type ComboboxVariant = 'form' | 'hero';

export interface ComboboxOption {
  /** Value reported by `onValueChange`. */
  value: string;
  /** Primary text. For languages this is the native name (shown first and larger). */
  label: string;
  /** Secondary text under the label, for example the English name. Also searched. */
  sub?: string;
  /** Extra words to match against (alternate spellings, codes). Not displayed. */
  keywords?: string[];
  /** BCP-47 language tag of `label`, written to `lang` (for example `"am"`). */
  lang?: string;
}

export interface ComboboxHeadInfo {
  /** Number of options in the list. */
  total: number;
  /** Number of options matching the typed text. */
  matches: number;
  /** True when the list is filtered by typed text. */
  filtering: boolean;
}

export interface ComboboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'onSelect' | 'type' | 'size' | 'children'
  > {
  /** Visible label. */
  label: ReactNode;
  /** The list to search. */
  options: ComboboxOption[];
  /** `form` is the 48px field for forms; `hero` is the 64px homepage directory search (one per page). @default "form" */
  variant?: ComboboxVariant;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value when uncontrolled. @default "" */
  defaultValue?: string;
  /** Called with the picked option's value. */
  onValueChange?: (value: string) => void;
  /** Called with the picked option. Use it in the hero to navigate to the chosen item. */
  onSelectOption?: (option: ComboboxOption) => void;
  /** Hint under the field (form variant). Replaced by `error`. */
  hint?: ReactNode;
  /** Error message (form variant). Sets `aria-invalid="true"` and links the message. */
  error?: ReactNode;
  /** Accessible name of the caret button. @default "Show all options" */
  showAllLabel?: string;
  /** Accessible name of the listbox. @default "Options" */
  listLabel?: string;
  /** Accessible name of the hero `<form role="search">`. */
  searchLabel?: string;
  /** Text of the list head and the polite match-count announcement. @default "All · N" / "N matches" / "1 match" (English) */
  formatHead?: (info: ComboboxHeadInfo) => string;
  /** Content shown when nothing matches. Receives the typed text. @default `No match for “text”.` */
  emptyText?: (query: string) => ReactNode;
  /** Extra content after the empty text in the hero, for example a "Browse every language ↗" link. */
  emptyAction?: ReactNode;
  /** Trailing text on hero rows. Hero rows leave the page when picked. @default "Open ↗" */
  goLabel?: ReactNode;
  /** Class on the outer wrapper (`.field` or `.fm-dir`). `className` goes on the input. */
  wrapperClassName?: string;
}

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

const defaultHead = ({ total, matches, filtering }: ComboboxHeadInfo) =>
  filtering ? (matches === 1 ? '1 match' : `${matches} matches`) : `All · ${total}`;

/**
 * Search field joined to a dropdown list. Type to filter (native and English names, ignoring accents and case)
 * or press the caret to see every option.
 * Keys: typing or focus opens; Down/Up move the active row (`aria-activedescendant`); Home/End jump
 * (when open); Enter picks the active row or the first match; Esc closes and keeps focus in the input.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    options,
    variant = 'form',
    value: valueProp,
    defaultValue = '',
    onValueChange,
    onSelectOption,
    hint,
    error,
    showAllLabel = 'Show all options',
    listLabel = 'Options',
    searchLabel,
    formatHead = defaultHead,
    emptyText = (q) => `No match for “${q}”.`,
    emptyAction,
    goLabel = 'Open ↗',
    wrapperClassName,
    className,
    id,
    placeholder,
    disabled,
    onFocus,
    onBlur,
    onKeyDown,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref,
) {
  const hero = variant === 'hero';
  const auto = useId();
  const inputId = id ?? `${auto}-combo`;
  const listId = `${inputId}-list`;
  const msgId = `${inputId}-msg`;
  const optId = (i: number) => `${inputId}-opt-${i}`;

  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const filtering = query.trim() !== '' && !showAll;
  const filtered = useMemo(() => {
    if (!filtering) return options;
    const q = norm(query);
    return options.filter((o) => [o.label, o.sub ?? '', ...(o.keywords ?? [])].some((s) => norm(s).includes(q)));
  }, [options, query, filtering]);

  const head = formatHead({ total: options.length, matches: filtered.length, filtering });
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (open && active >= 0) document.getElementById(optId(active))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  const openList = (at = -1) => {
    setOpen(true);
    setActive(at);
  };
  const close = () => {
    setOpen(false);
    setActive(-1);
  };
  const pick = (o: ComboboxOption) => {
    if (!controlled) setInner(o.value);
    onValueChange?.(o.value);
    onSelectOption?.(o);
    setQuery('');
    setShowAll(false);
    close();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowAll(false);
    openList(e.target.value.trim() ? 0 : -1);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const n = filtered.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) openList(n ? 0 : -1);
        else if (n) setActive((a) => (a + 1) % n);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openList(n ? n - 1 : -1);
        else if (n) setActive((a) => (a <= 0 ? n - 1 : a - 1));
        break;
      case 'Home':
        if (open && n) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case 'End':
        if (open && n) {
          e.preventDefault();
          setActive(n - 1);
        }
        break;
      case 'Enter':
        if (open) {
          e.preventDefault();
          const o = filtered[active >= 0 ? active : 0];
          if (o) pick(o);
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          close();
        } else if (query) {
          e.preventDefault();
          setQuery('');
        }
        break;
      case 'Tab':
        close();
        break;
    }
  };

  const hasError = !hero && Boolean(error);
  const hasHint = !hero && !hasError && Boolean(hint);
  const placeholderText = !hero && selected ? (selected.sub ? `${selected.label} · ${selected.sub}` : selected.label) : placeholder;

  const input = (
    <input
      ref={setRefs}
      id={inputId}
      type="search"
      role="combobox"
      className={cx('input', hero && 'fm-dir-input', className)}
      autoComplete="off"
      aria-expanded={open}
      aria-controls={listId}
      aria-autocomplete="list"
      aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
      aria-invalid={hasError ? true : undefined}
      aria-describedby={joinIds(describedByProp, (hasError || hasHint) && msgId)}
      placeholder={placeholderText}
      disabled={disabled}
      value={query}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={(e) => {
        onFocus?.(e);
        if (!disabled) openList(filtering && filtered.length ? 0 : -1);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        close();
      }}
      {...rest}
    />
  );

  const caret = (
    <button
      type="button"
      className={hero ? 'fm-dir-caret' : 'fm-combo-caret'}
      aria-label={showAllLabel}
      aria-expanded={open}
      aria-controls={listId}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        inputRef.current?.focus();
        if (open && showAll) close();
        else {
          setShowAll(true);
          openList(-1);
        }
      }}
    >
      <UiIcon name="chevron-down" size={hero ? 20 : 18} />
    </button>
  );

  const live = (
    <div className="fm-vh" role="status" aria-live="polite">
      {open ? head : ''}
    </div>
  );

  if (hero) {
    return (
      <form
        className={cx('fm-dir', wrapperClassName)}
        role="search"
        aria-label={searchLabel}
        onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
      >
        <label className="label" htmlFor={inputId}>
          {label}
        </label>
        <div className="fm-dir-box">
          <UiIcon className="fm-dir-icon" name="search" size={22} />
          {input}
          {caret}
        </div>
        <div id={listId} className="fm-dir-results" role="listbox" aria-label={listLabel} hidden={!open}>
          <div className="fm-dir-head" aria-hidden="true">
            {head}
          </div>
          {filtered.map((o, i) => (
            <button
              key={o.value}
              id={optId(i)}
              type="button"
              tabIndex={-1}
              role="option"
              className={cx('fm-dir-option', i === active && 'fm-active')}
              aria-selected={o.value === value}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => active !== i && setActive(i)}
              onClick={() => pick(o)}
            >
              <span className="fm-dir-name">
                <span className="fm-dir-native" lang={o.lang}>
                  {o.label}
                </span>
                {o.sub ? <span className="fm-dir-eng">{o.sub}</span> : null}
              </span>
              <span className="fm-dir-go" aria-hidden="true">
                {goLabel}
              </span>
            </button>
          ))}
          {filtered.length === 0 ? (
            <div className="fm-dir-empty">
              {emptyText(query)}
              {emptyAction ? <> {emptyAction}</> : null}
            </div>
          ) : null}
        </div>
        {live}
      </form>
    );
  }

  return (
    <div className={cx('field', wrapperClassName)}>
      <label className={cx('label', disabled && 'cr-label-off')} htmlFor={inputId}>
        {label}
      </label>
      <div className="fm-sf fm-combo">
        <UiIcon className="fm-sf-icon" name="search" size={18} />
        {input}
        {caret}
      </div>
      <div className="fm-combo-anchor">
        <div className="fm-menu fm-menu-float" id={listId} role="listbox" aria-label={listLabel} hidden={!open}>
          <div className="fm-menu-head" aria-hidden="true">
            {head}
          </div>
          {filtered.map((o, i) => (
            <button
              key={o.value}
              id={optId(i)}
              type="button"
              tabIndex={-1}
              role="option"
              className={cx('fm-opt', i === active && 'fm-active')}
              aria-selected={o.value === value}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => active !== i && setActive(i)}
              onClick={() => pick(o)}
            >
              {o.sub ? (
                <span className="fm-opt-two">
                  <span lang={o.lang}>{o.label}</span>
                  <span className="fm-opt-sub">{o.sub}</span>
                </span>
              ) : (
                <span lang={o.lang}>{o.label}</span>
              )}
              {o.value === value ? <UiIcon className="fm-opt-tick" name="check" size={16} strokeWidth={2.4} /> : null}
            </button>
          ))}
          {filtered.length === 0 ? <div className="fm-menu-empty">{emptyText(query)}</div> : null}
        </div>
      </div>
      {live}
      {hasError ? <FieldError id={msgId}>{error}</FieldError> : null}
      {hasHint ? <FieldHint id={msgId}>{hint}</FieldHint> : null}
    </div>
  );
});
