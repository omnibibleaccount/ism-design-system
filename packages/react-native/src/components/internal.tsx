// Shared helpers for the primitives group. Lower-case file name: not exported from the package index.
import { useState } from 'react';
import { View, type TextStyle } from 'react-native';
import { scriptFor } from '@ism/tokens/native';
import { fontFor, type FontWeightName } from '../fonts';
import { useTheme } from '../theme';

/** Visible 2dp focus ring drawn outside (or inside, with a negative `inset`) the parent. Parent must not clip it. */
export function FocusRing({ visible, radius, color, inset = 4 }: { visible: boolean; radius: number; color: string; inset?: number }) {
  if (!visible) return null;
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{ position: 'absolute', top: -inset, bottom: -inset, start: -inset, end: -inset, borderWidth: 2, borderColor: color, borderRadius: radius < 0 ? 0 : radius + inset }}
    />
  );
}

/** Focus state and handlers for `onFocus`/`onBlur` (keyboard and switch control). */
export function useFocus() {
  const [focused, setFocused] = useState(false);
  return { focused, handlers: { onFocus: () => setFocused(true), onBlur: () => setFocused(false) } };
}

/** Text style that applies a static font weight for Latin text and `fontWeight` for other scripts. */
export function weightStyle(weight: FontWeightName, lang: string, serif = false): TextStyle {
  return scriptFor(lang).id === 'latin' ? { fontFamily: fontFor(serif ? 'serif' : 'sans', weight) } : { fontWeight: weight };
}

/** Script-aware text treatments: uppercase and tracking only apply to Latin script. */
export function useScript(lang?: string) {
  const theme = useTheme();
  const language = lang ?? theme.lang;
  const latin = scriptFor(language).id === 'latin';
  return {
    latin,
    language,
    upper: (latin ? { textTransform: 'uppercase' } : { textTransform: 'none' }) as TextStyle,
    tracking: (em: number, size: number): TextStyle => (latin ? { letterSpacing: em * size } : { letterSpacing: 0 }),
    weight: (w: FontWeightName, serif = false) => weightStyle(w, language, serif),
  };
}
