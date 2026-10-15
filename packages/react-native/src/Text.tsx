import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { typography } from '@ism/tokens/native';
import { lineHeightFor, scriptFor } from '@ism/tokens/native';
import { fontFor, type FontFamilyName } from './fonts';
import { useTheme } from './theme';

export type TextVariant = keyof typeof typography;
export type TextTone = 'primary' | 'body' | 'secondary' | 'tertiary' | 'link' | 'error' | 'success' | 'onPrimary' | 'inverse';

export interface TextProps extends RNTextProps {
  /** Type style from the design tokens (e.g. "web-body", "web-h3", "scripture"). @default "web-body" */
  variant?: TextVariant;
  /** Semantic colour. @default "primary" */
  tone?: TextTone;
  /** Override the theme language for this text, e.g. a verse in another language than the UI. Drives line-height, letter-spacing and RTL alignment. */
  lang?: string;
  /** Use the serif face (Lora). Scripture variants use it automatically. @default false */
  serif?: boolean;
}

const HEADING = /h[1-4]|display|pull-quote|editorial/;

/** Text with ISM type styles, static font weights and per-script line-height and tracking. */
export function Text({ variant = 'web-body', tone = 'primary', lang, serif, style, ...rest }: TextProps) {
  const theme = useTheme();
  const t = typography[variant] as { fontFamily: string; fontSize: number; lineHeight: number; fontWeight?: string; fontStyle?: string; letterSpacing?: number; textTransform?: string };
  const language = lang ?? theme.lang;
  const nonLatin = scriptFor(language).id !== 'latin';
  const family: FontFamilyName = serif || /Lora/i.test(t.fontFamily) ? 'serif' : 'sans';
  const italic = t.fontStyle === 'italic';
  const colors = theme.colors;
  const tones: Record<TextTone, string> = {
    primary: colors.text, body: colors.textBody, secondary: colors.textSecondary, tertiary: colors.textTertiary,
    link: colors.link, error: colors.error, success: colors.success, onPrimary: colors.onPrimary, inverse: theme.isDark ? '#000000' : '#ffffff',
  };
  const base: TextStyle = {
    fontFamily: nonLatin ? undefined : fontFor(family, t.fontWeight ?? '400', italic),
    fontWeight: nonLatin ? ((t.fontWeight as TextStyle['fontWeight']) ?? '400') : undefined,
    fontSize: t.fontSize,
    lineHeight: nonLatin ? Math.round(t.fontSize * lineHeightFor(language, HEADING.test(variant) ? 'heading' : 'body')) : t.lineHeight,
    letterSpacing: nonLatin ? 0 : t.letterSpacing,
    textTransform: nonLatin ? 'none' : (t.textTransform as TextStyle['textTransform']),
    fontStyle: nonLatin ? 'normal' : undefined,
    color: tones[tone],
    textAlign: 'auto',
    writingDirection: (lang ? undefined : theme.dir) as TextStyle['writingDirection'],
  };
  return <RNText allowFontScaling {...rest} style={[base, style]} />;
}
