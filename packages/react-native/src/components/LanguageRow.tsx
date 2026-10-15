import { Children, cloneElement, isValidElement, useState, type ReactElement } from 'react';
import { Pressable, View, useWindowDimensions, type PressableProps, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { directionFor, lineHeightFor, scriptFor } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';

/** Formats a language can offer, in the only order they are shown. */
export type LanguageFormat = 'read' | 'listen' | 'print' | 'app';
const ORDER: readonly LanguageFormat[] = ['read', 'listen', 'print', 'app'];
const ICON: Record<LanguageFormat, UiIconProps['name']> = { read: 'book-open', listen: 'headphones', print: 'file', app: 'phone' };

export interface LanguageFormatLabels {
  /** @default "Read" */
  read?: string;
  /** @default "Listen" */
  listen?: string;
  /** @default "Print" */
  print?: string;
  /** @default "App" */
  app?: string;
}
const DEFAULT_FORMAT_LABELS: Required<LanguageFormatLabels> = { read: 'Read', listen: 'Listen', print: 'Print', app: 'App' };

interface LanguageEntryProps extends Omit<PressableProps, 'children' | 'style'> {
  /** Native-script name, shown first. Never show only the English name. */
  nativeName: string;
  /** BCP-47 tag of the native name, e.g. "am", "my", "ur". Sets font fallback, line-height and direction. */
  nativeLang: string;
  /** English name exactly as in the directory, e.g. "Burmese". */
  englishName: string;
  /** Formats that exist for this language. Shown in the order Read, Listen, Print, App. */
  formats: LanguageFormat[];
  /** Badge words; override for translation. */
  formatLabels?: LanguageFormatLabels;
  style?: StyleProp<ViewStyle>;
}

function ringStyle(color: string, on: boolean): ViewStyle {
  return on ? { outlineColor: color, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' } : {};
}

function nativeStyle(lang: string, fontSize: number) {
  const latin = scriptFor(lang).id === 'latin';
  const ratio = latin ? 1.3 : Math.max(1.3, lineHeightFor(lang, 'heading'));
  return { fontSize, lineHeight: Math.round(fontSize * ratio), writingDirection: directionFor(lang) } as const;
}

function Badges({ formats, labels, onTint }: { formats: LanguageFormat[]; labels: Required<LanguageFormatLabels>; onTint?: boolean }) {
  const { colors, radius } = useTheme();
  const list = ORDER.filter((f) => formats.includes(f));
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {list.map((f) => (
        <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 28, paddingHorizontal: 10, borderRadius: radius['radius-pill'], backgroundColor: onTint ? colors.surface : colors.surfaceMuted }}>
          <UiIcon name={ICON[f]} size={14} />
          <Text variant="web-label" style={{ fontSize: 13, lineHeight: 16 }}>{labels[f]}</Text>
        </View>
      ))}
    </View>
  );
}

function accessibleName(p: LanguageEntryProps, labels: Required<LanguageFormatLabels>, extra?: string) {
  const fmts = ORDER.filter((f) => p.formats.includes(f)).map((f) => labels[f]).join(', ');
  return [p.nativeName, p.englishName, extra, fmts].filter(Boolean).join(', ');
}

export interface LanguageRowProps extends LanguageEntryProps {
  /** Draw the hairline above this row. `LanguageList` sets it for every row after the first. @default false */
  divider?: boolean;
}

/** One directory entry as a list row: native name, English name, format badges and an arrow. The whole row is one link. */
export function LanguageRow(props: LanguageRowProps) {
  const { nativeName, nativeLang, englishName, formats, formatLabels, divider = false, style, accessibilityLabel, ...rest } = props;
  const { colors, radius, opacity } = useTheme();
  const { width } = useWindowDimensions();
  const narrow = width < 768;
  const labels = { ...DEFAULT_FORMAT_LABELS, ...formatLabels };
  const [focus, setFocus] = useState(false);
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? accessibleName(props, labels)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
      style={({ pressed }) => [
        {
          flexDirection: 'row', alignItems: 'center', gap: narrow ? 12 : 20, minHeight: 72, paddingVertical: narrow ? 12 : 10, paddingHorizontal: narrow ? 12 : 16, borderRadius: radius['radius-md'],
          opacity: rest.disabled ? opacity['opacity-disabled'] : 1, backgroundColor: pressed ? colors.tint : 'transparent', borderTopWidth: divider ? 1 : 0, borderTopColor: colors.surfaceMuted, ...ringStyle(colors.focus, focus),
        } as ViewStyle,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          <View style={{ flex: 1, minWidth: 0, gap: narrow ? 6 : 0, flexDirection: narrow ? 'column' : 'row', alignItems: narrow ? 'flex-start' : 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', columnGap: 14, minWidth: 0, flexShrink: 1 }}>
              <Text variant="web-h4" lang={nativeLang} style={nativeStyle(nativeLang, 22)}>{nativeName}</Text>
              <Text variant="body-sm" tone="tertiary" style={{ fontSize: 14 }}>{englishName}</Text>
            </View>
            <Badges formats={formats} labels={labels} onTint={pressed} />
          </View>
          <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <Text variant="web-body" style={{ fontSize: 18, color: pressed ? colors.link : colors.textBody }}>{'↗'}</Text>
          </View>
        </>
      )}
    </Pressable>
  );
}

export interface LanguageListProps extends ViewProps {
  /** `LanguageRow` elements. Keep order stable while filtering. */
  children: ReactElement<LanguageRowProps> | ReactElement<LanguageRowProps>[];
  style?: StyleProp<ViewStyle>;
}

/** Card container for `LanguageRow`s, with hairlines between them. */
export function LanguageList({ children, style, ...rest }: LanguageListProps) {
  const { colors, radius, spacing } = useTheme();
  return (
    <View {...rest} style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], padding: spacing['space-2'] }, style]}>
      {Children.toArray(children).map((child, i) => (isValidElement<LanguageRowProps>(child) ? cloneElement(child, { divider: i > 0 }) : child))}
    </View>
  );
}

export interface LanguageCardProps extends LanguageEntryProps {
  /** Meta line: "Language · Country · speakers (sample)". Mark unconfirmed speaker counts "(sample)". */
  meta?: string;
}

/** Featured language as a card: larger native name, meta line, badges and an arrow. */
export function LanguageCard(props: LanguageCardProps) {
  const { nativeName, nativeLang, englishName, formats, formatLabels, meta, style, accessibilityLabel, ...rest } = props;
  const { colors, radius, shadow, spacing, isDark, opacity } = useTheme();
  const labels = { ...DEFAULT_FORMAT_LABELS, ...formatLabels };
  const [focus, setFocus] = useState(false);
  const burmese = scriptFor(nativeLang).id === 'myanmar';
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel ?? accessibleName(props, labels, meta)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
      style={({ pressed }) => [
        {
          gap: 14, opacity: rest.disabled ? opacity['opacity-disabled'] : 1, padding: spacing['space-5'], borderRadius: radius['radius-lg'], borderWidth: 1, borderColor: pressed ? 'rgba(0,0,0,0.2)' : colors.border, backgroundColor: colors.surface,
          ...(pressed ? shadow['shadow-lift'] : isDark ? shadow['shadow-card-dark'] : shadow['shadow-card-light']), ...ringStyle(colors.focus, focus),
        } as ViewStyle,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing['space-3'] }}>
            <Text variant="web-h3" lang={nativeLang} style={{ flexShrink: 1, ...nativeStyle(nativeLang, burmese ? 28 : 32) }}>{nativeName}</Text>
            <Text variant="web-body" accessibilityElementsHidden importantForAccessibility="no" style={{ fontSize: 18, color: pressed ? colors.link : colors.textBody }}>{'↗'}</Text>
          </View>
          <Text variant="web-small" tone="tertiary">{meta ?? englishName}</Text>
          <Badges formats={formats} labels={labels} />
        </>
      )}
    </Pressable>
  );
}
