import { forwardRef, useId, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import type { Direction } from '../direction';

export type VerseBlockVariant = 'card' | 'votd';

/** Put a non-breaking space between the book name and the chapter number ("John 3:16"). Verse text is never touched. */
export function formatReference(reference: string): string {
  return reference.replace(/(\p{L}|\.) (\d)/u, '$1 $2');
}

export interface VerseBlockLabels {
  /** Accessible name of the share tool. @default "Share verse" */
  share: string;
  /** Accessible name of the copy tool. @default "Copy verse" */
  copy: string;
  /** Accessible name of the bookmark tool when not saved. @default "Bookmark verse" */
  bookmark: string;
  /** Accessible name of the bookmark tool when saved. @default "Remove bookmark" */
  removeBookmark: string;
}

const DEFAULT_LABELS: VerseBlockLabels = {
  share: 'Share verse',
  copy: 'Copy verse',
  bookmark: 'Bookmark verse',
  removeBookmark: 'Remove bookmark',
};

export interface VerseBlockProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'lang' | 'dir'> {
  /** `card`: white verse card. `votd`: dark Verse of the day hero with gold accents. @default "card" */
  variant?: VerseBlockVariant;
  /** The verse text exactly as in the translation, without surrounding quotation marks. Never edited or shortened here. */
  text: string;
  /** Reference such as "John 3:16" or "1 Corinthians 13:4–7", in the reader's language. A non-breaking space is placed after the book name. */
  reference: string;
  /** Translation abbreviation or name ("BSB"). Always name it. Shown after the reference as "John 3:16 · BSB". */
  translation?: string;
  /** Language of the verse text and reference (BCP 47), set when it differs from the page language. */
  lang?: string;
  /** Reading direction of the verse text. Use "rtl" for Arabic-script and Hebrew translations. */
  dir?: Direction;
  /** Direction of the reference run; references are isolated as LTR by default so digits and punctuation keep their order. @default "ltr" */
  referenceDir?: Direction;
  /** Wrap the text in curly quotation marks. Turn off when the translation supplies its own marks. @default true */
  quoted?: boolean;
  /** Called by the Share tool. The tool is shown only when this is given. */
  onShare?: () => void;
  /** Called by the Copy tool. The tool is shown only when this is given. Confirm with a Toast. */
  onCopy?: () => void;
  /** Called by the Bookmark tool. The tool is shown only when this is given. */
  onBookmarkChange?: (saved: boolean) => void;
  /** Whether the verse is bookmarked (`aria-pressed`). @default false */
  bookmarked?: boolean;
  /** Accessible names of the tools. */
  labels?: Partial<VerseBlockLabels>;
  /** Eyebrow of the `votd` variant, for example "Verse of the day". */
  eyebrow?: ReactNode;
  /** Lead-in line under a `votd` verse, usually ending in a `VerseCitation`. */
  more?: ReactNode;
  /** Id of the `votd` eyebrow, used as the landmark name; generated when omitted. */
  eyebrowId?: string;
}

/** A single Bible verse in the serif face with its reference and Share, Copy and Bookmark tools. */
export const VerseBlock = forwardRef<HTMLElement, VerseBlockProps>(function VerseBlock(
  {
    variant = 'card',
    text,
    reference,
    translation,
    lang,
    dir,
    referenceDir = 'ltr',
    quoted = true,
    onShare,
    onCopy,
    onBookmarkChange,
    bookmarked = false,
    labels,
    eyebrow,
    more,
    eyebrowId,
    className,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const l = { ...DEFAULT_LABELS, ...labels };
  const dark = variant === 'votd';
  const toolClass = cx('sx-ibtn', dark && 'sx-ibtn-dark');
  const shown = quoted ? `“${text}”` : text;
  const refText = formatReference(reference) + (translation ? ` · ${translation}` : '');
  const foot = (
    <div className="sx-verse-foot">
      <span className={dark ? 'sx-votd-ref' : 'sx-ref'} lang={lang} dir={referenceDir}>{refText}</span>
      {onShare || onCopy || onBookmarkChange ? (
        <div className="sx-verse-tools">
          {onShare ? (
            <button type="button" className={toolClass} aria-label={l.share} onClick={onShare}>
              <UiIcon name="share" />
            </button>
          ) : null}
          {onCopy ? (
            <button type="button" className={toolClass} aria-label={l.copy} onClick={onCopy}>
              <UiIcon name="copy" />
            </button>
          ) : null}
          {onBookmarkChange ? (
            <button
              type="button"
              className={toolClass}
              aria-label={bookmarked ? l.removeBookmark : l.bookmark}
              aria-pressed={bookmarked}
              onClick={() => onBookmarkChange(!bookmarked)}
            >
              <UiIcon name="bookmark" fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (dark) {
    const eid = eyebrowId ?? `votd-${autoId}`;
    return (
      <section ref={ref as React.Ref<HTMLElement>} className={cx('sx-votd', className)} aria-labelledby={eyebrow ? eid : undefined} {...rest}>
        {eyebrow ? <span className="eyebrow sx-eyebrow-gold" id={eid}>{eyebrow}</span> : null}
        <div className="sx-gold-rule" aria-hidden="true" />
        <p className="sx-votd-text" lang={lang} dir={dir}>{shown}</p>
        {foot}
        {more ? <p className="sx-votd-more">{more}</p> : null}
      </section>
    );
  }
  return (
    <article ref={ref as React.Ref<HTMLElement>} className={cx('sx-verse', className)} {...rest}>
      <p className="sx-verse-text" lang={lang} dir={dir}>{shown}</p>
      {foot}
    </article>
  );
});

export interface VerseCitationProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Use on a dark section. @default false */
  dark?: boolean;
  /** The citation opens the reader on another page: appends ↗. Leave false inside the reader, where it scrolls to a verse. @default false */
  opensPage?: boolean;
}

/** Inline Bible reference inside running text that links to the passage. Non-breaking space is placed after the book name. */
export const VerseCitation = forwardRef<HTMLAnchorElement, VerseCitationProps>(function VerseCitation(
  { dark = false, opensPage = false, className, children, ...rest },
  ref,
) {
  const content = typeof children === 'string' ? formatReference(children) : children;
  return (
    <a ref={ref} className={cx('sx-cite', dark && 'sx-cite-dark', className)} {...rest}>
      {content}
      {opensPage ? ' ↗' : null}
    </a>
  );
});
