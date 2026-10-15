import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { FieldError, FieldHint, joinIds } from './Input';

export interface SelectOption {
  /** Value reported by `onValueChange` and submitted under `name`. */
  value: string;
  /** Visible text of the option. Sentence case, a few words. */
  label: string;
  /** Disable this option: it is skipped by the arrow keys and cannot be picked. @default false */
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange' | 'children'> {
  /** Visible label shown above the field. */
  label: ReactNode;
  /** The fixed options (2 to 10 works best). */
  options: SelectOption[];
  /** Controlled value. Use `""` for "nothing chosen". */
  value?: string;
  /** Initial value when uncontrolled. @default "" */
  defaultValue?: string;
  /** Called with the picked value. */
  onValueChange?: (value: string) => void;
  /** Placeholder shown while nothing is chosen, for example "Choose a topic". */
  placeholder?: string;
  /** Hint under the field. Replaced by `error`. */
  hint?: ReactNode;
  /** Error message. Sets `aria-invalid="true"` on the trigger and links the message with `aria-describedby`. */
  error?: ReactNode;
  /** Mark the label with the optional marker. @default false */
  optional?: boolean;
  /** Text of the optional marker. @default "(optional)" */
  optionalLabel?: ReactNode;
  /** Marks the field as required (`aria-required`). @default false */
  required?: boolean;
  /** Form field name. When set, a hidden input submits the chosen value. */
  name?: string;
  /** Class on the outer `.field` wrapper. `className` goes on the trigger button. */
  fieldClassName?: string;
}

/**
 * Field-styled dropdown button that opens a listbox of fixed options. Focus stays on the trigger.
 * Keys: Enter / Space / Alt+Down / Down / Up open; Up, Down, Home, End move; typing jumps to a match;
 * Enter or Space picks; Esc closes; Tab or blur closes.
 */
export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    label,
    options,
    value: valueProp,
    defaultValue = '',
    onValueChange,
    placeholder,
    hint,
    error,
    optional = false,
    optionalLabel = '(optional)',
    required = false,
    name,
    fieldClassName,
    className,
    id,
    disabled,
    onKeyDown,
    onBlur,
    onClick,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const triggerId = id ?? `${auto}-sel`;
  const labelId = `${triggerId}-label`;
  const listId = `${triggerId}-list`;
  const msgId = `${triggerId}-msg`;
  const optId = (i: number) => `${triggerId}-opt-${i}`;

  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listRef = useRef<HTMLDivElement | null>(null);
  const typed = useRef({ text: '', timer: 0 as unknown as ReturnType<typeof setTimeout> });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const enabled = (i: number) => i >= 0 && i < options.length && !options[i].disabled;
  const step = (from: number, dir: 1 | -1) => {
    let i = from + dir;
    while (i >= 0 && i < options.length && !enabled(i)) i += dir;
    return enabled(i) ? i : from;
  };
  const firstEnabled = () => options.findIndex((o) => !o.disabled);
  const lastEnabled = () => {
    for (let i = options.length - 1; i >= 0; i--) if (!options[i].disabled) return i;
    return -1;
  };

  const openList = (at?: number) => {
    setOpen(true);
    setActive(at ?? (enabled(selectedIndex) ? selectedIndex : firstEnabled()));
  };
  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);
  const pick = (i: number) => {
    if (!enabled(i)) return;
    if (!controlled) setInner(options[i].value);
    onValueChange?.(options[i].value);
    close();
  };

  useEffect(() => {
    if (!open || active < 0) return;
    document.getElementById(optId(active))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  useEffect(() => {
    const t = typed.current;
    return () => clearTimeout(t.timer);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || disabled) return;
    const k = e.key;
    if (!open) {
      if (k === 'Enter' || k === ' ' || k === 'ArrowDown' || k === 'ArrowUp' || (k === 'ArrowDown' && e.altKey)) {
        e.preventDefault();
        openList();
      } else if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        typeahead(k, true);
      }
      return;
    }
    switch (k) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => (a < 0 ? firstEnabled() : step(a, 1)));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => (a < 0 ? lastEnabled() : step(a, -1)));
        break;
      case 'Home':
        e.preventDefault();
        setActive(firstEnabled());
        break;
      case 'End':
        e.preventDefault();
        setActive(lastEnabled());
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        pick(active);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
      default:
        if (k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          typeahead(k, false);
        }
    }
  };

  function typeahead(ch: string, whileClosed: boolean) {
    const t = typed.current;
    clearTimeout(t.timer);
    t.text += ch.toLowerCase();
    t.timer = setTimeout(() => {
      t.text = '';
    }, 700);
    const from = whileClosed ? selectedIndex : active;
    const order = options.map((_, i) => (i + (t.text.length === 1 ? from + 1 : Math.max(from, 0))) % options.length);
    const hit = order.find((i) => enabled(i) && options[i].label.toLowerCase().startsWith(t.text));
    if (hit === undefined) return;
    if (whileClosed) {
      if (!controlled) setInner(options[hit].value);
      onValueChange?.(options[hit].value);
    } else setActive(hit);
  }

  const hasError = Boolean(error);
  const hasHint = !hasError && Boolean(hint);

  return (
    <div className={cx('field', fieldClassName)}>
      <span
        className={cx('label', disabled && 'cr-label-off')}
        id={labelId}
        onClick={() => document.getElementById(triggerId)?.focus()}
      >
        {label}
        {optional ? (
          <>
            {' '}
            <span className="opt">{optionalLabel}</span>
          </>
        ) : null}
      </span>
      <div className="fm-sel">
        <button
          ref={ref}
          type="button"
          className={cx('input', 'fm-sel-btn', className)}
          id={triggerId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${labelId} ${triggerId}`}
          aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
          aria-required={required || undefined}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={joinIds(describedByProp, (hasError || hasHint) && msgId)}
          onKeyDown={handleKeyDown}
          onClick={(e) => {
            onClick?.(e);
            if (e.defaultPrevented) return;
            if (open) close();
            else openList();
          }}
          onBlur={(e) => {
            onBlur?.(e);
            close();
          }}
          {...rest}
        >
          {selected ? <span>{selected.label}</span> : <span className="fm-ph">{placeholder}</span>}
          <UiIcon name="chevron-down" size={18} />
        </button>
        <div
          className="fm-menu fm-menu-float"
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          ref={listRef}
          hidden={!open}
        >
          {options.map((o, i) => (
            <button
              key={o.value}
              id={optId(i)}
              type="button"
              tabIndex={-1}
              role="option"
              className={cx('fm-opt', open && i === active && 'fm-active')}
              aria-selected={i === selectedIndex}
              aria-disabled={o.disabled || undefined}
              onMouseDown={(e) => e.preventDefault()}
              onMouseMove={() => enabled(i) && active !== i && setActive(i)}
              onClick={() => pick(i)}
            >
              <span>{o.label}</span>
              {i === selectedIndex ? <UiIcon className="fm-opt-tick" name="check" size={16} strokeWidth={2.4} /> : null}
            </button>
          ))}
        </div>
        {name ? <input type="hidden" name={name} value={value} disabled={disabled} /> : null}
      </div>
      {hasError ? <FieldError id={msgId}>{error}</FieldError> : null}
      {hasHint ? <FieldHint id={msgId}>{hint}</FieldHint> : null}
    </div>
  );
});
