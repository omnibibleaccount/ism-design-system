import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface CenteredCtaProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow label. */
  eyebrow?: ReactNode;
  /** Headline (h2), about 8 words. Wrap one word in `<span className="em">`. */
  title: ReactNode;
  /** Two buttons: one primary and one `outlineLight` `Button`. Never two blue buttons. */
  actions?: ReactNode;
  /** Id of the h2; generated when omitted. */
  headingId?: string;
}

/** Light centred call to action in a white card. One per page end. */
export const CenteredCta = forwardRef<HTMLElement, CenteredCtaProps>(function CenteredCta(
  { eyebrow, title, actions, headingId, className, ...rest },
  ref,
) {
  const autoId = useId();
  const hid = headingId ?? `ccta-h-${autoId}`;
  return (
    <section ref={ref} className={cx('dp-ccta', className)} aria-labelledby={hid} {...rest}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="h2 dp-ccta-title" id={hid}>{title}</h2>
      {actions ? <div className="dp-ccta-actions">{actions}</div> : null}
    </section>
  );
});

export interface CtaBannerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Question or prompt (h2 styled `.h3`). No `.em`. */
  title: ReactNode;
  /** One short supporting sentence. */
  text?: ReactNode;
  /** Exactly one `Button` (primary). */
  action: ReactNode;
  /** Id of the h2; generated when omitted. */
  headingId?: string;
}

/** Compact inline banner card: one question, one action. Rendered as an `<aside>`. */
export const CtaBanner = forwardRef<HTMLElement, CtaBannerProps>(function CtaBanner(
  { title, text, action, headingId, className, ...rest },
  ref,
) {
  const autoId = useId();
  const hid = headingId ?? `banner-h-${autoId}`;
  return (
    <aside ref={ref} className={cx('card', 'card-flat', 'dp-banner', className)} aria-labelledby={hid} {...rest}>
      <div className="dp-banner-text">
        <h2 className="h3" id={hid}>{title}</h2>
        {text ? <p className="muted small">{text}</p> : null}
      </div>
      {action}
    </aside>
  );
});
