import { forwardRef, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';
import { useDirection } from '../direction';

export interface DatePickerLabels {
  /** Accessible name of the calendar button when empty. @default "Choose date" */
  chooseDate?: string;
  /** Accessible name prefix of the calendar button when filled: "<changeDate>, <long date>". @default "Change date" */
  changeDate?: string;
  /** Accessible name of the popover dialog. @default "Choose date" */
  dialog?: string;
  /** @default "Previous month" */
  previousMonth?: string;
  /** @default "Next month" */
  nextMonth?: string;
  /** Prefix of today's day label: "<today>, October 14", and text of the footer Today button. @default "Today" */
  today?: string;
  /** Suffix of the selected day label: "October 18, <selected>". @default "selected" */
  selected?: string;
  /** Footer Cancel button. @default "Cancel" */
  cancel?: string;
  /** Footer Done button. @default "Done" */
  done?: string;
}

export interface DatePickerProps {
  /** Visible label, for example "Preferred call date". */
  label: ReactNode;
  /** Selected date (controlled). `null` is empty. Dates are local calendar days; the time is ignored. */
  value?: Date | null;
  /** Initial date (uncontrolled). */
  defaultValue?: Date | null;
  /** Called when a date is committed (Done, or valid typed text on blur) or cleared (`null`). */
  onChange?: (date: Date | null) => void;
  /** Called on blur when the typed text cannot be read as a date. Show your own `error` in response. */
  onInvalidText?: (text: string) => void;
  /** BCP 47 locale for month and weekday names, field order, the long date and the first weekday. @default "en-US" */
  locale?: string;
  /** Earliest selectable day. Earlier days stay in the grid but are disabled. */
  min?: Date;
  /** Latest selectable day. */
  max?: Date;
  /** First weekday, 0 = Sunday to 6 = Saturday. @default from the locale (Intl week info), else Sunday for US and Monday elsewhere */
  weekStart?: number;
  /** Placeholder for the text field. @default "MM / DD / YYYY" */
  placeholder?: string;
  /** Tag such as "(optional)" shown after the label. */
  optionalText?: ReactNode;
  /** Helper line under the field, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Error under the field. Sets `aria-invalid`. */
  error?: ReactNode;
  /** Overrides for accessible names and button texts (English defaults). */
  labels?: DatePickerLabels;
  /** Open the calendar initially (for previews and tests). @default false */
  defaultOpen?: boolean;
  /** Treat this day as "today" (testing and previews). @default the current day */
  today?: Date;
  /** Disable the field and the calendar. @default false */
  disabled?: boolean;
  /** Mark the input required. @default false */
  required?: boolean;
  /** `id` of the text input. Generated when omitted. */
  id?: string;
  /** `name` of the text input; the posted value is the long date text. */
  name?: string;
  /** Extra class on the outer `.field`. */
  className?: string;
}

// ---- date helpers (local calendar days, Intl only) ----
const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
};
const same = (a: Date | null, b: Date | null) => !!a && !!b && a.getTime() === b.getTime();
const mk = (y: number, m: number, d: number): Date | null => {
  const r = new Date(y, m, d);
  if (y < 100) r.setFullYear(y);
  return r.getFullYear() === y && r.getMonth() === m && r.getDate() === d ? r : null;
};

function firstWeekday(locale: string): number {
  try {
    const loc = new Intl.Locale(locale) as Intl.Locale & { weekInfo?: { firstDay: number }; getWeekInfo?: () => { firstDay: number } };
    const info = loc.getWeekInfo?.() ?? loc.weekInfo;
    if (info) return info.firstDay % 7;
    return loc.region === 'US' || !loc.region ? 0 : 1;
  } catch {
    return 0;
  }
}

/** Order of day / month / year in the locale's numeric format, for example ["m","d","y"]. */
function fieldOrder(locale: string): Array<'d' | 'm' | 'y'> {
  const parts = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date(2000, 10, 25));
  const out: Array<'d' | 'm' | 'y'> = [];
  for (const p of parts) {
    if (p.type === 'day') out.push('d');
    else if (p.type === 'month') out.push('m');
    else if (p.type === 'year') out.push('y');
  }
  return out.length === 3 ? out : ['m', 'd', 'y'];
}

/** Read common typed formats: numeric in locale order, ISO, or a written-out date. Returns null when unreadable. */
function parseDate(text: string, locale: string): Date | null {
  const t = text.trim();
  if (!t) return null;
  const iso = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(t);
  if (iso) return mk(+iso[1], +iso[2] - 1, +iso[3]);
  const num = /^(\d{1,4})\s*[-/.\s]\s*(\d{1,2})\s*[-/.\s]\s*(\d{1,4})$/.exec(t);
  if (num) {
    const [a, b, c] = [+num[1], +num[2], +num[3]];
    const order = fieldOrder(locale);
    const v: Record<'d' | 'm' | 'y', number> = { d: 0, m: 0, y: 0 };
    [a, b, c].forEach((n, i) => { v[order[i]] = n; });
    if (v.y < 100) v.y += 2000;
    return mk(v.y, v.m - 1, v.d);
  }
  // Written-out dates: match against this locale's own month names.
  const months = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, i, 1)).toLowerCase());
  const lower = t.toLowerCase();
  const mi = months.findIndex((m) => lower.includes(m));
  if (mi >= 0) {
    const nums = lower.replace(months[mi], ' ').match(/\d+/g)?.map(Number) ?? [];
    const y = nums.find((n) => n > 31);
    const d = nums.find((n) => n >= 1 && n <= 31);
    if (y !== undefined && d !== undefined) return mk(y, mi, d);
  }
  return null;
}

/**
 * Text field with a calendar button that opens a month popover. Typing is always allowed (locale-ordered numeric,
 * ISO or written-out dates; rewritten to the long form on blur). Uses only `Intl`, no date libraries.
 * Calendar keys: arrows move a day or week, PageUp/PageDown change month (Shift: year), Home/End go to week start/end,
 * Enter or Space picks, Esc closes and returns focus to the calendar button. The ref points to the text input.
 */
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label, value, defaultValue = null, onChange, onInvalidText, locale = 'en-US', min, max, weekStart, placeholder = 'MM / DD / YYYY',
    optionalText, hint, error, labels, defaultOpen = false, today: todayProp, disabled, required, id, name, className,
  },
  ref,
) {
  const auto = useId();
  const fid = id ?? `${auto}-date`;
  const hintId = `${fid}-hint`;
  const errId = `${fid}-err`;
  const dir = useDirection();
  const l: Required<DatePickerLabels> = {
    chooseDate: 'Choose date', changeDate: 'Change date', dialog: 'Choose date', previousMonth: 'Previous month', nextMonth: 'Next month',
    today: 'Today', selected: 'selected', cancel: 'Cancel', done: 'Done', ...labels,
  };

  const longFmt = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), [locale]);
  const monthFmt = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }), [locale]);
  const mdFmt = useMemo(() => new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric' }), [locale]);
  const wdFmt = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: 'short' }), [locale]);
  const start = weekStart ?? firstWeekday(locale);

  const [inner, setInner] = useState<Date | null>(defaultValue ? day(defaultValue) : null);
  const current = value !== undefined ? (value ? day(value) : null) : inner;
  const today = day(todayProp ?? new Date());
  const lo = min ? day(min) : null;
  const hi = max ? day(max) : null;
  const blocked = (d: Date) => (lo !== null && d < lo) || (hi !== null && d > hi);

  const [text, setText] = useState(() => (current ? longFmt.format(current) : ''));
  const [open, setOpen] = useState(defaultOpen);
  const [draft, setDraft] = useState<Date | null>(current);
  const [focused, setFocused] = useState<Date>(current ?? today);
  const input = useRef<HTMLInputElement | null>(null);
  const calBtn = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const moveFocus = useRef(false);

  // Keep the text in step with a date changed from outside.
  useEffect(() => {
    if (value === undefined) return;
    const d = value ? day(value) : null;
    setText((t) => (same(parseDate(t, locale), d) && t !== '' ? t : d ? longFmt.format(d) : ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = (d: Date | null) => {
    if (value === undefined) setInner(d);
    setText(d ? longFmt.format(d) : '');
    onChange?.(d);
  };

  const openCal = () => {
    if (disabled) return;
    setDraft(current);
    setFocused(current ?? today);
    moveFocus.current = true;
    setOpen(true);
  };
  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) calBtn.current?.focus();
  };

  // Move focus to the focused day after the grid renders (not during render, SSR-safe).
  useEffect(() => {
    if (!open || !moveFocus.current) return;
    moveFocus.current = false;
    grid.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [open, focused]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const blurText = () => {
    if (text.trim() === '') {
      if (current) commit(null);
      return;
    }
    const d = parseDate(text, locale);
    if (d) {
      if (!same(d, current)) commit(d);
      else setText(longFmt.format(d));
    } else {
      onInvalidText?.(text);
    }
  };

  // Calendar cells for the focused month, padded to whole weeks.
  const y = focused.getFullYear();
  const m = focused.getMonth();
  const first = new Date(y, m, 1);
  const lead = (first.getDay() - start + 7) % 7;
  const daysIn = new Date(y, m + 1, 0).getDate();
  const cells: Array<Date | null> = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysIn }, (_, i) => new Date(y, m, i + 1)),
  ];
  const weekdays = Array.from({ length: 7 }, (_, i) => wdFmt.format(new Date(2023, 0, 1 + ((start + i) % 7))));
  const monthName = monthFmt.format(first);
  const prevLast = new Date(y, m, 0);
  const prevDisabled = lo !== null && prevLast < lo;
  const nextDisabled = hi !== null && new Date(y, m + 1, 1) > hi;

  const clampTo = (d: Date) => (lo && d < lo ? lo : hi && d > hi ? hi : d);
  const onGridKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = dir === 'rtl';
    let next: Date | null = null;
    switch (e.key) {
      case 'ArrowLeft': next = addDays(focused, rtl ? 1 : -1); break;
      case 'ArrowRight': next = addDays(focused, rtl ? -1 : 1); break;
      case 'ArrowUp': next = addDays(focused, -7); break;
      case 'ArrowDown': next = addDays(focused, 7); break;
      case 'PageUp': next = addMonths(focused, e.shiftKey ? -12 : -1); break;
      case 'PageDown': next = addMonths(focused, e.shiftKey ? 12 : 1); break;
      case 'Home': next = addDays(focused, -((focused.getDay() - start + 7) % 7)); break;
      case 'End': next = addDays(focused, 6 - ((focused.getDay() - start + 7) % 7)); break;
      default: return;
    }
    e.preventDefault();
    moveFocus.current = true;
    setFocused(clampTo(next));
  };

  const onDialogKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    }
  };

  const pick = (d: Date) => {
    setDraft(d);
    setFocused(d);
  };
  const done = () => {
    if (draft && !same(draft, current)) commit(draft);
    close(true);
  };

  const ids = [hint ? hintId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;
  const btnName = current ? `${l.changeDate}, ${longFmt.format(current)}` : l.chooseDate;
  const dialogId = `${fid}-dialog`;

  return (
    <div className={cx('field', className)} ref={root}>
      <label className="label" htmlFor={fid}>
        {label}
        {optionalText ? <>{' '}<span className="opt">{optionalText}</span></> : null}
      </label>
      <div className="fm-sel">
        <div className="fm-adorn">
          <input
            ref={(el) => {
              input.current = el;
              if (typeof ref === 'function') ref(el);
              else if (ref) ref.current = el;
            }}
            className={cx('input', open && 'fm-focus')}
            id={fid}
            name={name}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={placeholder}
            value={text}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={ids}
            onChange={(e) => setText(e.target.value)}
            onBlur={blurText}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown' && e.altKey) {
                e.preventDefault();
                openCal();
              }
            }}
          />
          <button
            ref={calBtn}
            className={cx('fm-calbtn', open && 'fm-on')}
            type="button"
            disabled={disabled}
            aria-label={btnName}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? dialogId : undefined}
            onClick={() => (open ? close(false) : openCal())}
          >
            <UiIcon name="calendar" size={20} />
          </button>
        </div>
        {open ? (
          <div className="fm-menu-float">
            <div className="fm-pop" id={dialogId} role="dialog" aria-label={l.dialog} onKeyDown={onDialogKey}>
              <div className="fm-pop-head">
                <button
                  className="fm-nav"
                  type="button"
                  aria-label={l.previousMonth}
                  disabled={prevDisabled}
                  onClick={() => setFocused(clampTo(addMonths(focused, -1)))}
                >
                  <UiIcon name={dir === 'rtl' ? 'chevron-right' : 'chevron-left'} size={20} />
                </button>
                <span className="fm-pop-month" aria-live="polite">{monthName}</span>
                <button
                  className="fm-nav"
                  type="button"
                  aria-label={l.nextMonth}
                  disabled={nextDisabled}
                  onClick={() => setFocused(clampTo(addMonths(focused, 1)))}
                >
                  <UiIcon name={dir === 'rtl' ? 'chevron-left' : 'chevron-right'} size={20} />
                </button>
              </div>
              <div className="fm-grid" role="grid" aria-label={monthName} ref={grid} onKeyDown={onGridKey}>
                {weekdays.map((w, i) => <span className="fm-wd" aria-hidden="true" key={i}>{w}</span>)}
                {cells.map((d, i) => {
                  if (!d) return <span key={`b${i}`} aria-hidden="true" />;
                  const isToday = same(d, today);
                  const isSel = same(d, draft);
                  const base = mdFmt.format(d);
                  const name2 = isToday && isSel ? `${l.today}, ${base}, ${l.selected}` : isToday ? `${l.today}, ${base}` : isSel ? `${base}, ${l.selected}` : base;
                  return (
                    <button
                      key={d.getDate()}
                      className={cx('fm-day', isToday && 'fm-today')}
                      type="button"
                      disabled={blocked(d)}
                      tabIndex={same(d, focused) ? 0 : -1}
                      aria-current={isToday ? 'date' : undefined}
                      aria-selected={isSel ? true : undefined}
                      aria-label={name2}
                      onClick={() => pick(d)}
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
              <div className="fm-pop-foot">
                <button
                  className="btn btn-ghost btn-sm"
                  type="button"
                  disabled={blocked(today)}
                  onClick={() => {
                    moveFocus.current = true;
                    pick(today);
                  }}
                >
                  {l.today}
                </button>
                <span className="fm-pop-actions">
                  <button className="btn btn-secondary btn-sm" type="button" onClick={() => close(true)}>{l.cancel}</button>
                  <button className="btn btn-primary btn-sm" type="button" onClick={done}>{l.done}</button>
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {hint ? <p className="hint" id={hintId}>{hint}</p> : null}
      {error ? <p className="err" id={errId}>{error}</p> : null}
    </div>
  );
});
