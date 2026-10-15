import { forwardRef, useId, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { UiIcon } from '../Icon';
import { cx } from '../utils';

/* ---------- React audio row ---------- */

export interface ListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Shown in a 40px round tile. */
  icon?: ReactNode;
  /** Chapter or teaching name. */
  title?: string;
  /** Duration, for example "9:12". */
  meta?: string;
  /** Listened fraction, 0 to 1. @default 0.15 */
  progress?: number;
  /** Dark surface styling. Set `false` on light surfaces. @default true */
  dark?: boolean;
  /** Called when the play button is pressed. */
  onPlay?: () => void;
  /** Accessible name of the play button. Override to translate. @default "Play" */
  playLabel?: string;
  /** Glyph inside the play button. @default "▶" */
  playIcon?: ReactNode;
}

/** Audio Bible chapter or teaching row: icon, title, progress line, duration and play. */
export const ListRow = forwardRef<HTMLDivElement, ListRowProps>(function ListRow(
  { icon, title, meta, progress = 0.15, dark = true, onPlay, playLabel = 'Play', playIcon = '▶', style, ...rest },
  ref,
) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const ink = dark ? 'var(--white)' : 'var(--charcoal-900)';
  const soft = dark ? 'var(--text-tertiary-dark)' : 'var(--gray-600)';
  const line = dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)';
  return (
    <div
      ref={ref}
      style={{ display: 'flex', alignItems: 'center', gap: 14, minHeight: 56, padding: '12px 20px', color: ink, ...style }}
      {...rest}
    >
      {icon ? (
        <span
          aria-hidden="true"
          style={{ display: 'grid', placeItems: 'center', width: 40, height: 40, borderRadius: '50%', flex: 'none', background: dark ? 'rgba(255,255,255,.1)' : 'var(--blue-tint)' }}
        >
          {icon}
        </span>
      ) : null}
      <span style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
        <span
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          style={{ position: 'relative', display: 'block', height: 3, borderRadius: 2, background: line, overflow: 'hidden' }}
        >
          <span style={{ position: 'absolute', top: 0, bottom: 0, insetInlineStart: 0, width: `${pct}%`, background: 'var(--horizon-blue)', borderRadius: 2 }} />
        </span>
      </span>
      {meta ? <span style={{ fontSize: 14, color: soft, fontVariantNumeric: 'tabular-nums' }}>{meta}</span> : null}
      <button
        type="button"
        aria-label={playLabel}
        onClick={onPlay}
        style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: '50%', border: 0, background: 'transparent', color: ink, cursor: 'pointer', flex: 'none' }}
      >
        {playIcon}
      </button>
    </div>
  );
});

/* ---------- Website / app rows (.cr-lr) ---------- */

export type ListProps = HTMLAttributes<HTMLDivElement>;

/** Bordered, divided list of `ListItem` rows. */
export const List = forwardRef<HTMLDivElement, ListProps>(function List({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('cr-list', 'cr-list-div', className)} {...rest} />;
});

export interface ListGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Group heading, shown as an overline and tied to the group with `aria-labelledby`. */
  title: ReactNode;
}

/** Inset grouped card with an overline heading, for app screens and settings. */
export function ListGroup({ title, className, children, ...rest }: ListGroupProps) {
  const id = useId();
  return (
    <div className={cx('cr-list-inset', className)} {...rest}>
      <span className="overline" id={id}>{title}</span>
      <div className="cr-inset-grp" role="group" aria-labelledby={id}>
        {children}
      </div>
    </div>
  );
}

interface ListItemOwn {
  /** Leading icon, shown in a blue-tint tile. Decorative. */
  icon?: ReactNode;
  /** Use the gold tint for the icon tile. @default false */
  iconGold?: boolean;
  /** Leading avatar node, for example `<span className="cr-av">MS</span>`. Decorative beside the title. */
  avatar?: ReactNode;
  /** Row title, one line. */
  title: ReactNode;
  /** One extra fact under the title. */
  meta?: ReactNode;
  /** Meta may wrap to two lines then ellipsis. @default false */
  twoLine?: boolean;
  /** Current value in the end slot ("Amharic"). */
  value?: ReactNode;
  /** End-slot affordance. `drill` shows › (opens an app screen), `out` shows ↗ (another page). The row must be a link. */
  end?: 'drill' | 'out';
  /** Visually hidden text after the title for links that open a new tab. Override to translate. @default "(opens in a new tab)" */
  newTabLabel?: string;
  /** Row has no leading icon (inside an inset group). @default false */
  noIcon?: boolean;
  /** Dim the row and block interaction. @default false */
  disabled?: boolean;
  /** Turns the row into a switch row; the whole row toggles. Controlled checked state. */
  checked?: boolean;
  /** Called when the switch row is toggled. Passing it makes the row a switch row. */
  onCheckedChange?: (checked: boolean) => void;
}

export type ListItemProps = ListItemOwn &
  (
    | (Omit<HTMLAttributes<HTMLElement>, keyof ListItemOwn> & { href?: undefined })
    | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ListItemOwn> & { href: string; external?: boolean })
  );

/** One 56px row. A link when `href` is set (never nest another control), a toggle row when `onCheckedChange` is set, else plain. */
export function ListItem(props: ListItemProps) {
  const { icon, iconGold = false, avatar, title, meta, twoLine = false, value, end, newTabLabel = '(opens in a new tab)', noIcon = false, disabled = false, checked, onCheckedChange, className, ...rest } = props;
  const titleId = useId();
  const isLink = 'href' in rest && rest.href !== undefined;
  const external = isLink && Boolean((rest as { external?: boolean }).external);
  const lead = icon ? (
    <span className={cx('cr-lr-ic', iconGold && 'cr-lr-ic-gold')} aria-hidden="true">{icon}</span>
  ) : avatar ? (
    <span aria-hidden="true" style={{ display: 'contents' }}>{avatar}</span>
  ) : null;
  const body = (
    <>
      {lead}
      <span className="cr-lr-tx">
        <span className="cr-lr-t" id={titleId}>
          {title}
          {external ? <span className="dp-vh"> {newTabLabel}</span> : null}
        </span>
        {meta ? <span className="cr-lr-m">{meta}</span> : null}
      </span>
      {value !== undefined || end || onCheckedChange ? (
        <span className={cx('cr-lr-end', end === 'out' && 'cr-lr-out')}>
          {value}
          {end === 'drill' ? <UiIcon name="chevron-right" size={20} /> : null}
          {end === 'out' ? <span aria-hidden="true">↗</span> : null}
          {onCheckedChange ? (
            <button
              type="button"
              className="cr-sw"
              role="switch"
              aria-checked={Boolean(checked)}
              aria-labelledby={titleId}
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                onCheckedChange(!checked);
              }}
            />
          ) : null}
        </span>
      ) : null}
    </>
  );
  const classes = cx('cr-lr', twoLine && 'cr-lr-two', noIcon && 'cr-lr-noic', disabled && 'cr-lr-off', className);
  if (isLink) {
    const { external: _e, href, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { external?: boolean };
    return (
      <a
        className={classes}
        href={href}
        aria-disabled={disabled || undefined}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
        {...anchor}
      >
        {body}
      </a>
    );
  }
  if (onCheckedChange) {
    return (
      <label className={classes} {...(rest as HTMLAttributes<HTMLLabelElement>)}>
        {body}
      </label>
    );
  }
  return (
    <div className={classes} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {body}
    </div>
  );
}
