import { scripts } from './generated.js';

export type ScriptId = (typeof scripts)[number]['id'];

/** Primary subtag of a BCP-47 tag: "am-ET" -> "am", "zh-Hans" -> "zh". */
const primary = (lang: string): string => lang.toLowerCase().split(/[-_]/)[0] ?? '';

/** The ISM script record for a language tag. Unknown languages fall back to "latin". */
export function scriptFor(lang: string): (typeof scripts)[number] {
  const p = primary(lang);
  return (scripts as readonly (typeof scripts)[number][]).find((s) => (s.languages as readonly string[]).includes(p)) ?? scripts[0];
}

/** True for Arabic-script languages that need dir="rtl" (ar, fa, ur). */
export const isRtl = (lang: string): boolean => scriptFor(lang).dir === 'rtl';

/** Value for the HTML `dir` attribute. */
export const directionFor = (lang: string): 'ltr' | 'rtl' => (isRtl(lang) ? 'rtl' : 'ltr');

/** Recommended unitless line-height for body copy or headings in a language. */
export function lineHeightFor(lang: string, role: 'body' | 'heading' = 'body'): number {
  const s = scriptFor(lang);
  return role === 'body' ? s.lineHeightBody : s.lineHeightHeading;
}

/** Alias kept for readability in React: `<html lang={scriptLang("am")}>`. */
export const scriptLang = (lang: string): string => primary(lang);
