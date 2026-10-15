import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../utils';

export interface AccentBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Fraction filled, 0 to 1. @default 0.4 */
  progress?: number;
  /** Track width in px, or any CSS width such as "100%". @default 200 */
  width?: number | string;
  /** Light track (`rgba(0,0,0,.12)`) for white or off-white surfaces. The default track is for dark surfaces. @default false */
  light?: boolean;
  /**
   * Accessible name ("John 3 read"). When given, the track gets `role="progressbar"` with value attributes.
   * Without it the bar is plain divs: show the value in text beside it.
   */
  label?: string;
}

/** 3px passive progress line filled with the signature gradient. Not for uploads or form steps. */
export const AccentBar = forwardRef<HTMLDivElement, AccentBarProps>(function AccentBar(
  { progress = 0.4, width = 200, light = false, label, className, style, ...rest },
  ref,
) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const aria = label
    ? { role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct }
    : {};
  return (
    <div ref={ref} className={cx('cr-accentbar', light && 'cr-accentbar-light', className)} style={{ width, ...style }} {...aria} {...rest}>
      <span className="cr-accentbar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
});
