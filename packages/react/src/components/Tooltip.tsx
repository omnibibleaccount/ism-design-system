import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

const SIDE_CLASS: Record<TooltipSide, string> = {
  top: 'fb-tip-t',
  bottom: 'fb-tip-b',
  left: 'fb-tip-l',
  right: 'fb-tip-r',
};

interface TriggerProps {
  children?: ReactNode;
  'aria-describedby'?: string;
  onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
  onFocus?: (e: FocusEvent<HTMLElement>) => void;
  onBlur?: (e: FocusEvent<HTMLElement>) => void;
}

export interface TooltipProps {
  /**
   * The trigger: one element, usually an icon-only `<button className="fb-ib" aria-label="Copy link">`.
   * It must be `position: relative` (`.fb-ib` is). The tooltip is rendered inside it, as in the README markup.
   */
  children: ReactElement<TriggerProps>;
  /** Two or three words, sentence case, verb first, no full stop. Never put interactive content here. */
  label: ReactNode;
  /** Preferred side. Defaults to top; use `bottom` under a header. @default "top" */
  side?: TooltipSide;
  /** Hover delay in ms before the tooltip shows. Keyboard focus shows it immediately. @default 300 */
  delay?: number;
  /** Class names for the tooltip bubble. */
  className?: string;
  /** Id of the tooltip element (used by `aria-describedby`). Generated when omitted. */
  id?: string;
}

/**
 * Small dark label for an icon-only control. Shows after 300ms hover or immediately on focus,
 * stays while hovered, hides on mouse-out, blur or Esc (WCAG 1.4.13) and is linked with `aria-describedby`.
 */
export function Tooltip({ children, label, side = 'top', delay = 300, className, id }: TooltipProps) {
  const autoId = useId();
  const tipId = id ?? `tip-${autoId}`;
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const show = useCallback(() => {
    clear();
    setVisible(true);
  }, [clear]);
  const hide = useCallback(() => {
    clear();
    setVisible(false);
  }, [clear]);
  useEffect(() => clear, [clear]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, hide]);

  const child = Children.only(children);
  if (!isValidElement<TriggerProps>(child)) return child;
  const props = child.props;
  const describedBy = [props['aria-describedby'], tipId].filter(Boolean).join(' ');

  return cloneElement(
    child,
    {
      'aria-describedby': describedBy,
      onMouseEnter: (e: MouseEvent<HTMLElement>) => {
        props.onMouseEnter?.(e);
        clear();
        timer.current = setTimeout(() => setVisible(true), delay);
      },
      onMouseLeave: (e: MouseEvent<HTMLElement>) => {
        props.onMouseLeave?.(e);
        hide();
      },
      onFocus: (e: FocusEvent<HTMLElement>) => {
        props.onFocus?.(e);
        if (e.currentTarget.matches(':focus-visible')) show();
      },
      onBlur: (e: FocusEvent<HTMLElement>) => {
        props.onBlur?.(e);
        hide();
      },
    },
    props.children,
    <span key="tip" className={cx('fb-tip', SIDE_CLASS[side], className)} id={tipId} role="tooltip" hidden={!visible}>
      {label}
    </span>,
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Popover: the light, click-to-open sibling of the tooltip.

const POPOVER_EVENT = 'ism-popover-open';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Accessible name of the trigger button and of the popover dialog, for example "About offline reading". */
  label: string;
  /** Short popover title. */
  title: ReactNode;
  /** One or two plain sentences. */
  children: ReactNode;
  /** Optional single link at the end of the popover. */
  linkHref?: string;
  /** Text of the link, for example "How offline reading works ↗". */
  linkLabel?: ReactNode;
  /** Icon inside the 44px trigger. Defaults to the info icon. */
  icon?: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Popover opened by click (never hover). Esc, a click outside, or the trigger again closes it and returns focus
 * to the trigger. Only one popover is open at a time. Focus stays on the trigger; Tab moves into the link.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { label, title, children, linkHref, linkLabel, icon, open: openProp, defaultOpen = false, onOpenChange, className, ...rest },
  ref,
) {
  const controlled = openProp !== undefined;
  const [inner, setInner] = useState(defaultOpen);
  const open = controlled ? openProp : inner;
  const id = useId();
  const popId = `pop-${id}`;
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const onChangeRef = useRef(onOpenChange);
  onChangeRef.current = onOpenChange;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInner(next);
      onChangeRef.current?.(next);
    },
    [controlled],
  );

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      wrapRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== popId) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener(POPOVER_EVENT, onOther);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener(POPOVER_EVENT, onOther);
    };
  }, [open, setOpen, popId]);

  const toggle = () => {
    if (!open) document.dispatchEvent(new CustomEvent(POPOVER_EVENT, { detail: popId }));
    setOpen(!open);
  };

  return (
    <div ref={setRefs} className={className} style={{ position: 'relative' }} {...rest}>
      <button
        ref={triggerRef}
        className="fb-ib"
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={popId}
        onClick={toggle}
      >
        {icon ?? <UiIcon name="info" size={20} />}
      </button>
      {open ? (
        <div className="fb-pop" id={popId} role="dialog" aria-label={label}>
          <span className="fb-pop-title">{title}</span>
          <span className="fb-pop-body">{children}</span>
          {linkHref && linkLabel ? (
            <a className="fb-pop-link" href={linkHref}>
              {linkLabel}
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
