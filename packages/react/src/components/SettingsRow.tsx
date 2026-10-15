import { forwardRef, useId, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { useDirection } from '../direction';
import { UiIcon } from '../Icon';

export type SettingsRowKind = 'action' | 'value' | 'toggle' | 'radio';

export interface SettingsGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section header above the card (12/600 caps), e.g. "Reading". Also names the group. */
  heading?: ReactNode;
  /** Helper text under the card (13px), one sentence about consequences. */
  footer?: ReactNode;
  /** Separate card with extra top margin, for a lone Sign out card. @default false */
  gap?: boolean;
  /** Render as a `role="radiogroup"` where arrow keys move the selection. Needs an accessible name from `heading` or `aria-label`. @default false */
  choiceGroup?: boolean;
  /** `.ap-grp` cards are `.ap-row`s (see `SettingsRow`). */
  children?: ReactNode;
}

/** Inset settings card with optional header and footer. */
export const SettingsGroup = forwardRef<HTMLDivElement, SettingsGroupProps>(function SettingsGroup(
  { heading, footer, gap = false, choiceGroup = false, className, children, onKeyDown, ...rest },
  ref,
) {
  const id = useId();
  const dir = useDirection();
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!choiceGroup || e.defaultPrevented) return;
    const next = e.key === 'ArrowDown' || e.key === (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight');
    const prev = e.key === 'ArrowUp' || e.key === (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft');
    if (!next && !prev) return;
    const radios = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]:not([aria-disabled="true"])'));
    if (radios.length === 0) return;
    const i = radios.indexOf(document.activeElement as HTMLElement);
    const target = radios[(i + (next ? 1 : -1) + radios.length) % radios.length];
    e.preventDefault();
    target.focus();
    target.click();
  };
  return (
    <>
      {heading ? <p className="ap-grp-h" id={`${id}-h`}>{heading}</p> : null}
      <div
        ref={ref}
        className={cx('ap-grp', gap && 'ap-grp-gap', className)}
        role={choiceGroup ? 'radiogroup' : 'group'}
        aria-labelledby={heading ? `${id}-h` : undefined}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
      {footer ? <p className="ap-grp-f">{footer}</p> : null}
    </>
  );
});

export interface SettingsRowProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'children'> {
  /** `action` acts at once, `value` shows a value and › and opens another screen, `toggle` is an on/off switch, `radio` picks one option in place. @default "action" */
  kind?: SettingsRowKind;
  /** Short noun label, e.g. "Language". */
  label: ReactNode;
  /** Second line (two-line row, 64px), e.g. "Needs Wi‑Fi". */
  subtitle?: ReactNode;
  /** Leading 30px icon tile (use on every row of a card or none), e.g. `<UiIcon name="language" />`. */
  icon?: ReactNode;
  /** `value` rows: the current value, short, matching the next screen's selected option. */
  value?: ReactNode;
  /** `toggle` and `radio` rows: on / selected state (controlled). @default false */
  checked?: boolean;
  /** `toggle` and `radio` rows: called with the next state. Toggles take effect at once; never pair with Save. */
  onCheckedChange?: (checked: boolean) => void;
  /** `action` rows: render in `--error`, alone in a `gap` group (Sign out). @default false */
  destructive?: boolean;
  /** Dim the row and ignore input. Say why in `subtitle`. @default false */
  disabled?: boolean;
  /** Click handler for `action` and `value` rows. */
  onClick?: () => void;
}

/** A 52px settings row: action, value with ›, toggle switch or radio choice. Place inside `SettingsGroup`. */
export const SettingsRow = forwardRef<HTMLElement, SettingsRowProps>(function SettingsRow(
  { kind = 'action', label, subtitle, icon, value, checked = false, onCheckedChange, destructive = false, disabled = false, onClick, className, ...rest },
  ref,
) {
  const id = useId();
  const labelEl = subtitle ? (
    <span className="ap-tt"><span className="ap-t" id={`${id}-t`}>{label}</span><span className="ap-s">{subtitle}</span></span>
  ) : (
    <span id={`${id}-t`}>{label}</span>
  );
  const lead = icon ? <i className="ap-ri">{icon}</i> : null;
  const rowClass = cx('ap-row', !!subtitle && 'ap-row-tall', destructive && 'ap-row-danger', className);

  if (kind === 'toggle') {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} className={rowClass} aria-disabled={disabled || undefined} {...(rest as HTMLAttributes<HTMLDivElement>)}>
        {lead}
        {labelEl}
        <button
          className="ap-tog"
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={`${id}-t`}
          disabled={disabled}
          onClick={() => onCheckedChange?.(!checked)}
        />
      </div>
    );
  }

  const common = {
    ref: ref as React.Ref<HTMLButtonElement>,
    className: rowClass,
    type: 'button' as const,
    'aria-disabled': disabled || undefined,
    ...(rest as HTMLAttributes<HTMLButtonElement>),
  };

  if (kind === 'radio') {
    return (
      <button
        {...common}
        role="radio"
        aria-checked={checked}
        tabIndex={checked ? 0 : -1}
        onClick={() => {
          if (!disabled && !checked) onCheckedChange?.(true);
        }}
      >
        {lead}
        {labelEl}
        <span className="ap-rad" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      {...common}
      onClick={() => {
        if (!disabled) onClick?.();
      }}
    >
      {lead}
      {labelEl}
      {kind === 'value' ? (
        <>
          {value ? <span className="ap-val">{value}</span> : null}
          <span className="ap-chv"><UiIcon name="chevron-right" size={20} /></span>
        </>
      ) : null}
    </button>
  );
});
