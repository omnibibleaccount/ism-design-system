import { Children, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { UiIcon } from '../Icon';
import { cx } from '../utils';

export type AvatarSize = 24 | 32 | 40 | 56 | 80;
export type AvatarColor = 'blue' | 'violet' | 'gold' | 'ink' | 'peach';
export type AvatarPresence = 'online' | 'away' | 'offline';

const COLORS: AvatarColor[] = ['blue', 'violet', 'gold', 'ink', 'peach'];

/** Picks an initials colour from a name so a person always keeps the same one. */
export function avatarColor(name: string): AvatarColor {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

/** One or two uppercase initials from a name. */
export function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  const first = Array.from(parts[0])[0] ?? '';
  const last = parts.length > 1 ? Array.from(parts[parts.length - 1])[0] ?? '' : '';
  return (first + last).toUpperCase();
}

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Photo URL. When omitted, initials (from `name` or `initials`) or the person icon show. */
  src?: string;
  /** The person's name. Used for alt text, the accessible name and default initials and colour. */
  name?: string;
  /** Override the initials, one or two letters. */
  initials?: string;
  /** Diameter in px. 40 in list rows, 56 in testimonials, 80 on profiles, 24-32 in dense UI. @default 40 */
  size?: AvatarSize;
  /** Initials background. Defaults to a colour picked from `name`. */
  color?: AvatarColor;
  /** The avatar sits beside the person's visible name, so it is hidden from assistive tech (`alt=""`). @default false */
  decorative?: boolean;
  /** Live presence dot. Only use when presence is real. */
  presence?: AvatarPresence;
  /** Word for the presence state ("away"), added to the accessible name. Required with `presence`. */
  presenceLabel?: string;
  /** Accessible name of the person icon fallback when there is no photo or name. @default "No photo" */
  fallbackLabel?: string;
}

/** Circular picture of a person: photo, initials or person icon, with an optional presence dot. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, initials, size = 40, color, decorative = false, presence, presenceLabel, fallbackLabel = 'No photo', className, ...rest },
  ref,
) {
  const text = initials ?? (name ? avatarInitials(name) : '');
  const label = [name, presence ? presenceLabel : undefined].filter(Boolean).join(', ');
  const dot = presence ? (
    <span className={cx('dp-pres', presence === 'away' && 'dp-pres-away', presence === 'offline' && 'dp-pres-off')} />
  ) : null;
  const base = cx('dp-av', `dp-av-${size}`, className);

  if (src) {
    // A photo is an img; presence needs the word in the accessible name.
    const needsRole = !decorative && Boolean(presence);
    return (
      <span ref={ref} className={base} role={needsRole ? 'img' : undefined} aria-label={needsRole ? label : undefined} {...rest}>
        <img src={src} alt={decorative || needsRole ? '' : name ?? ''} />
        {dot}
      </span>
    );
  }
  if (text) {
    return (
      <span
        ref={ref}
        className={cx(base, `dp-av-${color ?? avatarColor(name ?? text)}`)}
        role={decorative ? undefined : 'img'}
        aria-label={decorative ? undefined : label || text}
        aria-hidden={decorative ? true : undefined}
        {...rest}
      >
        <span aria-hidden="true">{text}</span>
        {dot}
      </span>
    );
  }
  return (
    <span
      ref={ref}
      className={cx(base, 'dp-av-ic')}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label || fallbackLabel}
      aria-hidden={decorative ? true : undefined}
      {...rest}
    >
      <UiIcon name="user" size={size >= 56 ? 28 : 16} />
      {dot}
    </span>
  );
});

export interface AvatarStackProps extends HTMLAttributes<HTMLDivElement> {
  /** One accessible name for the whole stack listing names and the count ("Maria, Dawit and 5 more partners"). Required. */
  'aria-label': string;
  /** Avatars to show; give each `decorative` and the same `size`. */
  children: ReactNode;
  /** Maximum faces before the count tile. @default 4 */
  max?: number;
  /** Number of people not shown, rendered as the "+N" tile. Defaults to the avatars cut by `max`. */
  more?: number;
  /** Size of the count tile. @default 40 */
  size?: AvatarSize;
}

/** Overlapping group of avatars with a "+N" count tile. Shows at most four faces. */
export function AvatarStack({ children, max = 4, more, size = 40, className, ...rest }: AvatarStackProps) {
  const all = Children.toArray(children);
  const shown = all.slice(0, max);
  const extra = more ?? Math.max(0, all.length - max);
  return (
    <div className={cx('dp-stack', className)} role="img" {...rest}>
      {shown}
      {extra > 0 ? <span className={cx('dp-av', `dp-av-${size}`, 'dp-av-more')} aria-hidden="true">+{extra}</span> : null}
    </div>
  );
}
