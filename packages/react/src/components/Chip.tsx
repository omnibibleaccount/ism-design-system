import { forwardRef, useId, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-pressed'> {
  /** Whether the chip is on. Renders `aria-pressed`. @default false */
  pressed?: boolean;
  /** Short text label, one or two words. Text only: no icons or flags. */
  children?: ReactNode;
}

/** Pill toggle for filters and presets. Pressed chips are black, never blue. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { pressed = false, className, type = 'button', children, ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx('chip', className)} aria-pressed={pressed ? 'true' : 'false'} {...rest}>
      {children}
    </button>
  );
});

export interface ChipOption {
  /** Stable value reported to `onChange`. */
  value: string;
  /** Visible label. */
  label: ReactNode;
  /** Disable this chip. @default false */
  disabled?: boolean;
}

export interface ChipGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The chips. */
  options: ChipOption[];
  /** `single` releases the others when one is pressed (filters, amounts); `multiple` toggles each on its own. @default "single" */
  mode?: 'single' | 'multiple';
  /** Controlled value: one string in single mode, an array in multiple mode. */
  value?: string | string[];
  /** Uncontrolled initial value. In single mode start with "All" pressed. */
  defaultValue?: string | string[];
  /** Called with the new value (string in single mode, string[] in multiple mode). */
  onChange?: (value: string | string[]) => void;
  /** Accessible name of the group, for example "Filter resources". Required. */
  'aria-label': string;
}

const toArray = (v: string | string[] | undefined): string[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

/** A `role="group"` of chips laid out with an 8px gap. Controlled or uncontrolled. */
export function ChipGroup({ options, mode = 'single', value, defaultValue, onChange, className, style, ...rest }: ChipGroupProps) {
  const [inner, setInner] = useState<string[]>(toArray(defaultValue));
  const current = value !== undefined ? toArray(value) : inner;
  const id = useId();
  const toggle = (v: string) => {
    let next: string[];
    if (mode === 'single') next = [v];
    else next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v];
    if (value === undefined) setInner(next);
    onChange?.(mode === 'single' ? next[0] : next);
  };
  return (
    <div role="group" className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, ...style }} {...rest}>
      {options.map((o) => (
        <Chip key={`${id}-${o.value}`} pressed={current.includes(o.value)} disabled={o.disabled} onClick={() => toggle(o.value)}>
          {o.label}
        </Chip>
      ))}
    </div>
  );
}
