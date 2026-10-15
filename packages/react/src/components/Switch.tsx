import {
  forwardRef,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'role' | 'children' | 'onChange' | 'defaultChecked'> {
  /** Title of the setting: says what is on ("Verse of the day"), not the action. */
  label: ReactNode;
  /** One plain line on what happens. When the switch is disabled, say why ("Turn on notifications first"). */
  description?: ReactNode;
  /** Controlled on/off state. */
  checked?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultChecked?: boolean;
  /** Called with the new state. A switch acts at once: revert it and show an alert if saving fails. */
  onCheckedChange?: (checked: boolean) => void;
  /** Class on the row (`.fm-swrow`). `className` goes on the switch button. */
  rowClassName?: string;
}

/**
 * Toggle for settings that take effect at once: `<button role="switch" aria-checked>` in a 44px row, text on the left.
 * The whole row toggles. Space and Enter toggle from the keyboard. Not for forms with a Save button (use Checkbox).
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    label,
    description,
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    rowClassName,
    className,
    id,
    disabled,
    onClick,
    'aria-describedby': describedByProp,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const switchId = id ?? `${auto}-sw`;
  const titleId = `${switchId}-t`;
  const descId = `${switchId}-d`;
  const [inner, setInner] = useState(defaultChecked);
  const controlled = checkedProp !== undefined;
  const checked = controlled ? checkedProp : inner;

  const toggle = () => {
    if (disabled) return;
    if (!controlled) setInner(!checked);
    onCheckedChange?.(!checked);
  };

  return (
    <div
      className={cx('fm-swrow', disabled && 'fm-disabled', rowClassName)}
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) return;
        toggle();
      }}
    >
      <span className="fm-sw-text">
        <span className="fm-sw-t" id={titleId}>
          {label}
        </span>
        {description ? (
          <span className="fm-sw-d" id={descId}>
            {description}
          </span>
        ) : null}
      </span>
      <button
        ref={ref}
        type="button"
        role="switch"
        id={switchId}
        className={cx('fm-switch', className)}
        aria-checked={checked}
        aria-labelledby={titleId}
        aria-describedby={[describedByProp, description ? descId : undefined].filter(Boolean).join(' ') || undefined}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) toggle();
        }}
        {...rest}
      />
    </div>
  );
});

export interface SwitchGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** The `Switch` rows (about 3 to 6). */
  children: ReactNode;
}

/** White `.fm-settings` panel that groups related `Switch` rows with dividers. */
export const SwitchGroup = forwardRef<HTMLDivElement, SwitchGroupProps>(function SwitchGroup(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('fm-settings', className)} {...rest}>
      {children}
    </div>
  );
});
