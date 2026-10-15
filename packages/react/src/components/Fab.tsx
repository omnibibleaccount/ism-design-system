import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export interface FabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'> {
  /** Names the action; the icon is always +, so there is no visible text. Required, e.g. "New note". */
  'aria-label': string;
  /** Lift above a visible snackbar (`.ap-fab-lifted`). @default false */
  lifted?: boolean;
  /** Replace the + icon. Keep it +; only change it for a different create glyph. */
  icon?: ReactNode;
}

/**
 * Floating action button: the one Horizon Blue primary of a list screen. Place inside the positioned app
 * screen (`.ap-screen`); never on reading screens, settings, or screens that already have a blue primary.
 */
export const Fab = forwardRef<HTMLButtonElement, FabProps>(function Fab(
  { lifted = false, icon, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cx('ap-fab', lifted && 'ap-fab-lifted', className)} {...rest}>
      {icon ?? <UiIcon name="plus" size={24} />}
    </button>
  );
});

export interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  /** Short line saying what is happening, e.g. "Checking for new episodes…". */
  children: ReactNode;
}

/**
 * Pull-to-refresh indicator under the app bar: a white disc with a spinning blue arc and a status line.
 * `role="status"`; never move focus to it, and offer a Refresh command for people who cannot pull.
 * The CSS spins the arc; under reduced motion your global rules should show it static.
 */
export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(function PullToRefresh(
  { className, children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('ap-ptr', className)} role="status" {...rest}>
      <span className="ap-ptr-c"><UiIcon name="refresh" size={20} /></span>
      <span className="ap-ptr-t">{children}</span>
    </div>
  );
});

export interface SnackbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** One-line past-tense message, e.g. "Note deleted". */
  message: ReactNode;
  /** Text action in `--blue-on-dark`, e.g. "Undo" or "View". 44px tall. */
  actionLabel?: ReactNode;
  /** Called when the action is pressed. Also offer Undo somewhere else (the item's menu): the snackbar disappears. */
  onAction?: () => void;
}

/**
 * Snackbar above the tab bar (`role="status"`). Hide it after 5 seconds (8 with Undo) in the host, and pair
 * it with `Fab lifted`. Not for errors that need attention; use an inline Alert.
 */
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  { message, actionLabel, onAction, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('ap-snack', className)} role="status" {...rest}>
      <span>{message}</span>
      {actionLabel ? <button className="ap-snack-a" type="button" onClick={onAction}>{actionLabel}</button> : null}
    </div>
  );
});
