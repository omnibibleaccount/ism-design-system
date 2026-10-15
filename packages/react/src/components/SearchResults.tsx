import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { AppBar } from './AppBar';

export type SearchResultKind = 'language' | 'verse' | 'page';

const TILE_CLASS: Record<SearchResultKind, string> = { language: 'ap-lt', verse: 'ap-lt ap-lt-verse', page: 'ap-lt ap-lt-page' };
const VISUALLY_HIDDEN = 'fm-vh';

/** A single result row. */
export interface SearchResultItem {
  /** Stable id. */
  id: string;
  /** Tile text, e.g. "SW" for a language, "JN" for a verse. Decorative. */
  tile?: string;
  /** Primary text. The matched characters of `query` are highlighted with `mark.ap-hl`. */
  title: string;
  /** Secondary line, e.g. "Kiswahili · Bible + audio". */
  subtitle?: string;
  /** Destination. In-app results end with ›; set `external` for website pages. Without `href` a button is rendered. */
  href?: string;
  /** The result opens the website: ends with ↗ and gets the hidden `externalLabel`. @default false */
  external?: boolean;
  /** Click handler (use for in-app navigation without `href`). */
  onSelect?: () => void;
}

/** A group of results of one type. Order groups Languages, Verses, Pages. */
export interface SearchResultGroup {
  /** Stable id. */
  id: string;
  /** Group header, e.g. "Languages". */
  title: ReactNode;
  /** Controls the tile colour of its rows. @default "language" */
  kind?: SearchResultKind;
  /** Rows. At most five are shown, then the See all row. */
  items: SearchResultItem[];
  /** Total number in the group (shown as the Horizon Blue count). @default items.length */
  count?: number;
  /** "See all" row text, shown when the group has more than five rows. */
  seeAllLabel?: ReactNode;
  /** Called when See all is pressed. */
  onSeeAll?: () => void;
}

/** Content of the no-results state. */
export interface SearchEmptyState {
  /** e.g. "No results for “xqz”". */
  title: ReactNode;
  /** e.g. "Check the spelling, or try a book name like “John” or a language like “Amharic”." */
  hint?: ReactNode;
  /** The one secondary action, e.g. "Browse all languages". */
  actionLabel?: ReactNode;
  /** Called when the action is pressed. */
  onAction?: () => void;
}

export interface SearchResultsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current text in the search field. Empty shows recent searches. */
  query: string;
  /** Called as the reader types or clears. */
  onQueryChange?: (query: string) => void;
  /** Called on Cancel (return focus to the search trigger). */
  onCancel?: () => void;
  /** Placeholder, e.g. "Search languages, verses". */
  placeholder?: string;
  /** Accessible name of the input. @default "Search" */
  searchLabel?: string;
  /** Cancel text. @default "Cancel" */
  cancelLabel?: ReactNode;
  /** Result groups. When `query` is set and all groups are empty the `empty` state shows. */
  groups?: SearchResultGroup[];
  /** Polite live-region text announcing counts, e.g. "2 languages, 14 verses, 1 page". */
  announcement?: string;
  /** Hidden text for external rows. @default "(opens the website)" */
  externalLabel?: string;
  /** No-results content. */
  empty?: SearchEmptyState;
  /** Recent searches, newest first, five at most. Shown while `query` is empty. */
  recents?: string[];
  /** Header of the recents block, e.g. "Recent". */
  recentsHeading?: ReactNode;
  /** Clear-all row text, e.g. "Clear". */
  clearRecentsLabel?: ReactNode;
  /** Called when a recent search is chosen. */
  onRecentSelect?: (term: string) => void;
  /** Called when one recent search is removed. */
  onRecentRemove?: (term: string) => void;
  /** Called when Clear is pressed. */
  onClearRecents?: () => void;
  /** Builds the accessible name of a recent's remove button. @default "Remove <term>" */
  formatRemoveLabel?: (term: string) => string;
  /** "Try" suggestions shown as chips under the recents. */
  suggestions?: string[];
  /** Header of the suggestions, e.g. "Try". */
  suggestionsHeading?: ReactNode;
  /** Called when a suggestion chip is chosen. */
  onSuggestionSelect?: (term: string) => void;
}

/** Wraps the first case-insensitive match of `query` in `<mark class="ap-hl">`. */
function highlight(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="ap-hl">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

// Reset for the select control inside a recent-search row (the row itself holds the remove button).
const SELECT_STYLE: CSSProperties = {
  flex: 1,
  minWidth: 0,
  minHeight: 44,
  padding: 0,
  border: 0,
  background: 'none',
  font: 'inherit',
  color: 'var(--black)',
  textAlign: 'start',
  cursor: 'pointer',
};

/**
 * The in-app search screen: focused field with Cancel, recent searches, grouped results with highlighted
 * matches and a helpful no-results state. Presentational: you own the query and the results.
 */
export const SearchResults = forwardRef<HTMLDivElement, SearchResultsProps>(function SearchResults(
  {
    query,
    onQueryChange,
    onCancel,
    placeholder,
    searchLabel,
    cancelLabel,
    groups = [],
    announcement,
    externalLabel = '(opens the website)',
    empty,
    recents = [],
    recentsHeading,
    clearRecentsLabel,
    onRecentSelect,
    onRecentRemove,
    onClearRecents,
    formatRemoveLabel = (t) => `Remove ${t}`,
    suggestions = [],
    suggestionsHeading,
    onSuggestionSelect,
    className,
    ...rest
  },
  ref,
) {
  const hasQuery = query.trim().length > 0;
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div ref={ref} className={className} {...rest}>
      <AppBar
        variant="search"
        searchValue={query}
        onSearchChange={onQueryChange}
        onCancel={onCancel}
        searchPlaceholder={placeholder}
        searchLabel={searchLabel}
        cancelLabel={cancelLabel}
      />
      <div className={VISUALLY_HIDDEN} role="status" aria-live="polite">{announcement}</div>

      {!hasQuery ? (
        <>
          {recents.length ? (
            <>
              <div className="ap-res-h">
                <span>{recentsHeading}</span>
                {clearRecentsLabel ? (
                  <button className="ap-res-action" type="button" onClick={onClearRecents}>{clearRecentsLabel}</button>
                ) : null}
              </div>
              {recents.slice(0, 5).map((term) => (
                <div key={term} className="ap-res">
                  <UiIcon name="clock" size={20} />
                  <button type="button" style={SELECT_STYLE} onClick={() => onRecentSelect?.(term)}>{term}</button>
                  <button className="ap-rm" type="button" aria-label={formatRemoveLabel(term)} onClick={() => onRecentRemove?.(term)}>
                    <UiIcon name="close" size={18} />
                  </button>
                </div>
              ))}
            </>
          ) : null}
          {suggestions.length ? (
            <>
              <div className="ap-res-h"><span>{suggestionsHeading}</span></div>
              <div className="ap-chips">
                {suggestions.map((s) => (
                  <button key={s} className="chip" type="button" onClick={() => onSuggestionSelect?.(s)}>{s}</button>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : total === 0 ? (
        empty ? (
          <div className="ap-empty">
            <span className="ap-empty-ic"><UiIcon name="search" size={28} /></span>
            <h3>{empty.title}</h3>
            {empty.hint ? <p>{empty.hint}</p> : null}
            {empty.actionLabel ? (
              <button className="btn btn-secondary btn-sm" type="button" onClick={empty.onAction}>{empty.actionLabel}</button>
            ) : null}
          </div>
        ) : null
      ) : (
        groups.map((g) => {
          const kind = g.kind ?? 'language';
          const more = g.items.length > 5;
          return (
            <section key={g.id}>
              <div className="ap-res-h"><span>{g.title}</span><span className="count">{g.count ?? g.items.length}</span></div>
              {g.items.slice(0, 5).map((item) => {
                const body = (
                  <>
                    {item.tile ? <i className={TILE_CLASS[kind]} aria-hidden="true">{item.tile}</i> : null}
                    <span className="ap-tt">
                      <span className="ap-t">{highlight(item.title, query)}</span>
                      {item.subtitle ? <span className="ap-s">{item.subtitle}</span> : null}
                    </span>
                    {item.external ? (
                      <>
                        <span className={VISUALLY_HIDDEN}>{externalLabel}</span>
                        <span className="ap-go" aria-hidden="true">↗</span>
                      </>
                    ) : (
                      <span className="ap-chv"><UiIcon name="chevron-right" size={20} /></span>
                    )}
                  </>
                );
                return item.href ? (
                  <a key={item.id} className="ap-res" href={item.href} onClick={item.onSelect}>{body}</a>
                ) : (
                  <button key={item.id} className="ap-res" type="button" onClick={item.onSelect}>{body}</button>
                );
              })}
              {more && g.seeAllLabel ? (
                <button className="ap-res-action" type="button" onClick={g.onSeeAll}>{g.seeAllLabel}</button>
              ) : null}
            </section>
          );
        })
      )}
    </div>
  );
});
