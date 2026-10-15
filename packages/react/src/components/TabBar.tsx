import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';

export interface TabBarItem {
  /** Stable id, passed to `onChange`. */
  id: string;
  /** One short title-case word, e.g. "Home". Always visible. */
  label: ReactNode;
  /** Outline icon (stroke 1.8, 24px), e.g. `<UiIcon name="home" size={24} />`. Do not swap to a filled icon when active. */
  icon: ReactNode;
  /** Show the Horizon Blue "something new" dot. Never a number above 9. @default false */
  dot?: boolean;
  /** Accessible name when it must differ from the label, e.g. "More, new item" for a tab with a dot. */
  ariaLabel?: string;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'defaultValue'> {
  /** The tabs, in order. dot.Bible uses exactly five: Home, Bible, Listen, Saved, More. */
  tabs: TabBarItem[];
  /** Controlled id of the active tab. */
  value?: string;
  /** Initial active tab when uncontrolled. @default the first tab */
  defaultValue?: string;
  /** Called when a tab is pressed. */
  onChange?: (id: string) => void;
  /** Dark bar (`--charcoal-900`, active `--blue-on-dark`). @default false */
  dark?: boolean;
  /** Accessible name of the `<nav>`. @default "Main" */
  'aria-label'?: string;
}

/** Bottom tab bar with equal tabs that switch top-level sections. Tabs only navigate; they never act. */
export const TabBar = forwardRef<HTMLElement, TabBarProps>(function TabBar(
  { tabs, value, defaultValue, onChange, dark = false, 'aria-label': ariaLabel = 'Main', className, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultValue ?? tabs[0]?.id);
  const active = value !== undefined ? value : inner;
  const select = (id: string) => {
    if (value === undefined) setInner(id);
    onChange?.(id);
  };
  return (
    <nav ref={ref} className={cx('ap-tabbar', dark && 'ap-dark', className)} aria-label={ariaLabel} {...rest}>
      {tabs.map((t) => (
        <button
          key={t.id}
          className="ap-tab"
          type="button"
          aria-current={t.id === active ? 'page' : undefined}
          aria-label={t.ariaLabel}
          onClick={() => select(t.id)}
        >
          <span className="ap-tab-ico">
            {t.icon}
            {t.dot ? <span className="ap-dot" aria-hidden="true" /> : null}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
});
