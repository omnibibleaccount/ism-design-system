import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { UiIcon } from '../Icon';
import { cx } from '../utils';

export type BadgeTone = 'outlineDark' | 'outlineLight' | 'solidBlue' | 'accentText';

const PILL_BASE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 14px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-sans)',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: 'var(--eyebrow-tracking)',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  border: '1px solid transparent',
};

const TONE_STYLE: Record<BadgeTone, CSSProperties> = {
  outlineDark: { color: 'var(--white)', borderColor: 'rgba(255,255,255,.4)' },
  outlineLight: { color: 'var(--black)', borderColor: 'rgba(0,0,0,.28)' },
  solidBlue: { color: 'var(--white)', background: 'var(--horizon-blue)', borderColor: 'var(--horizon-blue)' },
  accentText: { color: 'var(--horizon-blue)', paddingLeft: 0, paddingRight: 0 },
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * `outlineDark` on dark, `outlineLight` on light, `solidBlue` filled, `accentText` blue text with no border.
   * @default "outlineDark"
   */
  tone?: BadgeTone;
  /** The label; rendered uppercase. */
  children?: ReactNode;
}

/** Section or promo tag in an outlined pill ("Trending", "You're almost done!"). Not a button. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'outlineDark', style, children, ...rest }, ref) {
  return (
    <span ref={ref} style={{ ...PILL_BASE, ...TONE_STYLE[tone], ...style }} {...rest}>
      {children}
    </span>
  );
});

export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'gold';
export type StatusSize = 'sm' | 'md';

const SUBTLE: Record<StatusTone, string> = {
  neutral: 'cr-badge-neutral',
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning cr-badge-warning',
  error: 'badge-error',
  gold: 'cr-badge-gold',
};
const SOLID: Record<StatusTone, string> = {
  neutral: 'cr-solid-neutral',
  info: 'cr-solid-info',
  success: 'cr-solid-success',
  warning: 'cr-solid-warning',
  error: 'cr-solid-error',
  gold: 'cr-solid-gold',
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status colour. Use only for status, and always with a word. @default "neutral" */
  tone?: StatusTone;
  /** Solid fill instead of the subtle tint. @default false */
  solid?: boolean;
  /** `sm` is 24px with 12px text (data tables); `md` is 28px. Omit for the default 24px. */
  size?: StatusSize;
  /** Leading dot. @default false */
  dot?: boolean;
  /** Leading live (on-air) dot. The only use of `--live`. @default false */
  live?: boolean;
  /** One word: Draft, New, Live, Pending, Failed, Partner. */
  children?: ReactNode;
}

/** `.badge` status label shown beside data. Text, not a button. */
export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(function StatusBadge(
  { tone = 'neutral', solid = false, size, dot = false, live = false, className, children, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx('badge', size === 'sm' && 'cr-badge-sm', size === 'md' && 'cr-badge-md', solid ? SOLID[tone] : SUBTLE[tone], className)}
      {...rest}
    >
      {dot ? <span className="cr-badge-dot" aria-hidden="true" /> : null}
      {live ? <span className="live-dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The item name as the user chose it ("Amharic"). */
  children: string;
  /** Called when the remove button is pressed. After removal, move focus to the next tag or the field. */
  onRemove?: () => void;
  /** Accessible name of the remove button. @default (label) => `Remove ${label}` */
  removeLabel?: string;
  /** Applied-filter look (info tint). @default false */
  active?: boolean;
  /** Dim the tag and disable removal. @default false */
  disabled?: boolean;
  /** Extra props for the remove button, for example a ref. */
  removeButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'disabled'>;
}

/** Removable applied-filter tag (`.cr-tag`). */
export function Tag({ children, onRemove, removeLabel, active = false, disabled = false, removeButtonProps, className, ...rest }: TagProps) {
  return (
    <span className={cx('cr-tag', active && 'cr-tag-active', disabled && 'cr-tag-off', className)} {...rest}>
      {children}
      <button
        type="button"
        className="cr-tag-x"
        aria-label={removeLabel ?? `Remove ${children}`}
        disabled={disabled}
        onClick={onRemove}
        {...removeButtonProps}
      >
        <UiIcon name="close" size={12} strokeWidth={2.4} />
      </button>
    </span>
  );
}

export interface CountProps extends HTMLAttributes<HTMLSpanElement> {
  /** The number to show. */
  children: ReactNode;
  /** Visually hidden context read after the number ("unread"). Needed when the count is not inside a labelled link. */
  hiddenLabel?: string;
}

/** Horizon Blue number dot for unread or pending items. Never red. */
export function Count({ children, hiddenLabel, className, ...rest }: CountProps) {
  return (
    <span className={cx('count', className)} {...rest}>
      {children}
      {hiddenLabel ? <span className="dp-vh"> {hiddenLabel}</span> : null}
    </span>
  );
}
