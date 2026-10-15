import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface CtaBandColumn {
  /** Column title (h3). */
  title: ReactNode;
  /** One sentence. No links inside. */
  text: ReactNode;
}

const NUMERAL_CLASS = ['', 'dp-ctaband-n-gold', 'dp-ctaband-n-violet'];

export interface CtaBandProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow label, for example "Join the Mission". */
  eyebrow?: ReactNode;
  /** Headline (h2). Wrap one word in `<span className="em">`. */
  title: ReactNode;
  /** Two buttons: a `solidWhite` and an `outlineDark`, both size lg. */
  actions?: ReactNode;
  /** Exactly three columns; numerals cycle sky blue, gold, violet. */
  columns: [CtaBandColumn, CtaBandColumn, CtaBandColumn] | CtaBandColumn[];
  /** Id of the h2; generated when omitted. */
  headingId?: string;
}

/** Dark `.sec-ink` closing band with headline, two buttons and three numbered columns. Use once per page. */
export const CtaBand = forwardRef<HTMLElement, CtaBandProps>(function CtaBand(
  { eyebrow, title, actions, columns, headingId, className, ...rest },
  ref,
) {
  const autoId = useId();
  const hid = headingId ?? `ctaband-h-${autoId}`;
  return (
    <section ref={ref} className={cx('sec-ink', 'dp-ctaband', className)} aria-labelledby={hid} {...rest}>
      <div className="dp-ctaband-head">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="h2" id={hid}>{title}</h2>
        {actions ? <div className="dp-ctaband-actions">{actions}</div> : null}
      </div>
      <ol className="dp-ctaband-cols" style={{ listStyle: 'none', margin: 0, paddingInlineStart: 0 }}>
        {columns.map((c, i) => (
          <li key={i} className="dp-ctaband-col">
            <span className={cx('dp-ctaband-n', NUMERAL_CLASS[i % 3])} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="h3">{c.title}</h3>
            <p className="dp-ctaband-text">{c.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
});
