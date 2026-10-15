import type { HTMLAttributes, ReactNode } from 'react';
import { uiIcons, ministryIcons, type UiIconName, type MinistryIconName } from '@ism/tokens/icons';
import { UiIcon, MinistryIcon } from '../Icon';
import { cx } from '../utils';

export { UiIcon, MinistryIcon };
export type { UiIconName, MinistryIconName };

export interface IconTileProps extends HTMLAttributes<HTMLSpanElement> {
  /** The icon to centre in the tile, for example `<UiIcon name="search" />`. Decorative: the tile is `aria-hidden`. */
  children: ReactNode;
  /** Use the gold tint instead of the blue tint. @default false */
  gold?: boolean;
}

/** 40px tinted tile (`--blue-tint`, `--radius-md`) that holds one icon, as used at the start of a list row. */
export function IconTile({ gold = false, className, children, ...rest }: IconTileProps) {
  return (
    <span className={cx('cr-lr-ic', gold && 'cr-lr-ic-gold', className)} aria-hidden="true" {...rest}>
      {children}
    </span>
  );
}

export interface IconographyProps extends HTMLAttributes<HTMLDivElement> {
  /** Which set to list: the thin UI line icons or the filled ministry icons. @default "ui" */
  set?: 'ui' | 'ministry';
  /** Icon size in px. UI: 16, 20 or 24. Ministry: 24, 32 or 48. @default 24 */
  size?: number;
  /** Show the icon name under each icon. @default true */
  showNames?: boolean;
}

/** Documentation helper: lists every icon in a set with its name. Not for production screens. */
export function Iconography({ set = 'ui', size = 24, showNames = true, className, style, ...rest }: IconographyProps) {
  const names = (set === 'ui' ? Object.keys(uiIcons) : Object.keys(ministryIcons)) as string[];
  return (
    <div
      className={className}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 16, ...style }}
      {...rest}
    >
      {names.map((name) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {set === 'ui' ? <UiIcon name={name as UiIconName} size={size} /> : <MinistryIcon name={name as MinistryIconName} size={size} />}
          {showNames ? <span className="small muted">{name}</span> : null}
        </div>
      ))}
    </div>
  );
}
