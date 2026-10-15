import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon, type UiIconProps } from '../Icon';

export type LanguageRowVariant = 'row' | 'card';
export type LanguageFormatType = 'read' | 'listen' | 'print' | 'app';

const FORMAT_ORDER: LanguageFormatType[] = ['read', 'listen', 'print', 'app'];
const FORMAT_ICON: Record<LanguageFormatType, UiIconProps['name']> = {
  read: 'book-open',
  listen: 'headphones',
  print: 'file',
  app: 'phone',
};

export interface LanguageFormat {
  /** Format that exists for this language. Badges are always shown in the order read, listen, print, app. */
  type: LanguageFormatType;
  /** Badge word in the page language ("Read", "Listen", "Print", "App"). */
  label: ReactNode;
}

export interface LanguageRowProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** `row`: list row inside a `LanguageList`. `card`: card for featured languages. @default "row" */
  variant?: LanguageRowVariant;
  /** Link to the language page. */
  href: string;
  /** Language name written in its own script, shown first. Never show only the English name. */
  nativeName: string;
  /** BCP 47 code of the native name (BCP 47), for example "am". Needed so fonts and screen readers pick the right voice. */
  nativeLang: string;
  /** Set "rtl" for Arabic-script and Hebrew names. */
  nativeDir?: 'ltr' | 'rtl';
  /** English name exactly as in the directory ("Burmese"). Card meta may replace it with `meta`. */
  englishName: string;
  /** Card only: secondary line such as "Amharic · Ethiopia · 57M speakers (sample)". Defaults to `englishName`. */
  meta?: ReactNode;
  /** Formats available for this language; show only those that exist. */
  formats?: LanguageFormat[];
}

/** One language in the dot.bible directory. The whole row or card is a single link, so it ends with ↗ and has no nested links. */
export const LanguageRow = forwardRef<HTMLAnchorElement, LanguageRowProps>(function LanguageRow(
  { variant = 'row', nativeName, nativeLang, nativeDir, englishName, meta, formats, className, ...rest },
  ref,
) {
  const sorted = [...(formats ?? [])].sort((a, b) => FORMAT_ORDER.indexOf(a.type) - FORMAT_ORDER.indexOf(b.type));
  const badges = sorted.length ? (
    <div className="sx-badges">
      {sorted.map((f) => (
        <span key={f.type} className="sx-badge">
          <UiIcon name={FORMAT_ICON[f.type]} size={14} />
          {f.label}
        </span>
      ))}
    </div>
  ) : null;
  const native = (
    <span className="sx-native" lang={nativeLang} dir={nativeDir}>{nativeName}</span>
  );
  if (variant === 'card') {
    return (
      <a ref={ref} className={cx('sx-lcard', className)} {...rest}>
        <div className="sx-lcard-top">
          {native}
          <span className="sx-go" aria-hidden="true">{'↗'}</span>
        </div>
        <span className="sx-eng">{meta ?? englishName}</span>
        {badges}
      </a>
    );
  }
  return (
    <a ref={ref} className={cx('sx-lang', className)} {...rest}>
      <div className="sx-lang-name">
        {native}
        <span className="sx-eng">{englishName}</span>
      </div>
      {badges}
      <span className="sx-go" aria-hidden="true">{'↗'}</span>
    </a>
  );
});

export type LanguageListProps = HTMLAttributes<HTMLDivElement>;

/** Container for `LanguageRow` rows. Keep list order stable when filtering. */
export const LanguageList = forwardRef<HTMLDivElement, LanguageListProps>(function LanguageList({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('sx-langlist', className)} {...rest} />;
});
