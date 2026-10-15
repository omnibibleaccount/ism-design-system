import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

/** Join several `aria-describedby` id lists, dropping empties. Returns `undefined` when nothing is left. */
export function joinIds(...ids: Array<string | number | bigint | false | null | undefined>): string | undefined {
  const out = ids.filter(Boolean).join(' ');
  return out || undefined;
}

/** Props shared by the text-like field wrappers (Input, Textarea, SearchField, Select, Combobox). */
export interface FieldMessageProps {
  /** Id of the element; used by `aria-describedby`. */
  id: string;
  /** Message text. */
  children: ReactNode;
}

/** Error line (`.err`) with an icon, so the state is never colour alone. */
export function FieldError({ id, children }: FieldMessageProps) {
  return (
    <p className="err" id={id}>
      <UiIcon name="alert-circle" size={16} />
      <span>{children}</span>
    </p>
  );
}

/** Success line (`.cr-ok-msg`) with a tick. Only for checks that really ran. */
export function FieldSuccess({ id, children }: FieldMessageProps) {
  return (
    <p className="cr-ok-msg" id={id}>
      <UiIcon name="check" size={16} />
      <span>{children}</span>
    </p>
  );
}

/** Hint line (`.hint`). */
export function FieldHint({ id, children }: FieldMessageProps) {
  return (
    <p className="hint" id={id}>
      {children}
    </p>
  );
}

interface FieldOwnProps {
  /** Visible label shown above the field. Always required: a placeholder is not a label. */
  label: ReactNode;
  /** Hint under the field. Shown only when there is no error or success message. */
  hint?: ReactNode;
  /** Error message. Sets `aria-invalid="true"` and links the message with `aria-describedby`. Replaces the hint. */
  error?: ReactNode;
  /** Success message, shown only where a check really ran (for example a confirmed email). Adds a tick inside the field. */
  success?: ReactNode;
  /** Mark the field as optional by appending the `.opt` marker to the label. Most ISM forms are mostly required, so mark the fewer kind. @default false */
  optional?: boolean;
  /** Text of the optional marker. @default "(optional)" */
  optionalLabel?: ReactNode;
  /** Class on the outer `.field` wrapper. */
  fieldClassName?: string;
  /** Translucent field for `.sec-ink` and black surfaces. @default false */
  dark?: boolean;
}

export interface InputProps
  extends FieldOwnProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'children'> {
  /** Field size. `lg` (60px) is for the one or two big fields of a sign-up or give flow and also enlarges the label. @default "md" */
  size?: 'md' | 'lg';
  /** Adornment shown inside the start of the field, for example a currency symbol (renders the `.cr-amount` field, pair with `size="lg"`). Decorative. */
  prefix?: ReactNode;
  /** Input type: `email`, `tel`, `password`, … @default "text" */
  type?: string;
}

export interface TextareaProps
  extends FieldOwnProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {}

function Label({
  id,
  htmlFor,
  large,
  disabled,
  optional,
  optionalLabel,
  children,
}: {
  id: string;
  htmlFor: string;
  large?: boolean;
  disabled?: boolean;
  optional?: boolean;
  optionalLabel: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className={cx('label', large && 'cr-label-lg', disabled && 'cr-label-off')} id={id} htmlFor={htmlFor}>
      {children}
      {optional ? (
        <>
          {' '}
          <span className="opt">{optionalLabel}</span>
        </>
      ) : null}
    </label>
  );
}

/**
 * Rounded 48px text field with its label above and one line of hint, error or success below.
 * Wires `label`/`for`/`id`, `aria-describedby` and `aria-invalid`. Supports `disabled` and `readOnly` (lock icon).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    success,
    optional = false,
    optionalLabel = '(optional)',
    fieldClassName,
    dark = false,
    size = 'md',
    prefix,
    id,
    type = 'text',
    className,
    disabled,
    readOnly,
    'aria-describedby': describedByProp,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const inputId = id ?? `${auto}-input`;
  const msgId = `${inputId}-msg`;
  const hasError = Boolean(error);
  const hasSuccess = !hasError && Boolean(success);
  const hasHint = !hasError && !hasSuccess && Boolean(hint);
  const input = (
    <input
      ref={ref}
      id={inputId}
      type={type}
      className={cx(
        'input',
        size === 'lg' && 'input-lg',
        hasSuccess && 'cr-ok',
        readOnly && 'cr-ro',
        dark && 'fm-sub-input',
        className,
      )}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={hasError ? true : ariaInvalid}
      aria-describedby={joinIds(describedByProp, (hasError || hasSuccess || hasHint) && msgId)}
      {...rest}
    />
  );
  const adorn = readOnly ? (
    <span className="cr-adorn-end">
      <UiIcon name="lock" size={18} />
    </span>
  ) : hasSuccess ? (
    <span className="cr-adorn-end cr-ok-ic">
      <UiIcon name="check" size={18} />
    </span>
  ) : null;
  return (
    <div className={cx('field', fieldClassName)}>
      <Label
        id={`${inputId}-label`}
        htmlFor={inputId}
        large={size === 'lg'}
        disabled={disabled}
        optional={optional}
        optionalLabel={optionalLabel}
      >
        {label}
      </Label>
      {prefix ? (
        <div className="cr-amount">
          <span className="cr-amount-sym" aria-hidden="true">
            {prefix}
          </span>
          {input}
        </div>
      ) : adorn ? (
        <div className="cr-adorn">
          {input}
          {adorn}
        </div>
      ) : (
        input
      )}
      {hasError ? <FieldError id={msgId}>{error}</FieldError> : null}
      {hasSuccess ? <FieldSuccess id={msgId}>{success}</FieldSuccess> : null}
      {hasHint ? <FieldHint id={msgId}>{hint}</FieldHint> : null}
    </div>
  );
});

/** Multi-line text field (`<textarea class="input">`) for messages and prayer requests. Same label, hint and error wiring as Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    error,
    success,
    optional = false,
    optionalLabel = '(optional)',
    fieldClassName,
    dark = false,
    id,
    className,
    disabled,
    readOnly,
    'aria-describedby': describedByProp,
    'aria-invalid': ariaInvalid,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const inputId = id ?? `${auto}-input`;
  const msgId = `${inputId}-msg`;
  const hasError = Boolean(error);
  const hasSuccess = !hasError && Boolean(success);
  const hasHint = !hasError && !hasSuccess && Boolean(hint);
  return (
    <div className={cx('field', fieldClassName)}>
      <Label
        id={`${inputId}-label`}
        htmlFor={inputId}
        disabled={disabled}
        optional={optional}
        optionalLabel={optionalLabel}
      >
        {label}
      </Label>
      <textarea
        ref={ref}
        id={inputId}
        className={cx('input', hasSuccess && 'cr-ok', readOnly && 'cr-ro', dark && 'fm-sub-input', className)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={hasError ? true : ariaInvalid}
        aria-describedby={joinIds(describedByProp, (hasError || hasSuccess || hasHint) && msgId)}
        {...rest}
      />
      {hasError ? <FieldError id={msgId}>{error}</FieldError> : null}
      {hasSuccess ? <FieldSuccess id={msgId}>{success}</FieldSuccess> : null}
      {hasHint ? <FieldHint id={msgId}>{hint}</FieldHint> : null}
    </div>
  );
});
