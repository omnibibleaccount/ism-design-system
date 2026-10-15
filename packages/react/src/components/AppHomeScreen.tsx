import { forwardRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { Button } from './Button';
import { TabBar, type TabBarItem } from './TabBar';
import { DownloadState, type DownloadStatus } from './DownloadState';

const VISUALLY_HIDDEN = 'fm-vh';

/** The continue-reading (or start-reading) card. */
export interface HomeContinueCard {
  /** Kicker, e.g. "Continue reading · BSB". */
  kicker: ReactNode;
  /** Chapter title, e.g. "John 3". */
  title: ReactNode;
  /** Next verse preview in Lora: verse number plus text. */
  verseNumber?: ReactNode;
  /** Preview text, e.g. "For God so loved the world…". */
  preview: ReactNode;
  /** Percent read (0 to 100) for the progress ring. Omit on the first run (no ring). */
  percent?: number;
  /** Text equivalent of the ring, e.g. "42 percent read". */
  percentLabel?: string;
  /** Primary action label: the screen's one Horizon Blue button ("Continue" or "Start reading"). */
  actionLabel: ReactNode;
  /** Called when the primary action is pressed. */
  onAction?: () => void;
  /** Secondary action label, e.g. "Listen". */
  secondaryLabel?: ReactNode;
  /** Called when the secondary action is pressed. */
  onSecondary?: () => void;
}

/** A language row. Downloaded languages show ›; others show the download button. */
export interface HomeLanguage {
  /** Stable id. */
  id: string;
  /** Two-letter tile, e.g. "AM". Decorative. */
  tile: string;
  /** English name, e.g. "Amharic". */
  name: string;
  /** Native-script name, e.g. "አማርኛ". */
  nativeName?: string;
  /** Language code of `nativeName`, e.g. "am". */
  nativeLang?: string;
  /** "Bible + audio · Downloaded" or the size, e.g. "Bible · 210 MB". */
  subtitle: ReactNode;
  /** Download state. `downloaded` shows › and links to the language. @default "downloaded" */
  status?: DownloadStatus;
  /** Progress 0 to 1 while downloading. */
  progress?: number;
  /** Open the language (downloaded rows). */
  href?: string;
  /** Click handler for opening the language, or for the download button on not-downloaded rows. */
  onSelect?: () => void;
}

/** The mini player above the tab bar. Drop it when nothing is playing. */
export interface HomeMiniPlayer {
  /** Title, e.g. "John 3 · Amharic". */
  title: ReactNode;
  /** Time text, e.g. "2:14 / 5:40". */
  time: ReactNode;
  /** Cover image URL (decorative). */
  imageSrc?: string;
  /** Progress 0 to 1 for the top line. */
  progress: number;
  /** Text equivalent of the progress line, e.g. "2:14 of 5:40". */
  progressLabel?: string;
  /** Whether audio is playing (shows Pause) or paused (shows Play). @default true */
  playing?: boolean;
  /** Called to toggle playback. */
  onToggle?: () => void;
  /** Called to close the player. */
  onClose?: () => void;
  /** @default "Pause" */
  pauseLabel?: string;
  /** @default "Play" */
  playLabel?: string;
  /** @default "Close player" */
  closeLabel?: string;
}

export interface AppHomeScreenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Wordmark text next to the icon. The dot is Horizon Blue. @default dot.Bible with a blue dot */
  brand?: ReactNode;
  /** dot.Bible icon URL (black; inverted on dark by the CSS). @default "/ism/assets/logos/dot.bible%20Icon%20Black.svg" */
  brandIconSrc?: string;
  /** Visually hidden `h1` for assistive tech, the tab name. @default "Home" */
  pageTitle?: string;
  /** Decorative status bar content for phone-frame previews, e.g. the time. Hidden from assistive tech. */
  statusBar?: ReactNode;
  /** Accessible name of the notifications button. @default "Notifications" */
  notificationsLabel?: string;
  /** Show the Horizon Blue dot on notifications (never red). @default false */
  notificationsDot?: boolean;
  /** Called when notifications is pressed. */
  onNotifications?: () => void;
  /** Initial letter(s) in the account avatar. */
  accountInitial?: string;
  /** Accessible name of the account button. @default "Account" */
  accountLabel?: string;
  /** Called when the avatar is pressed. */
  onAccount?: () => void;
  /** Search field text, e.g. "Search 500+ languages". */
  searchPlaceholder: string;
  /** Called when the search field is activated (opens SearchResults). */
  onSearchOpen?: () => void;
  /** Continue-reading card, or the "Start reading" card on first run (omit `percent`). */
  continueCard?: HomeContinueCard;
  /** Header of the language group, e.g. "Your languages". */
  languagesHeading?: ReactNode;
  /** "See all" link text (› is added), e.g. "See all". */
  seeAllLabel?: ReactNode;
  /** "See all" destination. */
  seeAllHref?: string;
  /** Language rows. */
  languages?: HomeLanguage[];
  /** Mini player. Omit when nothing is playing. */
  player?: HomeMiniPlayer;
  /** Tab bar items; Home active by default. dot.Bible uses Home, Bible, Listen, Saved, More. */
  tabs: TabBarItem[];
  /** Active tab id. @default "home" */
  activeTab?: string;
  /** Called when a tab is chosen. */
  onTabChange?: (id: string) => void;
  /** Dark mode (`.ap-dark` on the screen and tab bar). @default false */
  dark?: boolean;
}

/**
 * The composed dot.Bible home screen from App UI parts: app bar with wordmark, search, continue-reading card,
 * grouped language rows, mini player and tab bar. One Horizon Blue primary on the screen: the card's action.
 */
export const AppHomeScreen = forwardRef<HTMLDivElement, AppHomeScreenProps>(function AppHomeScreen(
  {
    brand,
    brandIconSrc = '/ism/assets/logos/dot.bible%20Icon%20Black.svg',
    pageTitle = 'Home',
    statusBar,
    notificationsLabel = 'Notifications',
    notificationsDot = false,
    onNotifications,
    accountInitial,
    accountLabel = 'Account',
    onAccount,
    searchPlaceholder,
    onSearchOpen,
    continueCard,
    languagesHeading,
    seeAllLabel,
    seeAllHref,
    languages = [],
    player,
    tabs,
    activeTab = 'home',
    onTabChange,
    dark = false,
    className,
    ...rest
  },
  ref,
) {
  const onSearchKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSearchOpen?.();
    }
  };
  const c = continueCard;
  const ringBg =
    c?.percent !== undefined
      ? `radial-gradient(var(--white) 58%,transparent 60%),conic-gradient(var(--horizon-blue) 0 ${c.percent}%,var(--gray-200) ${c.percent}% 100%)`
      : undefined;

  return (
    <div ref={ref} className={cx('ap-screen', dark && 'ap-dark', className)} {...rest}>
      <h1 className={VISUALLY_HIDDEN}>{pageTitle}</h1>
      {statusBar ? <div className="ap-sb" aria-hidden="true">{statusBar}</div> : null}
      <div className="ap-bar">
        <span className="ap-wm">
          <img src={brandIconSrc} alt="" style={dark ? { filter: 'brightness(0) invert(1)' } : undefined} />
          <span>{brand ?? <>dot<b>.</b>Bible</>}</span>
        </span>
        <span style={{ flex: 1 }} />
        <button className="ap-tb" type="button" aria-label={notificationsLabel} onClick={onNotifications}>
          <UiIcon name="info" size={22} />
          {notificationsDot ? <span className="ap-dot" aria-hidden="true" /> : null}
        </button>
        <button className="ap-avatar" type="button" aria-label={accountLabel} onClick={onAccount}>{accountInitial}</button>
      </div>
      <div className="ap-scroll">
        <div className="ap-px">
          <div className="ap-field" role="button" tabIndex={0} onClick={onSearchOpen} onKeyDown={onSearchKey}>
            <UiIcon name="search" size={20} />
            <span>{searchPlaceholder}</span>
          </div>
        </div>
        {c ? (
          <div className="ap-cont" style={{ marginTop: 12 }}>
            <div className="ap-cont-top">
              <div>
                <span className="ap-kicker ap-kicker-blue">{c.kicker}</span>
                <p className="ap-cont-t">{c.title}</p>
              </div>
              {c.percent !== undefined ? (
                <span className="ap-ring-sm" role="img" aria-label={c.percentLabel} style={{ background: ringBg }}>{Math.round(c.percent)}%</span>
              ) : null}
            </div>
            <p className="ap-cont-v">{c.verseNumber ? <sup className="ap-vn">{c.verseNumber}</sup> : null}{c.preview}</p>
            <div className="ap-cont-acts">
              <Button size="sm" onClick={c.onAction}>{c.actionLabel}</Button>
              {c.secondaryLabel ? <Button variant="outlineLight" size="sm" onClick={c.onSecondary}>{c.secondaryLabel}</Button> : null}
            </div>
          </div>
        ) : null}
        {languages.length ? (
          <>
            <div className="ap-res-h">
              <span>{languagesHeading}</span>
              {seeAllLabel ? <a className="ap-res-action" href={seeAllHref}>{seeAllLabel} <span aria-hidden="true">›</span></a> : null}
            </div>
            <div className="ap-grp">
              {languages.map((lang) => {
                const status = lang.status ?? 'downloaded';
                const inner = (
                  <>
                    <i className="ap-lt" aria-hidden="true">{lang.tile}</i>
                    <span className="ap-tt">
                      <span className="ap-t">
                        {lang.name}
                        {lang.nativeName ? <> <span className="ap-eth" lang={lang.nativeLang}>{lang.nativeName}</span></> : null}
                      </span>
                      <span className="ap-s">{lang.subtitle}</span>
                    </span>
                  </>
                );
                return status === 'downloaded' ? (
                  <a key={lang.id} className="ap-row ap-row-tall" href={lang.href} onClick={lang.onSelect}>
                    {inner}
                    <span className="ap-chv"><UiIcon name="chevron-right" size={18} /></span>
                  </a>
                ) : (
                  <div key={lang.id} className="ap-row ap-row-tall">
                    {inner}
                    <DownloadState small status={status} progress={lang.progress} itemName={lang.name} onClick={lang.onSelect} />
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
      {player ? (
        <div className="ap-mini">
          <span
            className="ap-mini-line"
            role={player.progressLabel ? 'img' : undefined}
            aria-label={player.progressLabel}
            aria-hidden={player.progressLabel ? undefined : true}
            style={{ width: `${Math.round(Math.min(1, Math.max(0, player.progress)) * 100)}%` }}
          />
          {player.imageSrc ? <img src={player.imageSrc} alt="" /> : null}
          <div className="ap-mini-tt">
            <span className="ap-t">{player.title}</span>
            <span className="ap-s">{player.time}</span>
          </div>
          <button
            className="ap-tb"
            type="button"
            aria-label={(player.playing ?? true) ? (player.pauseLabel ?? 'Pause') : (player.playLabel ?? 'Play')}
            onClick={player.onToggle}
          >
            <UiIcon name={(player.playing ?? true) ? 'pause' : 'play'} size={22} />
          </button>
          <button className="ap-tb" type="button" aria-label={player.closeLabel ?? 'Close player'} onClick={player.onClose}>
            <UiIcon name="close" size={20} />
          </button>
        </div>
      ) : null}
      <TabBar tabs={tabs} value={activeTab} onChange={onTabChange} dark={dark} />
    </div>
  );
});
