import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { Button } from './Button';

export type BookPickerTestament = 'old' | 'new';
export type BookPickerStep = 'book' | 'chapter' | 'verse';

/** One book in the list. Names are in the reader's language, in full ("1 Corinthians"). */
export interface BookPickerBook {
  /** Stable id. */
  id: string;
  /** Full book name. */
  name: string;
  /** Number of chapters, shown beside the name and above the grid. */
  chapters: number;
  /** Which testament tab lists this book. */
  testament: BookPickerTestament;
}

export interface BookPickerLabels {
  /** @default "Old Testament" */
  oldTestament?: string;
  /** @default "New Testament" */
  newTestament?: string;
  /** Step tab names. @default "Book" */
  book?: string;
  /** @default "Chapter" */
  chapter?: string;
  /** @default "Verse" */
  verse?: string;
  /** Name of the panel or sheet. @default "Choose a book and chapter" */
  title?: string;
  /** @default "Close" */
  close?: string;
  /** @default "Back to chapters" */
  back?: string;
  /** Legend text for the current item. @default "Current" */
  current?: string;
  /** Legend text for read chapters. @default "Read" */
  read?: string;
  /** Group name of the testament tabs. @default "Testament" */
  testament?: string;
  /** Group name of the step tabs. @default "Step" */
  step?: string;
}

export interface BookPickerProps extends ViewProps {
  /** All books, in canon order. */
  books: BookPickerBook[];
  /** `panel` is the two-pane desktop/tablet popover; `sheet` is the three-step mobile sheet content. Under 768dp the panel stacks. @default "panel" */
  variant?: 'panel' | 'sheet';
  /** Active testament tab. */
  testament: BookPickerTestament;
  /** Called when a testament tab is chosen. */
  onTestamentChange: (testament: BookPickerTestament) => void;
  /** Selected book id. */
  bookId?: string;
  /** Called when a book is chosen; loads its chapters. */
  onSelectBook: (book: BookPickerBook) => void;
  /** Current chapter of the selected book (marked current). */
  chapter?: number;
  /** Called when a chapter is chosen. In the sheet this moves to the verse step when `verseCount` is set. */
  onSelectChapter: (chapter: number) => void;
  /** Chapters already read in the selected book; shown quiet. */
  readChapters?: number[];
  /** Sheet only: active step. @default "book" */
  step?: BookPickerStep;
  /** Sheet only: called when a step tab or Back is used. */
  onStepChange?: (step: BookPickerStep) => void;
  /** Sheet only: number of verses in the chosen chapter (verse step). */
  verseCount?: number;
  /** Sheet only: picked verse. */
  verse?: number;
  /** Sheet only: called when a verse is picked. */
  onSelectVerse?: (verse: number) => void;
  /** Sheet only: label of the confirm button, naming the destination, e.g. "Go to John 3:16". Shown on the verse step. */
  confirmLabel?: string;
  /** Sheet only: called by the confirm button. */
  onConfirm?: () => void;
  /** Close button (sheet) action. Hidden when omitted. */
  onClose?: () => void;
  /** Header title in the sheet, e.g. "John 3". */
  sheetTitle?: string;
  /** Text of the chapter grid caption, e.g. "John · 21 chapters". Defaults to name and count. */
  chapterCaption?: (book: BookPickerBook) => string;
  /** Accessible name of a chapter cell, e.g. "John chapter 3". */
  chapterCellLabel?: (book: BookPickerBook, chapter: number) => string;
  /** Accessible name of a verse cell, e.g. "Verse 16". */
  verseCellLabel?: (verse: number) => string;
  /** Breadcrumb for the panel header, e.g. `<><Text>John</Text>...</>`. Optional. */
  breadcrumb?: ReactNode;
  /** Visible and accessible strings; override for translation. */
  labels?: BookPickerLabels;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_LABELS: Required<BookPickerLabels> = {
  oldTestament: 'Old Testament', newTestament: 'New Testament', book: 'Book', chapter: 'Chapter', verse: 'Verse', title: 'Choose a book and chapter',
  close: 'Close', back: 'Back to chapters', current: 'Current', read: 'Read', testament: 'Testament', step: 'Step',
};

function ring(color: string, on: boolean): ViewStyle {
  return on ? { outlineColor: color, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' } : {};
}

interface SegProps<T extends string> {
  items: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  name: string;
  full?: boolean;
}

/** Pill tabs: the selected tab is charcoal with white text. */
function Seg<T extends string>({ items, value, onChange, name, full }: SegProps<T>) {
  const { colors, radius, isDark } = useTheme();
  const [focus, setFocus] = useState<T | null>(null);
  return (
    <View accessibilityRole="tablist" accessibilityLabel={name} style={{ flexDirection: 'row', gap: 4, padding: 4, borderRadius: radius['radius-pill'], backgroundColor: colors.surfaceMuted, alignSelf: full ? 'stretch' : 'flex-start' }}>
      {items.map((it) => {
        const on = it.value === value;
        return (
          <Pressable
            key={it.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(it.value)}
            onFocus={() => setFocus(it.value)}
            onBlur={() => setFocus(null)}
            style={{ flex: full ? 1 : undefined, minHeight: 40, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', borderRadius: radius['radius-pill'], backgroundColor: on ? (isDark ? '#ffffff' : '#161819') : 'transparent', ...ring(colors.focus, focus === it.value) }}
          >
            <Text variant="web-label" style={{ fontSize: 15, color: on ? (isDark ? '#000000' : '#ffffff') : colors.textBody }}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface NumberGridProps {
  count: number;
  mode: 'current' | 'pressed';
  value?: number;
  read?: number[];
  label: (n: number) => string;
  onPick: (n: number) => void;
  name: string;
}

/** Six-per-row grid of 48dp number cells. Current or picked is solid Horizon Blue and bold; read cells are quiet. */
function NumberGrid({ count, mode, value, read, label, onPick, name }: NumberGridProps) {
  const { colors, radius } = useTheme();
  const [focus, setFocus] = useState<number | null>(null);
  const items = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <View accessibilityLabel={name} style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -4 }}>
      {items.map((n) => {
        const on = n === value;
        const isRead = !on && !!read?.includes(n);
        return (
          <View key={n} style={{ width: `${100 / 6}%`, padding: 4 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={label(n)}
              accessibilityState={{ selected: on }}
              onPress={() => onPick(n)}
              onFocus={() => setFocus(n)}
              onBlur={() => setFocus(null)}
              testID={`${mode}-${n}`}
              style={({ pressed }): ViewStyle => ({
                height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: radius['radius-md'], borderWidth: 1,
                borderColor: on ? colors.primary : colors.border,
                backgroundColor: on ? colors.primary : pressed ? colors.surfaceMuted : isRead ? colors.background : colors.surface,
                ...ring(colors.focus, focus === n),
              })}
            >
              <Text variant="web-label" style={{ fontSize: 16, fontWeight: on ? '600' : '500', color: on ? '#ffffff' : isRead ? colors.textTertiary : colors.text }}>{String(n)}</Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function Legend({ current, read }: { current: string; read: string }) {
  const { colors, radius } = useTheme();
  const box = (bg: string, border: string) => <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 14, height: 14, borderRadius: radius['radius-xs'], borderWidth: 1, backgroundColor: bg, borderColor: border }} />;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>{box(colors.primary, colors.primary)}<Text variant="body-sm" tone="body" style={{ fontSize: 13 }}>{current}</Text></View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>{box(colors.background, colors.border)}<Text variant="body-sm" tone="body" style={{ fontSize: 13 }}>{read}</Text></View>
    </View>
  );
}

/** Book, chapter and verse chooser: a two-pane panel on larger screens and a three-step sheet on phones. Controlled. */
export function BookPicker({
  books, variant = 'panel', testament, onTestamentChange, bookId, onSelectBook, chapter, onSelectChapter, readChapters, step = 'book', onStepChange, verseCount, verse, onSelectVerse,
  confirmLabel, onConfirm, onClose, sheetTitle, chapterCaption, chapterCellLabel, verseCellLabel, breadcrumb, labels, style, ...rest
}: BookPickerProps) {
  const { colors, radius, shadow, spacing, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const stacked = width < 768;
  const l = { ...DEFAULT_LABELS, ...labels };
  const shown = books.filter((b) => b.testament === testament);
  const selected = books.find((b) => b.id === bookId);
  const caption = selected ? (chapterCaption ? chapterCaption(selected) : `${selected.name} · ${selected.chapters}`) : '';
  const cellLabel = (n: number) => (selected ? (chapterCellLabel ? chapterCellLabel(selected, n) : `${selected.name} ${l.chapter.toLowerCase()} ${n}`) : String(n));
  const testaments = [{ value: 'old' as const, label: l.oldTestament }, { value: 'new' as const, label: l.newTestament }];

  const bookList = (
    <ScrollView
      accessibilityLabel={l.book}
      style={{ maxHeight: stacked ? 220 : 384, ...(variant === 'panel' && !stacked ? { width: 240, borderEndWidth: 1, borderEndColor: colors.border } : variant === 'panel' ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null) }}
      contentContainerStyle={{ padding: spacing['space-3'], gap: 2 }}
      nestedScrollEnabled
    >
      {shown.map((b) => {
        const on = b.id === bookId;
        return (
          <BookRow key={b.id} book={b} selected={on} onPress={() => onSelectBook(b)} />
        );
      })}
    </ScrollView>
  );

  const chapterPane = selected ? (
    <View style={{ flex: 1, gap: 14, padding: 20 }}>
      <Text variant="web-overline" tone="secondary">{caption}</Text>
      <NumberGrid count={selected.chapters} mode="current" value={chapter} read={readChapters} label={cellLabel} onPick={onSelectChapter} name={l.chapter} />
      <Legend current={l.current} read={l.read} />
    </View>
  ) : null;

  if (variant === 'panel') {
    return (
      <View
        accessibilityLabel={l.title}
        {...rest}
        style={[{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius['radius-lg'], overflow: 'hidden', ...shadow['shadow-overlay'] }, style]}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing['space-4'], paddingVertical: spacing['space-4'], paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Seg name={l.testament} items={testaments} value={testament} onChange={onTestamentChange} />
          {breadcrumb}
        </View>
        <View style={{ flexDirection: stacked ? 'column' : 'row' }}>
          {bookList}
          {chapterPane}
        </View>
      </View>
    );
  }

  const steps = [{ value: 'book' as const, label: l.book }, { value: 'chapter' as const, label: l.chapter }, { value: 'verse' as const, label: l.verse }];
  const dismissable = !!onClose;
  const canBack = step !== 'book' && !!onStepChange;
  return (
    <View
      accessibilityViewIsModal
      accessibilityLabel={l.title}
      {...rest}
      style={[{ backgroundColor: colors.surface, borderTopLeftRadius: radius['radius-lg'], borderTopRightRadius: radius['radius-lg'], paddingTop: 10, paddingHorizontal: 20, paddingBottom: spacing['space-5'], gap: 14 }, style]}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: 40, height: 5, borderRadius: radius['radius-pill'], backgroundColor: isDark ? '#373737' : '#c7c8cb', alignSelf: 'center' }} />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing['space-3'] }}>
        {canBack ? (
          <SheetIconButton icon="chevron-left" label={l.back} onPress={() => onStepChange?.(step === 'verse' ? 'chapter' : 'book')} mirror />
        ) : <View style={{ width: 44 }} />}
        <Text variant="web-h4" accessibilityRole="header" style={{ flex: 1, textAlign: 'center' }}>{sheetTitle ?? l.title}</Text>
        {dismissable ? <SheetIconButton icon="close" label={l.close} onPress={onClose} /> : <View style={{ width: 44 }} />}
      </View>
      <Seg full name={l.step} items={steps} value={step} onChange={(s) => onStepChange?.(s)} />
      {step === 'book' ? (
        <View>
          <Seg name={l.testament} items={testaments} value={testament} onChange={onTestamentChange} />
          <View style={{ height: 8 }} />
          {bookList}
        </View>
      ) : null}
      {step === 'chapter' && selected ? (
        <View style={{ gap: 14 }}>
          <Text variant="web-overline" tone="secondary">{caption}</Text>
          <NumberGrid count={selected.chapters} mode="current" value={chapter} read={readChapters} label={cellLabel} onPick={onSelectChapter} name={l.chapter} />
          <Legend current={l.current} read={l.read} />
        </View>
      ) : null}
      {step === 'verse' && verseCount ? (
        <View style={{ gap: 14 }}>
          <NumberGrid count={verseCount} mode="pressed" value={verse} label={(n) => (verseCellLabel ? verseCellLabel(n) : `${l.verse} ${n}`)} onPick={(n) => onSelectVerse?.(n)} name={l.verse} />
          {confirmLabel ? <Button block onPress={onConfirm} disabled={verse === undefined}>{confirmLabel}</Button> : null}
        </View>
      ) : null}
    </View>
  );
}

function BookRow({ book, selected, onPress }: { book: BookPickerBook; selected: boolean; onPress: () => void }) {
  const { colors, radius } = useTheme();
  const [focus, setFocus] = useState(false);
  const ink = selected ? (colors.link) : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={({ pressed }): ViewStyle => ({
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44, paddingHorizontal: 14, borderRadius: radius['radius-sm'],
        backgroundColor: selected ? colors.tint : pressed ? colors.surfaceMuted : 'transparent', ...ring(colors.focus, focus),
      })}
    >
      <Text variant="body-lg" style={{ fontSize: 16, lineHeight: 22, color: selected ? (colors.link) : colors.text, fontWeight: selected ? '600' : '400' }}>{book.name}</Text>
      <Text variant="body-sm" style={{ fontSize: 13, color: selected ? ink : colors.textTertiary }}>{String(book.chapters)}</Text>
    </Pressable>
  );
}

function SheetIconButton({ icon, label, onPress, mirror }: { icon: 'chevron-left' | 'close'; label: string; onPress?: () => void; mirror?: boolean }) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({ width: 44, height: 44, borderRadius: radius['radius-pill'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.surfaceMuted : colors.surface })}
    >
      <UiIcon name={icon} size={20} mirrorInRTL={mirror} />
    </Pressable>
  );
}
