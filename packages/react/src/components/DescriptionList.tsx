import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface DescriptionItem {
  /** Term or key: a short noun in sentence case ("Order number"). */
  term: ReactNode;
  /** Description or value. Can hold a badge or a small link. */
  description: ReactNode;
  /** Set money and IDs in tabular figures (`.dp-num`). Key-value only. @default false */
  numeric?: boolean;
  /** Total row: 18px/600 with a stronger rule above. Keep it last. Key-value only. @default false */
  total?: boolean;
}

export interface DescriptionListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** `keyValue` is the two-column details list; `glossary` is the stacked term over definition list. @default "keyValue" */
  variant?: 'keyValue' | 'glossary';
  /** The pairs, in order. */
  items: DescriptionItem[];
  /** Key-value only: wrap in `.card.card-flat` with this title row (`.h4`). Omit for a bare list. */
  title?: ReactNode;
  /** Key-value only: status node (a Badge) shown at the right of the title row. */
  status?: ReactNode;
  /** Heading level for `title`. @default 3 */
  headingLevel?: 2 | 3 | 4;
}

/** Real `<dl>` of key-value rows (receipts, order details) or a stacked glossary. */
export const DescriptionList = forwardRef<HTMLElement, DescriptionListProps>(function DescriptionList(
  { variant = 'keyValue', items, title, status, headingLevel = 3, className, ...rest },
  ref,
) {
  if (variant === 'glossary') {
    return (
      <dl ref={ref as React.Ref<HTMLDListElement>} className={cx('dp-dl', className)} {...(rest as HTMLAttributes<HTMLDListElement>)}>
        {items.map((it, i) => (
          <div key={i}>
            <dt>{it.term}</dt>
            <dd>{it.description}</dd>
          </div>
        ))}
      </dl>
    );
  }
  const H = `h${headingLevel}` as 'h3';
  const list = (
    <dl
      ref={title ? undefined : (ref as React.Ref<HTMLDListElement>)}
      className={cx('dp-kv', !title && className)}
      {...(title ? {} : (rest as HTMLAttributes<HTMLDListElement>))}
    >
      {items.flatMap((it, i) => [
        <dt key={`t${i}`} className={it.total ? 'dp-kv-tot' : undefined}>{it.term}</dt>,
        <dd key={`d${i}`} className={cx(it.total && 'dp-kv-tot', it.numeric && 'dp-num') || undefined}>{it.description}</dd>,
      ])}
    </dl>
  );
  if (!title) return list;
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={cx('card', 'card-flat', className)} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      <div className="dp-kv-head">
        <H className="h4">{title}</H>
        {status}
      </div>
      {list}
    </div>
  );
});
