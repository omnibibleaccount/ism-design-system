import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../utils';

export interface DividerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** @default "horizontal" */
  orientation?: 'horizontal' | 'vertical';
  /** Length in px along the main axis. @default 72 */
  length?: number;
  /** Thickness in px across. @default 2 */
  thickness?: number;
}

/** Pill-ended accent bar painted with `--gradient-signature`. Decorative; use at most once per section. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', length = 72, thickness = 2, style, ...rest },
  ref,
) {
  const horizontal = orientation === 'horizontal';
  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        width: horizontal ? length : thickness,
        height: horizontal ? thickness : length,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--gradient-signature)',
        flex: 'none',
        ...style,
      }}
      {...rest}
    />
  );
});

export interface RuleProps extends Omit<HTMLAttributes<HTMLHRElement>, 'children'> {
  /** `strong` for a total row or page-end rule; `dark` on dark surfaces. @default "hairline" */
  tone?: 'hairline' | 'strong' | 'dark';
}

/** Quiet 1px `<hr>` between groups inside a card, form or panel. Space it with the parent's `gap`. */
export const Rule = forwardRef<HTMLHRElement, RuleProps>(function Rule({ tone = 'hairline', className, ...rest }, ref) {
  return <hr ref={ref} className={cx('cr-rule', tone === 'strong' && 'cr-rule-strong', tone === 'dark' && 'cr-rule-dark', className)} {...rest} />;
});

export interface OrDividerProps extends HTMLAttributes<HTMLDivElement> {
  /** The one lowercase word between the lines. @default "or" */
  children?: string;
}

/** Two hairlines with a word between, for two alternative ways to do one thing. */
export function OrDivider({ children = 'or', className, ...rest }: OrDividerProps) {
  return (
    <div className={cx('cr-rule-or', className)} role="separator" aria-label={children} {...rest}>
      {children}
    </div>
  );
}

/** 1px by 24px vertical rule between short inline facts. Place inside a flex row with a 16px gap. Decorative. */
export function VerticalRule({ className, ...rest }: Omit<HTMLAttributes<HTMLSpanElement>, 'children'>) {
  return <span className={cx('cr-rule-v', className)} aria-hidden="true" {...rest} />;
}

/** The `.thread` signature gradient line, full width of its box. Decorative; at most once per section. */
export function Thread({ className, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'children'>) {
  return <div className={cx('thread', className)} aria-hidden="true" {...rest} />;
}
