// Shared token helpers: load tokens.json, flatten, resolve {references}, parse colours and CSS lengths.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TOKENS_PATH = resolve(ROOT, 'tokens', 'tokens.json');

/** Groups whose `tokens` array holds plain name/value/usage tokens, with the category label used in generated code. */
export const TOKEN_GROUPS = [
  ['color', 'color', (t) => t.color.tokens],
  ['spacing', 'spacing', (t) => t.spacing.tokens],
  ['radius', 'radius', (t) => t.radius.tokens],
  ['shadow', 'shadow', (t) => t.shadow.tokens],
  ['gradient', 'gradient', (t) => t.gradient.tokens],
  ['layout', 'layout', (t) => t.layout.tokens],
  ['breakpoint', 'layout', (t) => t.breakpointsExtra.tokens],
  ['tracking', 'tracking', (t) => t.tracking.tokens],
  ['blur', 'blur', (t) => t.blur.tokens],
  ['zIndex', 'zIndex', (t) => t.zIndex.tokens],
  ['duration', 'motion', (t) => t.motion.duration],
  ['easing', 'motion', (t) => t.motion.easing],
  ['opacity', 'opacity', (t) => t.opacity.tokens],
  ['size', 'size', (t) => t.size.tokens],
];

export function loadTokens() {
  return JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
}

/** Flat list: { name, raw, value (references resolved), usage, group, category } in source order. */
export function flatten(t) {
  const list = [];
  for (const [group, category, pick] of TOKEN_GROUPS) {
    for (const tok of pick(t)) list.push({ name: tok.name, raw: tok.value, usage: tok.usage, group, category });
  }
  const byName = new Map();
  for (const tok of list) {
    if (byName.has(tok.name)) throw new Error(`Duplicate token name: ${tok.name}`);
    byName.set(tok.name, tok);
  }
  const resolveRef = (v, seen = []) => {
    const m = /^\{([a-z0-9-]+)\}$/.exec(v);
    if (!m) return v;
    if (seen.includes(m[1])) throw new Error(`Circular token reference: ${[...seen, m[1]].join(' -> ')}`);
    const target = byName.get(m[1]);
    if (!target) throw new Error(`Unknown token reference {${m[1]}}`);
    return resolveRef(target.raw, [...seen, m[1]]);
  };
  for (const tok of list) tok.value = resolveRef(tok.raw);
  // Gradients may reference colour tokens by literal value already; nothing else to resolve.
  return list;
}

export const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
export const pascal = (s) => camel(s).replace(/^./, (c) => c.toUpperCase());

/** Parse #rgb, #rrggbb or rgba()/rgb() into { r, g, b, a } (0-255, alpha 0-1). Returns null if not a colour. */
export function parseColor(v) {
  v = String(v).trim();
  let m = /^#([0-9a-f]{6})$/i.exec(v);
  if (m) {
    const n = parseInt(m[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  m = /^#([0-9a-f]{3})$/i.exec(v);
  if (m) {
    const [r, g, b] = m[1].split('').map((c) => parseInt(c + c, 16));
    return { r, g, b, a: 1 };
  }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(v);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  return null;
}

export const px = (v) => {
  const m = /^(-?[\d.]+)px$/.exec(String(v).trim());
  return m ? parseFloat(m[1]) : null;
};
export const ms = (v) => {
  const m = /^([\d.]+)ms$/.exec(String(v).trim());
  return m ? parseFloat(m[1]) : null;
};
export const em = (v) => {
  const m = /^(-?[\d.]+)em$/.exec(String(v).trim());
  return m ? parseFloat(m[1]) : null;
};

/** Parse a CSS box-shadow with ONE layer: "0 8px 30px -12px rgba(0,0,0,0.08)" -> { x, y, blur, spread, color } */
export function parseShadow(v) {
  const m = /^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(?:(-?[\d.]+)(?:px)?\s+)?(rgba?\([^)]*\)|#[0-9a-f]{3,6})$/i.exec(String(v).trim());
  if (!m) return null;
  return { x: +m[1], y: +m[2], blur: +m[3], spread: m[4] === undefined ? 0 : +m[4], color: parseColor(m[5]) };
}

/** Parse "cubic-bezier(a, b, c, d)" -> [a,b,c,d], or null. */
export function parseBezier(v) {
  const m = /^cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)$/.exec(String(v).trim());
  return m ? m.slice(1, 5).map(Number) : null;
}

/** Parse a linear-gradient into { angle, stops: [{ color, pos }] } for native generators. */
export function parseGradient(v) {
  const m = /^linear-gradient\(\s*(-?[\d.]+)deg\s*,\s*(.+)\)$/.exec(String(v).trim());
  if (!m) return null;
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of m[2]) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; } else cur += ch;
  }
  parts.push(cur.trim());
  const stops = parts.map((p, i) => {
    const sm = /^(.*?)(?:\s+([\d.]+)%)?$/.exec(p);
    const color = parseColor(sm[1].trim());
    const pos = sm[2] === undefined ? i / Math.max(parts.length - 1, 1) : +sm[2] / 100;
    return { color, pos };
  });
  return { angle: +m[1], stops };
}

/** WCAG relative luminance and contrast ratio. Colours with alpha are composited over `bg` first. */
export function composite(fg, bg) {
  const a = fg.a;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}
export function luminance({ r, g, b }) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrast(fg, bg) {
  const front = fg.a < 1 ? composite(fg, bg) : fg;
  const l1 = luminance(front), l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
