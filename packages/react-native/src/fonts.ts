import { Platform } from 'react-native';

/**
 * React Native cannot pick weights from a variable font reliably, so the app ships static files
 * (generated into packages/web/assets/fonts-static and copied to ./fonts). Register them with expo-font
 * or by linking the folder (react-native.config.js `assets`), using the file names below as the family names.
 */
export const fontFiles = [
  'Inter-Regular', 'Inter-Medium', 'Inter-SemiBold', 'Inter-Bold',
  'Lora-Regular', 'Lora-SemiBold', 'Lora-Bold', 'Lora-Italic', 'Lora-SemiBoldItalic', 'Lora-BoldItalic',
] as const;
export type FontFile = (typeof fontFiles)[number];

export type FontFamilyName = 'sans' | 'serif';
export type FontWeightName = '400' | '500' | '600' | '700';

/** Resolve a registered font family name for a family, weight and style. */
export function fontFor(family: FontFamilyName, weight: FontWeightName | string = '400', italic = false): FontFile {
  if (family === 'sans') return weight === '700' ? 'Inter-Bold' : weight === '600' ? 'Inter-SemiBold' : weight === '500' ? 'Inter-Medium' : 'Inter-Regular';
  if (weight === '700') return italic ? 'Lora-BoldItalic' : 'Lora-Bold';
  if (weight === '600') return italic ? 'Lora-SemiBoldItalic' : 'Lora-SemiBold';
  return italic ? 'Lora-Italic' : 'Lora-Regular';
}

/**
 * Non-Latin fallbacks. React Native has no font-stack: text in Ethiopic, Myanmar and Arabic script falls back to the
 * platform font, which is acceptable (Noto on Android, system fonts on iOS). Do not force Inter on those scripts.
 */
export const platformFallback = Platform.select({ ios: 'System', default: 'sans-serif' }) as string;
