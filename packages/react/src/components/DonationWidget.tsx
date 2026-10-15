import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils';
import { UiIcon } from '../Icon';

export type DonationFrequency = 'once' | 'monthly';
export type DonationVariant = 'full' | 'compact' | 'goal';
/** A preset amount, or `"other"` when the reader types their own. */
export type DonationAmount = number | 'other';

/** The values passed to `onSubmit`. No payment is made by this component. */
export interface DonationSubmit {
  /** Chosen amount in whole currency units (decimals allowed for Other). `NaN` when Other is empty or invalid. */
  amount: number;
  /** Chosen frequency. */
  frequency: DonationFrequency;
}

/** Visible strings. Override them all for other languages. */
export interface DonationLabels {
  /** Heading of the full widget. @default "Give to the mission" */
  heading: ReactNode;
  /** Lead under the heading. @default "Your gift puts Scripture in the hands of people still waiting for it." */
  lead: ReactNode;
  /** Accessible name of the frequency group. @default "Gift frequency" */
  frequencyLabel: string;
  /** One-time segment. @default "One-time" */
  once: ReactNode;
  /** Monthly segment. @default "Monthly" */
  monthly: ReactNode;
  /** Label above the amount chips. @default "Amount (USD)" */
  amountLabel: ReactNode;
  /** Other chip text. @default "Other" */
  other: ReactNode;
  /** Accessible name of the Other input. @default "Other amount" */
  otherAriaLabel: string;
  /** Secure payment note. @default "Secure, encrypted payment · cancel monthly gifts anytime" */
  secure: ReactNode;
  /** Button label while `submitting`. @default "Processing…" */
  processing: ReactNode;
}

export const defaultDonationLabels: DonationLabels = {
  heading: 'Give to the mission',
  lead: 'Your gift puts Scripture in the hands of people still waiting for it.',
  frequencyLabel: 'Gift frequency',
  once: 'One-time',
  monthly: 'Monthly',
  amountLabel: 'Amount (USD)',
  other: 'Other',
  otherAriaLabel: 'Other amount',
  secure: 'Secure, encrypted payment · cancel monthly gifts anytime',
  processing: 'Processing…',
};

/** Goal-progress data for `variant="goal"`. Figures are samples until finance confirms them. */
export interface DonationGoal {
  /** Campaign title, e.g. "Year-end Bible drive". */
  title: ReactNode;
  /** Right-hand meta, e.g. "18 days left". */
  meta?: ReactNode;
  /** Amount raised so far (for the progress bar). */
  raised: number;
  /** Target amount. */
  target: number;
  /** Accessible name of the progress bar. @default "Raised toward goal" */
  label?: string;
  /** Text sum repeating the numbers, e.g. `<><b>$18,400</b> of $25,000 raised · 74%</>`. */
  summary: ReactNode;
  /** Optional call to action shown under the sum (`btn-light` on dark, `btn-primary` on light). */
  cta?: { label: ReactNode; href: string };
}

export interface DonationWidgetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit' | 'defaultValue'> {
  /** `full` is the Give module, `compact` is one row for sidebars, `goal` shows campaign progress. @default "full" */
  variant?: DonationVariant;
  /** Controlled frequency. */
  frequency?: DonationFrequency;
  /** Initial frequency when uncontrolled. @default "monthly" */
  defaultFrequency?: DonationFrequency;
  /** Called when the frequency changes. */
  onFrequencyChange?: (frequency: DonationFrequency) => void;
  /** Controlled selected amount (a preset or `"other"`). */
  amount?: DonationAmount;
  /** Initial amount when uncontrolled. @default the second preset */
  defaultAmount?: DonationAmount;
  /** Called when the selected amount changes. */
  onAmountChange?: (amount: DonationAmount) => void;
  /** Controlled text of the Other input. */
  otherValue?: string;
  /** Called when the Other input text changes. */
  onOtherValueChange?: (value: string) => void;
  /** Preset amounts in whole currency units. The compact variant shows the first three. @default [25, 50, 100, 250] */
  presets?: number[];
  /** Currency symbol shown before amounts. @default "$" */
  currencySymbol?: string;
  /** Called when the reader presses Give. Presentational only: this component never calls a payment API. */
  onSubmit?: (value: DonationSubmit) => void;
  /** Show the processing state: spinner, "Processing…", disabled, `aria-busy`. @default false */
  submitting?: boolean;
  /** Override visible strings. */
  labels?: Partial<DonationLabels>;
  /** Builds the Give button label. Must repeat amount and frequency. @default "Give $50 monthly" */
  formatGiveLabel?: (amount: number, frequency: DonationFrequency, currencySymbol: string) => ReactNode;
  /** Builds the one-sentence impact line (bold the number). Rates are samples until confirmed. */
  renderImpact?: (amount: number, frequency: DonationFrequency, isOther: boolean, currencySymbol: string) => ReactNode;
  /** Goal data, required for `variant="goal"`. */
  goal?: DonationGoal;
  /** Goal variant on the dark panel (`.mn-panel-dark`). @default false */
  dark?: boolean;
}

const defaultGive = (amount: number, frequency: DonationFrequency, sym: string): ReactNode =>
  Number.isFinite(amount) && amount > 0
    ? `Give ${sym}${amount}${frequency === 'monthly' ? ' monthly' : ''}`
    : `Give${frequency === 'monthly' ? ' monthly' : ''}`;

const defaultImpact = (amount: number, frequency: DonationFrequency, isOther: boolean, sym: string): ReactNode => {
  if (isOther || !Number.isFinite(amount) || amount <= 0) {
    return (<><b>Every {sym}5 places a Bible</b> with a new reader.</>);
  }
  return (
    <>
      <b>{sym}{amount} places {Math.max(1, Math.round(amount / 5))} Bibles</b> with new readers{frequency === 'monthly' ? ' every month' : ''}.
    </>
  );
};

function useControllable<T>(value: T | undefined, initial: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState<T>(initial);
  const current = value !== undefined ? value : inner;
  const set = (v: T) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };
  return [current, set] as const;
}

/**
 * Giving module: frequency switch, amount chips with Other, live impact line, one Give button and a secure
 * note; plus compact and goal-progress versions. Controlled or uncontrolled; calls `onSubmit` only.
 */
export const DonationWidget = forwardRef<HTMLDivElement, DonationWidgetProps>(function DonationWidget(
  {
    variant = 'full',
    frequency: frequencyProp,
    defaultFrequency = 'monthly',
    onFrequencyChange,
    amount: amountProp,
    defaultAmount,
    onAmountChange,
    otherValue: otherProp,
    onOtherValueChange,
    presets = [25, 50, 100, 250],
    currencySymbol = '$',
    onSubmit,
    submitting = false,
    labels,
    formatGiveLabel = defaultGive,
    renderImpact = defaultImpact,
    goal,
    dark = false,
    className,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const l = { ...defaultDonationLabels, ...labels };
  const [frequency, setFrequency] = useControllable<DonationFrequency>(frequencyProp, defaultFrequency, onFrequencyChange);
  const [amount, setAmount] = useControllable<DonationAmount>(amountProp, defaultAmount ?? presets[1] ?? presets[0] ?? 'other', onAmountChange);
  const [otherValue, setOtherValue] = useControllable<string>(otherProp, '', onOtherValueChange);

  if (variant === 'goal' && goal) {
    const pct = goal.target > 0 ? Math.max(0, Math.min(100, Math.round((goal.raised / goal.target) * 100))) : 0;
    return (
      <div ref={ref} className={cx(dark && 'mn-panel-dark', className)} {...rest}>
        <div className="mn-goal-row">
          <p className="mn-goal-title">{goal.title}</p>
          {goal.meta ? <p className="mn-goal-meta">{goal.meta}</p> : null}
        </div>
        <div
          className="mn-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goal.target}
          aria-valuenow={goal.raised}
          aria-label={goal.label ?? 'Raised toward goal'}
        >
          <span style={{ width: `${pct}%` }} />
        </div>
        <p className="mn-goal-sum">{goal.summary}</p>
        {goal.cta ? (
          <a className={cx('btn', dark ? 'btn-light' : 'btn-primary')} href={goal.cta.href}>{goal.cta.label}</a>
        ) : null}
      </div>
    );
  }

  const isOther = amount === 'other';
  const numeric = isOther ? parseFloat(otherValue.replace(',', '.')) : amount;
  const giveLabel = formatGiveLabel(numeric, frequency, currencySymbol);
  const impact = renderImpact(numeric, frequency, isOther, currencySymbol);
  const submit = () => onSubmit?.({ amount: numeric, frequency });
  const shown = variant === 'compact' ? presets.slice(0, 3) : presets;

  const chips = shown.map((p) => (
    <button key={p} className="chip" type="button" aria-pressed={amount === p} disabled={submitting} onClick={() => setAmount(p)}>
      {currencySymbol}{p}
    </button>
  ));

  const giveButton = (large: boolean) => (
    <button
      className={cx('btn btn-primary', large && 'btn-lg')}
      type="button"
      style={large ? { width: '100%' } : undefined}
      disabled={submitting}
      aria-busy={submitting || undefined}
      onClick={submit}
    >
      {submitting ? (<><span className="spin" aria-hidden="true" />{l.processing}</>) : giveLabel}
    </button>
  );

  if (variant === 'compact') {
    return (
      <div ref={ref} className={className} {...rest}>
        <div className="mn-compact mn-amts-sm">
          {chips}
          {giveButton(false)}
        </div>
        <p className="mn-impact-text" aria-live="polite">{impact}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className={cx('card card-lg card-flat mn-give', className)} {...rest}>
      <div className="mn-give-head">
        <h3 className="h4">{l.heading}</h3>
        <p className="muted">{l.lead}</p>
      </div>
      <div className="mn-seg" role="group" aria-label={l.frequencyLabel}>
        <button type="button" aria-pressed={frequency === 'once'} disabled={submitting} onClick={() => setFrequency('once')}>{l.once}</button>
        <button type="button" aria-pressed={frequency === 'monthly'} disabled={submitting} onClick={() => setFrequency('monthly')}>{l.monthly}</button>
      </div>
      <div className="field">
        <span className="label" id={`${uid}-amt-l`}>{l.amountLabel}</span>
        <div className="mn-amts" role="group" aria-labelledby={`${uid}-amt-l`}>
          {chips}
          <button className="chip" type="button" aria-pressed={isOther} disabled={submitting} onClick={() => setAmount('other')}>{l.other}</button>
        </div>
        {isOther ? (
          <div className="mn-other">
            <span aria-hidden="true">{currencySymbol}</span>
            <input
              className="input"
              type="text"
              inputMode="decimal"
              aria-label={l.otherAriaLabel}
              value={otherValue}
              disabled={submitting}
              onChange={(e) => setOtherValue(e.target.value)}
            />
          </div>
        ) : null}
      </div>
      <p className="mn-impact" aria-live="polite">
        <UiIcon name="heart" size={20} />
        <span>{impact}</span>
      </p>
      {giveButton(true)}
      <p className="mn-secure"><UiIcon name="lock" size={16} />{l.secure}</p>
    </div>
  );
});
