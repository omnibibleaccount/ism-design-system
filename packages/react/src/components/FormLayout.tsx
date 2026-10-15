import { forwardRef, useId, type FieldsetHTMLAttributes, type FormHTMLAttributes, type HTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

/** Props handed to the control inside a `FormField`. Spread them onto your `<input>`, `<textarea>` or `<select>`. */
export interface FormControlProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': true | undefined;
  required: boolean | undefined;
  disabled: boolean | undefined;
}

export interface FormLayoutProps extends FormHTMLAttributes<HTMLFormElement> {
  /** Accessible name of the form, for example "Become a church partner". */
  'aria-label'?: string;
  /** Sets, the validation summary and the actions row. */
  children?: ReactNode;
}

/** White card frame for longer forms. Always `noValidate`: errors are shown in the summary and inline. */
export const FormLayout = forwardRef<HTMLFormElement, FormLayoutProps>(function FormLayout({ className, children, ...rest }, ref) {
  return (
    <form ref={ref} className={cx('fm-form', className)} noValidate {...rest}>
      {children}
    </form>
  );
});

export interface FormSetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'> {
  /** Legend title, a plain noun such as "About you". */
  legend: ReactNode;
  /** One helper line under the legend title. */
  description?: ReactNode;
  /** Remove the top rule on the first set when no summary sits above it. @default false */
  first?: boolean;
  /** The set's `.field`s. Two per row; use `FormField full` for long fields. */
  children?: ReactNode;
}

/** Real `<fieldset>` with a legend column on the left and a two-column field grid on the right. */
export const FormSet = forwardRef<HTMLFieldSetElement, FormSetProps>(function FormSet(
  { legend, description, first = false, className, children, ...rest },
  ref,
) {
  return (
    <fieldset ref={ref} className={cx('fm-set', first && 'fm-first', className)} {...rest}>
      <legend>
        <span className="fm-set-lg">{legend}</span>
        {description ? <span className="fm-set-ld">{description}</span> : null}
      </legend>
      <div className="fm-cols">{children}</div>
    </fieldset>
  );
});

export interface FormFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Visible label text. */
  label: ReactNode;
  /** Id for the control. Generated when omitted. */
  id?: string;
  /** Show the "(optional)" tag (mark the fewer kind). Pass the tag text, for example "(optional)". */
  optionalText?: ReactNode;
  /** Mark required: sets `required` on the control and shows a red asterisk (hidden from assistive tech). @default false */
  required?: boolean;
  /** Helper text under the control, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Error message under the control. Sets `aria-invalid` and is linked with `aria-describedby`. */
  error?: ReactNode;
  /** Disable the control. @default false */
  disabled?: boolean;
  /** Span both field columns. @default false */
  full?: boolean;
  /** Extra id to include in `aria-describedby`, for example a `CharacterCount` id. */
  describedBy?: string;
  /** The control, or a render function that receives the wiring props to spread on it. */
  children: ReactNode | ((control: FormControlProps) => ReactNode);
}

/** A `.field` that wires label/for/id, hint and error (`aria-describedby`), `aria-invalid`, required and disabled. */
export function FormField({
  label, id, optionalText, required = false, hint, error, disabled, full = false, describedBy, className, children, ...rest
}: FormFieldProps) {
  const auto = useId();
  const fid = id ?? auto;
  const hintId = `${fid}-hint`;
  const errId = `${fid}-err`;
  const ids = [describedBy, hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ');
  const control: FormControlProps = {
    id: fid,
    'aria-describedby': ids || undefined,
    'aria-invalid': error ? true : undefined,
    required: required || undefined,
    disabled: disabled || undefined,
  };
  return (
    <div className={cx('field', full && 'fm-full', className)} {...rest}>
      <label className="label" htmlFor={fid}>
        {label}
        {required ? <span className="fm-req" aria-hidden="true">*</span> : null}
        {optionalText ? <>{' '}<span className="opt">{optionalText}</span></> : null}
      </label>
      {typeof children === 'function' ? children(control) : children}
      {hint ? <p className="hint" id={hintId}>{hint}</p> : null}
      {error ? <p className="err" id={errId}>{error}</p> : null}
    </div>
  );
}

export interface CharacterCountProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current length. */
  count: number;
  /** Limit. Typing is never blocked; the counter warns at 90% and flags over the limit. */
  max: number;
  /** Helper text on the left, for example "How has the Bible in your language helped?". */
  helper?: ReactNode;
  /** Id of the counter element; pass the same id in `FormField describedBy`. */
  counterId?: string;
  /** Format the counter text. Receives count, max and remaining characters (negative when over). @default `${count} / ${max}` */
  format?: (count: number, max: number, remaining: number) => ReactNode;
}

/** Character counter that sits under a textarea. A polite live region; debounce updates on the caller side. */
export function CharacterCount({ count, max, helper, counterId, format, className, ...rest }: CharacterCountProps) {
  const over = count > max;
  const warn = !over && count >= max * 0.9;
  const text = format ? format(count, max, max - count) : `${count} / ${max}`;
  return (
    <div className={cx('fm-count', className)} {...rest}>
      <span>{helper}</span>
      <span className={cx('fm-count-n', warn && 'fm-warn', over && 'fm-over')} id={counterId} aria-live="polite">{text}</span>
    </div>
  );
}

export interface FormSummaryItem {
  /** Id of the invalid field (without `#`). The link moves focus to it. */
  fieldId: string;
  /** Text such as "Email: enter a full email, like name@example.com", in page order. */
  message: ReactNode;
}

export interface FormSummaryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title such as "Please fix 3 things before sending". */
  title: ReactNode;
  /** One link per error, in page order. */
  items: FormSummaryItem[];
}

/** Validation summary (`role="alert"`, focusable). Focus it after a failed submit via its ref. */
export const FormSummary = forwardRef<HTMLDivElement, FormSummaryProps>(function FormSummary({ title, items, className, ...rest }, ref) {
  const go = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
    if (el) {
      e.preventDefault();
      el.focus();
    }
  };
  return (
    <div ref={ref} className={cx('alert fm-sum', className)} role="alert" tabIndex={-1} {...rest}>
      <span className="fm-sum-t">
        <UiIcon name="alert-circle" size={24} />
        {title}
      </span>
      <ul className="fm-sum-list">
        {items.map((it) => (
          <li key={it.fieldId}>
            <a href={`#${it.fieldId}`} onClick={(e) => go(e, it.fieldId)}>{it.message}</a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export interface FormChoiceGroupProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'> {
  /** Group legend. */
  legend: ReactNode;
  /** Lay the choices out in three columns (`.fm-radios`). @default false */
  columns?: boolean;
  /** Error under the group, linked with `aria-describedby`. */
  error?: ReactNode;
  /** The radios or checkboxes. */
  children?: ReactNode;
}

/** Nested choice group (radios, checkboxes) with its own `.fm-fieldset` and `.fm-legend`. */
export const FormChoiceGroup = forwardRef<HTMLFieldSetElement, FormChoiceGroupProps>(function FormChoiceGroup(
  { legend, columns = false, error, className, children, ...rest },
  ref,
) {
  const id = useId();
  return (
    <fieldset ref={ref} className={cx('fm-fieldset', 'field', 'fm-full', className)} aria-describedby={error ? `${id}-err` : undefined} {...rest}>
      <legend className="fm-legend">{legend}</legend>
      <div className={columns ? 'fm-radios' : undefined}>{children}</div>
      {error ? <p className="err" id={`${id}-err`}>{error}</p> : null}
    </fieldset>
  );
});

/** Row that holds the form's buttons: one Horizon Blue primary, the other secondary. */
export function FormActions({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('fm-actions', className)} {...rest} />;
}
