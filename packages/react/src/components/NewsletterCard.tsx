import { forwardRef, useEffect, useId, useRef, useState, type FormEvent, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

/** Visible strings. Override for other languages. */
export interface NewsletterLabels {
  /** @default "Newsletter" */
  eyebrow: ReactNode;
  /** @default "Stories from the field, once a month." */
  title: ReactNode;
  /** @default "Answered prayers, new languages and ways to help. Short and worth reading." */
  lead: ReactNode;
  /** Label above the field. @default "Email" */
  emailLabel: ReactNode;
  /** An example, not the label. @default "you@example.com" */
  placeholder: string;
  /** @default "Enter an email like name@example.com." */
  error: ReactNode;
  /** @default "You’re in. Watch for our next letter." */
  success: ReactNode;
  /** @default "Subscribe" */
  submit: ReactNode;
  /** @default "Subscribing…" */
  submitting: ReactNode;
  /** Text before the privacy link. @default "No spam. Unsubscribe anytime." */
  note: ReactNode;
  /** Privacy link text. @default "Privacy" */
  privacy: ReactNode;
}

export const defaultNewsletterLabels: NewsletterLabels = {
  eyebrow: 'Newsletter',
  title: 'Stories from the field, once a month.',
  lead: 'Answered prayers, new languages and ways to help. Short and worth reading.',
  emailLabel: 'Email',
  placeholder: 'you@example.com',
  error: 'Enter an email like name@example.com.',
  success: 'You’re in. Watch for our next letter.',
  submit: 'Subscribe',
  submitting: 'Subscribing…',
  note: 'No spam. Unsubscribe anytime.',
  privacy: 'Privacy',
};

export interface NewsletterCardProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /**
   * Called with the email after it passes validation. May return a promise: the button shows the submitting
   * state until it resolves (then the success line shows) and stays on the form if it rejects. No network call
   * is made by this component.
   */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Force the submitting state (controlled). */
  submitting?: boolean;
  /** Force the success state (controlled). */
  success?: boolean;
  /** Force an error message state from outside (for example a server rejection). */
  invalid?: boolean;
  /** Privacy page URL. @default "/privacy" */
  privacyHref?: string;
  /** Override visible strings. */
  labels?: Partial<NewsletterLabels>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Dark email sign-up card: one field, one Subscribe button, validation on submit and a one-line confirmation. */
export const NewsletterCard = forwardRef<HTMLFormElement, NewsletterCardProps>(function NewsletterCard(
  { onSubmit, submitting: submittingProp, success: successProp, invalid: invalidProp, privacyHref = '/privacy', labels, className, ...rest },
  ref,
) {
  const l = { ...defaultNewsletterLabels, ...labels };
  const uid = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const okRef = useRef<HTMLParagraphElement>(null);
  const [email, setEmail] = useState('');
  const [invalidInner, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const invalid = invalidProp ?? invalidInner;
  const submitting = submittingProp ?? busy;
  const success = successProp ?? done;

  useEffect(() => {
    if (success) okRef.current?.focus();
  }, [success]);

  const handle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setInvalid(true);
      inputRef.current?.focus();
      return;
    }
    setInvalid(false);
    setBusy(true);
    try {
      await onSubmit?.(value);
      setDone(true);
    } catch {
      setInvalid(true);
      inputRef.current?.focus();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form ref={ref} className={cx('mn-nl on-dark', className)} noValidate onSubmit={handle} {...rest}>
      <span className="eyebrow">{l.eyebrow}</span>
      <h3 className="h3 mn-nl-title">{l.title}</h3>
      <p className="mn-nl-lead">{l.lead}</p>
      {success ? (
        <>
          <div className="mn-nl-rule" />
          <p className="mn-nl-ok" role="status" tabIndex={-1} ref={okRef}>
            <UiIcon name="check" size={18} />
            {l.success}
          </p>
        </>
      ) : (
        <>
          <div className="field">
            <label className="label" htmlFor={`${uid}-email`}>{l.emailLabel}</label>
            <input
              ref={inputRef}
              className="input"
              id={`${uid}-email`}
              type="email"
              autoComplete="email"
              placeholder={l.placeholder}
              value={email}
              aria-invalid={invalid || undefined}
              aria-describedby={`${uid}-err`}
              disabled={submitting}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="mn-nl-err" id={`${uid}-err`} hidden={!invalid}>{l.error}</span>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            style={{ width: '100%' }}
            disabled={submitting}
            aria-busy={submitting || undefined}
          >
            {submitting ? (<><span className="spin" aria-hidden="true" />{l.submitting}</>) : l.submit}
          </button>
          <p className="mn-nl-note">{l.note} <a href={privacyHref}>{l.privacy}</a></p>
        </>
      )}
    </form>
  );
});
