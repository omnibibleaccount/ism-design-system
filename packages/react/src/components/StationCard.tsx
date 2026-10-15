import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type StationStatus = 'onAir' | 'offAir';

export interface StationCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Call sign or station name as the station uses it, e.g. "KISM". */
  name: string;
  /** Frequency line in tabular numbers, e.g. "98.7 FM · HD2". */
  frequency?: string;
  /** `onAir` shows the pulsing live pill; `offAir` greys the photo and the pill. @default "onAir" */
  status?: StationStatus;
  /** Pill text for on air. @default "On air" */
  onAirLabel?: string;
  /** Pill text for off air. @default "Off air" */
  offAirLabel?: string;
  /** Photo URL, e.g. `/ism/assets/imagery/deck-photo-headphones.jpg`. */
  imageSrc?: string;
  /** Real alt text for the photo, e.g. "A listener wearing headphones". */
  imageAlt?: string;
  /** Location row, e.g. "Nairobi, Kenya". */
  location?: string;
  /** Languages row, joined with " · " by the component. */
  languages?: string[];
  /** Label before the now-playing text, e.g. "Now:". Omit on off-air cards. */
  nowLabel?: ReactNode;
  /** What is playing now (on air) or when the station returns (off air, in local time). */
  now?: ReactNode;
  /** Action label, e.g. "Listen live" or "Past broadcasts". */
  actionLabel: ReactNode;
  /** Action URL. When omitted a `<button>` is rendered and `onAction` is used. */
  actionHref?: string;
  /** Click handler for the action (use with a button, or to start audio on press; never autoplay). */
  onAction?: () => void;
  /**
   * Use the Horizon Blue primary button. Only for the one featured on-air station; others use the
   * secondary button. Off-air cards always use secondary and show ↗.
   * @default true
   */
  primaryAction?: boolean;
}

/** Partner radio station card: photo, call sign, frequency, live status pill, meta, now line and one action. */
export const StationCard = forwardRef<HTMLElement, StationCardProps>(function StationCard(
  {
    name,
    frequency,
    status = 'onAir',
    onAirLabel = 'On air',
    offAirLabel = 'Off air',
    imageSrc,
    imageAlt = '',
    location,
    languages,
    nowLabel,
    now,
    actionLabel,
    actionHref,
    onAction,
    primaryAction = true,
    className,
    ...rest
  },
  ref,
) {
  const live = status === 'onAir';
  const btnClass = cx('btn', live && primaryAction ? 'btn-primary' : 'btn-secondary');
  const content = (
    <>
      {live ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" /></svg>
      ) : null}
      {actionLabel}
      {!live ? <> <span className="arrow" aria-hidden="true">↗</span></> : null}
    </>
  );
  return (
    <article ref={ref} className={cx('card card-flat mn-station', className)} {...rest}>
      {imageSrc ? (
        <div className={cx('mn-station-img', !live && 'mn-is-off')}>
          <img className="photo" src={imageSrc} alt={imageAlt} />
        </div>
      ) : null}
      <div className="mn-station-body">
        <div className="mn-station-head">
          <div>
            <p className="mn-station-name">{name}</p>
            {frequency ? <p className="mn-station-freq">{frequency}</p> : null}
          </div>
          {live ? (
            <span className="mn-live"><i aria-hidden="true" />{onAirLabel}</span>
          ) : (
            <span className="mn-offair"><i aria-hidden="true" />{offAirLabel}</span>
          )}
        </div>
        {location || languages?.length ? (
          <div className="mn-meta">
            {location ? <span><UiIcon name="map-pin" size={16} />{location}</span> : null}
            {languages?.length ? <span><UiIcon name="language" size={16} />{languages.join(' · ')}</span> : null}
          </div>
        ) : null}
        {now ? (
          <p className="mn-station-now">{nowLabel ? <>{nowLabel} </> : null}<span>{now}</span></p>
        ) : null}
        {actionHref ? (
          <a className={btnClass} href={actionHref} onClick={onAction}>{content}</a>
        ) : (
          <button className={btnClass} type="button" onClick={onAction}>{content}</button>
        )}
      </div>
    </article>
  );
});
