import { forwardRef, useState, type CSSProperties, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { useDirection, type Direction } from '../direction';

export type ReadingTextSize = 17 | 19 | 22 | 25;
export type ReadingTheme = 'light' | 'dark';

const TEXT_SIZES: ReadingTextSize[] = [17, 19, 22, 25];

export interface ReadingVerse {
  /** Verse number shown as a small superscript. */
  number: number | string;
  /** Verse text exactly as in the translation. Never edited. */
  text: string;
  /** Wrap the verse in a highlight. @default false */
  highlight?: boolean;
  /** Id of a footnote (from `footnotes`) whose marker follows this verse. */
  footnoteId?: string;
}

export interface ReadingSection {
  /** The translation's own section heading (h2). Do not invent headings. */
  heading?: string;
  /** Verses of this section, set as one paragraph. */
  verses: ReadingVerse[];
}

export interface ReadingFootnote {
  /** Id referenced by `ReadingVerse.footnoteId`. */
  id: string;
  /** The marker letter, for example "a". */
  mark: string;
  /** Verse reference in bold, for example "3:3". */
  reference?: string;
  /** Note text. */
  text: ReactNode;
}

export interface ReadingViewLabels {
  /** Accessible name of the text size button and radio group. @default "Text size" */
  textSize: string;
  /** Accessible name of the translation button. @default (abbreviation) => `Translation: ${abbreviation}` */
  translation: (abbreviation: string) => string;
  /** Accessible name of the listen button. @default "Listen" */
  listen: string;
  /** Accessible name of a footnote marker. @default (mark) => `Footnote ${mark}` */
  footnote: (mark: string) => string;
}

export interface ReadingViewProps extends Omit<HTMLAttributes<HTMLElement>, 'lang' | 'dir' | 'title'> {
  /** Accessible name of the article: book, chapter and translation, for example "John 3, Berean Standard Bible". */
  title: string;
  /** Language of the text (BCP 47). Set for non-English text. */
  lang?: string;
  /** Reading direction of the text. Use "rtl" for Arabic-script and Hebrew translations. */
  dir?: Direction;
  /** Visible text of the book and chapter picker button in the bar, for example "John 3". */
  pickerLabel: string;
  /** Translation abbreviation shown in the translation picker button, for example "BSB". */
  translationLabel: string;
  /** The book picker is open (`aria-expanded`). Render a `BookPicker` next to the reader. @default false */
  pickerOpen?: boolean;
  /** The translation picker is open (`aria-expanded`). @default false */
  translationOpen?: boolean;
  /** Called when the book picker button is pressed. */
  onPickerClick?: () => void;
  /** Called when the translation button is pressed. */
  onTranslationClick?: () => void;
  /** Called when the listen button is pressed; it opens the AudioPlayer mini player. The button is shown only when given. */
  onListen?: () => void;
  /** Controlled text size in px. */
  textSize?: ReadingTextSize;
  /** Initial text size when uncontrolled. @default 19 */
  defaultTextSize?: ReadingTextSize;
  /** Called when a text size step is chosen. */
  onTextSizeChange?: (size: ReadingTextSize) => void;
  /** Reading theme, set as `data-theme` on the reader. @default "light" */
  theme?: ReadingTheme;
  /** Label above the chapter title, for example "The Gospel of John". */
  bookLabel?: ReactNode;
  /** Chapter title (the single h1), for example "John 3". */
  chapterTitle: ReactNode;
  /** Chapter content as sections of verses. */
  sections?: ReadingSection[];
  /** Footnotes referenced by verses, rendered below the text. */
  footnotes?: ReadingFootnote[];
  /** Extra content placed at the end of the text column. */
  children?: ReactNode;
  /** Accessible names. */
  labels?: Partial<ReadingViewLabels>;
}

const DEFAULT_LABELS: ReadingViewLabels = {
  textSize: 'Text size',
  translation: (a) => `Translation: ${a}`,
  listen: 'Listen',
  footnote: (m) => `Footnote ${m}`,
};

/** Chapter reader: sticky bar with pickers, text size and listen, over a single serif column. */
export const ReadingView = forwardRef<HTMLElement, ReadingViewProps>(function ReadingView(
  {
    title,
    lang,
    dir,
    pickerLabel,
    translationLabel,
    pickerOpen = false,
    translationOpen = false,
    onPickerClick,
    onTranslationClick,
    onListen,
    textSize,
    defaultTextSize = 19,
    onTextSizeChange,
    theme = 'light',
    bookLabel,
    chapterTitle,
    sections,
    footnotes,
    labels,
    className,
    children,
    ...rest
  },
  ref,
) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const pageDir = useDirection();
  const [inner, setInner] = useState<ReadingTextSize>(defaultTextSize);
  const [aaOpen, setAaOpen] = useState(false);
  const size = textSize ?? inner;
  const choose = (s: ReadingTextSize) => {
    if (textSize === undefined) setInner(s);
    onTextSizeChange?.(s);
  };
  const effectiveDir = dir ?? pageDir;
  const onRadioKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = effectiveDir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const prev = effectiveDir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    let i = TEXT_SIZES.indexOf(size);
    if (e.key === next || e.key === 'ArrowDown') i = Math.min(TEXT_SIZES.length - 1, i + 1);
    else if (e.key === prev || e.key === 'ArrowUp') i = Math.max(0, i - 1);
    else return;
    e.preventDefault();
    choose(TEXT_SIZES[i]);
    const group = e.currentTarget.parentElement;
    (group?.children[i] as HTMLElement | undefined)?.focus();
  };

  return (
    <article ref={ref} className={cx('sx-reader', className)} aria-label={title} lang={lang} dir={dir} data-theme={theme} {...rest}>
      <div className="sx-rbar">
        <div className="sx-rbar-group">
          <button type="button" className="sx-sel" aria-haspopup="dialog" aria-expanded={pickerOpen} onClick={onPickerClick}>
            {pickerLabel}
            <UiIcon name="chevron-down" />
          </button>
          <button
            type="button"
            className="sx-sel"
            aria-haspopup="listbox"
            aria-expanded={translationOpen}
            aria-label={l.translation(translationLabel)}
            onClick={onTranslationClick}
          >
            {translationLabel}
            <UiIcon name="chevron-down" />
          </button>
        </div>
        <div className="sx-rbar-group">
          <button
            type="button"
            className="sx-ibtn sx-aa-btn"
            aria-label={l.textSize}
            aria-expanded={aaOpen}
            onClick={() => setAaOpen((o) => !o)}
          >
            Aa
          </button>
          {onListen ? (
            <button type="button" className="sx-play-sm" aria-label={l.listen} onClick={onListen}>
              <UiIcon name="play" fill="currentColor" />
            </button>
          ) : null}
        </div>
      </div>
      {aaOpen ? (
        <div className="sx-aa" role="radiogroup" aria-label={l.textSize}>
          {TEXT_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={s === size}
              tabIndex={s === size ? 0 : -1}
              onClick={() => choose(s)}
              onKeyDown={onRadioKey}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
      <div className="sx-col" style={{ '--sx-text': `${size}px` } as CSSProperties}>
        {bookLabel ? <p className="overline sx-col-book">{bookLabel}</p> : null}
        <h1 className="sx-ch">{chapterTitle}</h1>
        {sections?.map((section, si) => (
          <div key={si}>
            {section.heading ? <h2 className="sx-sh">{section.heading}</h2> : null}
            <p className="sx-body">
              {section.verses.map((v, vi) => {
                const fn = v.footnoteId ? footnotes?.find((f) => f.id === v.footnoteId) : undefined;
                const body = v.highlight ? <mark className="sx-hl">{v.text}</mark> : v.text;
                return (
                  <span key={vi}>
                    <sup className="sx-v">{v.number}</sup>
                    {body}
                    {fn ? (
                      <a className="sx-fn" href={`#${fn.id}`} aria-label={l.footnote(fn.mark)}>{fn.mark}</a>
                    ) : null}
                    {vi < section.verses.length - 1 ? ' ' : null}
                  </span>
                );
              })}
            </p>
          </div>
        ))}
        {footnotes?.map((f) => (
          <p key={f.id} className="sx-fnote" id={f.id}>
            <span className="sx-fnote-mark">{f.mark}</span>
            <span>
              {f.reference ? <b>{f.reference}</b> : null}
              {f.reference ? ' ' : null}
              {f.text}
            </span>
          </p>
        ))}
        {children}
      </div>
    </article>
  );
});
