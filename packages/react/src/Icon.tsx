import type { SVGProps } from 'react';
import { uiIcons, ministryIcons, type UiIconName, type MinistryIconName, type IconNode } from '@ism/tokens/icons';

const renderNode = ([tag, attrs]: IconNode, i: number) => {
  const Tag = tag as 'path';
  return <Tag key={i} {...(attrs as SVGProps<SVGPathElement>)} />;
};

export interface UiIconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> {
  /** Icon name from the UI line set, e.g. "chevron-down". */
  name: UiIconName;
  /** Size in px. Use 16, 20 or 24. @default 20 */
  size?: 16 | 20 | 24 | number;
  /** Accessible name. When omitted the icon is decorative (aria-hidden). */
  title?: string;
}

/** UI line icon: 24 viewBox, currentColor stroke 1.8, round caps. Decorative unless `title` is given. */
export function UiIcon({ name, size = 20, title, ...rest }: UiIconProps) {
  const nodes = uiIcons[name] as readonly IconNode[];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...rest}
    >
      {nodes.map(renderNode)}
    </svg>
  );
}

export interface MinistryIconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'children'> {
  /** Icon name from the ministry set, e.g. "bible", "radio", "translate". */
  name: MinistryIconName;
  /** Height in px; width follows the icon's aspect ratio. Use 24, 32 or 48. @default 32 */
  size?: 24 | 32 | 48 | number;
  /** Accessible name. When omitted the icon is decorative (aria-hidden). */
  title?: string;
}

/** Filled ministry icon. Uses currentColor, so it follows text colour (black on light, white on dark). */
export function MinistryIcon({ name, size = 32, title, ...rest }: MinistryIconProps) {
  const icon = ministryIcons[name];
  const [, , vw, vh] = icon.viewBox.split(' ').map(Number);
  return (
    <svg
      height={size}
      width={(size * vw) / vh}
      viewBox={icon.viewBox}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      {...rest}
    >
      {icon.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
