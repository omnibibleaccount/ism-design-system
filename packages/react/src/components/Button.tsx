import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export type ButtonVariant = 'primary' | 'outlineLight' | 'outlineDark' | 'solidWhite' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  outlineLight: 'btn-secondary',
  outlineDark: 'btn-outline-light',
  solidWhite: 'btn-light',
  ghost: 'btn-ghost',
};
const SIZE_CLASS: Record<ButtonSize, string> = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

interface ButtonOwnProps {
  /**
   * Colour treatment. `primary` (solid Horizon Blue) is for the ONE main action in a group.
   * `outlineLight` and `ghost` suit light sections; `outlineDark` and `solidWhite` suit dark sections.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /** @default "md" */
  size?: ButtonSize;
  /** Stretch to the full width of the container. @default false */
  block?: boolean;
  /** Show a spinner and block interaction. The label stays and the width does not change. Sets `aria-busy`. @default false */
  loading?: boolean;
  /** Trailing icon element, for example `<UiIcon name="arrow-right" />` or an `↗` span. Hidden from assistive tech. */
  icon?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps = ButtonOwnProps &
  (
    | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & { href?: undefined })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & { href: string; disabled?: boolean })
  );

/**
 * Pill-shaped call-to-action. Renders a `<button>` by default and an `<a>` when `href` is given
 * (buttons do things, links go places).
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block = false, loading = false, icon, className, children, ...rest },
  ref,
) {
  const classes = cx('btn', VARIANT_CLASS[variant], SIZE_CLASS[size], block && 'cr-btn-block', className);
  const content = (
    <>
      {children}
      {icon ? <span className="arrow" aria-hidden="true">{icon}</span> : null}
    </>
  );
  if ('href' in rest && rest.href !== undefined) {
    const { disabled, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { disabled?: boolean };
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        aria-disabled={disabled || loading ? true : undefined}
        aria-busy={loading || undefined}
        tabIndex={disabled ? -1 : anchor.tabIndex}
        {...anchor}
      >
        {content}
      </a>
    );
  }
  const button = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={button.type ?? 'button'}
      className={classes}
      aria-busy={loading || undefined}
      {...button}
      disabled={button.disabled || loading}
    >
      {content}
    </button>
  );
});
