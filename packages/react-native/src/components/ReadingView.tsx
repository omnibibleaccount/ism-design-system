import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { directionFor, lineHeightFor, scriptFor } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

/** The four reader text sizes in dp. */
export type ReadingTextSize = 17 | 19 | 22 | 25;
const TEXT_SIZES: readonly ReadingTextSize[] = [17, 19, 22, 25];

/** One verse inside a paragraph. The text is rendered exactly as given. */
export interface ReadingVerse {
  /** Verse number shown small and tertiary before the text. Omit for continuation text. */
  number?: number | string;
  /** Verse text, exactly as published. */
  text: string;
  /** Highlighted by the reader (peach wash that wraps across lines). @default false */
  highlighted?: boolean;
  /** Footnote markers that follow this verse, e.g. ["a"]. Each must match a `ReadingFootnote.marker`. */
  footnotes?: string[];
}

/** A block of the chapter: a section heading (the translation's own) or a paragraph of verses. */
export type ReadingBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; verses: ReadingVerse[] };

/** A footnote shown under the text. */
export interface ReadingFootnote {
  /** Marker letter, e.g. "a". */
  marker: string;
  /** Verse reference in bold, e.g. "3:3". */
  reference: string;
  /** The note. Use nested `Text` for italics. */
  note: ReactNode;
}

export interface ReadingViewLabels {
  /** Name of the text size button. @default "Text size" */
  textSize?: string;
  /** Prefix of the translation button name. @default "Translation" */
  translation?: string;
  /** Name of the listen button; if it contains "{chapter}" it is replaced by `chapterTitle`. @default "Listen to {chapter}" */
  listen?: string;
  /** Name of a footnote marker; "{marker}" is replaced. @default "Footnote {marker}" */
  footnote?: string;
}

export interface ReadingViewProps extends ViewProps {
  /** Book label above the title, e.g. "The Gospel of John". */
  bookLabel?: string;
  /** Chapter title, e.g. "John 3". Also the heading of the screen. */
  chapterTitle: string;
  /** Chapter content: section headings and paragraphs of verses. */
  blocks: ReadingBlock[];
  /** Footnotes shown below the text. */
  footnotes?: ReadingFootnote[];
  /** BCP-47 language of the text. Sets script line-height and direction. Defaults to the theme language. */
  lang?: string;
  /** Text shown on the book/chapter picker button, e.g. "John 3". Defaults to `chapterTitle`. */
  pickerLabel?: string;
  /** Translation abbreviation shown on the translation button, e.g. "BSB". */
  translationLabel: string;
  /** Opens the BookPicker. */
  onPressPicker?: () => void;
  /** Opens the translation list. */
  onPressTranslation?: () => void;
  /** The book picker is open (caret rotates, border turns blue). @default false */
  pickerOpen?: boolean;
  /** The translation list is open. @default false */
  translationOpen?: boolean;
  /** Current text size. Uncontrolled starts at 19. @default 19 */
  textSize?: ReadingTextSize;
  /** Called when a text size is chosen. */
  onTextSizeChange?: (size: ReadingTextSize) => void;
  /** Opens the audio player (the one Horizon Blue control in the bar). Hidden when omitted. */
  onPressListen?: () => void;
  /** Called when a footnote marker is pressed. */
  onPressFootnote?: (marker: string) => void;
  /** Accessible names; override for translation. */
  labels?: ReadingViewLabels;
  /** Render the chapter inside a ScrollView under a fixed bar. Set false to embed in your own scroller. @default true */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}

function ringStyle(color: string, focused: boolean): ViewStyle {
  return focused ? { outlineColor: color, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' } : {};
}

interface PickerButtonProps {
  label: string;
  accessibilityLabel?: string;
  expanded: boolean;
  onPress?: () => void;
  testID?: string;
}

/** Pill button that opens a picker; carries a caret because it opens here. */
function PickerButton({ label, accessibilityLabel, expanded, onPress, testID }: PickerButtonProps) {
  const { colors, radius } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ expanded }}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={testID}
      style={({ pressed }): ViewStyle => ({
        flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, paddingHorizontal: 16, borderRadius: radius['radius-pill'], borderWidth: 1,
        borderColor: expanded ? colors.primary : colors.border, backgroundColor: pressed ? colors.surfaceMuted : colors.surface,
        ...ringStyle(colors.focus, focused),
      })}
    >
      <Text variant="web-label" style={{ fontSize: 15 }}>{label}</Text>
      <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
        <UiIcon name="chevron-down" size={16} color={colors.textBody} />
      </View>
    </Pressable>
  );
}

export interface TextSizeControlProps extends ViewProps {
  /** Selected size. */
  value: ReadingTextSize;
  /** Called with the chosen size. */
  onChange: (size: ReadingTextSize) => void;
  /** Group name. @default "Text size" */
  accessibilityLabel?: string;
}

/** Four-step text size radio group (17, 19, 22, 25). The selected step is a white pill. */
export function TextSizeControl({ value, onChange, accessibilityLabel = 'Text size', style, ...rest }: TextSizeControlProps) {
  const { colors, radius, isDark } = useTheme();
  const steps = [14, 17, 19, 21];
  return (
    <View
      {...rest}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[{ flexDirection: 'row', gap: 6, padding: 6, borderRadius: radius['radius-pill'], backgroundColor: colors.surfaceMuted, alignSelf: 'flex-start' }, style]}
    >
      {TEXT_SIZES.map((s, i) => {
        const on = s === value;
        return (
          <Pressable
            key={s}
            accessibilityRole="radio"
            accessibilityLabel={String(s)}
            accessibilityState={{ checked: on }}
            onPress={() => onChange(s)}
            style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: radius['radius-pill'], backgroundColor: on ? (isDark ? colors.border : colors.surface) : 'transparent', ...(on ? { shadowColor: '#000000', shadowOpacity: 0.15, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : null) }}
          >
            <Text variant="scripture" serif style={{ fontSize: steps[i], lineHeight: steps[i] + 6, fontWeight: on ? '600' : '400' }}>{String(s)}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** The chapter reader: a bar with book and translation pickers, text size and listen, over a single serif column. */
export function ReadingView({
  bookLabel, chapterTitle, blocks, footnotes, lang, pickerLabel, translationLabel, onPressPicker, onPressTranslation, pickerOpen = false, translationOpen = false,
  textSize, onTextSizeChange, onPressListen, onPressFootnote, labels, scrollable = true, style, ...rest
}: ReadingViewProps) {
  const theme = useTheme();
  const { colors, radius, layout, spacing, isDark } = theme;
  const { width } = useWindowDimensions();
  const compact = width < layout['breakpoint-mobile'] + 1;
  const language = lang ?? theme.lang;
  const dir = directionFor(language);
  const [localSize, setLocalSize] = useState<ReadingTextSize>(19);
  const [sizeOpen, setSizeOpen] = useState(false);
  const size = textSize ?? localSize;
  const l = { textSize: 'Text size', translation: 'Translation', listen: 'Listen to {chapter}', footnote: 'Footnote {marker}', ...labels };
  const ratio = scriptFor(language).id === 'latin' ? 1.7 : Math.max(1.7, lineHeightFor(language, 'body'));
  const lineHeight = Math.round(size * ratio);
  const verseNo = colors.textTertiary;
  const highlight = isDark ? 'rgba(243,178,90,0.28)' : 'rgba(246,217,173,0.7)';
  const [aaFocused, setAaFocused] = useState(false);

  const choose = (s: ReadingTextSize) => { setLocalSize(s); onTextSizeChange?.(s); };

  const bar = (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing['space-3'], minHeight: 68, paddingHorizontal: spacing['space-4'], borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: isDark ? 'rgba(22,24,25,0.96)' : 'rgba(255,255,255,0.96)' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing['space-2'], flexShrink: 1 }}>
        <PickerButton label={pickerLabel ?? chapterTitle} expanded={pickerOpen} onPress={onPressPicker} />
        <PickerButton label={translationLabel} accessibilityLabel={`${l.translation}: ${translationLabel}`} expanded={translationOpen} onPress={onPressTranslation} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing['space-2'] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={l.textSize}
          accessibilityState={{ expanded: sizeOpen }}
          onPress={() => setSizeOpen((o) => !o)}
          onFocus={() => setAaFocused(true)}
          onBlur={() => setAaFocused(false)}
          style={({ pressed }): ViewStyle => ({ width: 44, height: 44, borderRadius: radius['radius-pill'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.surfaceMuted : colors.surface, ...ringStyle(colors.focus, aaFocused) })}
        >
          <Text variant="scripture" serif style={{ fontSize: 17, lineHeight: 22, fontWeight: '600' }} accessibilityElementsHidden importantForAccessibility="no">Aa</Text>
        </Pressable>
        {onPressListen ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={l.listen.replace('{chapter}', chapterTitle)}
            onPress={onPressListen}
            style={({ pressed }): ViewStyle => ({ width: 44, height: 44, borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.primaryPressed : colors.primary })}
          >
            <UiIcon name="play" size={20} color="#ffffff" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  const column = (
    <View style={{ width: '100%', maxWidth: layout['measure-scripture'], alignSelf: 'center', paddingHorizontal: compact ? spacing['space-5'] : 40, paddingTop: compact ? spacing['space-6'] : spacing['space-7'], paddingBottom: compact ? spacing['space-6'] : 40 }}>
      {sizeOpen ? <TextSizeControl value={size} onChange={choose} accessibilityLabel={l.textSize} style={{ marginBottom: spacing['space-5'] }} /> : null}
      {bookLabel ? <Text variant="web-overline" tone="secondary" lang={language} style={{ marginBottom: spacing['space-2'] }}>{bookLabel}</Text> : null}
      <Text variant={compact ? 'print-h3' : 'print-h2'} accessibilityRole="header" lang={language} style={{ writingDirection: dir }}>{chapterTitle}</Text>
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return <Text key={i} variant="web-h4" accessibilityRole="header" lang={language} style={{ marginTop: 28, marginBottom: 10, writingDirection: dir }}>{block.text}</Text>;
        }
        return (
          <Text key={i} variant="scripture" lang={language} style={{ fontSize: size, lineHeight, marginTop: i === 0 ? spacing['space-4'] : size, writingDirection: dir }}>
            {block.verses.map((v, j) => (
              <Text key={j} variant="scripture" lang={language} style={{ fontSize: size, lineHeight }}>
                {v.number !== undefined ? <Text variant="web-label" selectable={false} style={{ fontSize: 12, color: verseNo }}>{`${v.number} `}</Text> : null}
                {v.highlighted ? <Text variant="scripture" lang={language} style={{ fontSize: size, lineHeight, backgroundColor: highlight }}>{v.text}</Text> : v.text}
                {(v.footnotes ?? []).map((m) => (
                  <Text
                    key={m}
                    variant="web-label"
                    accessibilityRole="link"
                    accessibilityLabel={l.footnote.replace('{marker}', m)}
                    onPress={() => onPressFootnote?.(m)}
                    style={{ fontSize: 11, color: colors.link, fontStyle: 'italic' }}
                  >{m}</Text>
                ))}
                {j < block.verses.length - 1 ? ' ' : ''}
              </Text>
            ))}
          </Text>
        );
      })}
      {footnotes && footnotes.length > 0 ? (
        <View style={{ marginTop: 28, paddingTop: spacing['space-4'], borderTopWidth: 1, borderTopColor: colors.border, gap: spacing['space-2'] }}>
          {footnotes.map((f) => (
            <View key={f.marker} style={{ flexDirection: 'row', gap: spacing['space-2'] }}>
              <Text variant="web-small" style={{ fontStyle: 'italic', fontWeight: '600', color: colors.link, fontSize: 14 }}>{f.marker}</Text>
              <Text variant="web-small" tone="body" style={{ flex: 1, fontSize: 14, lineHeight: 21 }}>
                <Text variant="web-label" style={{ fontSize: 14 }}>{f.reference}</Text>
                {' '}
                {f.note}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );

  return (
    <View
      {...rest}
      style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], overflow: 'hidden' }, style]}
    >
      {bar}
      {scrollable ? <ScrollView>{column}</ScrollView> : column}
    </View>
  );
}
