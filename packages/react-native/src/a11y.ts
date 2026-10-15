import type { ViewStyle } from 'react-native';
import { size } from '@ism/tokens/native';

/** Minimum touch target in dp (44, same as web --tap-target). */
export const TAP_TARGET = 44;

/** hitSlop that grows a smaller visual to at least 44dp on each side. */
export function hitSlopFor(width: number, height: number) {
  const x = Math.max(0, Math.ceil((TAP_TARGET - width) / 2));
  const y = Math.max(0, Math.ceil((TAP_TARGET - height) / 2));
  return { top: y, bottom: y, left: x, right: x };
}

/** Style that guarantees a 44dp target without changing the visual when content is smaller. */
export const minTarget: ViewStyle = { minHeight: size['control-md'], minWidth: size['control-md'] };
