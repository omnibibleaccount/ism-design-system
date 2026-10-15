import { forwardRef, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { useDirection } from '../direction';

export type TabsVariant = 'underline' | 'segmented' | 'vertical';

/** One tab and its panel. */
export interface TabItem {
  /** Unique value identifying the tab. */
  value: string;
  /** Tab label: a short noun in sentence case ("All resources"). Kept on one line. */
  label: ReactNode;
  /** Real total of the items in the panel, shown as a neutral pill (underline tabs only). */
  count?: number | string;
  /** Disable the tab (`aria-disabled`). Show one only when its absence would confuse. @default false */
  disabled?: boolean;
  /** Panel content. Panels of unselected tabs are rendered with `hidden`. */
  panel?: ReactNode;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The tabs, in order. */
  items: TabItem[];
  /** Accessible name of the tablist that names the set: "Resource types". Required for a11y. */
  label: string;
  /**
   * `underline` filters one collection into kinds; `segmented` is for 2 to 4 short equal options; `vertical` is a side list (max 7).
   * @default "underline"
   */
  variant?: TabsVariant;
  /** Selected tab value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). @default the first enabled tab */
  defaultValue?: string;
  /** Called when the selection changes (click, arrow keys, Home, End). */
  onChange?: (value: string) => void;
  /** Segmented tabs on a dark background (`.nv-seg-dark`). @default false */
  dark?: boolean;
  /** Underline tabs: scroll sideways on phones instead of wrapping (`.nv-tabs-scroll`). @default false */
  scrollable?: boolean;
  /** Class name for the tablist element (the root `className` goes on the wrapper). */
  tablistClassName?: string;
}

/**
 * WAI-ARIA tabs: roving tabindex, automatic activation, Home/End. Arrow keys are direction-aware:
 * Left/Right move between tabs and swap in right-to-left pages (via `useDirection()`); vertical tabs use Up/Down.
 * Tabs swap panels in place; never use them to navigate to another URL.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, label, variant = 'underline', value, defaultValue, onChange, dark = false, scrollable = false, tablistClassName, className, ...rest },
  ref,
) {
  const dir = useDirection();
  const uid = useId();
  const firstEnabled = items.find((t) => !t.disabled)?.value ?? items[0]?.value;
  const [inner, setInner] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? inner;
  const listRef = useRef<HTMLDivElement>(null);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const vertical = variant === 'vertical';
    const enabled = items.filter((t) => !t.disabled);
    const idx = enabled.findIndex((t) => t.value === selected);
    const prevKey = vertical ? 'ArrowUp' : dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    const nextKey = vertical ? 'ArrowDown' : dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    let target: TabItem | undefined;
    if (e.key === nextKey) target = enabled[(idx + 1) % enabled.length];
    else if (e.key === prevKey) target = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === 'Home') target = enabled[0];
    else if (e.key === 'End') target = enabled[enabled.length - 1];
    if (!target) return;
    e.preventDefault();
    select(target.value);
    const el = listRef.current?.querySelector<HTMLElement>(`[data-tab-value="${CSS.escape(target.value)}"]`);
    el?.focus();
  };

  const listClass = variant === 'segmented' ? cx('nv-seg', dark && 'nv-seg-dark') : variant === 'vertical' ? 'nv-vtabs' : 'nv-tabs';
  const tabClass = variant === 'underline' ? 'nv-tab' : variant === 'vertical' ? 'nv-vtab' : undefined;

  const list = (
    <div
      ref={listRef}
      className={cx(listClass, tablistClassName)}
      role="tablist"
      aria-label={label}
      aria-orientation={variant === 'vertical' ? 'vertical' : undefined}
      onKeyDown={onKeyDown}
    >
      {items.map((t) => {
        const isSel = t.value === selected;
        return (
          <button
            key={t.value}
            className={tabClass}
            type="button"
            role="tab"
            id={`${uid}-t-${t.value}`}
            data-tab-value={t.value}
            aria-selected={isSel}
            aria-controls={`${uid}-p-${t.value}`}
            aria-disabled={t.disabled || undefined}
            tabIndex={isSel ? 0 : -1}
            onClick={() => {
              if (!t.disabled) select(t.value);
            }}
          >
            {t.label}
            {variant === 'underline' && t.count !== undefined ? <> <span className="nv-cnt">{t.count}</span></> : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={ref} className={className} {...rest}>
      {scrollable && variant === 'underline' ? <div className="nv-tabs-scroll">{list}</div> : list}
      {items.map((t) =>
        t.panel === undefined ? null : (
          <div key={t.value} role="tabpanel" id={`${uid}-p-${t.value}`} aria-labelledby={`${uid}-t-${t.value}`} hidden={t.value !== selected} tabIndex={0}>
            {t.panel}
          </div>
        ),
      )}
    </div>
  );
});
