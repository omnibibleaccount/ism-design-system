import { forwardRef, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export interface MultiSelectOption {
  /** Value reported in `onChange`. */
  value: string;
  /** English (or page-language) name, shown in the chip and first in the list row. */
  label: string;
  /** Native name shown on the right of the row, for example "Kiswahili". */
  native?: string;
  /** BCP 47 `lang` of the native name, for example "sw". Set it whenever `native` is in its own script. */
  nativeLang?: string;
}

export interface MultiSelectLabels {
  /** List head with the match count, for example (n) => `${n} matches`. */
  matches: (count: number) => ReactNode;
  /** Text when nothing matches, for example "No languages match. Try the English or native name." */
  empty: ReactNode;
  /** Accessible name of each chip's remove button. @default (label) => `Remove ${label}` */
  remove?: (label: string) => string;
  /** Accessible name of the caret button. @default "Show all options" */
  showAll?: string;
  /** Accessible name of the list. @default the `label` text when it is a string */
  list?: string;
  /** Polite announcement after adding. @default (label, count) => `${label} added, ${count} selected` */
  added?: (label: string, count: number) => string;
  /** Polite announcement after removing. @default (label, count) => `${label} removed, ${count} selected` */
  removed?: (label: string, count: number) => string;
}

export interface MultiSelectProps {
  /** Visible label. */
  label: ReactNode;
  /** All options, in list order. Selected options keep their place. */
  options: MultiSelectOption[];
  /** Selected values (controlled), in the order they were added. */
  value?: string[];
  /** Initially selected values (uncontrolled). */
  defaultValue?: string[];
  /** Called with the new list of values. */
  onChange?: (value: string[]) => void;
  /** Placeholder when nothing is selected, for example "Choose languages". */
  placeholder?: string;
  /** Placeholder once something is selected, for example "Add more". */
  placeholderMore?: string;
  /** Texts for the list and announcements. */
  labels: MultiSelectLabels;
  /** Tag such as "(optional)" shown after the label. */
  optionalText?: ReactNode;
  /** Helper text under the field, for example the selected count. Linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Error message under the field. Sets `aria-invalid` and the error shell. */
  error?: ReactNode;
  /** Disable the field. @default false */
  disabled?: boolean;
  /** Mark the input required. @default false */
  required?: boolean;
  /** Id of the combobox input. Generated when omitted. */
  id?: string;
  /** When set, one hidden input per value is rendered for native form posts. */
  name?: string;
  /** Extra class on the outer `.field`. */
  className?: string;
}

/**
 * Tag input with a type-to-filter checkbox list that stays open while picking.
 * Keys: type to filter, Up and Down move, Enter toggles, Backspace in the empty input removes the last chip,
 * Esc or Tab closes. Each chip has a real remove button. The ref points to the combobox input.
 */
export const MultiSelect = forwardRef<HTMLInputElement, MultiSelectProps>(function MultiSelect(
  { label, options, value, defaultValue = [], onChange, placeholder, placeholderMore, labels, optionalText, hint, error, disabled, required, id, name, className },
  ref,
) {
  const auto = useId();
  const fid = id ?? `${auto}-ms`;
  const listId = `${fid}-list`;
  const hintId = `${fid}-hint`;
  const errId = `${fid}-err`;
  const [inner, setInner] = useState<string[]>(defaultValue);
  const selected = value ?? inner;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement | null>(null);

  const q = query.trim().toLowerCase();
  const shown = options.filter((o) => !q || o.label.toLowerCase().includes(q) || (o.native ?? '').toLowerCase().includes(q));
  const byValue = (v: string) => options.find((o) => o.value === v);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const commit = (next: string[], changed: MultiSelectOption, added: boolean) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
    const fn = added ? (labels.added ?? ((l, c) => `${l} added, ${c} selected`)) : (labels.removed ?? ((l, c) => `${l} removed, ${c} selected`));
    setAnnounce(fn(changed.label, next.length));
  };
  const toggle = (o: MultiSelectOption) => {
    const has = selected.includes(o.value);
    commit(has ? selected.filter((v) => v !== o.value) : [...selected, o.value], o, !has);
  };
  const remove = (v: string) => {
    const o = byValue(v);
    if (o) commit(selected.filter((x) => x !== v), o, false);
    input.current?.focus();
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(shown.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      if (open && shown[active]) {
        e.preventDefault();
        toggle(shown[active]);
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        setOpen(false);
      }
    } else if (e.key === 'Tab') {
      setOpen(false);
    } else if (e.key === 'Backspace' && query === '' && selected.length) {
      remove(selected[selected.length - 1]);
    }
  };

  const ids = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;
  const listName = labels.list ?? (typeof label === 'string' ? label : undefined);
  const activeId = open && shown[active] ? `${listId}-o${active}` : undefined;
  const removeName = labels.remove ?? ((l: string) => `Remove ${l}`);

  return (
    <div className={cx('field', className)} ref={root}>
      <label className="label" htmlFor={fid}>
        {label}
        {optionalText ? <>{' '}<span className="opt">{optionalText}</span></> : null}
      </label>
      <div className="fm-sel">
        <div
          className={cx('fm-tags', open && 'fm-open', !!error && 'fm-err')}
          onMouseDown={(e) => {
            if (disabled || (e.target as HTMLElement).closest('button')) return;
            if (e.target !== input.current) {
              e.preventDefault();
              input.current?.focus();
            }
          }}
        >
          {selected.map((v) => {
            const o = byValue(v);
            if (!o) return null;
            return (
              <span className="fm-tag" key={v}>
                {o.label}
                <button className="fm-tag-x" type="button" disabled={disabled} aria-label={removeName(o.label)} onClick={() => remove(v)}>
                  <UiIcon name="close" size={14} />
                </button>
              </span>
            );
          })}
          <input
            ref={(el) => {
              input.current = el;
              if (typeof ref === 'function') ref(el);
              else if (ref) ref.current = el;
            }}
            className="fm-ti"
            id={fid}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={activeId}
            aria-invalid={error ? true : undefined}
            aria-describedby={ids}
            placeholder={selected.length ? placeholderMore : placeholder}
            disabled={disabled}
            required={required && selected.length === 0 ? true : undefined}
            value={query}
            onFocus={() => !disabled && setOpen(true)}
            onClick={() => !disabled && setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setOpen(true);
            }}
            onKeyDown={onKey}
          />
          <button
            className="fm-tags-caret"
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label={labels.showAll ?? 'Show all options'}
            aria-expanded={open}
            onClick={() => {
              setOpen(!open);
              input.current?.focus();
            }}
          >
            <UiIcon name="chevron-down" size={18} />
          </button>
        </div>
        {open ? (
          <div className="fm-menu fm-menu-float" id={listId} role="listbox" aria-multiselectable="true" aria-label={listName}>
            <div className="fm-menu-head">{labels.matches(shown.length)}</div>
            {shown.length === 0 ? <div className="fm-menu-empty">{labels.empty}</div> : null}
            {shown.map((o, i) => {
              const on = selected.includes(o.value);
              return (
                <button
                  key={o.value}
                  id={`${listId}-o${i}`}
                  className={cx('fm-o', i === active && 'fm-active')}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={on}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggle(o)}
                >
                  <span className="fm-mbox"><UiIcon name="check" size={14} /></span>
                  {o.label}
                  {o.native ? <span className="fm-dial" lang={o.nativeLang}>{o.native}</span> : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      {name ? selected.map((v) => <input key={v} type="hidden" name={name} value={v} />) : null}
      <div className="fm-vh" role="status" aria-live="polite">{announce}</div>
      {hint ? <p className="hint" id={hintId}>{hint}</p> : null}
      {error ? <p className="err" id={errId}>{error}</p> : null}
    </div>
  );
});
