
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { color } from '@ism/tokens/native';
import { Text } from '../Text';
import { useTheme } from '../theme';
import { useScript } from './internal';
import { Avatar, type AvatarProps } from './Avatar';
import { ContentCard } from './Card';
import { Thread, type GradientComponent } from './Divider';

/* ---------- Pull quote ---------- */

export interface PullQuoteProps extends Omit<ViewProps, 'children'> {
  /** The quote text, under about 35 words. Trim with an ellipsis rather than shrinking the type. */
  children: string;
  /** Person's name, shown bold in the caption. */
  author: string;
  /** Role and place after the name ("Radio Hope listener, Addis Ababa"). */
  byline?: string;
  /** BCP-47 language of the quote when it is not the UI language ("am"). Drives line-height, direction and font fallback. */
  quoteLang?: string;
  /** Gradient view such as `LinearGradient` for the 64dp thread rule; solid `gradient-violet` without it. */
  GradientComponent?: GradientComponent;
  style?: StyleProp<ViewStyle>;
}

/** Large Lora pull quote with a gold quote mark and a thread rule. One per screen. */
export function PullQuote({ children, author, byline, quoteLang, GradientComponent: Gradient, style, ...rest }: PullQuoteProps) {
  const { colors } = useTheme();
  const s = useScript(quoteLang);
  return (
    <View accessible accessibilityLabel={`${children} ${author}${byline ? `, ${byline}` : ''}`} style={[{ gap: 20, paddingVertical: 8, paddingEnd: 8 }, style]} {...rest}>
      <Text variant="scripture" lang={quoteLang} accessibilityElementsHidden importantForAccessibility="no" style={{ fontSize: 96, lineHeight: 58, height: 44, color: color['gradient-gold'], includeFontPadding: false }}>{'“'}</Text>
      <Text variant="scripture" lang={quoteLang} style={[{ fontSize: 34, color: colors.text }, s.latin ? { lineHeight: 46, letterSpacing: -0.34 } : null]}>{children}</Text>
      <Thread GradientComponent={Gradient} style={{ width: 64, alignSelf: 'flex-start' }} />
      <Text variant="web-small" tone="secondary">
        <Text variant="web-small" style={s.weight('600')}>{author}</Text>
        {byline ? ` · ${byline}` : ''}
      </Text>
    </View>
  );
}

/* ---------- Testimonial ---------- */

export interface TestimonialProps extends Omit<ViewProps, 'children'> {
  /** The quote. Include the quotation marks you want shown. Use only real, consented quotes. */
  children: string;
  /** Person's name. */
  name: string;
  /** Role and place ("Partner pastor · Lima, Peru"). */
  byline?: string;
  /** Photo URL for the 56dp avatar. Initials show when omitted. */
  avatarSrc?: string;
  /** Extra avatar props. The avatar is always decorative because the name is visible. */
  avatarProps?: Omit<AvatarProps, 'src' | 'name' | 'size' | 'decorative'>;
  /** BCP-47 language of the quote when it is not the UI language. */
  quoteLang?: string;
  style?: StyleProp<ViewStyle>;
}

/** Testimonial card: 18dp quote above a 56dp avatar, name and role. */
export function Testimonial({ children, name, byline, avatarSrc, avatarProps, quoteLang, style, ...rest }: TestimonialProps) {
  const s = useScript(quoteLang);
  return (
    <ContentCard variant="default" style={[{ gap: 20 }, style]} {...rest}>
      <Text variant="web-body" lang={quoteLang} style={[{ color: color['charcoal-900'] }, s.latin ? { lineHeight: 29 } : null]}>{children}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Avatar src={avatarSrc} name={name} size={56} decorative {...avatarProps} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="web-label" style={[{ fontSize: 16 }]}>{name}</Text>
          {byline ? <Text variant="web-small" tone="tertiary" style={{ fontSize: 14 }}>{byline}</Text> : null}
        </View>
      </View>
    </ContentCard>
  );
}

/* ---------- Scripture quote ---------- */

export interface ScriptureVerse {
  /** Verse number, shown as a superscript. */
  number: number | string;
  /** Verse text. */
  text: string;
}

export interface ScriptureQuoteProps extends Omit<ViewProps, 'children'> {
  /** Verses with their numbers. Alternatively pass `children` for unnumbered text. */
  verses?: ScriptureVerse[];
  /** Plain scripture text when there are no verse numbers. Used when `verses` is empty. */
  children?: string;
  /** Full reference: book, chapter:verse ("John 3:16"). */
  reference: string;
  /** Translation abbreviation ("BSB"), shown after the reference. */
  translation?: string;
  /** On a dark surface. Defaults to the theme scheme. */
  dark?: boolean;
  /** BCP-47 language of the scripture text when it is not the UI language ("am", "ar"). */
  quoteLang?: string;
  style?: StyleProp<ViewStyle>;
}

/** Scripture in Lora with a gold rule, superscript verse numbers and a full reference. Never italic. */
export function ScriptureQuote({ verses, children, reference, translation, dark, quoteLang, style, ...rest }: ScriptureQuoteProps) {
  const theme = useTheme();
  const s = useScript(quoteLang);
  const isDark = dark ?? theme.isDark;
  const ink = isDark ? '#ffffff' : color['charcoal-900'];
  const numColor = isDark ? color['blue-on-dark'] : color['horizon-blue-dim'];
  const label = `${(verses?.length ? verses.map((v) => `${v.number} ${v.text}`).join(' ') : children) ?? ''} ${reference}${translation ? ` ${translation}` : ''}`;
  return (
    <View
      accessible
      accessibilityLabel={label}
      style={[{ flexDirection: 'row', gap: theme.spacing['space-5'], paddingVertical: 28, paddingHorizontal: theme.spacing['space-6'], borderRadius: theme.radius['radius-lg'], borderWidth: 1, backgroundColor: isDark ? color['charcoal-900'] : theme.colors.surface, borderColor: isDark ? 'transparent' : color['gray-200'] }, style]}
      {...rest}
    >
      <View style={{ width: 3, borderRadius: theme.radius['radius-xs'], alignSelf: 'stretch', backgroundColor: isDark ? color['leather-gold'] : color['gradient-gold'] }} />
      <View style={{ flex: 1, gap: 14 }}>
        <Text variant="scripture" lang={quoteLang} style={[{ fontSize: 22, color: ink }, s.latin ? { lineHeight: 35 } : null]}>
          {verses && verses.length
            ? verses.map((v, i) => (
                <Text key={`${v.number}-${i}`} variant="scripture" lang={quoteLang} style={{ fontSize: 22, color: ink }}>
                  {i > 0 ? ' ' : ''}
                  <View style={{ transform: [{ translateY: -8 }], marginEnd: 2 }}>
                    <Text variant="web-label" style={{ fontSize: 12, lineHeight: 14, color: numColor }}>{String(v.number)}</Text>
                  </View>
                  {v.text}
                </Text>
              ))
            : children}
        </Text>
        <Text variant="web-label" style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.75)' : color['gray-700'] }}>
          {reference}
          {translation ? <Text variant="web-small" style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.55)' : color['gray-600'] }}>{` · ${translation}`}</Text> : null}
        </Text>
      </View>
    </View>
  );
}

