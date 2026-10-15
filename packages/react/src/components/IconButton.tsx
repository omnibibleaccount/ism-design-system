import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export type IconButtonTone = 'dark' | 'light' | 'solid';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Accessible name naming the action, for example "Open menu". Required: the button has no visible text. */
  'aria-label': string;
  /** The icon, normally `<UiIcon name="menu" />`. Hidden from assistive tech. */
  children: ReactNode;
  /** `dark` for dark surfaces (white icon), `light` for light surfaces, `solid` for filled Horizon Blue (the group's one primary). @default "dark" */
  tone?: IconButtonTone;
  /** `sm` is 36px visual with a 44px hit area; `lg` is 52px. @default "md" */
  size?: IconButtonSize;
  /** For toggles (play/pause, bookmark): sets `aria-pressed`. Omit for plain actions. */
  pressed?: boolean;
}

const TONE: Record<IconButtonTone, string> = { dark: 'cr-iconbtn-dark', light: 'cr-iconbtn-light', solid: 'cr-iconbtn-solid' };
const SIZE: Record<IconButtonSize, string> = { sm: 'cr-iconbtn-sm', md: '', lg: 'cr-iconbtn-lg' };

/** Round, icon-only 44px button. Always needs an `aria-label`. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { tone = 'dark', size = 'md', pressed, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('iconbtn', TONE[tone], SIZE[size], className)}
      aria-pressed={pressed}
      {...rest}
    >
      {children}
    </button>
  );
});
