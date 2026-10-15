import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type VideoPlayerState = 'poster' | 'playing' | 'paused';

/** Accessible names of the controls. Override for other languages. */
export interface VideoPlayerLabels {
  /** @default "Play" */
  play: string;
  /** @default "Pause" */
  pause: string;
  /** @default "Mute" */
  mute: string;
  /** @default "Captions" */
  captions: string;
  /** @default "Settings" */
  settings: string;
  /** @default "Full screen" */
  fullscreen: string;
  /** @default "Seek" */
  seek: string;
}

const defaultLabels: VideoPlayerLabels = {
  play: 'Play',
  pause: 'Pause',
  mute: 'Mute',
  captions: 'Captions',
  settings: 'Settings',
  fullscreen: 'Full screen',
  seek: 'Seek',
};

export interface VideoPlayerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Poster image URL (decorative, `alt=""`). */
  posterSrc?: string;
  /** Video title. Rendered as the visible `.h4` under the frame and used in the play button name. */
  title: ReactNode;
  /** Plain-text title for the accessible name of the play button. Falls back to `title` when it is a string. */
  titleText?: string;
  /** One-sentence summary under the title. */
  summary?: ReactNode;
  /** Total length in seconds. */
  duration: number;
  /** Spoken duration for the play button name, e.g. "4 minutes 12 seconds". */
  durationLabel?: string;
  /** Poster chip next to CC, e.g. "12 languages". Omit when there are no captions. */
  captionsChip?: ReactNode;
  /** Controlled state: `poster` (play button), `playing` or `paused` (control bar). */
  state?: VideoPlayerState;
  /** Initial state when uncontrolled. @default "poster" */
  defaultState?: VideoPlayerState;
  /** Called when the state changes. Start loading and playing the media here: this component renders no `<video>`. */
  onStateChange?: (state: VideoPlayerState) => void;
  /** Current position in seconds. @default 0 */
  currentTime?: number;
  /** Buffered position in seconds. @default 0 */
  buffered?: number;
  /** Called when the reader seeks (click on the track, or arrow, Home and End keys). */
  onSeek?: (seconds: number) => void;
  /** Muted toggle value. @default false */
  muted?: boolean;
  /** Called when Mute is pressed. */
  onMutedChange?: (muted: boolean) => void;
  /** Captions toggle value. @default true */
  captionsOn?: boolean;
  /** Called when the CC button is pressed. */
  onCaptionsChange?: (on: boolean) => void;
  /** Caption line shown above the bar while captions are on. */
  caption?: ReactNode;
  /** Called when Settings is pressed. */
  onSettings?: () => void;
  /** Called when Full screen is pressed. */
  onFullscreen?: () => void;
  /** Override control names. */
  labels?: Partial<VideoPlayerLabels>;
  /** Builds the poster play button name. @default "Play video: <title>, <durationLabel>" */
  formatPlayLabel?: (title: string, durationLabel?: string) => string;
  /** Builds the slider `aria-valuetext`. @default "1:24 of 4:12" */
  formatValueText?: (current: number, duration: number) => string;
  /** Seconds of inactivity before the bar hides while playing. @default 3 */
  hideAfter?: number;
}

/** Formats seconds as m:ss (or h:mm:ss). */
export function formatVideoTime(total: number): string {
  const t = Math.max(0, Math.floor(total));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = String(t % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/**
 * Presentational 16:9 video frame with a controlled playback UI: poster with a large play button and chips,
 * then a control bar with seek, time, captions, settings and full screen. It renders no `<video>`; the host
 * drives the media from the callbacks and feeds back `currentTime`, `buffered` and `state`.
 */
export const VideoPlayer = forwardRef<HTMLDivElement, VideoPlayerProps>(function VideoPlayer(
  {
    posterSrc,
    title,
    titleText,
    summary,
    duration,
    durationLabel,
    captionsChip,
    state: stateProp,
    defaultState = 'poster',
    onStateChange,
    currentTime = 0,
    buffered = 0,
    onSeek,
    muted = false,
    onMutedChange,
    captionsOn = true,
    onCaptionsChange,
    caption,
    onSettings,
    onFullscreen,
    labels,
    formatPlayLabel = (t, d) => `Play video: ${t}${d ? `, ${d}` : ''}`,
    formatValueText = (c, d) => `${formatVideoTime(c)} of ${formatVideoTime(d)}`,
    hideAfter = 3,
    className,
    ...rest
  },
  ref,
) {
  const l = { ...defaultLabels, ...labels };
  const [inner, setInner] = useState<VideoPlayerState>(defaultState);
  const state = stateProp !== undefined ? stateProp : inner;
  const setState = (s: VideoPlayerState) => {
    if (stateProp === undefined) setInner(s);
    onStateChange?.(s);
  };
  const [visible, setVisible] = useState(true);
  const focusWithin = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const playing = state === 'playing';
  const wake = () => setVisible(true);

  useEffect(() => {
    if (!playing) {
      setVisible(true);
      return undefined;
    }
    const id = window.setTimeout(() => {
      if (!focusWithin.current) setVisible(false);
    }, hideAfter * 1000);
    return () => window.clearTimeout(id);
  }, [playing, visible, hideAfter]);

  const plainTitle = titleText ?? (typeof title === 'string' ? title : '');
  const pct = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const bufPct = duration > 0 ? Math.min(100, Math.max(0, (buffered / duration) * 100)) : 0;

  const seekBy = (delta: number) => onSeek?.(Math.min(duration, Math.max(0, currentTime + delta)));
  const onTrackKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // Time always runs left to right in the control, so arrows are not mirrored in RTL.
    const map: Record<string, () => void> = {
      ArrowRight: () => seekBy(5),
      ArrowUp: () => seekBy(5),
      ArrowLeft: () => seekBy(-5),
      ArrowDown: () => seekBy(-5),
      PageUp: () => seekBy(15),
      PageDown: () => seekBy(-15),
      Home: () => onSeek?.(0),
      End: () => onSeek?.(duration),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };
  const onTrackClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    onSeek?.(Math.min(duration, Math.max(0, ((e.clientX - rect.left) / rect.width) * duration)));
  };

  return (
    <div ref={ref} className={className} {...rest}>
      <div
        className="mn-vid"
        onMouseMove={playing ? wake : undefined}
        onTouchStart={playing ? wake : undefined}
        onFocus={() => {
          focusWithin.current = true;
          wake();
        }}
        onBlur={() => {
          focusWithin.current = false;
        }}
      >
        {posterSrc ? <img src={posterSrc} alt="" /> : null}
        {state === 'poster' ? (
          <>
            <div className="mn-scrim" />
            <button
              className="mn-playbtn"
              type="button"
              aria-label={formatPlayLabel(plainTitle, durationLabel)}
              onClick={() => setState('playing')}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg>
            </button>
            {captionsChip ? <span className="mn-vchip mn-vchip-l"><span className="mn-cc">CC</span>{captionsChip}</span> : null}
            <span className="mn-vchip mn-vchip-r">{formatVideoTime(duration)}</span>
          </>
        ) : (
          <>
            <div className="mn-scrim mn-scrim-play" />
            {captionsOn && caption ? <div className="mn-caption">{caption}</div> : null}
            <div className="mn-vctrl" style={{ opacity: visible ? 1 : 0, transition: 'opacity 150ms ease' }}>
              <div
                ref={trackRef}
                className="mn-vtrack"
                role="slider"
                tabIndex={0}
                aria-label={l.seek}
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(currentTime)}
                aria-valuetext={formatValueText(currentTime, duration)}
                onKeyDown={onTrackKey}
                onClick={onTrackClick}
              >
                <span className="mn-buf" style={{ width: `${bufPct}%` }} />
                <span className="mn-fill" style={{ width: `${pct}%` }} />
                <span className="mn-knob" style={{ left: `${pct}%` }} />
              </div>
              <div className="mn-vrow">
                <button className="mn-vbtn" type="button" aria-label={playing ? l.pause : l.play} onClick={() => setState(playing ? 'paused' : 'playing')}>
                  <UiIcon name={playing ? 'pause' : 'play'} size={24} />
                </button>
                <button className="mn-vbtn" type="button" aria-label={l.mute} aria-pressed={muted} onClick={() => onMutedChange?.(!muted)}>
                  <UiIcon name={muted ? 'volume-off' : 'volume'} size={24} />
                </button>
                <span className="mn-vtime">{formatVideoTime(currentTime)} / {formatVideoTime(duration)}</span>
                <span className="mn-vspacer" />
                <button className="mn-vbtn" type="button" aria-label={l.captions} aria-pressed={captionsOn} onClick={() => onCaptionsChange?.(!captionsOn)}>
                  <span className="mn-cc">CC</span>
                </button>
                <button className="mn-vbtn" type="button" aria-label={l.settings} onClick={onSettings}>
                  <UiIcon name="settings" size={24} />
                </button>
                <button className="mn-vbtn" type="button" aria-label={l.fullscreen} onClick={onFullscreen}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <h3 className="h4">{title}</h3>
      {summary ? <p className="muted">{summary}</p> : null}
    </div>
  );
});
