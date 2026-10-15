import {
  forwardRef,
  useCallback,
  useId,
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

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'defaultValue' | 'children'> {
  /** Visible label. Always give one; the placeholder is an example, not the label. */
  label: ReactNode;
  /** Hint under the field, for example "Press Enter to see results.". Replaced by `error`. */
  hint?: ReactNode;
  /** Error message (rare). Sets `aria-invalid="true"` and links it with `aria-describedby`. */
  error?: ReactNode;
  /** Controlled value. */
  value?: string;
  /** Initial value when uncontrolled. @default "" */
  defaultValue?: string;
  /** Called with the new text whenever it changes (typing, clear button, Esc). */
  onValueChange?: (value: string) => void;
  /** Called with the current text when the form is submitted (Enter). */
  onSearch?: (value: string) => void;
  /** Accessible name of the clear button. @default "Clear search" */
  clearLabel?: string;
  /** Class on the outer `<form role="search">`. `className` goes on the input. */
  formClassName?: string;
}

/**
 * 48px search input with a magnifier and a clear button that appears once there is text.
 * Renders `<form role="search" class="field">` so Enter submits; Esc clears; clearing returns focus to the input.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    label,
    hint,
    error,
    value: valueProp,
    defaultValue = '',
    onValueChange,
    onSearch,
    clearLabel = 'Clear search',
    formClassName,
    className,
    id,
    onChange,
    onKeyDown,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const inputId = id ?? `${auto}-q`;
  const msgId = `${inputId}-msg`;
  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const update = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };
  const clear = () => {
    update('');
    inputRef.current?.focus();
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    update(e.target.value);
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.key === 'Escape' && value && !e.defaultPrevented) {
      e.preventDefault();
      update('');
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch?.(value);
  };

  const hasError = Boolean(error);
  const hasHint = !hasError && Boolean(hint);

  return (
    <form className={cx('field', formClassName)} role="search" onSubmit={handleSubmit}>
      <label className="label" htmlFor={inputId}>
        {label}
      </label>
      <div className="fm-sf">
        <UiIcon className="fm-sf-icon" name="search" size={18} />
        <input
          ref={setRefs}
          className={cx('input', className)}
          id={inputId}
          type="search"
          autoComplete="off"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-invalid={hasError ? true : undefined}
          aria-describedby={joinIds(describedByProp, (hasError || hasHint) && msgId)}
          {...rest}
        />
        <button type="button" className="fm-sf-clear" aria-label={clearLabel} hidden={!value} onClick={clear}>
          <UiIcon name="close" size={14} />
        </button>
      </div>
      {hasError ? <FieldError id={msgId}>{error}</FieldError> : null}
      {hasHint ? <FieldHint id={msgId}>{hint}</FieldHint> : null}
    </form>
  );
});
