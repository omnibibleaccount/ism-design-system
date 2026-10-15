import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

/** A region in the Global Bible Network list. */
export interface NetworkRegion {
  /** Stable id. */
  id: string;
  /** Region name, e.g. "Africa". */
  name: string;
  /** Number of partners (a sample until confirmed). */
  partners: number;
  /** `soon` renders the grey, `aria-disabled` "coming soon" row that ignores clicks. @default "active" */
  status?: 'active' | 'soon';
  /** Text after the name on a coming-soon row, e.g. "coming soon". */
  soonLabel?: string;
  /**
   * SVG path data (`d`) of this region's dots on the abstract map (round-capped zero-length segments).
   * Drawn in Horizon Blue when selected, `--blue-on-dark` otherwise, grey when `status="soon"`.
   */
  dots?: string;
}

/** A partner hub pin on the map. */
export interface NetworkStation {
  /** Stable id. */
  id: string;
  /** City shown in the tooltip, e.g. "Nairobi". */
  name: string;
  /** Number of partners at this hub (sample). */
  partners: number;
  /** x position in the SVG viewBox. */
  x: number;
  /** y position in the SVG viewBox. */
  y: number;
  /** Region this hub belongs to; the default tooltip follows the selected region. */
  regionId?: string;
}

export interface NetworkMapLegend {
  /** @default "Selected" */
  selected: string;
  /** @default "Network region" */
  network: string;
  /** @default "Not yet active" */
  inactive: string;
  /** @default "Partner hub" */
  hub: string;
}

export interface NetworkMapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'title'> {
  /** Regions in list order. The list is the keyboard path; the map illustrates it. */
  regions: NetworkRegion[];
  /** Partner hub pins. Gold, never blue or red. @default [] */
  stations?: NetworkStation[];
  /** Controlled selected region id. */
  selectedRegion?: string;
  /** Initial selected region when uncontrolled. @default the first active region */
  defaultSelectedRegion?: string;
  /** Called when a region row is chosen (never for coming-soon rows). */
  onSelectedRegionChange?: (regionId: string) => void;
  /** Station whose tooltip is shown. @default the first station of the selected region */
  activeStationId?: string;
  /** Path data for the grey "not yet active" background dots. */
  offDots?: string;
  /** SVG viewBox. @default "0 12 720 292" */
  viewBox?: string;
  /** Accessible name of the map: one `role="img"` that states the selection and where hubs are. */
  mapLabel: string;
  /** Map card title, e.g. "Global Bible Network". */
  title: ReactNode;
  /** Legend labels. */
  legend?: Partial<NetworkMapLegend>;
  /** Note under the map, e.g. "Choose a region or a pin to see its stations, partners and languages." */
  note?: ReactNode;
  /** Header of the region column. @default "Regions" */
  regionsHeading?: ReactNode;
  /** Header of the count column. @default "Partners" */
  partnersHeading?: ReactNode;
  /** Tooltip text. @default "Nairobi · 14 partners" form: `${name} · ${partners} partners` */
  formatTooltip?: (station: NetworkStation) => string;
  /** Footer summary, e.g. `<><b>383</b> partners in 61 countries</>`. */
  summary?: ReactNode;
  /** Footer link label, e.g. "Join". Shown with ↗. */
  joinLabel?: ReactNode;
  /** Footer link URL (the partner page). */
  joinHref?: string;
}

/**
 * Abstract dot map of the Global Bible Network beside a selectable region list. Renders SVG from data;
 * loads no map library. Not for directions or exact locations.
 */
export const NetworkMap = forwardRef<HTMLDivElement, NetworkMapProps>(function NetworkMap(
  {
    regions,
    stations = [],
    selectedRegion,
    defaultSelectedRegion,
    onSelectedRegionChange,
    activeStationId,
    offDots,
    viewBox = '0 12 720 292',
    mapLabel,
    title,
    legend,
    note,
    regionsHeading = 'Regions',
    partnersHeading = 'Partners',
    formatTooltip = (s) => `${s.name} · ${s.partners} partners`,
    summary,
    joinLabel,
    joinHref,
    className,
    ...rest
  },
  ref,
) {
  const lg: NetworkMapLegend = { selected: 'Selected', network: 'Network region', inactive: 'Not yet active', hub: 'Partner hub', ...legend };
  const [inner, setInner] = useState<string | undefined>(defaultSelectedRegion ?? regions.find((r) => r.status !== 'soon')?.id);
  const selected = selectedRegion !== undefined ? selectedRegion : inner;
  const choose = (id: string) => {
    if (selectedRegion === undefined) setInner(id);
    onSelectedRegionChange?.(id);
  };

  const active =
    stations.find((s) => s.id === activeStationId) ?? stations.find((s) => s.regionId === selected) ?? undefined;
  const tip = active ? formatTooltip(active) : '';
  const tipW = Math.round(tip.length * 6.6 + 20);

  return (
    <div ref={ref} className={cx('mn-netmap', className)} {...rest}>
      <div className="card card-flat mn-netmap-map">
        <div className="mn-map-head">
          <p className="mn-map-title">{title}</p>
          <div className="mn-legend">
            <span><i className="mn-c-sel" />{lg.selected}</span>
            <span><i className="mn-c-on" />{lg.network}</span>
            <span><i className="mn-c-off" />{lg.inactive}</span>
            <span><i className="mn-c-pin" />{lg.hub}</span>
          </div>
        </div>
        <div className="mn-map">
          <svg viewBox={viewBox} role="img" aria-label={mapLabel}>
            <g fill="none" strokeLinecap="round" strokeWidth="5.2">
              {offDots ? <path className="mn-map-off" d={offDots} /> : null}
              {regions.map((r) =>
                r.dots ? (
                  <path
                    key={r.id}
                    className={r.status === 'soon' ? 'mn-map-off' : r.id === selected ? 'mn-map-sel' : 'mn-map-on'}
                    d={r.dots}
                  />
                ) : null,
              )}
            </g>
            {active ? <circle className="mn-map-halo" cx={active.x} cy={active.y} r={14} /> : null}
            <g className="mn-map-pins" strokeWidth="2.4">
              {stations.map((s) => (
                <circle key={s.id} cx={s.x} cy={s.y} r={s === active ? 7 : 6} />
              ))}
            </g>
            {active ? (
              <g className="mn-map-tip">
                <rect x={active.x + 14} y={active.y - 12} width={tipW} height={26} rx={8} />
                <text x={active.x + 24} y={active.y + 5}>{tip}</text>
              </g>
            ) : null}
          </svg>
        </div>
        {note ? <p className="mn-map-note">{note}</p> : null}
      </div>
      <div className="card card-flat mn-regions">
        <div className="mn-regions-head"><span className="mn-st">{regionsHeading}</span><span>{partnersHeading}</span></div>
        {regions.map((r) => {
          const soon = r.status === 'soon';
          const isSel = !soon && r.id === selected;
          return (
            <button
              key={r.id}
              className={cx('mn-rrow', soon && 'mn-rrow-soon')}
              type="button"
              aria-pressed={isSel}
              aria-disabled={soon || undefined}
              onClick={() => {
                if (!soon) choose(r.id);
              }}
            >
              <span className={cx('mn-rrow-dot', soon ? 'mn-c-off' : isSel ? 'mn-c-sel' : 'mn-c-on')} />
              <span className="mn-rrow-nm">
                {r.name}
                {soon && r.soonLabel ? <> <span className="mn-rrow-u">· {r.soonLabel}</span></> : null}
              </span>
              <span className="mn-rrow-ct">{r.partners}</span>
            </button>
          );
        })}
        {summary || joinHref ? (
          <div className="mn-regions-foot">
            <p>{summary}</p>
            {joinHref ? (
              <a className="btn btn-ghost btn-sm" href={joinHref}>
                {joinLabel} <span className="arrow" aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
});
