import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { uiIcons, ministryIcons, logos, type UiIconName, type MinistryIconName, type LogoName, type IconNode } from '@ism/tokens/icons-all';
import { useTheme } from './theme';

const renderNode = ([tag, attrs]: IconNode, i: number) => {
  const a = attrs as Record<string, string>;
  if (tag === 'path') return <Path key={i} d={a.d} />;
  if (tag === 'circle') return <Circle key={i} cx={a.cx} cy={a.cy} r={a.r} />;
  return <Rect key={i} x={a.x} y={a.y} width={a.width} height={a.height} rx={a.rx} />;
};

export interface UiIconProps {
  /** Icon name from the UI line set, e.g. "chevron-down". */
  name: UiIconName;
  /** Size in dp. Use 16, 20 or 24. @default 20 */
  size?: 16 | 20 | 24 | number;
  /** Stroke colour. @default theme text colour */
  color?: string;
  /** Accessible label. When omitted the icon is hidden from screen readers. */
  accessibilityLabel?: string;
  /** Flip horizontally in RTL (use for arrows and chevrons that mean next/back). @default false */
  mirrorInRTL?: boolean;
}

/** UI line icon (24 viewBox, stroke 1.8, round caps). Decorative unless `accessibilityLabel` is set. */
export function UiIcon({ name, size = 20, color, accessibilityLabel, mirrorInRTL = false }: UiIconProps) {
  const theme = useTheme();
  const nodes = uiIcons[name] as readonly IconNode[];
  const flip = mirrorInRTL && theme.isRTL;
  return (
    <Svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color ?? theme.colors.text} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
      style={flip ? { transform: [{ scaleX: -1 }] } : undefined}
      accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!accessibilityLabel} importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}
    >
      {nodes.map(renderNode)}
    </Svg>
  );
}

export interface MinistryIconProps {
  /** Icon name from the ministry set, e.g. "bible", "radio". */
  name: MinistryIconName;
  /** Height in dp; width follows the aspect ratio. Use 24, 32 or 48. @default 32 */
  size?: 24 | 32 | 48 | number;
  /** Fill colour. @default theme text colour */
  color?: string;
  accessibilityLabel?: string;
}

/** Filled ministry icon. */
export function MinistryIcon({ name, size = 32, color, accessibilityLabel }: MinistryIconProps) {
  const theme = useTheme();
  const icon = ministryIcons[name];
  const [, , vw, vh] = icon.viewBox.split(' ').map(Number);
  return (
    <Svg
      width={(size * vw) / vh} height={size} viewBox={icon.viewBox} fill={color ?? theme.colors.text}
      accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!accessibilityLabel} importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}
    >
      {icon.paths.map((d, i) => <Path key={i} d={d} />)}
    </Svg>
  );
}

export interface LogoProps {
  /** Which logo. */
  name: LogoName;
  /** Height in dp; width follows the aspect ratio. @default 32 */
  height?: number;
  /** Ink colour. Defaults to black on light and white on dark. */
  color?: string;
  /** Accessible label, e.g. "International Scripture Ministries". Logos in a link need one. */
  accessibilityLabel?: string;
}

/** ISM / dot.Bible logo as vector. Black ink on light, white on dark; never recolour with brand colours. */
export function Logo({ name, height = 32, color, accessibilityLabel }: LogoProps) {
  const theme = useTheme();
  const logo = logos[name];
  const [, , vw, vh] = logo.viewBox.split(' ').map(Number);
  return (
    <Svg
      width={(height * vw) / vh} height={height} viewBox={logo.viewBox} fill={color ?? (theme.isDark ? '#ffffff' : '#000000')}
      accessible={!!accessibilityLabel} accessibilityRole={accessibilityLabel ? 'image' : undefined} accessibilityLabel={accessibilityLabel}
    >
      {logo.paths.map((d, i) => <Path key={i} d={d} />)}
    </Svg>
  );
}
