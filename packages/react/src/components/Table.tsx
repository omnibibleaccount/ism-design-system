import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { UiIcon } from '../Icon';
import { cx } from '../utils';

export type SortDirection = 'ascending' | 'descending';

export interface TableSort {
  /** Key of the sorted column. */
  key: string;
  direction: SortDirection;
}

export interface TableColumn<T> {
  /** Unique column key. */
  key: string;
  /** Header content: one or two words, sentence case. */
  header: ReactNode;
  /** Renders the cell. Put the main name in `<span className="dp-strong">` with the ID in `<span className="dp-sub">` beneath. */
  cell: (row: T) => ReactNode;
  /** Header becomes a sort button. @default false */
  sortable?: boolean;
  /** Value used to sort rows when this column is sortable. Without it you sort `rows` yourself in `onSortChange`. */
  sortValue?: (row: T) => string | number;
  /** Set the cell in tabular figures (`.dp-num`). @default false */
  numeric?: boolean;
}

export interface TableRowAction {
  /** Unique key. */
  key: string;
  /** Visible label. Items that leave the page end in ↗ via `external`. */
  label: ReactNode;
  /** Called when the item is chosen. The menu closes and focus returns to the ⋯ button. */
  onSelect?: () => void;
  /** Append the ↗ glyph. @default false */
  external?: boolean;
  /** Destructive item (`.dp-rmenu-danger`); place it last. @default false */
  danger?: boolean;
  /** Draw a separator above this item. @default false */
  separatorBefore?: boolean;
}

export interface TableMobileCard {
  /** Name line. */
  title: ReactNode;
  /** Meta line under the name. */
  meta?: ReactNode;
  /** Status badge at top right. */
  badge?: ReactNode;
  /** Key figure at bottom left. */
  figure?: ReactNode;
}

export interface TableLabels {
  /** @default "Select all" */
  selectAll?: string;
  /** Accessible name of a row checkbox. @default (name) => `Select ${name}` */
  selectRow?: (name: string) => string;
  /** Accessible name of a row's ⋯ button. @default (name) => `Actions for ${name}` */
  actions?: (name: string) => string;
  /** Visually hidden header of the actions column. @default "Actions" */
  actionsHeader?: string;
}

export interface TableProps<T> {
  /** Column definitions in display order. */
  columns: TableColumn<T>[];
  /** Row data. */
  rows: T[];
  /** Stable unique id of a row. */
  getRowId: (row: T) => string;
  /** Human name of a row, used in checkbox and menu labels ("Radio Hope"). Required when `selectable` or `rowActions` is used. */
  getRowName?: (row: T) => string;
  /** Names the table's contents for assistive tech. Required (or give `caption`). */
  'aria-label'?: string;
  /** Visible or hidden caption alternative to `aria-label`. */
  caption?: ReactNode;
  /** Even rows on `--off-white`. @default false */
  zebra?: boolean;
  /** Dense staff-tool variant: 40px header, 44px rows. @default false */
  dense?: boolean;
  /** Show a checkbox column. @default false */
  selectable?: boolean;
  /** Controlled selected row ids. */
  selectedIds?: string[];
  /** Uncontrolled initial selection. */
  defaultSelectedIds?: string[];
  /** Called with the new selected ids. */
  onSelectionChange?: (ids: string[]) => void;
  /** Controlled sort. */
  sort?: TableSort | null;
  /** Uncontrolled initial sort. */
  defaultSort?: TableSort | null;
  /** Called when a sort header is pressed. */
  onSortChange?: (sort: TableSort) => void;
  /** Row menu items. Return an empty array for no menu on that row. Adds a ⋯ column. */
  rowActions?: (row: T) => TableRowAction[];
  /** Footer content, for example the selection count ("1 of 38 stations selected") and pagination. Announced politely. */
  footer?: ReactNode;
  /** Render each row as a stacked card under 768px and hide the table there. */
  mobileCard?: (row: T) => TableMobileCard;
  /** Wrap class additions. */
  className?: string;
  /** Text labels, for translation. */
  labels?: TableLabels;
}

function useControlled<V>(value: V | undefined, initial: V): [V, (next: V) => void, boolean] {
  const [inner, setInner] = useState<V>(initial);
  const controlled = value !== undefined;
  return [controlled ? (value as V) : inner, setInner, controlled];
}

const SortIcon = ({ direction }: { direction?: SortDirection }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {direction === 'ascending' ? <path d="M12 19V5M6 11l6-6 6 6" /> : direction === 'descending' ? <path d="M12 5v14M6 13l6 6 6-6" /> : <path d="M8 9l4-4 4 4M8 15l4 4 4-4" />}
  </svg>
);

/** Data table with sortable headers, row selection, row menu, zebra and dense variants and a stacked mobile layout. */
export function Table<T>({
  columns,
  rows,
  getRowId,
  getRowName,
  caption,
  zebra = false,
  dense = false,
  selectable = false,
  selectedIds,
  defaultSelectedIds,
  onSelectionChange,
  sort,
  defaultSort,
  onSortChange,
  rowActions,
  footer,
  mobileCard,
  className,
  labels,
  ...rest
}: TableProps<T>) {
  const L = {
    selectAll: labels?.selectAll ?? 'Select all',
    selectRow: labels?.selectRow ?? ((n: string) => `Select ${n}`),
    actions: labels?.actions ?? ((n: string) => `Actions for ${n}`),
    actionsHeader: labels?.actionsHeader ?? 'Actions',
  };
  const ariaLabel = rest['aria-label'];
  const nameOf = (row: T) => (getRowName ? getRowName(row) : getRowId(row));

  const [selected, setSelected, selControlled] = useControlled<string[]>(selectedIds, defaultSelectedIds ?? []);
  const [sortState, setSortState, sortControlled] = useControlled<TableSort | null>(sort, defaultSort ?? null);
  const [openId, setOpenId] = useState<string | null>(null);
  const menuId = useId();
  const dotsRefs = useRef(new Map<string, HTMLButtonElement>());
  const allRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    if (!sortState) return rows;
    const col = columns.find((c) => c.key === sortState.key);
    if (!col?.sortValue) return rows;
    const val = col.sortValue;
    const dir = sortState.direction === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = val(a);
      const y = val(b);
      return (x < y ? -1 : x > y ? 1 : 0) * dir;
    });
  }, [rows, columns, sortState]);

  const ids = sorted.map(getRowId);
  const allOn = ids.length > 0 && ids.every((id) => selected.includes(id));
  const someOn = ids.some((id) => selected.includes(id));

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = someOn && !allOn;
  }, [someOn, allOn]);

  useEffect(() => {
    if (!openId) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openId]);

  const setSel = (next: string[]) => {
    if (!selControlled) setSelected(next);
    onSelectionChange?.(next);
  };
  const toggleRow = (id: string) => setSel(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const toggleAll = () => setSel(allOn ? selected.filter((x) => !ids.includes(x)) : Array.from(new Set([...selected, ...ids])));

  const pressSort = (key: string) => {
    const direction: SortDirection = sortState?.key === key && sortState.direction === 'ascending' ? 'descending' : 'ascending';
    const next = { key, direction };
    if (!sortControlled) setSortState(next);
    onSortChange?.(next);
  };

  const closeMenu = (id: string, focus: boolean) => {
    setOpenId(null);
    if (focus) dotsRefs.current.get(id)?.focus();
  };

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu(id, true);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'));
      const i = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    }
    if (e.key === 'Tab') setOpenId(null);
  };

  const hasActions = Boolean(rowActions);

  return (
    <>
      <div className={cx('dp-tbl-wrap', !hasActions && 'dp-tbl-clip', mobileCard && 'dp-hide-mobile', className)} ref={wrapRef}>
        <table className={cx('dp-tbl', zebra && 'dp-tbl-zebra', dense && 'dp-tbl-sm')} aria-label={ariaLabel}>
          {caption ? <caption>{caption}</caption> : null}
          <thead>
            <tr>
              {selectable ? (
                <th className="dp-w-chk">
                  <input ref={allRef} className="dp-cbx" type="checkbox" aria-label={L.selectAll} checked={allOn} onChange={toggleAll} />
                </th>
              ) : null}
              {columns.map((c) => {
                const active = sortState?.key === c.key ? sortState.direction : undefined;
                return (
                  <th key={c.key} aria-sort={c.sortable ? active : undefined} scope="col">
                    {c.sortable ? (
                      <button className="dp-sort" type="button" onClick={() => pressSort(c.key)}>
                        {c.header}
                        <SortIcon direction={active} />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
              {hasActions ? (
                <th className="dp-w-act">
                  <span className="dp-vh">{L.actionsHeader}</span>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const id = getRowId(row);
              const name = nameOf(row);
              const on = selected.includes(id);
              const actions = rowActions ? rowActions(row) : [];
              const open = openId === id;
              return (
                <tr key={id} aria-selected={selectable ? on : undefined}>
                  {selectable ? (
                    <td className="dp-w-chk">
                      <input className="dp-cbx" type="checkbox" aria-label={L.selectRow(name)} checked={on} onChange={() => toggleRow(id)} />
                    </td>
                  ) : null}
                  {columns.map((c) => (
                    <td key={c.key} className={c.numeric ? 'dp-num' : undefined}>
                      {c.cell(row)}
                    </td>
                  ))}
                  {hasActions ? (
                    <td className="dp-w-act">
                      {actions.length ? (
                        <>
                          <button
                            ref={(el) => {
                              if (el) dotsRefs.current.set(id, el);
                              else dotsRefs.current.delete(id);
                            }}
                            className="dp-dots"
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={open}
                            aria-controls={open ? `${menuId}-${id}` : undefined}
                            aria-label={L.actions(name)}
                            onClick={() => setOpenId(open ? null : id)}
                          >
                            <UiIcon name="more-horizontal" size={20} />
                          </button>
                          {open ? (
                            <div
                              className="dp-rmenu"
                              role="menu"
                              id={`${menuId}-${id}`}
                              onKeyDown={(e) => onMenuKey(e, id)}
                              ref={(el) => el?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()}
                            >
                              {actions.map((a) => (
                                <span key={a.key} style={{ display: 'contents' }}>
                                  {a.separatorBefore ? <hr className="dp-rmenu-sep" /> : null}
                                  <button
                                    type="button"
                                    role="menuitem"
                                    className={cx('dp-rmenu-item', a.danger && 'dp-rmenu-danger')}
                                    onClick={() => {
                                      a.onSelect?.();
                                      closeMenu(id, true);
                                    }}
                                  >
                                    {a.label}
                                    {a.external ? <span className="dp-rmenu-ic" aria-hidden="true">↗</span> : null}
                                  </button>
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
        {footer ? (
          <div className="dp-tbl-foot" aria-live="polite">
            {footer}
          </div>
        ) : null}
      </div>
      {mobileCard ? (
        <div className="dp-tcards dp-show-mobile">
          {sorted.map((row) => {
            const id = getRowId(row);
            const name = nameOf(row);
            const card = mobileCard(row);
            const actions = rowActions ? rowActions(row) : [];
            return (
              <div className="dp-tcard" key={id} aria-selected={selectable ? selected.includes(id) : undefined}>
                <div className="dp-tcard-top">
                  <div>
                    <div className="dp-tcard-t">{card.title}</div>
                    {card.meta ? <div className="dp-tcard-m">{card.meta}</div> : null}
                  </div>
                  {card.badge}
                </div>
                <div className="dp-tcard-bot">
                  <span className="dp-num">{card.figure}</span>
                  {actions.length ? (
                    <button className="dp-dots" type="button" aria-haspopup="menu" aria-expanded="false" aria-label={L.actions(name)}>
                      <UiIcon name="more-horizontal" size={20} />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
