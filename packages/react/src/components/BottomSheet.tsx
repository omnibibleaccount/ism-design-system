import { forwardRef, useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type BottomSheetVariant = 'sheet' | 'action';

/** One 56px share tile (`.ap-share-opt`) in the sheet's share row. Four per row. */
export interface SheetShareOption {
  /** Visible label under the tile, e.g. "Copy". */
  label: ReactNode;
  /** Icon element for the tile. */
  icon: ReactNode;
  /** Click handler. */
  onSelect?: () => void;
}

/** One command row in an action sheet. */
export interface SheetAction {
  /** Verb-first label, e.g. "Copy verse". */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Destructive row (`--error`). Use at most one and keep it last. @default false */
  destructive?: boolean;
  /** Called when chosen. The sheet closes afterwards. */
  onSelect?: () => void;
}

export interface BottomSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** `sheet` is the panel with a grab handle and Close; `action` is the iOS-style command list with Cancel. @default "sheet" */
  variant?: BottomSheetVariant;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the sheet asks to open or close (Esc, scrim, drag down, Close, Cancel, after an action). */
  onOpenChange?: (open: boolean) => void;
  /** Title that says the task, e.g. "Share this verse". Receives focus on open. */
  title: ReactNode;
  /** Sheet: sub-line naming the source, e.g. "John 3:16 · Berean Standard Bible". Action: the line under the bold title. */
  subtitle?: ReactNode;
  /** Sheet: expanded height (top 96px) with the stronger 42% scrim. The peek has a 28% scrim. @default false */
  expanded?: boolean;
  /** Sheet: share tiles shown in a four-column row under the sub-line. */
  shareOptions?: SheetShareOption[];
  /** Action sheet: commands, destructive last. */
  actions?: SheetAction[];
  /** Sheet: extra content under the share row, such as `.ap-verse` or `.ap-sheet-list` rows. Also the action sheet's extra content. */
  children?: ReactNode;
  /** Accessible name of the Close button. @default "Close" */
  closeLabel?: string;
  /** Action sheet: Cancel text. Cancel is never red. @default "Cancel" */
  cancelLabel?: ReactNode;
  /** Mark the dialog `aria-modal` and trap focus. @default true */
  modal?: boolean;
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Bottom sheet and action sheet. Place inside the app screen container (`.ap-screen`, which is positioned).
 * Traps focus, closes on Esc, scrim tap or drag down, focuses the title on open and restores focus on close.
 * The grab handle is decorative; Close or Cancel is always visible.
 */
export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(function BottomSheet(
  {
    variant = 'sheet',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    title,
    subtitle,
    expanded = false,
    shareOptions,
    actions,
    children,
    closeLabel = 'Close',
    cancelLabel = 'Cancel',
    modal = true,
    className,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : inner;
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLElement | null>(null);
  const dragStart = useRef<number | null>(null);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInner(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement as HTMLElement | null;
    titleRef.current?.focus();
    return () => {
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (e.key === 'Tab' && modal && panelRef.current) {
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.hasAttribute('hidden'));
      if (items.length === 0) {
        e.preventDefault();
        titleRef.current?.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      if (e.shiftKey && (current === first || current === titleRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const setRefs = (node: HTMLDivElement | null) => {
    panelRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  if (variant === 'action') {
    return (
      <>
        <div className="ap-scrim ap-scrim-peek" aria-hidden="true" onClick={() => setOpen(false)} />
        <div
          ref={setRefs}
          className={cx('ap-as', className)}
          role="dialog"
          aria-modal={modal || undefined}
          aria-labelledby={titleId}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          <div className="ap-as-grp">
            <div className="ap-as-head">
              <b id={titleId} tabIndex={-1} ref={titleRef}>{title}</b>
              {subtitle ? <span>{subtitle}</span> : null}
            </div>
            {actions?.map((a, i) => (
              <button
                key={i}
                className={cx('ap-as-row', a.destructive && 'ap-as-danger')}
                type="button"
                onClick={() => {
                  a.onSelect?.();
                  setOpen(false);
                }}
              >
                {a.icon}
                <span>{a.label}</span>
              </button>
            ))}
            {children}
          </div>
          <button className="ap-as-cancel" type="button" onClick={() => setOpen(false)}>{cancelLabel}</button>
        </div>
      </>
    );
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest('.ap-grab, .ap-sheet-h h3')) dragStart.current = e.clientY;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current !== null && e.clientY - dragStart.current > 80) setOpen(false);
    dragStart.current = null;
  };

  return (
    <>
      <div className={cx('ap-scrim', !expanded && 'ap-scrim-peek')} aria-hidden="true" onClick={() => setOpen(false)} />
      <div
        ref={setRefs}
        className={cx('ap-sheet', expanded && 'ap-sheet-full', className)}
        role="dialog"
        aria-modal={modal || undefined}
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
        {...rest}
      >
        <span className="ap-grab" aria-hidden="true" />
        <div className="ap-sheet-h">
          <h3 id={titleId} tabIndex={-1} ref={titleRef as React.Ref<HTMLHeadingElement>}>{title}</h3>
          <button className="ap-tb ap-tb-sm" type="button" aria-label={closeLabel} onClick={() => setOpen(false)}>
            <UiIcon name="close" size={20} />
          </button>
        </div>
        {subtitle ? <p className="ap-sheet-sub">{subtitle}</p> : null}
        {shareOptions?.length ? (
          <div className="ap-share-row">
            {shareOptions.map((o, i) => (
              <button key={i} className="ap-share-opt" type="button" onClick={o.onSelect}>
                <i>{o.icon}</i>
                {o.label}
              </button>
            ))}
          </div>
        ) : null}
        {children}
      </div>
    </>
  );
});

export interface BottomSheetRowProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Row label. */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Current value, `--gray-600`, e.g. "English". */
  value?: ReactNode;
  /** Rows that open another screen end with › (`drill`); rows that act immediately do not. @default false */
  drill?: boolean;
}

/** A 52px list row (`.ap-lrow`) for the expanded sheet's `.ap-sheet-list`. */
export function BottomSheetRow({ label, icon, value, drill = false, className, ...rest }: BottomSheetRowProps) {
  return (
    <button className={cx('ap-lrow', className)} type="button" {...rest}>
      {icon}
      <span>{label}</span>
      {value ? <span className="ap-val">{value}</span> : null}
      {drill ? <span className="ap-chv"><UiIcon name="chevron-right" size={20} /></span> : null}
    </button>
  );
}
