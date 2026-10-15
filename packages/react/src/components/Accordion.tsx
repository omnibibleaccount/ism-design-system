import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface AccordionItemData {
  /** Stable id used for open state. */
  id: string;
  /** The question, a full question ending with "?". */
  question: ReactNode;
  /** The answer: start with the answer, then one or two plain sentences. */
  answer: ReactNode;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The rows. */
  items: AccordionItemData[];
  /** Controlled list of open item ids. Several rows may be open at once. */
  value?: string[];
  /** Uncontrolled initial open ids. Open the first row by default on the FAQ page only; elsewhere start all closed. @default [] */
  defaultValue?: string[];
  /** Called with the open ids when a row opens or closes. */
  onChange?: (value: string[]) => void;
  /** Place the rows on the `--gray-100` panel. Drop it to sit straight on the page. @default true */
  panel?: boolean;
}

/** FAQ accordion on native `<details>`/`<summary>`: keyboard and screen-reader support come from the platform. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { items, value, defaultValue = [], onChange, panel = true, className, ...rest },
  ref,
) {
  const [inner, setInner] = useState<string[]>(defaultValue);
  const open = value ?? inner;
  const set = (id: string, isOpen: boolean) => {
    if (open.includes(id) === isOpen) return;
    const next = isOpen ? [...open, id] : open.filter((x) => x !== id);
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return (
    <div ref={ref} className={cx('acc', panel && 'dp-acc-panel', className)} {...rest}>
      {items.map((it) => (
        <details key={it.id} open={open.includes(it.id)} onToggle={(e) => set(it.id, e.currentTarget.open)}>
          <summary>{it.question}</summary>
          <div className="ans">{typeof it.answer === 'string' ? <p>{it.answer}</p> : it.answer}</div>
        </details>
      ))}
    </div>
  );
});
