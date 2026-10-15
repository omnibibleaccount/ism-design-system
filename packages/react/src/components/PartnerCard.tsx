import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type PartnerTone = 'dark' | 'blue' | 'violet';

export interface PartnerCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** URL of the partner's page. The whole card is the link. */
  href: string;
  /** Partner's official name, no abbreviations. */
  name: string;
  /** "City, Country". One line only. */
  location?: string;
  /** One or two partner-type badges, e.g. "Church partner". */
  badges?: string[];
  /** Two-letter initials. @default derived from the first two words of `name` */
  initials?: string;
  /** Initials tile colour; rotate so neighbours differ. @default "dark" */
  tone?: PartnerTone;
  /** The link leaves ISM for the partner's own site: adds the hidden text. @default false */
  external?: boolean;
  /** Hidden text added when `external`. @default "(opens partner site)" */
  externalLabel?: string;
}

const TONE_CLASS: Record<PartnerTone, string> = { dark: '', blue: 'mn-initials-blue', violet: 'mn-initials-violet' };
const VISUALLY_HIDDEN = 'fm-vh';

function makeInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => Array.from(w)[0]?.toUpperCase() ?? '').join('');
}

/** A linked partner card: initials tile, name, location, partner-type badges and a ↗ that fills on hover. */
export const PartnerCard = forwardRef<HTMLAnchorElement, PartnerCardProps>(function PartnerCard(
  { name, location, badges, initials, tone = 'dark', external = false, externalLabel = '(opens partner site)', className, ...rest },
  ref,
) {
  return (
    <a ref={ref} className={cx('card card-flat mn-partner', className)} {...rest}>
      <div className="mn-partner-head">
        <span className={cx('mn-initials', TONE_CLASS[tone])} aria-hidden="true">{initials ?? makeInitials(name)}</span>
        <span className="mn-go" aria-hidden="true">↗</span>
      </div>
      <div>
        <p className="mn-partner-name">{name}</p>
        {location ? (
          <p className="mn-meta mn-meta-sm"><span><UiIcon name="map-pin" size={14} />{location}</span></p>
        ) : null}
      </div>
      {badges?.length ? (
        <div className="mn-partner-badges">
          {badges.slice(0, 2).map((b) => <span key={b} className="badge badge-partner">{b}</span>)}
        </div>
      ) : null}
      {external ? <span className={VISUALLY_HIDDEN}>{externalLabel}</span> : null}
    </a>
  );
});
