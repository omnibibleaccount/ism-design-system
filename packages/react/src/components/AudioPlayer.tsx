import { forwardRef, useRef, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { useDirection } from '../direction';

export type AudioPlayerVariant = 'full' | 'mini' | 'miniDark';

export interface AudioPlayerLabels {
  /** Accessible name of the full player region. @default "Audio player" */
  region: string;
  /** Accessible name of the seek slider. @default "Seek" */
  seek: string;
  /** @default "Play" */
  play: string;
  /** @default "Pause" */
  pause: string;
  /** @default "Loading" */
  loading: string;
  /** @default "Previous chapter" */
  previous: string;
  /** @default "Next chapter" */
  next: string;
  /** @default "Chapter list" */
  chapterList: string;
  /** @default "Close player" */
  close: string;
  /** Accessible name of the back skip button. @default (s) => `Back ${s} seconds` */
  skipBack: (seconds: number) => string;
  /** Accessible name of the forward skip button. @default (s) => `Forward ${s} seconds` */
  skipForward: (seconds: number) => string;
  /** Accessible name of the speed button. @default (speed) => `Playback speed, ${speed}x` */
  speed: (speed: number) => string;
  /** Spoken `aria-valuetext` of the seek slider. @default "2 minutes 14 seconds" style */
  valueText: (seconds: number) => string;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const DEFAULT_LABELS: AudioPlayerLabels = {
  region: 'Audio player',
  seek: 'Seek',
  play: 'Play',
  pause: 'Pause',
  loading: 'Loading',
  previous: 'Previous chapter',
  next: 'Next chapter',
  chapterList: 'Chapter list',
  close: 'Close player',
  skipBack: (s) => `Back ${s} seconds`,
  skipForward: (s) => `Forward ${s} seconds`,
  speed: (x) => `Playback speed, ${x}x`,
  valueText: (sec) => {
    const total = Math.max(0, Math.round(sec));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return [m ? plural(m, 'minute', 'minutes') : '', s || !m ? plural(s, 'second', 'seconds') : ''].filter(Boolean).join(' ');
  },
};

/** Format seconds as m:ss (or h:mm:ss). */
export function formatAudioTime(seconds: number): string {
  const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

export interface AudioPlayerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** `full`: cover, seek bar and transport. `mini`: docked light bar. `miniDark`: docked dark bar. @default "full" */
  variant?: AudioPlayerVariant;
  /** Whether audio is playing. Drives the play/pause icon and label. @default false */
  playing?: boolean;
  /** Show the loading spinner in the play button. @default false */
  loading?: boolean;
  /** Current position in seconds. @default 0 */
  position?: number;
  /** Total duration in seconds. @default 0 */
  duration?: number;
  /** Playback speed multiplier. @default 1 */
  speed?: number;
  /** Speeds the speed button cycles through. @default [1, 1.25, 1.5, 0.75] */
  speeds?: number[];
  /** Seconds the skip buttons jump. @default 15 */
  skipSeconds?: number;
  /** Seconds one arrow key moves the seek slider. @default 5 */
  seekStep?: number;
  /** Title, for example "John 3 · Amharic". */
  title: ReactNode;
  /** Full variant subtitle: native name then "Narrated Bible". */
  subtitle?: ReactNode;
  /** Language of the subtitle's native-script text (BCP 47), for example "am". Set on the subtitle paragraph. */
  subtitleLang?: string;
  /** Overline of the full variant, for example "Now playing · dot.Bible Audio". */
  nowPlaying?: ReactNode;
  /** Cover image URL (decorative). */
  coverSrc?: string;
  /** Mini player meta line. Defaults to "2:14 / 5:52" built from `position` and `duration`. */
  meta?: ReactNode;
  /** Text shown before the default meta while paused, for example "Paused". Omit for none. */
  pausedLabel?: string;
  /** Called when the play/pause button is pressed. Never autoplay. */
  onPlayPause?: () => void;
  /** Called with the new position in seconds when the reader seeks (keyboard or pointer) or skips. */
  onSeek?: (seconds: number) => void;
  /** Called with the next speed when the speed button is pressed. The button is shown only when given. */
  onSpeedChange?: (speed: number) => void;
  /** Previous chapter. The button is shown only when given. */
  onPrevious?: () => void;
  /** Next chapter. The button is shown only when given. */
  onNext?: () => void;
  /** Chapter list. The button is shown only when given. */
  onChapterList?: () => void;
  /** Closes the mini player; shown in place of the skip button while paused. */
  onClose?: () => void;
  /** Accessible names. */
  labels?: Partial<AudioPlayerLabels>;
  /** Format a number of seconds for display. @default formatAudioTime */
  formatTime?: (seconds: number) => string;
}

/**
 * Presentational, controlled audio Bible player. It renders no `<audio>` element: connect it to any backend
 * through `playing`, `position`, `duration` and the callbacks.
 */
export const AudioPlayer = forwardRef<HTMLElement, AudioPlayerProps>(function AudioPlayer(
  {
    variant = 'full',
    playing = false,
    loading = false,
    position = 0,
    duration = 0,
    speed = 1,
    speeds = [1, 1.25, 1.5, 0.75],
    skipSeconds = 15,
    seekStep = 5,
    title,
    subtitle,
    subtitleLang,
    nowPlaying,
    coverSrc,
    meta,
    pausedLabel,
    onPlayPause,
    onSeek,
    onSpeedChange,
    onPrevious,
    onNext,
    onChapterList,
    onClose,
    labels,
    formatTime = formatAudioTime,
    className,
    ...rest
  },
  ref,
) {
  const l = { ...DEFAULT_LABELS, ...labels };
  const dir = useDirection();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const clamp = (s: number) => Math.min(Math.max(0, duration), Math.max(0, s));
  const pct = duration > 0 ? Math.min(100, Math.max(0, (position / duration) * 100)) : 0;
  const speedText = String(speed);

  const onTrackKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    let next: number | undefined;
    if (e.key === forwardKey || e.key === 'ArrowUp') next = position + seekStep;
    else if (e.key === backKey || e.key === 'ArrowDown') next = position - seekStep;
    else if (e.key === 'PageUp') next = position + skipSeconds;
    else if (e.key === 'PageDown') next = position - skipSeconds;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = duration;
    if (next === undefined) return;
    e.preventDefault();
    onSeek(clamp(next));
  };

  const onTrackPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (!onSeek || !trackRef.current || duration <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    if (rect.width <= 0) return;
    let f = (e.clientX - rect.left) / rect.width;
    if (dir === 'rtl') f = 1 - f;
    onSeek(clamp(f * duration));
  };

  const cycleSpeed = () => {
    if (!onSpeedChange) return;
    const i = speeds.indexOf(speed);
    onSpeedChange(speeds[(i + 1) % speeds.length]);
  };

  const playButton = (sizeClass?: string) => (
    <button
      type="button"
      className={cx('sx-big', sizeClass)}
      aria-label={playing ? l.pause : l.play}
      aria-busy={loading || undefined}
      onClick={onPlayPause}
    >
      {loading ? <span className="spin" role="img" aria-label={l.loading} /> : <UiIcon name={playing ? 'pause' : 'play'} size={24} fill="currentColor" />}
    </button>
  );

  const skipButton = (kind: 'back' | 'forward') => (
    <button
      type="button"
      className="sx-ctrl"
      aria-label={kind === 'back' ? l.skipBack(skipSeconds) : l.skipForward(skipSeconds)}
      onClick={() => onSeek?.(clamp(position + (kind === 'back' ? -skipSeconds : skipSeconds)))}
    >
      <UiIcon name={kind === 'back' ? 'replay' : 'forward'} size={24} />
      <small aria-hidden="true">{skipSeconds}</small>
    </button>
  );

  if (variant !== 'full') {
    const metaText = meta ?? `${pausedLabel && !playing ? `${pausedLabel} · ` : ''}${formatTime(position)} / ${formatTime(duration)}`;
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cx('sx-mini', variant === 'miniDark' && 'sx-mini-dark', className)}
        style={{ '--sx-progress': `${pct}%` } as React.CSSProperties}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        {coverSrc ? <img src={coverSrc} alt="" /> : null}
        <div className="sx-mini-text">
          <span className="sx-mini-title">{title}</span>
          <span className="sx-mini-meta">{metaText}</span>
        </div>
        {!playing && onClose ? (
          <button type="button" className="sx-ctrl" aria-label={l.close} onClick={onClose}>
            <UiIcon name="close" size={24} />
          </button>
        ) : (
          skipButton('back')
        )}
        {playButton('sx-big-sm')}
      </div>
    );
  }

  return (
    <section ref={ref} className={cx('sx-player', className)} aria-label={l.region} {...rest}>
      {coverSrc ? (
        <div className="sx-cover">
          <img src={coverSrc} alt="" />
        </div>
      ) : null}
      <div className="sx-player-main">
        <div>
          {nowPlaying ? <span className="sx-lbl">{nowPlaying}</span> : null}
          <p className="sx-player-title">{title}</p>
          {subtitle ? <p className="sx-player-sub" lang={subtitleLang}>{subtitle}</p> : null}
        </div>
        <div
          ref={trackRef}
          className="sx-track"
          tabIndex={0}
          role="slider"
          aria-label={l.seek}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(position)}
          aria-valuetext={l.valueText(position)}
          onKeyDown={onTrackKey}
          onPointerDown={onTrackPointer}
        >
          <i style={{ width: `${pct}%` }} />
          <b style={{ left: `${pct}%` }} />
        </div>
        <div className="sx-time">
          <span>{formatTime(position)}</span>
          <span>{`−${formatTime(Math.max(0, duration - position))}`}</span>
        </div>
        <div className="sx-controls">
          {onSpeedChange ? (
            <button type="button" className="sx-speed" aria-label={l.speed(speed)} onClick={cycleSpeed}>
              {speedText}x
            </button>
          ) : (
            <span />
          )}
          <div className="sx-transport">
            {onPrevious ? (
              <button type="button" className="sx-ctrl" aria-label={l.previous} onClick={onPrevious}>
                <UiIcon name="skip-back" size={24} />
              </button>
            ) : null}
            {skipButton('back')}
            {playButton()}
            {skipButton('forward')}
            {onNext ? (
              <button type="button" className="sx-ctrl" aria-label={l.next} onClick={onNext}>
                <UiIcon name="skip-forward" size={24} />
              </button>
            ) : null}
          </div>
          {onChapterList ? (
            <button type="button" className="sx-ibtn" aria-label={l.chapterList} onClick={onChapterList}>
              <UiIcon name="list" />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </section>
  );
});
