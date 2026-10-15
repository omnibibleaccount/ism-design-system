import { forwardRef, useId, useState, type FormEvent, type FormHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export interface InlineSubscribeProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  /** Called with the trimmed email once it passes validation. Return a promise to show the sending state. No network code is included. */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Visually hidden label text. @default "Email address" */
  label?: string;
  /** Input placeholder, an example and never the label. @default "you@example.com" */
  placeholder?: string;
  /** Submit button text; it is the consent action, for example "Subscribe". */
  buttonLabel: ReactNode;
  /** Reassurance line (frequency, unsubscribe) shown under the row while there is no error. */
  note?: ReactNode;
  /** Message when the field is empty on submit, for example "Please enter your email address." */
  emptyError: string;
  /** Message when the email is malformed, for example "Enter a valid email, like name@example.com." */
  invalidError: string;
  /** Text of the success state that replaces the form, for example "You're in. Watch for our next letter." */
  successMessage: ReactNode;
  /** Externally supplied error (for example from the server). Overrides internal validation text. */
  error?: string;
  /** Show the success state (controlled). When omitted the component switches itself after a successful submit. */
  done?: boolean;
  /** Show the sending spinner and set `aria-disabled` on the button (controlled). */
  loading?: boolean;
  /** Initial email value. */
  defaultValue?: string;
  /** Field `name` for native form posts. @default "email" */
  name?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Single-row newsletter sign-up: 52px pill email field and Subscribe button. Validates on submit, then live
 * once an error shows. On dark sections place it inside `.on-dark` or `.sec-ink`; the CSS adapts.
 */
export const InlineSubscribe = forwardRef<HTMLFormElement, InlineSubscribeProps>(function InlineSubscribe(
  {
    onSubmit, label = 'Email address', placeholder = 'you@example.com', buttonLabel, note, emptyError,
    invalidError, successMessage, error, done, loading, defaultValue = '', name = 'email',
    className, ...rest
  },
  ref,
) {
  const id = useId();
  const [email, setEmail] = useState(defaultValue);
  const [msg, setMsg] = useState<string | null>(null);
  const [selfDone, setSelfDone] = useState(false);
  const [selfBusy, setSelfBusy] = useState(false);
  const validate = (v: string) => (v.trim() === '' ? emptyError : EMAIL.test(v.trim()) ? null : invalidError);
  const shown = error ?? msg;
  const busy = loading ?? selfBusy;
  const isDone = done ?? selfDone;

  if (isDone) {
    return (
      <div className="fm-sub-wrap">
        <p className="fm-sub-done" role="status">
          <UiIcon name="check-circle" size={20} />
          {successMessage}
        </p>
      </div>
    );
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const problem = validate(email);
    setMsg(problem);
    if (problem) return;
    setSelfBusy(true);
    try {
      await onSubmit?.(email.trim());
      setSelfDone(true);
    } catch {
      // The caller handles failures; pass `error` to show a message.
    } finally {
      setSelfBusy(false);
    }
  };

  const noteId = `${id}-msg`;
  return (
    <div className="fm-sub-wrap">
      <form ref={ref} className={cx('fm-sub', className)} noValidate onSubmit={submit} {...rest}>
        <label className="fm-vh" htmlFor={`${id}-email`}>{label}</label>
        <input
          className="input fm-sub-input"
          id={`${id}-email`}
          name={name}
          type="email"
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          aria-invalid={shown ? true : undefined}
          aria-describedby={shown || note ? noteId : undefined}
          onChange={(e) => {
            setEmail(e.target.value);
            if (msg) setMsg(validate(e.target.value));
          }}
        />
        <button className="btn btn-primary btn-lg" type="submit" aria-disabled={busy || undefined} aria-busy={busy || undefined}>
          {busy ? <span className="spin" aria-hidden="true" /> : null}
          {buttonLabel}
        </button>
      </form>
      {shown ? (
        <p className="err fm-sub-err" id={noteId}>
          <UiIcon name="alert-circle" size={16} />
          {shown}
        </p>
      ) : note ? (
        <p className="fm-sub-note" id={noteId}>{note}</p>
      ) : null}
    </div>
  );
});
