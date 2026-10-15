import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { FieldError, joinIds } from './Input';

interface GroupContext {
  invalid: boolean;
  disabled: boolean;
}
const GroupCtx = createContext<GroupContext>({ invalid: false, disabled: false });

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'size'> {
  /** Label content. A short sentence for the inline form, a short noun for a row card. May contain links (they stay focusable). */
  children: ReactNode;
  /** Render as a full-width `.check` row card with a title (`children`) and an optional `description`. @default false */
  card?: boolean;
  /** One-line explanation under the title of a row card (`.hint` style). Also used as an inline hint after the label. */
  description?: ReactNode;
  /** Show the indeterminate state (a dash) and set `aria-checked="mixed"`. Say what it summarises in the label ("3 of 12"). @default false */
  indeterminate?: boolean;
  /** Error message shown directly under the checkbox. Sets `aria-invalid="true"` and links it with `aria-describedby`. For a group, use `CheckboxGroup error` instead. */
  error?: ReactNode;
}

/**
 * Real `<input type="checkbox">` wrapped in one `<label>` so the whole text is the 44px target.
 * Inline (`.fm-inline`) by default, or a row card (`.check`) with `card`. Space toggles.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    children,
    card = false,
    description,
    indeterminate = false,
    error,
    className,
    id,
    disabled: disabledProp,
    'aria-describedby': describedByProp,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const group = useContext(GroupCtx);
  const auto = useId();
  const inputId = id ?? `${auto}-cb`;
  const msgId = `${inputId}-err`;
  const disabled = disabledProp ?? group.disabled;
  const invalid = Boolean(error) || group.invalid;
  const inner = useRef<HTMLInputElement | null>(null);

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inner.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  useEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const box = (
    <input
      ref={setRefs}
      id={inputId}
      type="checkbox"
      className={cx('fm-check', className)}
      disabled={disabled}
      aria-checked={indeterminate ? 'mixed' : undefined}
      aria-invalid={invalid ? true : ariaInvalid}
      aria-describedby={joinIds(describedByProp, error ? msgId : undefined)}
      {...rest}
    />
  );
  const label = card ? (
    <label className={cx('check', disabled && 'fm-disabled')}>
      {box}
      <span className="fm-check-body">
        <span className="fm-check-t">{children}</span>
        {description ? <span className="hint">{description}</span> : null}
      </span>
    </label>
  ) : (
    <label className={cx('fm-inline', disabled && 'fm-disabled')}>
      {box}
      <span>
        {children}
        {description ? (
          <>
            {' '}
            <span className="hint">{description}</span>
          </>
        ) : null}
      </span>
    </label>
  );
  if (!error) return label;
  return (
    <>
      {label}
      <FieldError id={msgId}>{error}</FieldError>
    </>
  );
});

export interface CheckboxGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'> {
  /** The question the group answers. Rendered as the `<legend>`. */
  legend: ReactNode;
  /** The checkboxes. */
  children: ReactNode;
  /** Group error message under the options. Marks every checkbox `aria-invalid` and links the message from the fieldset. */
  error?: ReactNode;
  /** Stack the options with the gap used by row cards. Use with `<Checkbox card>`. @default false */
  cards?: boolean;
}

/** `<fieldset class="fm-fieldset">` with a `.fm-legend` question around related checkboxes or row cards. */
export const CheckboxGroup = forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(function CheckboxGroup(
  { legend, children, error, cards = false, className, id, disabled = false, 'aria-describedby': describedByProp, ...rest },
  ref,
) {
  const auto = useId();
  const errId = `${id ?? auto}-err`;
  return (
    <fieldset
      ref={ref}
      id={id}
      className={cx('fm-fieldset', className)}
      disabled={disabled}
      aria-describedby={joinIds(describedByProp, error ? errId : undefined)}
      {...rest}
    >
      <legend className="fm-legend">{legend}</legend>
      <GroupCtx.Provider value={{ invalid: Boolean(error), disabled }}>
        {cards ? <div className="field">{children}</div> : children}
      </GroupCtx.Provider>
      {error ? <FieldError id={errId}>{error}</FieldError> : null}
    </fieldset>
  );
});
