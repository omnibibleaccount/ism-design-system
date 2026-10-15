import { useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { uiIcons } from '@ism/tokens/icons-all';
import { directionFor, lineHeightFor, scriptFor } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';

/** Line-height for scripture: the Latin ratio, or the script's own (taller) ratio, never tighter than the Latin one. */
function scriptureLineHeight(lang: string, fontSize: number, latinRatio: number): number {
  const ratio = scriptFor(lang).id === 'latin' ? latinRatio : Math.max(latinRatio, lineHeightFor(lang, 'body'));
  return Math.round(fontSize * ratio);
}

/** Bookmark glyph drawn filled for the saved state (UiIcon is stroke only). */
function SavedGlyph({ color }: { color: string }) {
  const node = uiIcons.bookmark[0];
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Path d={(node[1] as Record<string, string>).d} />
    </Svg>
  );
}

export interface VerseBlockLabels {
  /** Accessible name of the share tool. @default "Share verse" */
  share?: string;
  /** Accessible name of the copy tool. @default "Copy verse" */
  copy?: string;
  /** Accessible name of the bookmark tool. @default "Bookmark verse" */
  bookmark?: string;
  /** Accessible name of the bookmark tool when saved. @default "Remove bookmark" */
  removeBookmark?: string;
}

const DEFAULT_LABELS: Required<VerseBlockLabels> = { share: 'Share verse', copy: 'Copy verse', bookmark: 'Bookmark verse', removeBookmark: 'Remove bookmark' };

interface ToolProps {
  icon: 'share' | 'copy' | 'bookmark';
  label: string;
  onPress?: () => void;
  saved?: boolean;
  dark?: boolean;
  testID?: string;
}

/** 44dp circular verse tool (Share, Copy, Bookmark). Saved state is a toggle with a filled icon. */
function VerseTool({ icon, label, onPress, saved = false, dark = false, testID }: ToolProps) {
  const { colors, radius, size } = useTheme();
  const [focused, setFocused] = useState(false);
  const ink = dark ? (saved ? '#e8c987' : '#ffffff') : saved ? '#0455ad' : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={icon === 'bookmark' ? { selected: saved } : undefined}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      testID={testID}
      style={({ pressed }): ViewStyle => ({
        width: size['control-md'], height: size['control-md'], borderRadius: radius['radius-pill'], alignItems: 'center', justifyContent: 'center',
        borderWidth: 1,
        borderColor: dark ? (saved ? 'rgba(232,201,135,0.6)' : 'rgba(255,255,255,0.22)') : saved ? colors.tintLine : colors.border,
        backgroundColor: dark ? (pressed || saved ? 'rgba(255,255,255,0.12)' : 'transparent') : saved ? colors.tint : pressed ? colors.surfaceMuted : colors.surface,
        ...(focused ? { outlineColor: colors.focus, outlineWidth: size['focus-width'], outlineOffset: size['focus-offset'], outlineStyle: 'solid' as const } : null),
      })}
    >
      {saved && icon === 'bookmark' ? <SavedGlyph color={ink} /> : <UiIcon name={icon} size={20} color={ink} />}
    </Pressable>
  );
}

export interface VerseBlockProps extends ViewProps {
  /** The verse text, exactly as published. Never edited or shortened here. */
  text: string;
  /** Reference, e.g. "John 3:16". */
  reference: string;
  /** Translation abbreviation or name, e.g. "BSB". Always shown after the reference. */
  translation: string;
  /** BCP-47 language of the verse when it differs from the UI language. Sets line-height and direction. */
  lang?: string;
  /** Wrap the verse in curly quotes. @default true */
  quotes?: boolean;
  /** Show the Share tool when set. */
  onShare?: () => void;
  /** Show the Copy tool when set. */
  onCopy?: () => void;
  /** Show the Bookmark tool when set. */
  onBookmark?: () => void;
  /** Bookmark is saved. @default false */
  bookmarked?: boolean;
  /** Accessible names for the tools; override for translation. */
  labels?: VerseBlockLabels;
  style?: StyleProp<ViewStyle>;
}

/** A single Bible verse in serif with its reference and Share, Copy and Bookmark tools. Confirm Copy and Share with a Toast. */
export function VerseBlock({ text, reference, translation, lang, quotes = true, onShare, onCopy, onBookmark, bookmarked = false, labels, style, ...rest }: VerseBlockProps) {
  const { colors, radius, shadow, isDark, spacing, lang: uiLang } = useTheme();
  const language = lang ?? uiLang;
  const l = { ...DEFAULT_LABELS, ...labels };
  const hasTools = !!(onShare || onCopy || onBookmark);
  return (
    <View
      {...rest}
      style={[
        { gap: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], padding: spacing['space-5'] + 4, ...(isDark ? shadow['shadow-card-dark'] : shadow['shadow-card-light']) },
        style,
      ]}
    >
      <Text variant="scripture" lang={language} style={{ fontSize: 21, lineHeight: scriptureLineHeight(language, 21, 1.6), writingDirection: directionFor(language) }}>
        {quotes ? `“${text}”` : text}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing['space-4'] }}>
        <Text variant="web-label" style={{ flexShrink: 1, color: isDark ? colors.link : '#0455ad', fontSize: 14, letterSpacing: 0.14 }}>
          {reference} {'·'} {translation}
        </Text>
        {hasTools ? (
          <View style={{ flexDirection: 'row', gap: spacing['space-2'] }}>
            {onShare ? <VerseTool icon="share" label={l.share} onPress={onShare} /> : null}
            {onCopy ? <VerseTool icon="copy" label={l.copy} onPress={onCopy} /> : null}
            {onBookmark ? <VerseTool icon="bookmark" label={bookmarked ? l.removeBookmark : l.bookmark} onPress={onBookmark} saved={bookmarked} /> : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

export interface VerseOfTheDayProps extends ViewProps {
  /** The verse text, exactly as published. */
  text: string;
  /** Reference, e.g. "Psalm 119:105". */
  reference: string;
  /** Translation abbreviation or name. */
  translation: string;
  /** Eyebrow label; also names the region. @default "Verse of the day" */
  eyebrow?: string;
  /** BCP-47 language of the verse when it differs from the UI language. */
  lang?: string;
  /** Wrap the verse in curly quotes. @default true */
  quotes?: boolean;
  /** Show the Share tool when set. */
  onShare?: () => void;
  /** Show the Bookmark tool when set. */
  onBookmark?: () => void;
  /** Bookmark is saved. @default false */
  bookmarked?: boolean;
  /** Accessible names for the tools; override for translation. */
  labels?: VerseBlockLabels;
  /** Short lead-in under the verse, usually text with a `VerseCitation`, e.g. "Read the whole chapter in the dot.Bible app". */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Dark Verse of the Day hero with gold accents. No blue button lives inside it. */
export function VerseOfTheDay({ text, reference, translation, eyebrow = 'Verse of the day', lang, quotes = true, onShare, onBookmark, bookmarked = false, labels, footer, style, ...rest }: VerseOfTheDayProps) {
  const { radius, spacing, lang: uiLang } = useTheme();
  const language = lang ?? uiLang;
  const l = { ...DEFAULT_LABELS, ...labels };
  const gold = '#e8c987';
  return (
    <View {...rest} accessibilityRole="summary" style={[{ overflow: 'hidden', gap: spacing['space-5'], paddingVertical: spacing['space-6'], paddingHorizontal: spacing['space-5'], borderRadius: radius['radius-lg'], backgroundColor: '#000000' }, style]}>
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', top: -140, start: -120, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(4,109,227,0.22)' }} />
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', bottom: -150, end: -120, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(243,178,90,0.12)' }} />
      <View style={{ alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(232,201,135,0.6)', backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: radius['radius-pill'], paddingHorizontal: 12, paddingVertical: 6 }}>
        <Text variant="web-eyebrow" accessibilityRole="header" style={{ color: gold }}>{eyebrow}</Text>
      </View>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 72, height: 2, borderRadius: 2, backgroundColor: gold }} />
      <Text variant="scripture" lang={language} style={{ color: '#ffffff', fontSize: 26, lineHeight: scriptureLineHeight(language, 26, 1.4), writingDirection: directionFor(language) }}>
        {quotes ? `“${text}”` : text}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing['space-4'] }}>
        <Text variant="web-label" style={{ flexShrink: 1, color: gold, fontSize: 15, letterSpacing: 0.3 }}>{reference} {'·'} {translation}</Text>
        <View style={{ flexDirection: 'row', gap: spacing['space-2'] }}>
          {onShare ? <VerseTool dark icon="share" label={l.share} onPress={onShare} /> : null}
          {onBookmark ? <VerseTool dark icon="bookmark" label={bookmarked ? l.removeBookmark : l.bookmark} onPress={onBookmark} saved={bookmarked} /> : null}
        </View>
      </View>
      {footer ? <Text variant="web-small" style={{ color: 'rgba(255,255,255,0.68)' }}>{footer}</Text> : null}
    </View>
  );
}

export interface VerseCitationProps {
  /** The reference text, e.g. "John 3:3". */
  children: string;
  /** Called on press. */
  onPress?: () => void;
  /** Opens the reader on another page: appends the arrow. Inside the reader, leave off. @default false */
  external?: boolean;
  /** Use on a dark surface. @default false */
  dark?: boolean;
  testID?: string;
}

/** Inline Bible reference inside running text, with a dotted underline. Place it inside a `Text`. */
export function VerseCitation({ children, onPress, external = false, dark = false, testID }: VerseCitationProps) {
  const { isDark } = useTheme();
  const onDark = dark || isDark;
  return (
    <Text
      variant="web-label"
      accessibilityRole="link"
      onPress={onPress}
      testID={testID}
      style={{ color: onDark ? '#7fa6f7' : '#0455ad', fontSize: 15, textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}
    >
      {children}
      {external ? ' ↗' : ''}
    </Text>
  );
}
