import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export type NumberedListVariant = 'rows' | 'steps';

export interface NumberedListItem {
  /** Item title (a heading). Steps start with a verb. */
  title: ReactNode;
  /** One or two short sentences. */
  description?: ReactNode;
}

export interface NumberedListProps extends HTMLAttributes<HTMLOListElement> {
  /** `rows`: large two-digit numerals (01, 02) for programmes and beliefs. `steps`: compact circled digits for how-it-works. @default "rows" */
  variant?: NumberedListVariant;
  /** The items, in order. Keep to about six. */
  items: NumberedListItem[];
  /** Heading level of each item title, to fit the page outline. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Ordered list with visual numerals hidden from assistive tech (the `<ol>` provides the numbers). Static content. */
export const NumberedList = forwardRef<HTMLOListElement, NumberedListProps>(function NumberedList(
  { variant = 'rows', items, headingLevel = 3, className, ...rest },
  ref,
) {
  const Heading = `h${headingLevel}` as 'h3';
  const rows = variant === 'rows';
  return (
    <ol ref={ref} className={cx(rows ? 'dp-numlist' : 'dp-steps', className)} {...rest}>
      {items.map((item, i) => (
        <li key={i} className={rows ? 'dp-numlist-item' : 'dp-step'}>
          <span className={rows ? 'dp-numlist-n' : 'dp-step-n'} aria-hidden="true">
            {rows ? String(i + 1).padStart(2, '0') : i + 1}
          </span>
          <div className={rows ? 'dp-numlist-body' : 'dp-step-body'}>
            <Heading className={rows ? 'h3' : 'h4'}>{item.title}</Heading>
            {item.description ? <p className="muted">{item.description}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
});
