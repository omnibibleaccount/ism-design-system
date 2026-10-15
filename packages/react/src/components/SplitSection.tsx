import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface SplitSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Photo URL. Use a real ISM photo of people reading or listening. */
  imageSrc: string;
  /** Alt text saying what the photo shows. Use "" only if purely decorative. */
  imageAlt: string;
  /** Put the photo on the right (text left). The photo stays first in the DOM so mobile stacks image-then-text. @default false */
  reverse?: boolean;
  /** Eyebrow label (the section name). */
  eyebrow?: ReactNode;
  /** Headline, rendered as `<h2>`. At most about 10 words; wrap one word in `<span className="em">`. */
  title: ReactNode;
  /** One or two sentence lead. */
  lead?: ReactNode;
  /** At most two actions: a secondary and a ghost `Button`. */
  actions?: ReactNode;
  /** Id of the h2; generated when omitted. */
  headingId?: string;
}

/** Two-column section pairing one photo with a short story. Alternate `reverse` down a page. */
export const SplitSection = forwardRef<HTMLElement, SplitSectionProps>(function SplitSection(
  { imageSrc, imageAlt, reverse = false, eyebrow, title, lead, actions, headingId, className, children, ...rest },
  ref,
) {
  const autoId = useId();
  const hid = headingId ?? `split-h-${autoId}`;
  return (
    <section ref={ref} className={cx('dp-split', reverse && 'dp-split-rev', className)} aria-labelledby={hid} {...rest}>
      <div className="media dp-split-media">
        <img className="photo" src={imageSrc} alt={imageAlt} />
      </div>
      <div className="dp-split-body">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2 className="h2" id={hid}>{title}</h2>
        {lead ? <p className="lead">{lead}</p> : null}
        {actions ? <div className="dp-split-actions">{actions}</div> : null}
        {children}
      </div>
    </section>
  );
});
