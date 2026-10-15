import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { color } from '@ism/tokens/native';
import { Text } from '../Text';
import { useTheme } from '../theme';
import { useScript } from './internal';

export interface StatDelta {
  /** `up` is green with an up arrow, `down` is red with a down arrow. */
  direction: 'up' | 'down';
  /** The change with its sign: "+3", "-2%". */
  value: string;
  /** The period, always given: "this quarter", "vs last year". */
  period?: string;
  /** Phrase that reads well aloud ("up 3 this quarter"). Used as the accessible name of the change. */
  spoken?: string;
}

export interface StatTileProps extends Omit<ViewProps, 'children'> {
  /** The big number, abbreviated if large (1.2M). */
  value: string | number;
  /** Short label, three or four words. */
  label: string;
  /** Optional change since a previous period. */
  delta?: StatDelta;
  /** Optional sparkline series (at least two numbers). Decorative. */
  spark?: number[];
  /** Grey sparkline for a flat or falling series. @default false */
  sparkFlat?: boolean;
  /** Dark tile (4% white fill, 14% white border). Do not mix light and dark tiles in one row. Defaults to the theme scheme. */
  dark?: boolean;
  /** Mark the figure as a sample (invented, for mock-ups): shows this caption in small italic under the label, e.g. "sample". */
  sampleLabel?: string;
  /** Extra content under the tile. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function sparkGeometry(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i): [number, number] => [2 + (i * 114) / (values.length - 1), 30 - ((v - min) / span) * 24]);
  return { points: pts.map(([x, y]) => `${x.toFixed(0)},${y.toFixed(0)}`).join(' '), last: pts[pts.length - 1] };
}

/** Metric tile: one big tabular number, a label, an optional change with arrow and period, and an optional sparkline. */
export function StatTile({ value, label, delta, spark, sparkFlat = false, dark, sampleLabel, children, style, accessibilityLabel, ...rest }: StatTileProps) {
  const theme = useTheme();
  const s = useScript();
  const isDark = dark ?? theme.isDark;
  const sp = spark && spark.length > 1 ? sparkGeometry(spark) : null;
  const ink = isDark ? '#ffffff' : '#000000';
  const sub = isDark ? color['text-secondary-dark'] : color['gray-700'];
  const faint = isDark ? color['text-tertiary-dark'] : color['gray-600'];
  const deltaColor = delta ? (delta.direction === 'up' ? (isDark ? color['success-on-dark'] : color['success']) : isDark ? color['error-on-dark'] : color['error']) : ink;
  const sparkColor = sparkFlat ? faint : isDark ? color['blue-on-dark'] : color['horizon-blue'];
  const spoken = delta ? delta.spoken ?? [delta.direction === 'up' ? delta.value : delta.value, delta.period].filter(Boolean).join(' ') : undefined;
  const summary = accessibilityLabel ?? [String(value), label, spoken].filter(Boolean).join(', ');
  return (
    <View
      accessible
      accessibilityLabel={summary}
      style={[{ gap: 10, padding: theme.spacing['space-5'], borderRadius: theme.radius['radius-lg'], borderWidth: 1, minWidth: 0, backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : theme.colors.surface, borderColor: isDark ? 'rgba(255,255,255,0.14)' : color['gray-200'] }, style]}
      {...rest}
    >
      <Text variant="web-h1" numberOfLines={1} adjustsFontSizeToFit style={[{ fontSize: 44, lineHeight: 48, color: ink, fontVariant: ['tabular-nums'] }, s.tracking(-0.03, 44)]}>{String(value)}</Text>
      <Text variant="web-small" style={{ color: sub }}>{label}</Text>
      {sampleLabel ? <Text variant="body-sm" style={{ fontSize: 12, fontStyle: s.latin ? 'italic' : 'normal', color: faint }}>{sampleLabel}</Text> : null}
      {delta || sp ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: theme.spacing['space-3'], marginTop: 6 }}>
          {delta ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={deltaColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" accessibilityElementsHidden importantForAccessibility="no">
                <Path d={delta.direction === 'up' ? 'M12 19V5M6 11l6-6 6 6' : 'M12 5v14M6 13l6 6 6-6'} />
              </Svg>
              <Text variant="web-label" style={{ fontSize: 13, color: deltaColor }}>
                {delta.value}
                {delta.period ? <Text variant="web-small" style={{ fontSize: 13, color: faint }}>{` ${delta.period}`}</Text> : null}
              </Text>
            </View>
          ) : null}
          {sp ? (
            <Svg width={88} height={32} viewBox="0 0 120 36" preserveAspectRatio="none" fill="none" accessibilityElementsHidden importantForAccessibility="no">
              <Polyline points={sp.points} stroke={sparkColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Circle cx={sp.last[0]} cy={sp.last[1]} r={3} fill={sparkColor} />
            </Svg>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}
