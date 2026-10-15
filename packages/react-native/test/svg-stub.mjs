// Test stand-in for react-native-svg: renders plain SVG elements so server rendering works in Node.
import { createElement } from 'react';
const make = (tag) => {
  const C = (props) => {
    // eslint-disable-next-line no-unused-vars
    const { children, style, accessibilityLabel, accessible, accessibilityElementsHidden, importantForAccessibility, accessibilityRole, ...rest } = props;
    return createElement(tag, rest, children);
  };
  C.displayName = tag;
  return C;
};
const Svg = make('svg');
export default Svg;
export const Path = make('path');
export const Circle = make('circle');
export const Rect = make('rect');
export const G = make('g');
export const Line = make('line');
export const Defs = make('defs');
export const LinearGradient = make('linearGradient');
export const Stop = make('stop');
export const ClipPath = make('clipPath');
export const Polygon = make('polygon');
export const Polyline = make('polyline');
export const Ellipse = make('ellipse');
export const Text = make('text');
export const SvgXml = make('svg');
export { Svg };
