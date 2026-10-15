import { useState, type ReactNode } from 'react';
import { ImageBackground, Pressable, View, useWindowDimensions, type ImageSourcePropType, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { directionFor } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon, type UiIconProps } from '../Icon';
import { Button } from './Button';

const GOLD = '#e8c987';
const LEATHER = '#121212';

export interface BibleCardLabels {
  /** Tile labels. @default "Read" */
  read?: string;
  /** @default "Listen" */
  listen?: string;
  /** @default "Order" */
  order?: string;
  /** @default "Get the app" */
  getApp?: string;
  /** Copy link button. @default "Copy link" */
  copyLink?: string;
  /** Share button. @default "Share…" */
  share?: string;
}

const DEFAULT_LABELS: Required<BibleCardLabels> = { read: 'Read', listen: 'Listen', order: 'Order', getApp: 'Get the app', copyLink: 'Copy link', share: 'Share…' };

interface BibleCardBase extends ViewProps {
  /** Native-script language name, shown first and largest, e.g. "አማርኛ". Never translated. */
  nativeName: string;
  /** BCP-47 language of the native name; sets font fallback, line-height and direction, e.g. "am", "ur". */
  nativeLang?: string;
  /** Leather texture. Falls back to near-black when omitted, so no remote image is needed. */
  leather?: ImageSourcePropType;
  /** Labels; override for translation. */
  labels?: BibleCardLabels;
  style?: StyleProp<ViewStyle>;
}

export interface BibleCardProps extends BibleCardBase {
  /** The dot.bible address under the name, e.g. "dot.bible/amharic". */
  url: string;
  /** Names the tile group: "Ways to get the Amharic Bible". */
  actionsLabel: string;
  /** Read. The one Horizon Blue tile. */
  onRead?: () => void;
  /** Listen. */
  onListen?: () => void;
  /** Order. */
  onOrder?: () => void;
  /** Get the app. */
  onGetApp?: () => void;
  /** QR code element (for example from QrShare); drawn on a white 128dp tile. Give it its own label through `qrLabel`. */
  qr?: ReactNode;
  /** Accessible name of the QR, naming the address: "QR code for dot.bible/amharic". */
  qrLabel?: string;
  /** Share title. @default none */
  shareTitle?: string;
  /** Share copy under the title. */
  shareCopy?: string;
  /** Copy link action; shows the Copy link button when set. */
  onCopyLink?: () => void;
  /** Share action; shows the Share button when set. */
  onShare?: () => void;
  /** Status after copying, e.g. "Link copied: dot.bible/amharic". Announced politely, in gold. */
  status?: string;
}

function ring(on: boolean): ViewStyle {
  return on ? { outlineColor: GOLD, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' } : {};
}

/** The black-leather cover with the gold tooled double border, spine on the start edge. */
function Cover({ source, row, children, style, ...rest }: { source?: ImageSourcePropType; row?: boolean; children: ReactNode; style?: StyleProp<ViewStyle> } & ViewProps) {
  const r = row ? 22 : 32;
  const inner = (
    <>
      <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', top: row ? 7 : 12, bottom: row ? 7 : 12, start: row ? 7 : 12, end: row ? 7 : 12, borderWidth: 1, borderColor: 'rgba(232,201,135,0.55)', borderTopStartRadius: 0, borderBottomStartRadius: 0, borderTopEndRadius: r - 10, borderBottomEndRadius: r - 10 }} />
      {!row ? <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ position: 'absolute', top: 8, bottom: 8, start: 8, end: 8, borderWidth: 1, borderColor: 'rgba(232,201,135,0.28)', borderTopEndRadius: r - 6, borderBottomEndRadius: r - 6 }} /> : null}
      {children}
    </>
  );
  const frame: ViewStyle = {
    overflow: 'hidden', backgroundColor: LEATHER, borderWidth: 1, borderColor: 'rgba(0,0,0,0.6)', borderStartWidth: row ? 8 : 10, borderStartColor: '#0b0b0b',
    borderTopStartRadius: 2, borderBottomStartRadius: 2, borderTopEndRadius: r, borderBottomEndRadius: r, minWidth: 0,
  };
  return source ? (
    <ImageBackground source={source} resizeMode="repeat" accessibilityIgnoresInvertColors {...rest} style={[frame, style]}>{inner}</ImageBackground>
  ) : (
    <View {...rest} style={[frame, style]}>{inner}</View>
  );
}

interface TileProps { icon: UiIconProps['name']; label: string; onPress?: () => void; primary?: boolean; horizontal?: boolean }

function Tile({ icon, label, onPress, primary, horizontal }: TileProps) {
  const { radius, colors } = useTheme();
  const [focus, setFocus] = useState(false);
  const fg = primary ? '#ffffff' : '#000000';
  return (
    <Pressable
      accessibilityRole="link"
      onPress={onPress}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={({ pressed }): ViewStyle => ({
        flexGrow: 1, flexBasis: 0, minHeight: horizontal ? 72 : 88, flexDirection: horizontal ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 6, paddingVertical: 12,
        borderRadius: radius['radius-md'], backgroundColor: primary ? (pressed ? colors.primaryPressed : colors.primary) : pressed ? '#e1e1e4' : '#ffffff', ...ring(focus),
      })}
    >
      <UiIcon name={icon} size={24} color={fg} />
      <Text variant="web-label" style={{ fontSize: 16, color: fg, textAlign: 'center' }}>{label}</Text>
    </Pressable>
  );
}

/** Black-leather Bible cover for one language: native name, address, Read / Listen / Order / Get the app tiles and a QR share. */
export function BibleCard({
  nativeName, nativeLang, url, actionsLabel, onRead, onListen, onOrder, onGetApp, qr, qrLabel, shareTitle, shareCopy, onCopyLink, onShare, status, leather, labels, style, ...rest
}: BibleCardProps) {
  const { spacing, radius } = useTheme();
  const { width } = useWindowDimensions();
  const compact = width <= 480;
  const phone = width < 768;
  const l = { ...DEFAULT_LABELS, ...labels };
  const tiles: TileProps[] = [
    onRead && { icon: 'book-open' as const, label: l.read, onPress: onRead, primary: true },
    onListen && { icon: 'headphones' as const, label: l.listen, onPress: onListen },
    onOrder && { icon: 'file' as const, label: l.order, onPress: onOrder },
    onGetApp && { icon: 'phone' as const, label: l.getApp, onPress: onGetApp },
  ].filter(Boolean) as TileProps[];
  return (
    <Cover source={leather} {...rest} style={[{ gap: phone ? spacing['space-4'] : 20, paddingTop: phone ? 26 : 40, paddingBottom: phone ? 20 : 36, paddingStart: phone ? 22 : 36, paddingEnd: phone ? 20 : 36 }, style]}>
      <View style={{ gap: 4 }}>
        <Text variant="display-2" lang={nativeLang} accessibilityRole="header" style={{ color: '#ffffff', fontSize: compact ? 32 : 44, lineHeight: compact ? 38 : 50, letterSpacing: -0.6, writingDirection: nativeLang ? directionFor(nativeLang) : undefined }}>{nativeName}</Text>
        <Text variant="web-body" style={{ fontSize: 16, color: 'rgba(255,255,255,0.68)' }}>{url}</Text>
      </View>
      {tiles.length > 0 ? (
        <View accessibilityRole="toolbar" accessibilityLabel={actionsLabel} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {tiles.map((t) => (
            <View key={t.label} style={{ flexGrow: 1, flexBasis: compact ? '45%' : 0, minWidth: compact ? '45%' : 0, flexDirection: 'row' }}>
              <Tile {...t} horizontal={compact} />
            </View>
          ))}
        </View>
      ) : null}
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ height: 2, borderRadius: radius['radius-pill'], backgroundColor: 'rgba(232,201,135,0.6)' }} />
      {qr || shareTitle || onCopyLink || onShare ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          {qr ? (
            <View accessible accessibilityRole="image" accessibilityLabel={qrLabel} style={{ width: compact ? 120 : 128, height: compact ? 120 : 128, padding: 6, borderRadius: radius['radius-md'], backgroundColor: '#ffffff' }}>{qr}</View>
          ) : null}
          <View style={{ flex: 1, minWidth: 0, gap: 10, justifyContent: 'center' }}>
            {shareTitle ? <Text variant="web-h4" style={{ fontSize: 17, color: '#ffffff' }}>{shareTitle}</Text> : null}
            {shareCopy && !compact ? <Text variant="web-small" style={{ color: 'rgba(255,255,255,0.68)' }}>{shareCopy}</Text> : null}
            <View style={{ flexDirection: compact ? 'column' : 'row', flexWrap: 'wrap', gap: 8, alignItems: compact ? 'stretch' : 'flex-start' }}>
              {onCopyLink ? <Button variant="outlineLight" block={compact} onPress={onCopyLink}>{l.copyLink}</Button> : null}
              {onShare ? <Button variant="outlineLight" block={compact} onPress={onShare}>{l.share}</Button> : null}
            </View>
            <Text variant="web-small" accessibilityLiveRegion="polite" accessibilityRole="alert" style={{ color: GOLD, minHeight: status ? undefined : 0 }}>{status ?? ''}</Text>
          </View>
        </View>
      ) : null}
    </Cover>
  );
}

export interface BibleCardRowProps extends BibleCardBase {
  /** Line under the native name: "Amharic · dot.bible/amharic". */
  subtitle: string;
  /** Read. Shown as the Horizon Blue 44dp tile. */
  onRead?: () => void;
  /** Listen. */
  onListen?: () => void;
  /** Opens the language page; shown as the gold arrow. */
  onOpen?: () => void;
  /** Accessible name of Read, e.g. "Read the Amharic Bible". */
  readLabel: string;
  /** Accessible name of Listen, e.g. "Listen to the Amharic Bible". */
  listenLabel?: string;
  /** Accessible name of the arrow, e.g. "Open the Amharic language page". */
  openLabel?: string;
}

/** Compact leather row for a short list of featured languages. Ends with the gold arrow because it opens another page. */
export function BibleCardRow({ nativeName, nativeLang, subtitle, onRead, onListen, onOpen, readLabel, listenLabel, openLabel, leather, style, labels: _labels, ...rest }: BibleCardRowProps) {
  const { radius } = useTheme();
  const [focus, setFocus] = useState(false);
  const mini = (icon: UiIconProps['name'], label: string, onPress: (() => void) | undefined, primary?: boolean) => (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }): ViewStyle => ({ width: 44, height: 44, borderRadius: radius['radius-md'], alignItems: 'center', justifyContent: 'center', backgroundColor: primary ? (pressed ? '#0455ad' : '#046de3') : pressed ? '#e1e1e4' : '#ffffff' })}
    >
      <UiIcon name={icon} size={20} color={primary ? '#ffffff' : '#000000'} />
    </Pressable>
  );
  return (
    <Cover row source={leather} {...rest} style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingVertical: 16, paddingStart: 20, paddingEnd: 16 }, style]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text variant="print-h4" lang={nativeLang} accessibilityRole="header" style={{ color: '#ffffff', fontSize: 24, lineHeight: 30, writingDirection: nativeLang ? directionFor(nativeLang) : undefined }}>{nativeName}</Text>
        <Text variant="body-sm" style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)' }}>{subtitle}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {onRead ? mini('book-open', readLabel, onRead, true) : null}
        {onListen ? mini('headphones', listenLabel ?? '', onListen) : null}
        {onOpen ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={openLabel}
            onPress={onOpen}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius['radius-pill'], ...ring(focus) }}
          >
            <Text variant="web-body" accessibilityElementsHidden importantForAccessibility="no" style={{ color: GOLD, fontSize: 18 }}>{'↗'}</Text>
          </Pressable>
        ) : null}
      </View>
    </Cover>
  );
}
