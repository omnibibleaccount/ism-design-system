import { forwardRef, type ImgHTMLAttributes } from 'react';

export type LogoVariant = 'ism' | 'ismMark' | 'dotbible' | 'dotbibleIcon';

const LOGO_FILE: Record<LogoVariant, string> = {
  ism: 'Full Logo Black.svg',
  ismMark: 'Logo Black.svg',
  dotbible: 'dot.bible Full Logo Black.svg',
  dotbibleIcon: 'dot.bible Icon Black.svg',
};

/** Default accessible names, overridable with `alt`. */
const LOGO_ALT: Record<LogoVariant, string> = {
  ism: 'International Scripture Ministries',
  ismMark: 'International Scripture Ministries',
  dotbible: 'dot.Bible',
  dotbibleIcon: 'dot.Bible',
};

const MIN_HEIGHT: Record<LogoVariant, number> = { ism: 28, ismMark: 24, dotbible: 28, dotbibleIcon: 32 };

/** Black ink to white, for dark surfaces. */
const INVERT = 'brightness(0) invert(1)';

export interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'height'> {
  /**
   * Which logo file to show: ISM full logo, ISM mark, dot.Bible full logo or dot.Bible icon.
   * @default "ism"
   */
  variant?: LogoVariant;
  /** Place on a dark surface: applies `filter: brightness(0) invert(1)` so the black ink turns white. @default false */
  inverse?: boolean;
  /** Base path of the logo files (no trailing slash needed). @default "/ism/assets/logos" */
  src?: string;
  /** Height in px. Full logo 28-40 in headers, 24-32 in footers; mark at least 24; dot.Bible icon at least 32. @default 32 */
  height?: number;
  /** Accessible name. Defaults to the brand name; when the logo is a home link make it the destination, for example "ISM home". */
  alt?: string;
}

/** An ISM or dot.Bible logo as an `<img>`. Never recolour, stretch or outline it. */
export const Logo = forwardRef<HTMLImageElement, LogoProps>(function Logo(
  { variant = 'ism', inverse = false, src = '/ism/assets/logos', height = 32, alt, className, style, ...rest },
  ref,
) {
  const base = src.replace(/\/+$/, '');
  return (
    <img
      ref={ref}
      className={className}
      src={`${base}/${encodeURIComponent(LOGO_FILE[variant])}`}
      alt={alt ?? LOGO_ALT[variant]}
      height={height}
      style={inverse ? { filter: INVERT, ...style } : style}
      {...rest}
    />
  );
});

/** Recommended minimum height in px for a logo variant. */
export const logoMinHeight = MIN_HEIGHT;

export type LogoPatternName = 'circle' | 'dots1' | 'dots2' | 'dots3' | 'dots4' | 'dots5';

const PATTERN_FILE: Record<LogoPatternName, string> = {
  circle: 'Circle-symbol-1.svg',
  dots1: 'Dots 1.png',
  dots2: 'Dots 2.png',
  dots3: 'Dots 3.png',
  dots4: 'Dots 4.png',
  dots5: 'Dots 5.png',
};

export interface LogoPatternProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Which brand pattern. `circle` is the ring (Circle-symbol-1); `dots1`-`dots5` are PNG corner textures. @default "circle" */
  pattern?: LogoPatternName;
  /** Base path of the pattern files. @default "/ism/assets/patterns" */
  src?: string;
  /** Opacity 0-1. Ring: 0.06-0.2 on dark, 0.04-0.1 on light. @default 0.1 */
  opacity?: number;
  /** Invert the black ink to white, for dark surfaces. @default false */
  inverse?: boolean;
}

/** Decorative brand pattern: `alt=""`, `aria-hidden`, no pointer events. Never place behind body text. */
export function LogoPattern({ pattern = 'circle', src = '/ism/assets/patterns', opacity = 0.1, inverse = false, style, ...rest }: LogoPatternProps) {
  const base = src.replace(/\/+$/, '');
  return (
    <img
      src={`${base}/${encodeURIComponent(PATTERN_FILE[pattern])}`}
      alt=""
      aria-hidden="true"
      style={{ pointerEvents: 'none', opacity, filter: inverse ? INVERT : undefined, ...style }}
      {...rest}
    />
  );
}
