import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { FieldError, joinIds } from './Input';

interface RadioGroupContext {
  name: string;
  value: string | undefined;
  onSelect: (value: string, e: ChangeEvent<HTMLInputElement>) => void;
  invalid: boolean;
  disabled: boolean;
  required: boolean;
}
const GroupCtx = createContext<RadioGroupContext | null>(null);

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children' | 'size'> {
  /** Label text. Short and parallel with the other options. */
  children: ReactNode;
  /** Value of this option. Required inside a `RadioGroup`. */
  value?: string;
  /** Render as a full-width `.check` row card; `children` becomes the title. @default false */
  card?: boolean;
  /** One-line explanation. In a card it sits under the title; in a plain row it follows the label (for example "(coming soon)" on a disabled option). */
  description?: ReactNode;
}

/**
 * 20px radio with a 6px Horizon Blue ring when selected, in a 44px clickable row.
 * Use inside `RadioGroup` (same `name`, arrow keys move and select, Tab enters and leaves).
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { children, card = false, description, className, value, disabled: disabledProp, checked, onChange, name, ...rest },
  ref,
) {
  const group = useContext(GroupCtx);
  const disabled = disabledProp ?? group?.disabled;
  const input = (
    <input
      ref={ref}
      type="radio"
      className={cx('fm-radio', className)}
      value={value}
      name={group ? group.name : name}
      disabled={disabled}
      required={group?.required || rest.required}
      aria-invalid={group?.invalid ? true : undefined}
      {...(group
        ? {
            checked: group.value === value,
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              onChange?.(e);
              if (value !== undefined) group.onSelect(value, e);
            },
          }
        : { checked, onChange })}
      {...rest}
    />
  );
  if (card) {
    return (
      <label className={cx('check', disabled && 'fm-disabled')}>
        {input}
        <span className="fm-check-body">
          <span className="fm-check-t">{children}</span>
          {description ? <span className="hint">{description}</span> : null}
        </span>
      </label>
    );
  }
  return (
    <label className={cx('fm-row', disabled && 'fm-disabled')}>
      {input}
      {children}
      {description ? (
        <>
          {' '}
          <span className="hint">{description}</span>
        </>
      ) : null}
    </label>
  );
});

export interface RadioGroupProps
  extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children' | 'onChange' | 'defaultValue'> {
  /** The question the group answers, rendered as the `<legend>`. */
  legend: ReactNode;
  /** The `Radio` options. */
  children: ReactNode;
  /** Shared `name` of every radio. Generated when omitted. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial selected value when uncontrolled. Never pre-select in surveys. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** One error message for the whole group. Marks every radio `aria-invalid` and links the message from the fieldset. */
  error?: ReactNode;
  /** Require a choice (`required` on each radio). @default false */
  required?: boolean;
  /** Lay out short options in three columns (`.fm-radios`) instead of stacking them. @default false */
  horizontal?: boolean;
  /** Stack the options with the gap used by row cards. Use with `<Radio card>`. @default false */
  cards?: boolean;
}

/** `<fieldset class="fm-fieldset">` + `.fm-legend` around radios that share a name. */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    legend,
    children,
    name,
    value: valueProp,
    defaultValue,
    onValueChange,
    error,
    required = false,
    horizontal = false,
    cards = false,
    disabled = false,
    className,
    id,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const errId = `${id ?? auto}-err`;
  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;
  const ctx: RadioGroupContext = {
    name: name ?? `${auto}-radio`,
    value,
    onSelect: (v) => {
      if (!controlled) setInner(v);
      onValueChange?.(v);
    },
    invalid: Boolean(error),
    disabled,
    required,
  };
  const body = horizontal ? <div className="fm-radios">{children}</div> : cards ? <div className="field">{children}</div> : children;
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
      <GroupCtx.Provider value={ctx}>{body}</GroupCtx.Provider>
      {error ? <FieldError id={errId}>{error}</FieldError> : null}
    </fieldset>
  );
});
