import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value, from 0 to `max`. Omit (or set `indeterminate`) when the length of the work is unknown. */
  value?: number;
  /** Total. @default 100 */
  max?: number;
  /** Unknown length: a looping 35% bar with no `aria-valuenow`. Use for work longer than about 2 seconds. @default false */
  indeterminate?: boolean;
  /** Visible name of the task: a verb and the object, for example "Downloading Amharic audio Bible". Names the bar. */
  label?: ReactNode;
  /** Text shown on the right of the label row, for example "68%". Defaults to the percentage when `label` is set. */
  valueText?: ReactNode;
  /** Hide the percentage next to the label. Show it only when it is accurate. @default false */
  hideValue?: boolean;
  /** Hint line below the bar, for example "412 MB of 600 MB · about 2 minutes left". */
  hint?: ReactNode;
  /** Accessible name when there is no visible `label`. */
  'aria-label'?: string;
}

/**
 * Linear progress bar. With `label` it uses the 8px track with a name and percent row;
 * without it the plain 4px track. Every bar has `role="progressbar"` and an accessible name.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, indeterminate = false, label, valueText, hideValue = false, hint, className, 'aria-label': ariaLabel, ...rest },
  ref,
) {
  const labelId = useId();
  const unknown = indeterminate || value === undefined;
  const pct = unknown ? 0 : clamp((value / max) * 100, 0, 100);
  const track = (
    <div
      className={cx('fb-track', label ? 'fb-track-lg' : undefined)}
      role="progressbar"
      aria-labelledby={label ? labelId : undefined}
      aria-label={label ? undefined : ariaLabel}
      aria-valuenow={unknown ? undefined : Math.round(clamp(value, 0, max))}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      {unknown ? <span className="fb-indet" /> : <span className="fb-fill" style={{ width: `${pct}%` }} />}
    </div>
  );
  if (!label && !hint) return <div ref={ref} className={className} {...rest}>{track}</div>;
  return (
    <div ref={ref} className={cx('fb-prog', className)} {...rest}>
      {label ? (
        <div className="fb-prog-head">
          <span className="fb-prog-name" id={labelId}>
            {label}
          </span>
          {hideValue || unknown ? null : <span className="fb-prog-val">{valueText ?? `${Math.round(pct)}%`}</span>}
        </div>
      ) : null}
      {track}
      {hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
});

export interface ProgressRingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current value, from 0 to 100. */
  value: number;
  /** `lg` is the 64px ring with the percent inside; `inline` is the 24px ring with text beside it. @default "lg" */
  size?: 'lg' | 'inline';
  /** Accessible name, for example "Reading plan · day 15 of 30". Also shown beside an `inline` ring. */
  label: string;
  /** Hide the visible text (percent inside `lg`, label beside `inline`); the name stays for assistive tech. @default false */
  hideText?: boolean;
  /** Text inside the `lg` ring. Defaults to the percentage. */
  valueText?: ReactNode;
}

/** Circular progress. Starts at 12 o’clock with round caps. The SVG is hidden from assistive tech. */
export const ProgressRing = forwardRef<HTMLDivElement, ProgressRingProps>(function ProgressRing(
  { value, size = 'lg', label, hideText = false, valueText, className, style, ...rest },
  ref,
) {
  const pct = clamp(value, 0, 100);
  const inline = size === 'inline';
  const dim = inline ? 24 : 64;
  const r = inline ? 9.5 : 28;
  const stroke = inline ? 3 : 6;
  const dash = inline ? 59.7 : 175.9;
  const c = dim / 2;
  const svg = (
    <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} aria-hidden="true" focusable="false">
      <circle className="fb-ring-track" cx={c} cy={c} r={r} strokeWidth={stroke} />
      <circle
        className="fb-ring-bar"
        cx={c}
        cy={c}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - pct / 100)}
      />
    </svg>
  );
  return (
    <div
      ref={ref}
      className={cx(inline ? 'fb-ring-inline' : 'fb-ring', className)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={inline ? style : { width: dim, height: dim, ...style }}
      {...rest}
    >
      {svg}
      {inline ? (hideText ? null : <span>{label}</span>) : hideText ? null : <span className="fb-ring-val">{valueText ?? `${Math.round(pct)}%`}</span>}
    </div>
  );
});

export interface ProgressStepsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current step, 1-based. The bar fills one share per step. */
  current: number;
  /** Total steps; use for two to five steps. */
  total: number;
  /** Visible label on the left, for example "Step 1 of 2". It names the bar. */
  label: ReactNode;
}

/** Step progress for a multi-step form: label left, a bar that fills one share per step. */
export const ProgressSteps = forwardRef<HTMLDivElement, ProgressStepsProps>(function ProgressSteps(
  { current, total, label, className, ...rest },
  ref,
) {
  const labelId = useId();
  const step = clamp(current, 0, total);
  return (
    <div ref={ref} className={cx('fb-steps', className)} {...rest}>
      <span className="fb-steps-label" id={labelId}>
        {label}
      </span>
      <span className="fb-track" role="progressbar" aria-labelledby={labelId} aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
        <span className="fb-fill" style={{ width: `${(step / total) * 100}%` }} />
      </span>
    </div>
  );
});
