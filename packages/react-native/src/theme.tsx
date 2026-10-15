import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { I18nManager, useColorScheme } from 'react-native';
import { color, spacing, radius, shadow, duration, size, opacity, layout, zIndex } from '@ism/tokens/native';
import { directionFor, scriptFor, type ScriptId } from '@ism/tokens/native';

export type ColorScheme = 'light' | 'dark';

/** Semantic colours for one scheme. Always read colours through the theme, never raw hex. */
export interface ThemeColors {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textBody: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  link: string;
  focus: string;
  error: string;
  errorBg: string;
  errorLine: string;
  success: string;
  successBg: string;
  successLine: string;
  warning: string;
  warningBg: string;
  warningLine: string;
  info: string;
  infoBg: string;
  infoLine: string;
  live: string;
  tint: string;
  tintLine: string;
  disabledBg: string;
  disabledText: string;
  scrim: string;
}

export interface Theme {
  scheme: ColorScheme;
  isDark: boolean;
  /** BCP-47 language of the content, used for line-height and letter-spacing per script. */
  lang: string;
  script: ScriptId;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  duration: typeof duration;
  size: typeof size;
  opacity: typeof opacity;
  layout: typeof layout;
  zIndex: typeof zIndex;
}

const light: ThemeColors = {
  background: color['off-white'], surface: color['white'], surfaceMuted: color['gray-100'],
  text: color['black'], textBody: color['gray-700'], textSecondary: color['text-secondary-light'], textTertiary: color['gray-600'],
  border: color['border-hairline-light'], primary: color['horizon-blue'], primaryPressed: color['horizon-blue-dim'], onPrimary: color['white'],
  link: color['horizon-blue'], focus: color['horizon-blue'],
  error: color['error'], errorBg: color['error-bg'], errorLine: color['error-line'],
  success: color['success'], successBg: color['success-bg'], successLine: color['success-line'],
  warning: color['warning'], warningBg: color['warning-bg'], warningLine: color['warning-line'],
  info: color['info'], infoBg: color['blue-tint'], infoLine: color['blue-tint-line'],
  live: color['live'], tint: color['blue-tint'], tintLine: color['blue-tint-line'],
  disabledBg: color['gray-100'], disabledText: color['gray-600'], scrim: opacity['scrim-sheet'],
};
const dark: ThemeColors = {
  background: color['black'], surface: color['charcoal-900'], surfaceMuted: color['charcoal-800'],
  text: color['white'], textBody: color['text-secondary-dark'], textSecondary: color['text-secondary-dark'], textTertiary: color['text-tertiary-dark'],
  border: color['border-hairline-dark'], primary: color['horizon-blue'], primaryPressed: color['sky-blue'], onPrimary: color['white'],
  link: color['blue-on-dark'], focus: color['blue-on-dark'],
  error: color['error-on-dark'], errorBg: 'rgba(245,163,155,0.12)', errorLine: 'rgba(245,163,155,0.4)',
  success: color['success-on-dark'], successBg: 'rgba(127,214,163,0.12)', successLine: 'rgba(127,214,163,0.4)',
  warning: color['leather-gold'], warningBg: 'rgba(232,201,135,0.12)', warningLine: 'rgba(232,201,135,0.4)',
  info: color['blue-on-dark'], infoBg: 'rgba(127,166,247,0.12)', infoLine: 'rgba(127,166,247,0.4)',
  live: color['live'], tint: 'rgba(127,166,247,0.12)', tintLine: 'rgba(127,166,247,0.4)',
  disabledBg: color['charcoal-800'], disabledText: color['text-tertiary-dark'], scrim: opacity['scrim-modal'],
};

export function buildTheme(scheme: ColorScheme, lang = 'en', rtlOverride?: boolean): Theme {
  const dir = rtlOverride === undefined ? directionFor(lang) : rtlOverride ? 'rtl' : 'ltr';
  return {
    scheme, isDark: scheme === 'dark', lang, script: scriptFor(lang).id, dir, isRTL: dir === 'rtl',
    colors: scheme === 'dark' ? dark : light,
    spacing, radius, shadow, duration, size, opacity, layout, zIndex,
  };
}

const ThemeContext = createContext<Theme>(buildTheme('light'));

export interface ISMThemeProviderProps {
  /** 'system' follows the device. @default "system" */
  scheme?: ColorScheme | 'system';
  /** BCP-47 language tag of the UI/content, e.g. "am", "ar". Drives script line-height and RTL. @default "en" */
  lang?: string;
  children: ReactNode;
}

/**
 * Provides colours, spacing and script-aware typography. For RTL languages call
 * `I18nManager.forceRTL(true)` once at app start (and restart the app) so native layout mirrors; the theme
 * reports `isRTL` from the language so components can flip glyphs.
 */
export function ISMThemeProvider({ scheme = 'system', lang = 'en', children }: ISMThemeProviderProps) {
  const system = useColorScheme();
  const resolved: ColorScheme = scheme === 'system' ? (system === 'dark' ? 'dark' : 'light') : scheme;
  const value = useMemo(() => buildTheme(resolved, lang, I18nManager.isRTL || undefined), [resolved, lang]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Current theme. Works without a provider (light, English). */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
