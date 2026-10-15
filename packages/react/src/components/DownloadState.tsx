import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type DownloadStatus = 'idle' | 'downloading' | 'paused' | 'downloaded' | 'error';

/** Ring circumference for r = 19 (progress × this = dash length). */
const CIRCUMFERENCE = 119.4;

/** Builders for the accessible name of the button. Each says the action and the item. Override for other languages. */
export interface DownloadStateLabels {
  /** Not downloaded. @default "Download <name>" */
  download: (name?: string) => string;
  /** Downloading. @default "Stop download, 62 percent" */
  stop: (percent: number, name?: string) => string;
  /** Paused. @default "Resume download, 62 percent" */
  resume: (percent: number, name?: string) => string;
  /** Downloaded. @default "<name> downloaded" */
  downloaded: (name?: string) => string;
  /** Error. @default "Retry download" */
  retry: (name?: string) => string;
}

const defaultLabels: DownloadStateLabels = {
  download: (n) => (n ? `Download ${n}` : 'Download'),
  stop: (p, n) => `Stop download, ${p} percent${n ? `, ${n}` : ''}`,
  resume: (p, n) => `Resume download, ${p} percent${n ? `, ${n}` : ''}`,
  downloaded: (n) => (n ? `${n} downloaded` : 'Downloaded'),
  retry: (n) => (n ? `Retry download, ${n}` : 'Retry download'),
};

export interface DownloadStateProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /**
   * `idle` hairline circle with ↓, `downloading` progress ring with a stop square, `paused` ring with a
   * resume triangle, `downloaded` success tick, `error` retry on error tint. State is never colour alone:
   * the icon shape changes too, and the row subtitle should change.
   * @default "idle"
   */
  status?: DownloadStatus;
  /** Progress from 0 to 1 for `downloading` and `paused`. Update at most every 250 ms. @default 0 */
  progress?: number;
  /** Name of the item, used in the accessible name ("Download Amharic"). */
  itemName?: string;
  /** 36px button with a 44px hit area, for dense lists. @default false */
  small?: boolean;
  /** Override the accessible-name builders. */
  labels?: Partial<DownloadStateLabels>;
}

/**
 * The 44px download button in its states: not downloaded, downloading (progress ring), paused, downloaded
 * and error. Always on the right of the row. It only reports presses; you own the download.
 */
export const DownloadState = forwardRef<HTMLButtonElement, DownloadStateProps>(function DownloadState(
  { status = 'idle', progress = 0, itemName, small = false, labels, className, type = 'button', ...rest },
  ref,
) {
  const l = { ...defaultLabels, ...labels };
  const clamped = Math.min(1, Math.max(0, progress));
  const percent = Math.round(clamped * 100);
  const dash = (Math.round(clamped * CIRCUMFERENCE * 10) / 10).toFixed(1);
  const iconSize = small ? 16 : 20;

  let name: string;
  let body: ReactNode;
  switch (status) {
    case 'downloading':
    case 'paused':
      name = status === 'downloading' ? l.stop(percent, itemName) : l.resume(percent, itemName);
      body = (
        <svg width={small ? 36 : 44} height={small ? 36 : 44} viewBox="0 0 44 44" aria-hidden="true" focusable="false">
          <circle className="ap-ring-track" cx="22" cy="22" r="19" />
          <circle className="ap-ring-val" cx="22" cy="22" r="19" strokeDasharray={`${dash} 120`} transform="rotate(-90 22 22)" />
          {status === 'downloading' ? (
            <rect className="ap-ring-stop" x="17" y="17" width="10" height="10" rx="2" />
          ) : (
            <path className="ap-ring-stop" d="M19 16.5v11l9-5.5z" />
          )}
        </svg>
      );
      break;
    case 'downloaded':
      name = l.downloaded(itemName);
      body = <UiIcon name="check" size={iconSize} />;
      break;
    case 'error':
      name = l.retry(itemName);
      body = <UiIcon name="refresh" size={iconSize} />;
      break;
    default:
      name = l.download(itemName);
      body = <UiIcon name="download" size={iconSize} />;
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'ap-dl',
        status === 'idle' && 'ap-dl-idle',
        status === 'downloaded' && 'ap-dl-ok',
        status === 'error' && 'ap-dl-err',
        small && 'ap-dl-sm',
        className,
      )}
      aria-label={name}
      {...rest}
    >
      {body}
    </button>
  );
});

export interface DownloadRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** English (or app-language) name, e.g. "Amharic". */
  name: string;
  /** Native-script name shown after the name, e.g. "አማርኛ". Rendered with `lang` when `nativeLang` is set. */
  nativeName?: string;
  /** Language code of `nativeName`, e.g. "am". */
  nativeLang?: string;
  /** Subtitle: size before download ("312 MB · Bible + audio"), progress during ("193 of 312 MB"), error text ("Download failed · Tap to retry"). */
  subtitle?: ReactNode;
  /** Download state of the row. @default "idle" */
  status?: DownloadStatus;
  /** Progress 0 to 1 for the ring. */
  progress?: number;
  /** Called when the button is pressed (download, stop, resume or retry). */
  onAction?: () => void;
  /** Offline and not downloaded: dim the row and keep the reason in `subtitle` ("Needs a connection"). @default false */
  disabled?: boolean;
  /** Override the button's accessible-name builders. */
  labels?: Partial<DownloadStateLabels>;
  /** Use the 36px button. @default false */
  small?: boolean;
}

/** A 64px list row with a name, subtitle and the `DownloadState` button on the right. */
export const DownloadRow = forwardRef<HTMLDivElement, DownloadRowProps>(function DownloadRow(
  { name, nativeName, nativeLang, subtitle, status = 'idle', progress, onAction, disabled = false, labels, small, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('ap-row ap-row-tall', className)} aria-disabled={disabled || undefined} {...rest}>
      <span className="ap-tt">
        <span className="ap-t">
          {name}
          {nativeName ? <> <span className="ap-eth" lang={nativeLang}>{nativeName}</span></> : null}
        </span>
        {subtitle ? <span className={cx('ap-s', status === 'error' && 'ap-s-err')}>{subtitle}</span> : null}
      </span>
      <DownloadState status={status} progress={progress} itemName={name} labels={labels} small={small} disabled={disabled} onClick={onAction} />
    </div>
  );
});

export interface StorageSegment {
  /** Segment kind: Bibles Horizon Blue, audio violet, other grey. */
  kind: 'bibles' | 'audio' | 'other';
  /** Legend text with its number, e.g. "Bibles 740 MB". */
  label: string;
  /** Share of the bar, 0 to 100. */
  percent: number;
}

const SEGMENT_CLASS: Record<StorageSegment['kind'], string> = { bibles: 'ap-c-bibles', audio: 'ap-c-audio', other: 'ap-c-other' };

export interface StorageRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Row title, e.g. "Storage". */
  title: ReactNode;
  /** Total used, e.g. "1.4 GB used". Mark example numbers as samples in specs. */
  used: ReactNode;
  /** Bar segments in order. The legend always shows the numbers. */
  segments: StorageSegment[];
}

/** Storage usage row for the top of Manage downloads: a segmented bar plus a legend with numbers. */
export const StorageRow = forwardRef<HTMLDivElement, StorageRowProps>(function StorageRow(
  { title, used, segments, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('ap-grp ap-grp-solo ap-store', className)} {...rest}>
      <div className="ap-store-top"><b>{title}</b><span>{used}</span></div>
      <div className="ap-store-bar" role="img" aria-label={segments.map((s) => s.label).join(', ')}>
        {segments.map((s) => (
          <i key={s.label} className={SEGMENT_CLASS[s.kind]} style={{ width: `${s.percent}%` }} />
        ))}
      </div>
      <div className="ap-legend">
        {segments.map((s) => (
          <span key={s.label}><i className={SEGMENT_CLASS[s.kind]} />{s.label}</span>
        ))}
      </div>
    </div>
  );
});

export interface ConnectionBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `offline` is the charcoal banner under the app bar; `online` is the success tint (hide it after 3 s). @default "offline" */
  kind?: 'offline' | 'online';
  /** Bold lead, e.g. "You’re offline" or "Back online". */
  title: ReactNode;
  /** Rest of the line, e.g. "Downloaded Bibles still work". */
  message?: ReactNode;
}

/** Offline or back-online banner (`role="status"`, announced once). Never blocks the screen. */
export const ConnectionBanner = forwardRef<HTMLDivElement, ConnectionBannerProps>(function ConnectionBanner(
  { kind = 'offline', title, message, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('ap-banner', kind === 'online' && 'ap-banner-online', className)} role="status" {...rest}>
      <UiIcon name={kind === 'online' ? 'signal' : 'wifi-off'} size={20} />
      <span><b>{title}</b>{message ? <> · {message}</> : null}</span>
    </div>
  );
});

export interface NotDownloadedWarningProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Bold line, e.g. "This Bible isn’t downloaded". */
  title: ReactNode;
  /** Body, e.g. "Download Español · NBLA to read it without a connection." */
  message?: ReactNode;
}

/** Inline warning shown when the reader opens something not downloaded while offline. */
export const NotDownloadedWarning = forwardRef<HTMLDivElement, NotDownloadedWarningProps>(function NotDownloadedWarning(
  { title, message, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cx('alert alert-warn ap-warn', className)} {...rest}>
      <UiIcon name="alert-circle" size={20} />
      <div><b>{title}</b>{message ? <p>{message}</p> : null}</div>
    </div>
  );
});
