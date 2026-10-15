import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type AppBarVariant = 'standard' | 'large' | 'search';

/** An icon-only 44×44 action on the bar. */
export interface AppBarAction {
  /** Accessible name, required because the button is icon-only ("Share", "More", "Search"). */
  label: string;
  /** Icon element, e.g. `<UiIcon name="share" />`. */
  icon: ReactNode;
  /** Click handler. */
  onClick?: () => void;
}

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onChange'> {
  /** `standard` is the 56px row, `large` adds a 32px title (and optional search field) for root screens, `search` replaces the bar with a search field and Cancel. @default "standard" */
  variant?: AppBarVariant;
  /** Screen title that names the place ("Bible", "John 3"). One line, under 20 characters. */
  title?: ReactNode;
  /** Back button: shows ‹ plus the parent screen name, never "Back". Used on drilled-in screens. */
  back?: { label: ReactNode; onClick?: () => void };
  /** Trailing icon actions, at most three (extras are dropped; move them into More). Primary first, More last. */
  actions?: AppBarAction[];
  /** Collapsed state after scroll: glass white with a hairline, centred title. @default false */
  scrolled?: boolean;
  /** Dark reader surface (`.ap-dark`). @default false */
  dark?: boolean;
  /** Use translucent glass action buttons for placing the bar over imagery (add your own scrim). @default false */
  glass?: boolean;
  /** Decorative status bar content (for phone-frame previews), e.g. a time and icons. Hidden from assistive tech. */
  statusBar?: ReactNode;
  /** Large variant: placeholder of the search field under the title, e.g. "Search books and verses". Omit for no field. */
  searchPlaceholder?: string;
  /** Called when the search field under the large title or a search action is focused or tapped. */
  onSearchOpen?: () => void;
  /** Accessible name of the search input. @default "Search" */
  searchLabel?: string;
  /** Search variant: input value. */
  searchValue?: string;
  /** Search variant: called as the reader types. */
  onSearchChange?: (value: string) => void;
  /** Search variant: called on Cancel (return focus to the search trigger). */
  onCancel?: () => void;
  /** Search variant: Cancel text. @default "Cancel" */
  cancelLabel?: ReactNode;
  /** Search variant: accessible name of the Clear button. @default "Clear search" */
  clearLabel?: string;
}

/** Top bar of a mobile app screen: back, title and icon actions, with large-title and search modes. */
export const AppBar = forwardRef<HTMLElement, AppBarProps>(function AppBar(
  {
    variant = 'standard',
    title,
    back,
    actions = [],
    scrolled = false,
    dark = false,
    glass = false,
    statusBar,
    searchPlaceholder,
    onSearchOpen,
    searchLabel = 'Search',
    searchValue = '',
    onSearchChange,
    onCancel,
    cancelLabel = 'Cancel',
    clearLabel = 'Clear search',
    className,
    ...rest
  },
  ref,
) {
  const status = statusBar ? <div className="ap-sb" aria-hidden="true">{statusBar}</div> : null;
  const tbClass = cx('ap-tb', glass && 'ap-tb-glass');
  const buttons = actions.slice(0, 3).map((a) => (
    <button key={a.label} className={tbClass} type="button" aria-label={a.label} onClick={a.onClick}>{a.icon}</button>
  ));
  const backButton = back ? (
    <button className="ap-back" type="button" onClick={back.onClick}>
      <UiIcon name="chevron-left" size={24} />
      <span>{back.label}</span>
    </button>
  ) : null;
  const wrapper = cx(scrolled && 'ap-bar-scrolled', dark && 'ap-dark', className);

  if (variant === 'search') {
    return (
      <header ref={ref} className={wrapper || undefined} {...rest}>
        {status}
        <div className="ap-bar ap-bar-search" role="search">
          <div className="ap-field ap-is-focus">
            <UiIcon name="search" size={20} />
            <input
              type="search"
              aria-label={searchLabel}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            {searchValue ? (
              <button className="ap-clear" type="button" aria-label={clearLabel} onClick={() => onSearchChange?.('')}>
                <UiIcon name="close" size={14} />
              </button>
            ) : null}
          </div>
          <button className="ap-cancel" type="button" onClick={onCancel}>{cancelLabel}</button>
        </div>
      </header>
    );
  }

  if (variant === 'large') {
    return (
      <header ref={ref} className={wrapper || undefined} {...rest}>
        {status}
        <div className="ap-bar ap-bar-end">
          {backButton}
          {back ? <span style={{ flex: 1 }} /> : null}
          {buttons}
        </div>
        <h1 className="ap-large">{title}</h1>
        {searchPlaceholder ? (
          <div className="ap-px">
            <div className="ap-field">
              <UiIcon name="search" size={20} />
              <input type="search" aria-label={searchLabel} placeholder={searchPlaceholder} readOnly onFocus={onSearchOpen} onClick={onSearchOpen} />
            </div>
          </div>
        ) : null}
      </header>
    );
  }

  return (
    <header ref={ref} className={wrapper || undefined} {...rest}>
      {status}
      <div className="ap-bar">
        {backButton}
        {!back && scrolled ? <span className="ap-tb ap-tb-ghost" aria-hidden="true" /> : null}
        <span className="ap-bar-title" role="heading" aria-level={1}>{title}</span>
        {buttons}
        {scrolled && actions.length === 0 ? <span className="ap-tb ap-tb-ghost" aria-hidden="true" /> : null}
      </div>
    </header>
  );
});

