import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type ToastVariant = 'success' | 'error' | 'info';

const DOT_CLASS: Record<ToastVariant, string> = {
  success: 'fb-tdot-ok',
  error: 'fb-tdot-err',
  info: 'fb-tdot-info',
};

export interface ToastAction {
  /** One verb: Undo, Retry, View. */
  label: ReactNode;
  /** Called when the action is pressed. The toast is dismissed afterwards. */
  onClick: () => void;
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The message. Past tense, plain, one line where possible. */
  children: ReactNode;
  /** Status dot. Errors use `role="alert"`, the others `role="status"`. @default "success" */
  variant?: ToastVariant;
  /** One text action at most. When present the dismiss X is not shown. */
  action?: ToastAction;
  /** Called when the reader presses the dismiss X or the action. When omitted no X is shown. */
  onDismiss?: () => void;
  /** Accessible name of the dismiss button. @default "Dismiss" */
  dismissLabel?: string;
  /** 44px tall compact form for small frames and narrow phones. @default false */
  compact?: boolean;
}

/** A single toast surface (dot, message, action or dismiss). Use `useToast` to show toasts from code. */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { children, variant = 'success', action, onDismiss, dismissLabel = 'Dismiss', compact = false, className, role, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('fb-toast', compact && 'fb-toast-sm', className)}
      role={role ?? (variant === 'error' ? 'alert' : 'status')}
      {...rest}
    >
      <span className={cx('fb-tdot', DOT_CLASS[variant])}>
        {variant === 'error' ? (
          <UiIcon name="close" size={14} strokeWidth={3} />
        ) : variant === 'info' ? (
          <UiIcon name="info" size={14} strokeWidth={3} />
        ) : (
          <UiIcon name="check" size={14} strokeWidth={3} />
        )}
      </span>
      <span className="fb-toast-msg">{children}</span>
      {action ? (
        <button
          className="fb-toast-act"
          type="button"
          onClick={() => {
            action.onClick();
            onDismiss?.();
          }}
        >
          {action.label}
        </button>
      ) : onDismiss ? (
        <button className="fb-toast-x" type="button" aria-label={dismissLabel} onClick={onDismiss}>
          <UiIcon name="close" size={20} />
        </button>
      ) : null}
    </div>
  );
});

export interface ToastOptions {
  /** The message. */
  message: ReactNode;
  /** @default "success" */
  variant?: ToastVariant;
  /** One text action (Undo, Retry, View). */
  action?: ToastAction;
  /** Auto-hide delay in ms. Default is 5000, or 8000 when there is an action. `0` or `Infinity` keeps it until dismissed. */
  duration?: number;
  /** Compact 44px form. @default false */
  compact?: boolean;
}

export interface ToastApi {
  /** Show a toast and return its id. The newest toast is on top; at most `max` are visible. */
  show: (options: ToastOptions) => string;
  /** Dismiss one toast by id. */
  dismiss: (id: string) => void;
  /** Dismiss all toasts. */
  dismissAll: () => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Access the toast queue. Must be used inside a `ToastProvider`. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Maximum number of visible toasts; the oldest is dropped when another arrives. @default 3 */
  max?: number;
  /** Accessible name of every dismiss button. @default "Dismiss" */
  dismissLabel?: string;
  /** Extra class on the `.fb-toaster` region. */
  toasterClassName?: string;
}

interface ToastEntry extends ToastOptions {
  id: string;
}

interface ToastItemProps {
  entry: ToastEntry;
  dismissLabel: string;
  onClose: (id: string) => void;
}

function ToastItem({ entry, dismissLabel, onClose }: ToastItemProps) {
  const { id, message, variant = 'success', action, compact } = entry;
  const duration = entry.duration ?? (action ? 8000 : 5000);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const paused = hover || focus;
  const remaining = useRef(duration);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!Number.isFinite(duration) || duration <= 0 || paused) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => closeRef.current(id), Math.max(0, remaining.current));
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused, duration, id]);

  return (
    <Toast
      variant={variant}
      compact={compact}
      action={action}
      dismissLabel={dismissLabel}
      onDismiss={() => onClose(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false);
      }}
    >
      {message}
    </Toast>
  );
}

/**
 * Provides `useToast` and renders the single `.fb-toaster` live region (present from load, `aria-live="polite"`).
 * Toasts auto-hide after 5s (8s with an action), pause on hover and focus, stack newest on top and never take focus.
 */
export function ToastProvider({ children, max = 3, dismissLabel = 'Dismiss', toasterClassName }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: string) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const dismissAll = useCallback(() => setToasts([]), []);
  const show = useCallback(
    (options: ToastOptions) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((list) => [{ ...options, id }, ...list].slice(0, Math.max(1, max)));
      return id;
    },
    [max],
  );
  const api = useMemo<ToastApi>(() => ({ show, dismiss, dismissAll }), [show, dismiss, dismissAll]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className={cx('fb-toaster', toasterClassName)} aria-live="polite">
        {toasts.map((t) => (
          <ToastItem key={t.id} entry={t} dismissLabel={dismissLabel} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
