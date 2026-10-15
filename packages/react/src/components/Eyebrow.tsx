import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface EyebrowProps extends HTMLAttributes<HTMLSpanElement> {
  /** Label text in normal case ("About ISM"); CSS uppercases it. One to three words. */
  children: ReactNode;
}

/** Website section label in a thin blue rectangle. Use once above a headline. On dark sections wrap in `.sec-ink` or `.on-dark`. */
export const Eyebrow = forwardRef<HTMLSpanElement, EyebrowProps>(function Eyebrow({ className, children, ...rest }, ref) {
  return (
    <span ref={ref} className={cx('eyebrow', className)} {...rest}>
      {children}
    </span>
  );
});

export interface OverlineProps extends HTMLAttributes<HTMLSpanElement> {
  /** Group name in plain words ("Reading", "All languages · 32"). Pass `id` and reference it with `aria-labelledby` on the group. */
  children: ReactNode;
}

/** Quiet label that heads a list, menu, table or form group. Not a heading element. */
export const Overline = forwardRef<HTMLSpanElement, OverlineProps>(function Overline({ className, children, ...rest }, ref) {
  return (
    <span ref={ref} className={cx('overline', className)} {...rest}>
      {children}
    </span>
  );
});
