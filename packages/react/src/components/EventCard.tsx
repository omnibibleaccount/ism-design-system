import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type EventBadgeTone = 'info' | 'brand' | 'success' | 'warning' | 'partner';

const BADGE_CLASS: Record<EventBadgeTone, string> = {
  info: 'badge-info',
  brand: 'badge-brand',
  success: 'badge-success',
  warning: 'badge-warning',
  partner: 'badge-partner',
};

const VISUALLY_HIDDEN = 'fm-vh';

export interface EventCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Month abbreviation on the date tile, e.g. "NOV". Decorative. */
  month: string;
  /** Day of month on the date tile, e.g. "12". Decorative. */
  day: string;
  /** Type badge text, e.g. "Online event". One badge per card. */
  badge: string;
  /** Badge colour; `info` suits online events. @default "info" */
  badgeTone?: EventBadgeTone;
  /** Event title that names the gathering. */
  title: ReactNode;
  /** Machine-readable start for `<time datetime>`, e.g. "2026-11-12T19:00-05:00". */
  dateTime: string;
  /** Time row: day, date, time with zone, length, e.g. "Thursday, Nov 12 · 7:00 pm ET · 90 min". */
  dateText: string;
  /** Place row, e.g. "Online · link sent after you register". */
  place?: string;
  /** One-sentence summary, two lines at most. */
  description?: ReactNode;
  /** Register link label. */
  actionLabel: ReactNode;
  /** Register URL. Opens another page, so the label ends with ↗. */
  href: string;
  /** Text beside the action, e.g. "212 going (sample)". Mark invented counts as samples. */
  footNote?: ReactNode;
}

/** Event card: date tile, type badge, time and place, summary and a Register link. */
export const EventCard = forwardRef<HTMLElement, EventCardProps>(function EventCard(
  { month, day, badge, badgeTone = 'info', title, dateTime, dateText, place, description, actionLabel, href, footNote, className, ...rest },
  ref,
) {
  return (
    <article ref={ref} className={cx('card card-flat mn-event', className)} {...rest}>
      <div className="mn-event-head">
        <span className="mn-datetile" aria-hidden="true">
          <span className="mn-datetile-m">{month}</span>
          <span className="mn-datetile-d">{day}</span>
        </span>
        <span className={cx('badge', BADGE_CLASS[badgeTone])}>{badge}</span>
      </div>
      <h3 className="h4">{title}</h3>
      <div className="mn-meta">
        <span><UiIcon name="calendar" size={16} /><time dateTime={dateTime}>{dateText}</time></span>
        {place ? <span><UiIcon name="map-pin" size={16} />{place}</span> : null}
      </div>
      {description ? <p className="muted">{description}</p> : null}
      <div className="mn-event-foot">
        <a className="btn btn-secondary btn-sm" href={href}>
          {actionLabel} <span className="arrow" aria-hidden="true">↗</span>
        </a>
        {footNote ? <span>{footNote}</span> : null}
      </div>
    </article>
  );
});

export interface NewsCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Photo URL from the system imagery. */
  imageSrc: string;
  /** Real alt text, e.g. "A woman listening to Scripture on her phone". */
  imageAlt: string;
  /** Category badge text, e.g. "Field story". */
  badge: string;
  /** Machine-readable date, e.g. "2026-10-02". */
  dateTime: string;
  /** Visible date, e.g. "Oct 2, 2026". */
  dateText: string;
  /** Plain headline in sentence case. */
  title: string;
  /** One-sentence summary, two lines at most. */
  description?: ReactNode;
  /** Story URL. Opens another page, so the label ends with ↗. */
  href: string;
  /** Link label, e.g. "Read the story". The title is added as visually hidden text so repeated links stay distinct. */
  linkLabel: ReactNode;
}

/** News card: photo, category badge, date, headline, summary and a Read the story link. */
export const NewsCard = forwardRef<HTMLElement, NewsCardProps>(function NewsCard(
  { imageSrc, imageAlt, badge, dateTime, dateText, title, description, href, linkLabel, className, ...rest },
  ref,
) {
  return (
    <article ref={ref} className={cx('card card-flat mn-news', className)} {...rest}>
      <div className="mn-news-img"><img className="photo" src={imageSrc} alt={imageAlt} /></div>
      <div className="mn-news-body">
        <div className="mn-news-meta">
          <span className="badge badge-brand">{badge}</span>
          <time dateTime={dateTime}>{dateText}</time>
        </div>
        <h3 className="h4">{title}</h3>
        {description ? <p className="muted">{description}</p> : null}
        <a className="btn btn-ghost btn-sm mn-news-link" href={href}>
          {linkLabel}
          <span className={VISUALLY_HIDDEN}>: {title}</span>
          {' '}<span className="arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
});
