import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface SegmentedControlOption {
  /** Value reported to `onChange` when this segment is chosen. */
  value: string;
  /** Visible label. One or two words, no icons or counts. */
  label: ReactNode;
  /** Disable this segment. @default false */
  disabled?: boolean;
}

export interface SegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The two (at most three) segments, in display order. */
  options: SegmentedControlOption[];
  /** Selected value (controlled). Exactly one segment is always pressed. */
  value?: string;
  /** Initially selected value (uncontrolled). Defaults to the first option. */
  defaultValue?: string;
  /** Called with the new value when a different segment is chosen. Never submits a form. */
  onChange?: (value: string) => void;
  /** Accessible name of the group, for example "Gift frequency". Required unless `aria-labelledby` is set. */
  'aria-label'?: string;
  /** Use on dark sections (`.on-dark`, `.sec-ink`, black): translucent track, white selected segment. @default false */
  dark?: boolean;
}

/**
 * Pill-shaped toggle for two or three equal, mutually exclusive modes. A `role="group"` of
 * `aria-pressed` buttons; changing the segment updates content right away and never submits a form.
 */
export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(function SegmentedControl(
  { options, value, defaultValue, onChange, dark = false, className, ...rest },
  ref,
) {
  const [inner, setInner] = useState<string>(defaultValue ?? options[0]?.value ?? '');
  const current = value ?? inner;
  const choose = (v: string) => {
    if (v === current) return;
    if (value === undefined) setInner(v);
    onChange?.(v);
  };
  return (
    <div ref={ref} role="group" className={cx('fm-seg', dark && 'fm-seg-dark', className)} {...rest}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="chip"
          aria-pressed={o.value === current}
          disabled={o.disabled}
          onClick={() => choose(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
});
