import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface StatDelta {
  /** `up` is green with an up arrow, `down` is red with a down arrow. */
  direction: 'up' | 'down';
  /** The change with its sign: "+3", "-2%". */
  value: string;
  /** The period, always given: "this quarter", "vs last year". */
  period?: string;
  /** Visually hidden phrase that reads well aloud ("up 3 this quarter"). */
  spoken?: string;
}

export interface StatTileProps extends HTMLAttributes<HTMLDivElement> {
  /** The big number, abbreviated if large (1.2M). */
  value: ReactNode;
  /** Short label, three or four words. */
  label: ReactNode;
  /** Optional change since a previous period. */
  delta?: StatDelta;
  /** Optional sparkline series (at least two numbers). Decorative. */
  spark?: number[];
  /** Grey sparkline for a flat or falling series. @default false */
  sparkFlat?: boolean;
  /** Dark tile: wraps the tile in the `.dp-dk` panel. Do not mix light and dark tiles in one row. @default false */
  dark?: boolean;
  /** Mark the figure as a sample (invented, for mock-ups) with `.dp-sample`. @default false */
  sample?: boolean;
}

function sparkPoints(values: number[]): { points: string; last: [number, number] } {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i): [number, number] => [2 + (i * 114) / (values.length - 1), 30 - ((v - min) / span) * 24]);
  return { points: pts.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' '), last: pts[pts.length - 1] };
}

const Arrow = ({ up }: { up: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {up ? <path d="M12 19V5M6 11l6-6 6 6" /> : <path d="M12 5v14M6 13l6 6 6-6" />}
  </svg>
);

/** Metric tile: one big number, a label, an optional change and an optional sparkline. */
export const StatTile = forwardRef<HTMLDivElement, StatTileProps>(function StatTile(
  { value, label, delta, spark, sparkFlat = false, dark = false, sample = false, className, ...rest },
  ref,
) {
  const sp = spark && spark.length > 1 ? sparkPoints(spark) : null;
  const tile = (
    <div ref={ref} className={cx('dp-stat', sample && 'dp-sample', className)} {...rest}>
      <span className="dp-stat-n">{value}</span>
      <span className="dp-stat-l">{label}</span>
      {delta || sp ? (
        <div className="dp-stat-row">
          {delta ? (
            <span className={cx('dp-delta', delta.direction === 'up' ? 'dp-delta-up' : 'dp-delta-down')}>
              <Arrow up={delta.direction === 'up'} />
              {delta.value}
              {delta.period ? <> <span className="dp-delta-vs">{delta.period}</span></> : null}
              {delta.spoken ? <span className="dp-vh"> {delta.spoken}</span> : null}
            </span>
          ) : null}
          {sp ? (
            <svg className={cx('dp-spark', sparkFlat && 'dp-spark-flat')} width="88" height="32" viewBox="0 0 120 36" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <polyline points={sp.points} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={sp.last[0]} cy={sp.last[1]} r="3" fill="currentColor" />
            </svg>
          ) : null}
        </div>
      ) : null}
    </div>
  );
  return dark ? <div className="dp-dk">{tile}</div> : tile;
});
