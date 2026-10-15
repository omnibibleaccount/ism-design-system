import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { useDirection } from '../direction';

export type BookPickerVariant = 'panel' | 'sheet';
export type BookPickerStep = 'book' | 'chapter' | 'verse';

export interface BookPickerBook {
  /** Stable id of the book. */
  id: string;
  /** Book name in the reader's language, full form ("1 Corinthians", not "1 Cor"). */
  name: string;
  /** Number of chapters. */
  chapters: number;
}

export interface BookPickerTestament {
  /** Stable id of the testament. */
  id: string;
  /** Tab label, for example "Old Testament". */
  label: string;
  /** Books in canonical order. */
  books: BookPickerBook[];
}

export interface BookPickerValue {
  /** Selected book id. */
  book?: string;
  /** Selected chapter number (1-based). */
  chapter?: number;
  /** Picked verse number (1-based), sheet variant only. */
  verse?: number;
}

export interface BookPickerLabels {
  /** Accessible name of the desktop panel dialog. */
  dialog: string;
  /** Accessible name of the testament tabs. */
  testament: string;
  /** Accessible name of the breadcrumb. */
  breadcrumb: string;
  /** Visible last breadcrumb segment while no verse is chosen, for example "Verse". */
  verse: string;
  /** Accessible name of the books listbox. */
  books: string;
  /** Accessible name of the chapter grid. */
  chapters: string;
  /** Accessible name of the verse grid. */
  verses: string;
  /** Text above the chapter grid, for example "John · 21 chapters". */
  chapterCount: (book: string, count: number) => string;
  /** Full accessible name of a chapter cell, for example "John chapter 3". */
  chapterCell: (book: string, chapter: number) => string;
  /** Full accessible name of a verse cell, for example "Verse 16". */
  verseCell: (verse: number) => string;
  /** Legend entry for the current chapter. */
  legendCurrent: string;
  /** Legend entry for hover. */
  legendHover: string;
  /** Legend entry for read chapters. */
  legendRead: string;
  /** Accessible name of the sheet dialog. */
  sheet: string;
  /** Accessible name of the step tabs. */
  step: string;
  /** Step tab labels. */
  stepBook: string;
  stepChapter: string;
  stepVerse: string;
  /** Accessible name of the sheet's Back button. */
  back: string;
  /** Accessible name of the Close button. */
  close: string;
  /** Text of the sheet's confirm button, for example "Go to John 3:16". */
  go: (reference: string) => string;
}

export interface BookPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'onSelect'> {
  /** `panel`: two-pane desktop popover. `sheet`: mobile bottom sheet with Book, Chapter and Verse steps. @default "panel" */
  variant?: BookPickerVariant;
  /** Testaments with their books. */
  testaments: BookPickerTestament[];
  /** Controlled selection. */
  value?: BookPickerValue;
  /** Initial selection when uncontrolled. */
  defaultValue?: BookPickerValue;
  /** Called whenever the selection changes (book, chapter or verse). */
  onChange?: (value: BookPickerValue) => void;
  /** Called when the reader commits a destination: a chapter in the panel, or the confirm button in the sheet. */
  onSelect?: (value: BookPickerValue) => void;
  /** Called on Esc, the Close button, or a click outside. The text does not change. */
  onClose?: () => void;
  /** Chapters already read, by book id. Shown quietly, never coloured. */
  readChapters?: Record<string, number[]>;
  /** Returns the number of verses in a chapter. When given, the sheet adds the Verse step. */
  getVerseCount?: (book: string, chapter: number) => number;
  /** Text and accessible names. Visible strings are supplied by you so they can be translated. */
  labels: BookPickerLabels;
}

function findBook(testaments: BookPickerTestament[], id?: string) {
  for (const t of testaments) {
    const b = t.books.find((x) => x.id === id);
    if (b) return { testament: t, book: b };
  }
  return undefined;
}

/**
 * Book, chapter and verse chooser. Moves focus into the dialog on open and back to the trigger on close.
 * Render it only while open; it closes with Esc, the Close button or a click outside.
 */
export const BookPicker = forwardRef<HTMLDivElement, BookPickerProps>(function BookPicker(
  { variant = 'panel', testaments, value, defaultValue, onChange, onSelect, onClose, readChapters, getVerseCount, labels, className, ...rest },
  ref,
) {
  const dir = useDirection();
  const [inner, setInner] = useState<BookPickerValue>(defaultValue ?? {});
  const current = value ?? inner;
  const found = findBook(testaments, current.book);
  const [testamentId, setTestamentId] = useState<string>(found?.testament.id ?? testaments[0]?.id ?? '');
  const [step, setStep] = useState<BookPickerStep>('book');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasVerses = typeof getVerseCount === 'function';
  const sheet = variant === 'sheet';

  const setRefs = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const update = (next: BookPickerValue) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  // Focus into the dialog on open, back to the previous element on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    rootRef.current?.focus();
    return () => previous?.focus?.();
  }, []);

  // Click outside closes the panel (the sheet uses its scrim).
  useEffect(() => {
    if (sheet || !onClose) return;
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sheet, onClose]);

  const testament = testaments.find((t) => t.id === testamentId) ?? testaments[0];
  const book = found?.book;

  const onRootKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose?.();
    }
  };

  const moveFocus = (e: KeyboardEvent<HTMLElement>, selector: string, keys: [string, string]) => {
    const dirNext = keys[0];
    const dirPrev = keys[1];
    if (e.key !== dirNext && e.key !== dirPrev) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(selector));
    const idx = items.indexOf(document.activeElement as HTMLElement);
    if (idx < 0) return;
    e.preventDefault();
    const nextIdx = e.key === dirNext ? Math.min(items.length - 1, idx + 1) : Math.max(0, idx - 1);
    items[nextIdx]?.focus();
  };

  const pickBook = (b: BookPickerBook) => {
    update({ book: b.id });
    if (sheet) setStep('chapter');
  };
  const pickChapter = (n: number) => {
    if (!book) return;
    const next = { book: book.id, chapter: n };
    update(next);
    if (sheet && hasVerses) setStep('verse');
    else onSelect?.(next);
  };
  const pickVerse = (n: number) => {
    if (!book || current.chapter === undefined) return;
    update({ book: book.id, chapter: current.chapter, verse: n });
  };

  const readSet = new Set(book ? readChapters?.[book.id] ?? [] : []);
  const chapterCells = book
    ? Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => {
        const isCurrent = current.chapter === n;
        return (
          <button
            key={n}
            type="button"
            className={cx('sx-num', readSet.has(n) && !isCurrent && 'is-read')}
            aria-current={isCurrent ? 'true' : undefined}
            aria-label={labels.chapterCell(book.name, n)}
            onClick={() => pickChapter(n)}
          >
            {n}
          </button>
        );
      })
    : null;

  const verseCount = book && current.chapter !== undefined && getVerseCount ? getVerseCount(book.id, current.chapter) : 0;
  const reference = book && current.chapter !== undefined ? `${book.name} ${current.chapter}${current.verse ? `:${current.verse}` : ''}` : '';

  const nextKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const prevKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

  const testamentTabs = (
    <div className="sx-seg" role="tablist" aria-label={labels.testament} onKeyDown={(e) => moveFocus(e, '[role="tab"]', [nextKey, prevKey])}>
      {testaments.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={t.id === testament?.id}
          tabIndex={t.id === testament?.id ? 0 : -1}
          onClick={() => setTestamentId(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  const booksList = (
    <div className="sx-books" role="listbox" aria-label={labels.books} onKeyDown={(e) => moveFocus(e, '[role="option"]', ['ArrowDown', 'ArrowUp'])}>
      {testament?.books.map((b) => (
        <button key={b.id} type="button" className="sx-book" role="option" aria-selected={b.id === current.book} onClick={() => pickBook(b)}>
          <span>{b.name}</span>
          <span className="n">{b.chapters}</span>
        </button>
      ))}
    </div>
  );

  if (!sheet) {
    return (
      <div ref={setRefs} className={cx('sx-picker', className)} role="dialog" aria-label={labels.dialog} tabIndex={-1} onKeyDown={onRootKey} {...rest}>
        <div className="sx-picker-head">
          {testamentTabs}
          <div className="sx-crumb" aria-label={labels.breadcrumb}>
            {book ? <b>{book.name}</b> : null}
            {book ? <span aria-hidden="true">›</span> : null}
            {current.chapter !== undefined ? <b>{current.chapter}</b> : null}
            {current.chapter !== undefined ? <span aria-hidden="true">›</span> : null}
            <span>{labels.verse}</span>
          </div>
        </div>
        <div className="sx-picker-body">
          {booksList}
          <div className="sx-chapters">
            {book ? <span className="sx-lbl">{labels.chapterCount(book.name, book.chapters)}</span> : null}
            <div className="sx-grid" role="group" aria-label={labels.chapters}>{chapterCells}</div>
            <div className="sx-legend">
              <span><i className="k-on" />{labels.legendCurrent}</span>
              <span><i className="k-hover" />{labels.legendHover}</span>
              <span><i className="k-read" />{labels.legendRead}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps: Array<{ id: BookPickerStep; label: string }> = [
    { id: 'book', label: labels.stepBook },
    { id: 'chapter', label: labels.stepChapter },
    ...(hasVerses ? [{ id: 'verse' as const, label: labels.stepVerse }] : []),
  ];
  const stepOrder: BookPickerStep[] = steps.map((s) => s.id);
  const canGo = (id: BookPickerStep) => id === 'book' || (id === 'chapter' && !!book) || (id === 'verse' && !!book && current.chapter !== undefined);
  const stepTitle = book ? (current.chapter !== undefined ? `${book.name} ${current.chapter}` : book.name) : '';

  return (
    <>
      <div className="sx-scrim" aria-hidden="true" onClick={onClose} />
      <div ref={setRefs} className={cx('sx-sheet', className)} role="dialog" aria-label={labels.sheet} tabIndex={-1} onKeyDown={onRootKey} {...rest}>
        <div className="sx-handle" aria-hidden="true" />
        <div className="sx-sheet-head">
          <button
            type="button"
            className="sx-ibtn"
            aria-label={labels.back}
            disabled={step === 'book'}
            onClick={() => setStep(stepOrder[Math.max(0, stepOrder.indexOf(step) - 1)])}
          >
            <UiIcon name="chevron-left" />
          </button>
          <span>{stepTitle}</span>
          <button type="button" className="sx-ibtn" aria-label={labels.close} onClick={onClose}>
            <UiIcon name="close" />
          </button>
        </div>
        <div className="sx-seg sx-seg-full" role="tablist" aria-label={labels.step} onKeyDown={(e) => moveFocus(e, '[role="tab"]:not([disabled])', [nextKey, prevKey])}>
          {steps.map((s) => (
            <button key={s.id} type="button" role="tab" aria-selected={step === s.id} disabled={!canGo(s.id)} onClick={() => setStep(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
        {step === 'book' ? (
          <>
            {testamentTabs}
            {booksList}
          </>
        ) : null}
        {step === 'chapter' ? <div className="sx-grid" role="group" aria-label={labels.chapters}>{chapterCells}</div> : null}
        {step === 'verse' ? (
          <>
            <div className="sx-grid" role="group" aria-label={labels.verses}>
              {Array.from({ length: verseCount }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" className="sx-num" aria-pressed={current.verse === n} aria-label={labels.verseCell(n)} onClick={() => pickVerse(n)}>
                  {n}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={current.verse === undefined}
              onClick={() => onSelect?.(current)}
            >
              {labels.go(reference)}
            </button>
          </>
        ) : null}
      </div>
    </>
  );
});
