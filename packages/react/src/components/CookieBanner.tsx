import { forwardRef, useCallback, useEffect, useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface CookieBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /**
   * Whether the banner is shown. You own this state: show it on the first visit, hide it after a choice,
   * show it again when the stored choice expires (365 days) or from "Cookie settings".
   * @default true
   */
  open?: boolean;
  /** Called when the reader presses the accept button. Store the choice and load analytics here. The library writes no cookies. */
  onAccept: () => void;
  /** Called when the reader presses the reject button. Store the choice here. The library writes no cookies. */
  onDecline: () => void;
  /** Heading, for example "A note on cookies". */
  title: ReactNode;
  /** The paragraph, for example "We use cookies to enhance your experience…". */
  children: ReactNode;
  /** URL of the Cookie Policy page. Renders the "Learn more" link when given together with `learnMoreLabel`. */
  learnMoreHref?: string;
  /** Text of the link, for example "Learn more". */
  learnMoreLabel?: ReactNode;
  /** Label of the primary button, for example "Accept All". */
  acceptLabel: ReactNode;
  /** Label of the outline button, for example "Reject Non-Essential". */
  declineLabel: ReactNode;
  /** Drop fixed positioning and the rise animation, for docs and static boards. @default false */
  static?: boolean;
}

const MAIN_SELECTOR = "main[tabindex='-1'], main, #main";

/**
 * Cookie consent card at the bottom-left. Controlled: pass `open`, `onAccept` and `onDecline`.
 * It never blocks the page, never steals focus on load, and after a choice returns focus to where the reader was
 * (or to `main`). The library does not read or write cookies or storage.
 */
export const CookieBanner = forwardRef<HTMLDivElement, CookieBannerProps>(function CookieBanner(
  { open = true, onAccept, onDecline, title, children, learnMoreHref, learnMoreLabel, acceptLabel, declineLabel, static: isStatic = false, className, ...rest },
  forwardedRef,
) {
  const headingId = useId();
  const innerRef = useRef<HTMLDivElement | null>(null);
  const lastOutside = useRef<HTMLElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  // Remember the last element focused outside the banner, to restore focus after a choice.
  useEffect(() => {
    if (!open) return;
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target;
      if (t instanceof HTMLElement && !innerRef.current?.contains(t)) lastOutside.current = t;
    };
    document.addEventListener('focusin', onFocusIn);
    return () => document.removeEventListener('focusin', onFocusIn);
  }, [open]);

  const choose = (handler: () => void) => {
    handler();
    const previous = lastOutside.current;
    requestAnimationFrame(() => {
      const target = previous && previous.isConnected ? previous : document.querySelector<HTMLElement>(MAIN_SELECTOR);
      target?.focus({ preventScroll: true });
    });
  };

  if (!open) return null;
  return (
    <div
      ref={setRef}
      className={cx('cookie', isStatic && 'nv-static', className)}
      role="region"
      aria-labelledby={headingId}
      {...rest}
    >
      <p className="nv-cookie-h" id={headingId}>
        {title}
      </p>
      <p>
        {children}
        {learnMoreHref && learnMoreLabel ? (
          <>
            {' '}
            <a href={learnMoreHref}>{learnMoreLabel}</a>
          </>
        ) : null}
      </p>
      <div className="nv-cookie-actions">
        <button className="btn btn-primary" type="button" onClick={() => choose(onAccept)}>
          {acceptLabel}
        </button>
        <button className="btn btn-outline-light" type="button" onClick={() => choose(onDecline)}>
          {declineLabel}
        </button>
      </div>
    </div>
  );
});
