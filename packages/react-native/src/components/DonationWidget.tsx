import { useId, useState } from 'react';
import { Pressable, TextInput, View, useWindowDimensions, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { gradient } from '@ism/tokens/native';
import { useTheme } from '../theme';
import { Text } from '../Text';
import { UiIcon } from '../Icon';
import { Button } from './Button';

/** One-time or monthly. Default to monthly. */
export type DonationFrequency = 'once' | 'monthly';
/** A preset amount in whole currency units, or `other` for the typed amount. */
export type DonationAmount = number | 'other';

export interface DonationLabels {
  /** @default "Give to the mission" */
  heading?: string;
  /** @default "Your gift puts Scripture in the hands of people still waiting for it." */
  lead?: string;
  /** Accessible name of the frequency group. @default "Gift frequency" */
  frequencyGroup?: string;
  /** @default "One-time" */
  once?: string;
  /** @default "Monthly" */
  monthly?: string;
  /** Visible label above the amount chips. @default "Amount (USD)" */
  amountLabel?: string;
  /** @default "Other" */
  other?: string;
  /** Accessible name of the Other input. @default "Other amount" */
  otherInput?: string;
  /** @default "Secure, encrypted payment · cancel monthly gifts anytime" */
  secure?: string;
}

const DEFAULT_LABELS: Required<DonationLabels> = {
  heading: 'Give to the mission',
  lead: 'Your gift puts Scripture in the hands of people still waiting for it.',
  frequencyGroup: 'Gift frequency',
  once: 'One-time',
  monthly: 'Monthly',
  amountLabel: 'Amount (USD)',
  other: 'Other',
  otherInput: 'Other amount',
  secure: 'Secure, encrypted payment · cancel monthly gifts anytime',
};

/** Impact sentence with the number in bold: "$50 places 10 Bibles" + " with new readers every month." */
export interface DonationImpact {
  /** Bold part, e.g. "$50 places 10 Bibles". */
  strong: string;
  /** Rest of the sentence, starting with a space. */
  text: string;
}

function ring(color: string, on: boolean): ViewStyle {
  return on ? { outlineColor: color, outlineWidth: 2, outlineOffset: 2, outlineStyle: 'solid' } : {};
}

interface ChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  minWidth: number;
  compact?: boolean;
  disabled?: boolean;
}

/** Amount chip, at least 44dp tall. Selected is black (white in dark mode), never blue. */
function AmountChip({ label, selected, onPress, minWidth, compact, disabled }: ChipProps) {
  const { colors, radius, opacity, isDark } = useTheme();
  const [focus, setFocus] = useState(false);
  const fill = isDark ? '#ffffff' : '#000000';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={({ pressed }): ViewStyle => ({
        minWidth, minHeight: 44, paddingHorizontal: compact ? 14 : 20, alignItems: 'center', justifyContent: 'center', borderRadius: radius['radius-pill'], borderWidth: 1,
        borderColor: selected ? fill : pressed ? colors.text : colors.border, backgroundColor: selected ? fill : colors.surface, opacity: disabled ? opacity['opacity-disabled'] : 1, ...ring(colors.focus, focus),
      })}
    >
      <Text variant="web-label" style={{ fontSize: 16, color: selected ? (isDark ? '#000000' : '#ffffff') : colors.text }}>{label}</Text>
    </Pressable>
  );
}

export interface DonationWidgetProps extends ViewProps {
  /** Selected frequency. Default to `monthly`. */
  frequency: DonationFrequency;
  /** Called when the frequency changes. Update the Give label and impact line in response. */
  onFrequencyChange: (frequency: DonationFrequency) => void;
  /** Preset amounts in whole currency units, ascending. Default to the second chip. @default [25, 50, 100, 250] */
  amounts?: number[];
  /** Selected preset, or `other`. */
  amount: DonationAmount;
  /** Called when a chip is chosen. */
  onAmountChange: (amount: DonationAmount) => void;
  /** Text typed in the Other field. */
  otherValue?: string;
  /** Called as the Other field changes. */
  onOtherValueChange?: (value: string) => void;
  /** Currency symbol on chips and the Other prefix. @default "$" */
  currencySymbol?: string;
  /** Impact line, one sentence with the number in bold. Updates on every change; announced politely. */
  impact?: DonationImpact;
  /** Give button label; always repeat amount and frequency: "Give $50 monthly". */
  giveLabel: string;
  /** Called by Give. Presentational: this component never takes payment. */
  onGive: () => void;
  /** Disable the Give button, e.g. until an Other amount is valid. @default false */
  giveDisabled?: boolean;
  /** Submitting: spinner and `processingLabel`, button disabled and busy, width unchanged. @default false */
  submitting?: boolean;
  /** Label while submitting. @default "Processing…" */
  processingLabel?: string;
  /** Fixed strings; override for translation. */
  labels?: DonationLabels;
  style?: StyleProp<ViewStyle>;
}

/** The giving module: frequency switch, amount chips with Other, live impact line, one Give button and a secure note. Presentational only. */
export function DonationWidget({
  frequency, onFrequencyChange, amounts = [25, 50, 100, 250], amount, onAmountChange, otherValue = '', onOtherValueChange, currencySymbol = '$', impact, giveLabel, onGive, giveDisabled = false,
  submitting = false, processingLabel = 'Processing…', labels, style, ...rest
}: DonationWidgetProps) {
  const { colors, radius, spacing, isDark } = useTheme();
  const { width } = useWindowDimensions();
  const l = { ...DEFAULT_LABELS, ...labels };
  const [otherFocus, setOtherFocus] = useState(false);
  const impactInk = isDark ? '#7fa6f7' : '#0455ad';
  const seg = (value: DonationFrequency, label: string) => {
    const on = frequency === value;
    return (
      <Pressable
        key={value}
        accessibilityRole="button"
        accessibilityState={{ selected: on }}
        onPress={() => onFrequencyChange(value)}
        style={{ flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radius['radius-pill'], backgroundColor: on ? (isDark ? colors.border : colors.surface) : 'transparent', ...(on ? { shadowColor: '#000000', shadowOpacity: 0.14, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 } : null) }}
      >
        <Text variant="web-label" style={{ fontSize: 15, color: on ? colors.text : colors.textBody }}>{label}</Text>
      </Pressable>
    );
  };
  return (
    <View {...rest} style={[{ gap: 22, padding: width < 768 ? spacing['space-5'] : spacing['space-6'], backgroundColor: colors.surface, borderRadius: radius['radius-lg'], borderWidth: 1, borderColor: colors.border }, style]}>
      <View style={{ gap: 6 }}>
        <Text variant="web-h4" accessibilityRole="header" style={{ fontSize: 24, lineHeight: 30, letterSpacing: -0.24 }}>{l.heading}</Text>
        <Text variant="web-small" tone="secondary">{l.lead}</Text>
      </View>
      <View accessibilityRole="radiogroup" accessibilityLabel={l.frequencyGroup} style={{ flexDirection: 'row', gap: 4, padding: 4, borderRadius: radius['radius-pill'], backgroundColor: colors.surfaceMuted }}>
        {seg('once', l.once)}
        {seg('monthly', l.monthly)}
      </View>
      <View style={{ gap: 8 }}>
        <Text variant="web-label">{l.amountLabel}</Text>
        <View accessibilityLabel={l.amountLabel} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {amounts.map((a) => <AmountChip key={a} label={`${currencySymbol}${a}`} selected={amount === a} onPress={() => onAmountChange(a)} minWidth={76} disabled={submitting} />)}
          <AmountChip label={l.other} selected={amount === 'other'} onPress={() => onAmountChange('other')} minWidth={76} disabled={submitting} />
        </View>
        {amount === 'other' ? (
          <View style={{ justifyContent: 'center' }}>
            <Text variant="web-label" accessibilityElementsHidden importantForAccessibility="no" tone="tertiary" style={{ position: 'absolute', start: 16, zIndex: 1, fontSize: 16 }}>{currencySymbol}</Text>
            <TextInput
              value={otherValue}
              onChangeText={onOtherValueChange}
              accessibilityLabel={l.otherInput}
              keyboardType="decimal-pad"
              inputMode="decimal"
              editable={!submitting}
              onFocus={() => setOtherFocus(true)}
              onBlur={() => setOtherFocus(false)}
              style={{ height: 48, paddingStart: 32, paddingEnd: 16, fontSize: 16, color: colors.text, borderRadius: radius['radius-md'], borderWidth: 1, borderColor: otherFocus ? colors.primary : colors.border, backgroundColor: colors.surface, ...(otherFocus ? { shadowColor: colors.focus, shadowOpacity: 0.35, shadowRadius: 0, shadowOffset: { width: 0, height: 0 } } : null) }}
            />
          </View>
        ) : null}
      </View>
      {impact ? (
        <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', alignItems: 'center', gap: spacing['space-3'], paddingVertical: 14, paddingHorizontal: 16, borderRadius: radius['radius-md'], backgroundColor: colors.tint }}>
          <UiIcon name="heart" size={20} color={impactInk} />
          <Text variant="web-small" style={{ flex: 1, fontSize: 15, lineHeight: 22, color: impactInk }}>
            <Text variant="web-label" style={{ fontSize: 15, color: impactInk }}>{impact.strong}</Text>
            {impact.text}
          </Text>
        </View>
      ) : null}
      <Button size="lg" block loading={submitting} disabled={giveDisabled} onPress={onGive}>{submitting ? processingLabel : giveLabel}</Button>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing['space-2'] }}>
        <UiIcon name="lock" size={16} color={colors.textTertiary} />
        <Text variant="body-sm" tone="tertiary" style={{ fontSize: 14, textAlign: 'center', flexShrink: 1 }}>{l.secure}</Text>
      </View>
    </View>
  );
}

export interface DonationCompactProps extends ViewProps {
  /** Preset amounts; the first three are shown. */
  amounts?: number[];
  /** Selected preset. */
  amount: number;
  /** Called when a chip is chosen. */
  onAmountChange: (amount: number) => void;
  /** @default "$" */
  currencySymbol?: string;
  /** Give label repeating amount and frequency: "Give $50 monthly". */
  giveLabel: string;
  /** Called by Give. */
  onGive: () => void;
  /** One sentence under the chips. */
  impactText?: string;
  /** Spinner and busy state. @default false */
  submitting?: boolean;
  /** @default "Processing…" */
  processingLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Compact giving row for sidebars and the end of articles: three chips and a Give button. */
export function DonationCompact({ amounts = [25, 50, 100], amount, onAmountChange, currencySymbol = '$', giveLabel, onGive, impactText, submitting = false, processingLabel = 'Processing…', style, ...rest }: DonationCompactProps) {
  const { spacing, isDark } = useTheme();
  return (
    <View {...rest} style={[{ gap: spacing['space-2'] }, style]}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing['space-2'] }}>
        {amounts.slice(0, 3).map((a) => <AmountChip key={a} compact label={`${currencySymbol}${a}`} selected={amount === a} onPress={() => onAmountChange(a)} minWidth={64} disabled={submitting} />)}
        <View style={{ marginStart: 'auto' }}>
          <Button loading={submitting} onPress={onGive}>{submitting ? processingLabel : giveLabel}</Button>
        </View>
      </View>
      {impactText ? <Text variant="body-sm" accessibilityLiveRegion="polite" style={{ fontSize: 14, color: isDark ? '#7fa6f7' : '#0455ad' }}>{impactText}</Text> : null}
    </View>
  );
}

export interface DonationGoalProps extends ViewProps {
  /** Campaign title: "Year-end Bible drive". */
  title: string;
  /** Time left: "18 days left". */
  meta?: string;
  /** Amount raised, in the same unit as `goal`. */
  raised: number;
  /** Real target. Use only for campaigns with a real goal. */
  goal: number;
  /** Bold part of the summary: "$18,400". */
  raisedLabel: string;
  /** Rest of the summary: " of $25,000 raised · 74%". Repeats the numbers in text. */
  summaryText: string;
  /** Accessible name of the progress bar. @default "Raised toward goal" */
  progressLabel?: string;
  /** On a dark panel: white 14% track and white text. @default false */
  onDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Goal progress: title row, a 10dp pill bar filled with the signature line gradient (never Horizon Blue alone) and a text sum. */
export function DonationGoal({ title, meta, raised, goal, raisedLabel, summaryText, progressLabel = 'Raised toward goal', onDark = false, style, ...rest }: DonationGoalProps) {
  const { colors, radius, spacing, isDark } = useTheme();
  const [w, setW] = useState(0);
  const id = useId().replace(/:/g, '');
  const dark = onDark || isDark;
  const pct = goal > 0 ? Math.min(Math.max(raised / goal, 0), 1) : 0;
  const line = gradient['gradient-line'];
  const ink = dark ? '#ffffff' : colors.text;
  return (
    <View {...rest} style={[{ gap: spacing['space-2'] }, style]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing['space-3'] }}>
        <Text variant="web-h4" style={{ fontSize: 17, lineHeight: 22, color: ink }}>{title}</Text>
        {meta ? <Text variant="body-sm" style={{ fontSize: 14, color: dark ? 'rgba(255,255,255,0.68)' : colors.textTertiary }}>{meta}</Text> : null}
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel={progressLabel}
        accessibilityValue={{ min: 0, max: goal, now: raised, text: `${raisedLabel}${summaryText}` }}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        style={{ height: 10, borderRadius: radius['radius-pill'], overflow: 'hidden', backgroundColor: dark ? 'rgba(255,255,255,0.14)' : colors.surfaceMuted }}
      >
        {w > 0 ? (
          <Svg width={w} height={10}>
            <Defs>
              <LinearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
                {line.colors.map((c, i) => <Stop key={c} offset={line.locations[i]} stopColor={c} />)}
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={w * pct} height={10} rx={5} fill={`url(#g${id})`} />
          </Svg>
        ) : null}
      </View>
      <Text variant="web-small" style={{ fontSize: 15, fontVariant: ['tabular-nums'], color: dark ? 'rgba(255,255,255,0.75)' : colors.textBody }}>
        <Text variant="web-label" style={{ fontSize: 15, color: ink }}>{raisedLabel}</Text>
        {summaryText}
      </Text>
    </View>
  );
}
