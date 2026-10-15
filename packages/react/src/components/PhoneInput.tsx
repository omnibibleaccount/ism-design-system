import {
  forwardRef, useEffect, useId, useMemo, useRef, useState, type InputHTMLAttributes, type KeyboardEvent, type ReactNode,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export interface PhoneCountry {
  /** Two-letter code shown in the flag tile, for example "US". Also the key. */
  code: string;
  /** Country name shown in the list and in the button's accessible name. */
  name: string;
  /** Dial code with a plus, for example "+1". */
  dial: string;
  /** Local example number for the placeholder, for example "(555) 123-4567". */
  placeholder?: string;
}

/** A small starter list. Pass your own `countries` (the list is data, not a requirement). */
export const defaultPhoneCountries: PhoneCountry[] = [
  { code: 'US', name: 'United States', dial: '+1', placeholder: '(555) 123-4567' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', placeholder: '07400 123456' },
  { code: 'IN', name: 'India', dial: '+91', placeholder: '81234 56789' },
  { code: 'NG', name: 'Nigeria', dial: '+234', placeholder: '802 123 4567' },
  { code: 'KE', name: 'Kenya', dial: '+254', placeholder: '712 123456' },
  { code: 'ET', name: 'Ethiopia', dial: '+251', placeholder: '91 123 4567' },
  { code: 'PH', name: 'Philippines', dial: '+63', placeholder: '917 123 4567' },
  { code: 'BR', name: 'Brazil', dial: '+55', placeholder: '(11) 91234-5678' },
];

export interface PhoneInputLabels {
  /** Visible placeholder of the search field, for example "Search countries". */
  search: string;
  /** Heading of the suggested group, for example "Suggested". */
  suggested: string;
  /** Heading of the full list, for example "All countries". */
  all: string;
  /** Text when nothing matches the search. */
  empty: string;
  /** Accessible name of the country list. @default "Country code" */
  list?: string;
  /** Accessible name of the country button. @default (name, dial) => `Country code: ${name} ${dial}` */
  countryButton?: (name: string, dial: string) => string;
}

export interface PhoneChange {
  /** The selected country. */
  country: PhoneCountry;
  /** The digits typed, without the dial code. */
  national: string;
}

export interface PhoneInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  /** Visible label. */
  label: ReactNode;
  /** Tag such as "(optional)" shown after the label. */
  optionalText?: ReactNode;
  /** Helper text under the field, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Error message under the field. Sets `aria-invalid` and the error shell. */
  error?: ReactNode;
  /** Texts for the country list. */
  labels: PhoneInputLabels;
  /** Countries offered. @default defaultPhoneCountries (8 entries) */
  countries?: PhoneCountry[];
  /** Codes (from `countries`) pinned in a "Suggested" group above the full list. */
  suggested?: string[];
  /** Show the search field. @default true when there are more than 10 countries */
  searchable?: boolean;
  /** Selected country code (controlled). */
  country?: string;
  /** Initial country code (uncontrolled). Never blank: falls back to the first country. */
  defaultCountry?: string;
  /** Called when the country changes. */
  onCountryChange?: (country: PhoneCountry) => void;
  /** Phone number in E.164, for example "+251911234567" (controlled). */
  value?: string;
  /** Initial E.164 number (uncontrolled). */
  defaultValue?: string;
  /** Called on every edit with the E.164 value (spaces, dashes and brackets stripped) and details. */
  onChange?: (e164: string, details: PhoneChange) => void;
  /** Disable the whole group. @default false */
  disabled?: boolean;
  /** Mark required (`required` on the number input). @default false */
  required?: boolean;
}

const digits = (s: string) => s.replace(/\D/g, '');

/**
 * Country-code button plus number input with a searchable country list. Typing accepts spaces, dashes and
 * brackets; the value reported is E.164. The ref points to the number input.
 * Keys on the list: type to search, Up and Down move, Enter picks and returns focus to the number, Esc closes.
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  {
    label, optionalText, hint, error, labels, countries = defaultPhoneCountries, suggested, searchable, country, defaultCountry,
    onCountryChange, value, defaultValue, onChange, disabled, required, id, className, placeholder, 'aria-describedby': describedBy, ...rest
  },
  ref,
) {
  const auto = useId();
  const fid = id ?? `${auto}-phone`;
  const hintId = `${fid}-hint`;
  const errId = `${fid}-err`;
  const listId = `${fid}-list`;
  const byCode = (c?: string) => countries.find((x) => x.code === c);

  const [innerCode, setInnerCode] = useState(() => byCode(defaultCountry)?.code ?? countries[0]?.code ?? '');
  const code = country ?? innerCode;
  const current = byCode(code) ?? countries[0];

  const [text, setText] = useState(() => {
    const v = value ?? defaultValue ?? '';
    return current && v.startsWith(current.dial) ? v.slice(current.dial.length) : v.replace(/^\+/, '');
  });
  // Keep the text in step with a controlled E.164 value that was changed from outside.
  useEffect(() => {
    if (value === undefined || !current) return;
    const own = current.dial + digits(text);
    if (value !== own) setText(value.startsWith(current.dial) ? value.slice(current.dial.length) : value.replace(/^\+/, ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, code]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const num = useRef<HTMLInputElement | null>(null);
  const menuFocus = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const showSearch = searchable ?? countries.length > 10;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (c: PhoneCountry) => !q || c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q);
    const pin = !q && suggested?.length ? suggested.map((s) => countries.find((c) => c.code === s)).filter((c): c is PhoneCountry => !!c) : [];
    return {
      pinned: pin,
      list: countries.filter(match),
    };
  }, [countries, suggested, query]);
  const flat = [...rows.pinned.map((c) => ({ c, key: `s-${c.code}` })), ...rows.list.map((c) => ({ c, key: `a-${c.code}` }))];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    (showSearch ? search.current : menuFocus.current)?.focus();
  }, [open, showSearch]);

  const emit = (t: string, c: PhoneCountry) => onChange?.(c.dial + digits(t), { country: c, national: digits(t) });

  const choose = (c: PhoneCountry) => {
    if (country === undefined) setInnerCode(c.code);
    onCountryChange?.(c);
    emit(text, c);
    setOpen(false);
    setQuery('');
    num.current?.focus();
  };

  const toggle = () => {
    if (disabled) return;
    if (!open) {
      setQuery('');
      const i = flat.findIndex((r) => r.c.code === current?.code);
      setActive(Math.max(0, i));
    }
    setOpen(!open);
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      btn.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(flat.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Home' && !showSearch) {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End' && !showSearch) {
      e.preventDefault();
      setActive(flat.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const r = flat[active];
      if (r) choose(r.c);
    } else if (e.key === 'Tab') {
      setOpen(false);
    } else if (!showSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Type-ahead when there is no search field.
      const q = e.key.toLowerCase();
      const i = flat.findIndex((r, n) => n > active && r.c.name.toLowerCase().startsWith(q));
      const j = i >= 0 ? i : flat.findIndex((r) => r.c.name.toLowerCase().startsWith(q));
      if (j >= 0) setActive(j);
    }
  };

  const ids = [describedBy, hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;
  const btnName = (labels.countryButton ?? ((n, d) => `Country code: ${n} ${d}`))(current?.name ?? '', current?.dial ?? '');
  const activeId = open && flat[active] ? `${listId}-${flat[active].key}` : undefined;

  const option = (c: PhoneCountry, key: string, idx: number) => {
    const selected = c.code === current?.code;
    return (
      <button
        key={key}
        id={`${listId}-${key}`}
        className={cx('fm-o', idx === active && 'fm-active')}
        type="button"
        role="option"
        tabIndex={-1}
        aria-selected={selected}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => choose(c)}
      >
        <span className="fm-tick">{selected ? <UiIcon name="check" size={16} /> : null}</span>
        <span className="fm-flag" aria-hidden="true">{c.code}</span>
        {c.name}
        <span className="fm-dial">{c.dial}</span>
      </button>
    );
  };

  return (
    <div className={cx('field', className)} ref={root}>
      <label className="label" htmlFor={fid}>
        {label}
        {optionalText ? <>{' '}<span className="opt">{optionalText}</span></> : null}
      </label>
      <div className="fm-sel">
        <div className={cx('fm-phone', !!error && 'fm-err')}>
          <button
            ref={btn}
            className="fm-cc"
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={btnName}
            onClick={toggle}
          >
            <span className="fm-flag" aria-hidden="true">{current?.code}</span>
            <span>{current?.dial}</span>
            <UiIcon name="chevron-down" size={16} />
          </button>
          <input
            {...rest}
            ref={(el) => {
              num.current = el;
              if (typeof ref === 'function') ref(el);
              else if (ref) ref.current = el;
            }}
            className="fm-num"
            id={fid}
            type="tel"
            autoComplete="tel-national"
            placeholder={placeholder ?? current?.placeholder}
            value={text}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={ids}
            onChange={(e) => {
              setText(e.target.value);
              if (current) emit(e.target.value, current);
            }}
          />
        </div>
        {open ? (
          <div
            className="fm-menu fm-menu-float"
            id={listId}
            role="listbox"
            aria-label={labels.list ?? 'Country code'}
            ref={menuFocus}
            tabIndex={showSearch ? undefined : -1}
            aria-activedescendant={showSearch ? undefined : activeId}
            onKeyDown={onMenuKey}
          >
            {showSearch ? (
              <div className="fm-menu-search">
                <input
                  ref={search}
                  className="input"
                  type="search"
                  placeholder={labels.search}
                  aria-label={labels.search}
                  aria-activedescendant={activeId}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                />
              </div>
            ) : null}
            {rows.pinned.length ? <div className="fm-menu-head">{labels.suggested}</div> : null}
            {rows.pinned.map((c, i) => option(c, `s-${c.code}`, i))}
            {rows.pinned.length ? <div className="fm-menu-head">{labels.all}</div> : null}
            {rows.list.map((c, i) => option(c, `a-${c.code}`, rows.pinned.length + i))}
            {flat.length === 0 ? <div className="fm-menu-empty">{labels.empty}</div> : null}
          </div>
        ) : null}
      </div>
      {hint ? <p className="hint" id={hintId}>{hint}</p> : null}
      {error ? <p className="err" id={errId}>{error}</p> : null}
    </div>
  );
});
