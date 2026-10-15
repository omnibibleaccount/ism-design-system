import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type ModalSize = 's' | 'm';
export type ModalVariant = 'dialog' | 'confirm';
export type ModalTone = 'danger' | 'neutral';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the dialog asks to open or close (Esc, X, scrim click, or a closing button). */
  onOpenChange?: (open: boolean) => void;
  /** The title: the task or the question. Labels the dialog (`aria-labelledby`). */
  title: ReactNode;
  /**
   * `dialog` is a short task with a close X; `confirm` is a confirmation (`role="alertdialog"`, no X,
   * scrim clicks do nothing, Esc means Cancel).
   * @default "dialog"
   */
  variant?: ModalVariant;
  /** Panel width: `s` is 400px, `m` is 560px. @default "s" */
  size?: ModalSize;
  /** Confirm only: `danger` shows a red icon circle, `neutral` a blue one. @default "danger" */
  tone?: ModalTone;
  /** Confirm only: icon inside the 48px circle. Defaults to a trash icon (danger) or an info icon (neutral). */
  icon?: ReactNode;
  /** Confirm only: the one-sentence consequence, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Body content (dialog variant). */
  children?: ReactNode;
  /** Footer buttons: secondary first, then one primary. Build them with `Button` (`size="sm"`). */
  footer?: ReactNode;
  /** Accessible name of the close X. @default "Close" */
  closeLabel?: string;
  /** Close when the scrim is clicked. Ignored by `confirm`. @default true */
  closeOnScrim?: boolean;
  /**
   * Element to focus when the dialog opens. Defaults to the first element with `data-autofocus`,
   * else the Cancel (first footer) button in a confirmation, else the first form field, else the title.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Class names for the scrim wrapper. */
  scrimClassName?: string;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

let scrollLocks = 0;
let savedOverflow = '';
let savedPadding = '';

function lockScroll() {
  if (scrollLocks === 0) {
    const body = document.body;
    savedOverflow = body.style.overflow;
    savedPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;
  }
  scrollLocks += 1;
}
function unlockScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPadding;
  }
}

/** Make everything except `host` (and live toaster regions) inert. Returns a restore function. */
function inertAround(host: HTMLElement): () => void {
  const keepers: Element[] = [host, ...Array.from(document.querySelectorAll('.fb-toaster'))];
  const keep = new Set<Element>();
  for (const k of keepers) {
    for (let e: Element | null = k; e; e = e.parentElement) keep.add(e);
  }
  const changed: Element[] = [];
  keep.forEach((parent) => {
    if (parent === host) return;
    for (const child of Array.from(parent.children)) {
      if (keep.has(child) || child.tagName === 'SCRIPT' || child.tagName === 'STYLE') continue;
      if (!child.hasAttribute('inert')) {
        child.setAttribute('inert', '');
        changed.push(child);
      }
    }
  });
  return () => changed.forEach((c) => c.removeAttribute('inert'));
}

/**
 * Modal dialog over a dimmed scrim. Rendered in a portal on the client only (SSR safe), traps Tab,
 * closes on Esc, locks page scroll, makes the page behind `inert` and returns focus to the opener.
 * Open it only from a click; never open a modal from a modal.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    title,
    variant = 'dialog',
    size = 's',
    tone = 'danger',
    icon,
    description,
    children,
    footer,
    closeLabel = 'Close',
    closeOnScrim = true,
    initialFocusRef,
    scrimClassName,
    className,
    onKeyDown,
    ...rest
  },
  forwardedRef,
) {
  const controlled = openProp !== undefined;
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ? openProp : inner;
  const [host, setHost] = useState<HTMLElement | null>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;
  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const pressStartedOnScrim = useRef(false);
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  const initialFocusRefRef = useRef(initialFocusRef);
  initialFocusRefRef.current = initialFocusRef;
  const isConfirm = variant === 'confirm';

  // The portal host exists only on the client while open, so the server renders nothing.
  useEffect(() => {
    if (!open) {
      setHost(null);
      return;
    }
    const el = document.createElement('div');
    document.body.appendChild(el);
    setHost(el);
    return () => {
      el.remove();
    };
  }, [open]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onOpenChangeRef.current?.(next);
    },
    [controlled],
  );

  const setPanelRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  // Focus management, scroll lock and inert page behind.
  useEffect(() => {
    if (!open || !host) return;
    const panel = panelRef.current;
    if (!panel) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockScroll();
    const restoreInert = inertAround(host);

    const target =
      initialFocusRefRef.current?.current ??
      panel.querySelector<HTMLElement>('[data-autofocus]') ??
      (isConfirm
        ? panel.querySelector<HTMLElement>('.fb-modal-foot button, .fb-modal-foot a[href]')
        : panel.querySelector<HTMLElement>('.fb-modal-body input:not([type="hidden"]), .fb-modal-body select, .fb-modal-body textarea')) ??
      titleRef.current;
    target?.focus({ preventScroll: true });

    return () => {
      restoreInert();
      unlockScroll();
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, host, isConfirm]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpen(false);
      return;
    }
    if (e.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (items.length === 0) {
      e.preventDefault();
      titleRef.current?.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel || active === titleRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onScrimMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    pressStartedOnScrim.current = e.target === e.currentTarget;
  };
  const onScrimClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && pressStartedOnScrim.current && closeOnScrim && !isConfirm) setOpen(false);
    pressStartedOnScrim.current = false;
  };

  if (!open || !host) return null;

  const titleEl = (
    <h2 className="fb-modal-title" id={titleId} tabIndex={-1} ref={titleRef}>
      {title}
    </h2>
  );

  const panel = (
    <div
      ref={setPanelRef}
      className={cx('fb-modal', size === 'm' ? 'fb-modal-m' : 'fb-modal-s', className)}
      role={isConfirm ? 'alertdialog' : 'dialog'}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={isConfirm && description ? descId : undefined}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {isConfirm ? (
        <div className="fb-confirm">
          <span className={cx('fb-cicon', tone === 'danger' ? 'fb-cicon-danger' : 'fb-cicon-info')}>
            {icon ?? <UiIcon name={tone === 'danger' ? 'trash' : 'info'} size={24} />}
          </span>
          <div className="fb-confirm-text">
            {titleEl}
            {description ? (
              <p className="fb-confirm-desc" id={descId}>
                {description}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          <div className="fb-modal-head">
            {titleEl}
            <button className="fb-x" type="button" aria-label={closeLabel} onClick={() => setOpen(false)}>
              <UiIcon name="close" size={20} />
            </button>
          </div>
          <div className="fb-modal-body">{children}</div>
        </>
      )}
      {footer ? <div className="fb-modal-foot">{footer}</div> : null}
    </div>
  );

  return createPortal(
    <div className={cx('fb-scrim', scrimClassName)} onMouseDown={onScrimMouseDown} onClick={onScrimClick}>
      {panel}
    </div>,
    host,
  );
});
