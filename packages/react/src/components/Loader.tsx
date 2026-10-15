import { forwardRef, useEffect, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export type LoaderSize = 's' | 'm' | 'l';
export type LoaderTone = 'default' | 'dark' | 'ink';

const SIZE_CLASS: Record<LoaderSize, string> = { s: 'fb-spin-s', m: 'fb-spin-m', l: 'fb-spin-l' };
const TONE_CLASS: Record<LoaderTone, string> = { default: '', dark: 'fb-spin-dk', ink: 'fb-spin-ink' };

export interface LoaderProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 16px inside buttons and inputs, 24px inside menus and cards, 40px in an empty panel. @default "m" */
  size?: LoaderSize;
  /** `dark` for dark surfaces (white head), `ink` for light secondary buttons (black head). @default "default" */
  tone?: LoaderTone;
  /** Accessible name; say what is loading, for example "Loading stations". @default "Loading" */
  label?: string;
}

/** Standalone spinner (`role="status"`). Turns once every 0.8s. Never colour it with a status colour. */
export const Loader = forwardRef<HTMLSpanElement, LoaderProps>(function Loader(
  { size = 'm', tone = 'default', label = 'Loading', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cx('fb-spin', SIZE_CLASS[size], TONE_CLASS[tone], className)}
      role="status"
      aria-label={label}
      {...rest}
    />
  );
});

/** Returns true once `delay` ms have passed. With `delay` 0 it is true from the first render (server-safe). */
function useAfterDelay(delay: number): boolean {
  const [ready, setReady] = useState(delay <= 0);
  useEffect(() => {
    if (delay <= 0) return;
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

interface SkeletonBaseProps {
  /**
   * Show the skeleton only after this many ms; if the content arrives sooner nothing is shown.
   * The design rule is 300.
   * @default 0
   */
  delay?: number;
}

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement>, SkeletonBaseProps {
  /** Line (default 12px tall), `media` block, `avatar` circle, or `title` (24px tall). @default "line" */
  shape?: 'line' | 'media' | 'avatar' | 'title';
  /** CSS width, for example "60%". Vary line widths. */
  width?: CSSProperties['width'];
  /** CSS height override, for example 10 for a secondary line. */
  height?: CSSProperties['height'];
}

const SHAPE_CLASS = { line: '', media: 'fb-sk-media', avatar: 'fb-sk-avatar', title: 'fb-sk-title' } as const;

/** One shimmering skeleton shape. Shapes are not announced; put `aria-busy` and a label on the container. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = 'line', width, height, delay = 0, className, style, ...rest },
  ref,
) {
  const ready = useAfterDelay(delay);
  if (!ready) return null;
  return (
    <span
      ref={ref}
      className={cx('fb-sk', SHAPE_CLASS[shape], className)}
      style={width !== undefined || height !== undefined ? { width, height, ...style } : style}
      {...rest}
    />
  );
});

export interface SkeletonListProps extends HTMLAttributes<HTMLDivElement>, SkeletonBaseProps {
  /** Accessible name of the loading region, for example "Loading stations". */
  label: string;
  /** Number of 72px rows. @default 3 */
  rows?: number;
  /** Set false when the content has arrived to drop `aria-busy`. @default true */
  busy?: boolean;
}

/** Skeleton list: rows of an avatar and two lines. Shape it like the real list. */
export const SkeletonList = forwardRef<HTMLDivElement, SkeletonListProps>(function SkeletonList(
  { label, rows = 3, busy = true, delay = 0, className, ...rest },
  ref,
) {
  const ready = useAfterDelay(delay);
  if (!ready) return null;
  return (
    <div ref={ref} className={cx('fb-sk-list', className)} aria-busy={busy} aria-label={label} {...rest}>
      {Array.from({ length: rows }, (_, i) => (
        <div className="fb-sk-row" key={i}>
          <span className="fb-sk fb-sk-avatar" />
          <span className="fb-sk-lines">
            <span className="fb-sk" style={{ width: i % 2 ? '50%' : '60%' }} />
            <span className="fb-sk" style={{ height: 10, width: '40%' }} />
          </span>
        </div>
      ))}
    </div>
  );
});

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement>, SkeletonBaseProps {
  /** Accessible name of the loading region, for example "Loading Psalm 23". */
  label: string;
  /** Number of body lines under the title. @default 4 */
  lines?: number;
  /** Set false when the content has arrived. @default true */
  busy?: boolean;
}

/** Skeleton for a block of text: a title and lines of varying width. */
export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  { label, lines = 4, busy = true, delay = 0, className, ...rest },
  ref,
) {
  const ready = useAfterDelay(delay);
  if (!ready) return null;
  const widths = ['100%', '92%', '96%', '70%'];
  return (
    <div ref={ref} className={cx('fb-sk-text', className)} aria-busy={busy} aria-label={label} {...rest}>
      <span className="fb-sk fb-sk-title" style={{ width: '45%' }} />
      {Array.from({ length: lines }, (_, i) => (
        <span className="fb-sk" key={i} style={{ width: widths[i % widths.length] }} />
      ))}
    </div>
  );
});

export interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement>, SkeletonBaseProps {
  /** Accessible name of the loading region, for example "Loading stories". */
  label: string;
  /** Set false when the content has arrived. @default true */
  busy?: boolean;
  /** Extra content, for example more `Skeleton` lines. Defaults to a title line and two text lines. */
  children?: ReactNode;
}

/** Skeleton card: a media block and lines inside a flat card. */
export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonCardProps>(function SkeletonCard(
  { label, busy = true, delay = 0, className, children, ...rest },
  ref,
) {
  const ready = useAfterDelay(delay);
  if (!ready) return null;
  return (
    <div ref={ref} className={cx('card card-flat', className)} aria-busy={busy} aria-label={label} {...rest}>
      <span className="fb-sk fb-sk-media" />
      {children ?? (
        <>
          <span className="fb-sk" style={{ width: '60%' }} />
          <span className="fb-sk" style={{ width: '90%' }} />
          <span className="fb-sk" style={{ width: '40%' }} />
        </>
      )}
    </div>
  );
});
