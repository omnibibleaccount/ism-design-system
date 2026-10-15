#!/usr/bin/env node
// Writes packages/tokens/tokens.dtcg.json: the tokens in W3C Design Tokens (DTCG) format, for Figma (Tokens Studio, Variables import
// plugins), Style Dictionary, Penpot, Supernova and any other tool that reads DTCG. Generated from tokens/tokens.json. Do not edit by hand.
// Usage: node scripts/build-dtcg.mjs [--check]
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, loadTokens, parseColor } from './lib/tokens.mjs';

const OUT = resolve(ROOT, 'packages/tokens/tokens.dtcg.json');
const t = loadTokens();
const hex2 = (n) => Math.round(n).toString(16).padStart(2, '0');
const toHex = (v) => { const c = parseColor(v); if (!c) return v; return `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}${c.a < 1 ? hex2(c.a * 255) : ''}`; };
const px = (v) => (/^-?[\d.]+px$/.test(v) ? v : null);
const num = (v) => (/^-?[\d.]+$/.test(String(v)) ? Number(v) : null);
const alias = (v, path) => { const m = /^\{([a-z0-9-]+)\}$/.exec(String(v)); return m ? `{${path(m[1])}}` : null; };
const owner = new Map(); // token name -> dotted path, filled before conversion so aliases resolve
const reg = (group, list) => list.forEach((x) => owner.set(x.name, `${group}.${x.name}`));
reg('color', t.color.tokens); reg('spacing', t.spacing.tokens); reg('radius', t.radius.tokens); reg('shadow', t.shadow.tokens);
reg('gradient', t.gradient.tokens); reg('layout', t.layout.tokens); reg('layout', t.breakpointsExtra.tokens); reg('tracking', t.tracking.tokens);
reg('blur', t.blur.tokens); reg('zIndex', t.zIndex.tokens); reg('motion.duration', t.motion.duration); reg('motion.easing', t.motion.easing);
reg('opacity', t.opacity.tokens); reg('size', t.size.tokens);
const A = (v) => alias(v, (n) => owner.get(n) ?? n);

function splitTop(s, sep = ',') { const out = []; let d = 0, cur = ''; for (const ch of s) { if (ch === '(') d++; if (ch === ')') d--; if (ch === sep && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; }
function parseShadow(s) {
  const layers = splitTop(s).map((layer) => {
    const inset = /\binset\b/.test(layer);
    const rest = layer.replace(/\binset\b/, '').trim();
    const colorM = /(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8})/.exec(rest);
    if (!colorM) return null;
    const nums = rest.replace(colorM[0], '').trim().split(/\s+/).filter(Boolean);
    if (nums.length < 2 || nums.length > 4 || nums.some((n) => !/^-?[\d.]+(px)?$/.test(n))) return null;
    const d = (n) => `${parseFloat(n)}px`;
    return { color: toHex(colorM[0]), offsetX: d(nums[0]), offsetY: d(nums[1]), blur: d(nums[2] ?? '0'), spread: d(nums[3] ?? '0'), ...(inset ? { inset: true } : {}) };
  });
  return layers.every(Boolean) ? (layers.length === 1 ? layers[0] : layers) : null;
}
const EASE = { ease: [0.25, 0.1, 0.25, 1], linear: [0, 0, 1, 1], 'ease-in': [0.42, 0, 1, 1], 'ease-out': [0, 0, 0.58, 1], 'ease-in-out': [0.42, 0, 0.58, 1] };
function parseEase(v) { if (EASE[v]) return EASE[v]; const m = /^cubic-bezier\(([^)]*)\)$/.exec(v); return m ? m[1].split(',').map(Number) : null; }

const tok = (type, value, desc, extra = {}) => ({ $type: type, $value: value, ...(desc ? { $description: desc } : {}), ...extra });
const group = (list, fn) => Object.fromEntries(list.map((x) => [x.name, fn(x)]));
const dim = (x) => tok('dimension', A(x.value) ?? px(x.value) ?? x.value, x.usage);

const out = {
  $description: 'ISM Design System tokens in DTCG format. Generated from tokens/tokens.json (version ' + t.version + '). Do not edit by hand.',
  color: group(t.color.tokens, (x) => tok('color', A(x.value) ?? toHex(x.value), x.usage)),
  spacing: group(t.spacing.tokens, dim),
  radius: group(t.radius.tokens, (x) => tok('dimension', A(x.value) ?? (px(x.value) ?? (x.value === '999px' || /pill/.test(x.name) ? '9999px' : x.value)), x.usage)),
  shadow: group(t.shadow.tokens, (x) => { const v = parseShadow(x.value); return v ? tok('shadow', v, x.usage) : tok('string', x.value, x.usage, { $extensions: { 'ism.note': 'Composite value kept as CSS string' } }); }),
  gradient: group(t.gradient.tokens, (x) => tok('string', x.value, x.usage, { $extensions: { 'ism.kind': 'css-gradient' } })),
  layout: group([...t.layout.tokens, ...t.breakpointsExtra.tokens], (x) => (px(x.value) ? tok('dimension', x.value, x.usage) : num(x.value) !== null ? tok('number', num(x.value), x.usage) : tok('string', x.value, x.usage))),
  tracking: group(t.tracking.tokens, (x) => tok('string', x.value, x.usage, { $extensions: { 'ism.unit': 'em' } })),
  blur: group(t.blur.tokens, dim),
  zIndex: group(t.zIndex.tokens, (x) => tok('number', Number(x.value), x.usage)),
  motion: {
    duration: group(t.motion.duration, (x) => tok('duration', x.value, x.usage)),
    easing: group(t.motion.easing, (x) => { const b = parseEase(x.value); return b ? tok('cubicBezier', b, x.usage, { $extensions: { 'ism.css': x.value } }) : tok('string', x.value, x.usage); }),
  },
  opacity: group(t.opacity.tokens, (x) => (num(x.value) !== null ? tok('number', num(x.value), x.usage) : tok('color', toHex(x.value), x.usage, { $extensions: { 'ism.kind': 'scrim' } }))),
  size: group(t.size.tokens, dim),
  font: {
    family: Object.fromEntries(Object.entries(t.type.families).map(([k, v]) => [k, tok('fontFamily', splitTop(v).map((f) => f.replace(/^"|"$/g, '')))])),
  },
  typography: Object.fromEntries(t.type.groups.map((g) => [g.name.toLowerCase().replace(/\s+/g, '-'), Object.fromEntries(g.styles.map((s) => [s.name, tok('typography', {
    fontFamily: `{font.family.${s.family ?? g.family}}`, fontSize: s.fontSize, fontWeight: s.fontWeight, lineHeight: s.lineHeight, ...(s.letterSpacing ? { letterSpacing: s.letterSpacing } : {}),
  }, s.usage, s.sample ? { $extensions: { 'ism.sample': s.sample } } : {})]))])),
  script: Object.fromEntries(t.script.scripts.map((s) => [s.id, {
    lineHeightBody: tok('number', s.lineHeightBody, `Body line height for ${s.languages.join(', ')}. Status: ${s.status}.`),
    lineHeightHeading: tok('number', s.lineHeightHeading, `Heading line height for ${s.languages.join(', ')}.`),
  }])),
};
const text = JSON.stringify(out, null, 2) + '\n';
if (process.argv.includes('--check')) {
  let cur = ''; try { cur = readFileSync(OUT, 'utf8'); } catch { /* missing */ }
  if (cur !== text) { console.error('STALE: packages/tokens/tokens.dtcg.json. Run: node scripts/build-dtcg.mjs'); process.exit(1); }
  console.log('dtcg: up to date'); process.exit(0);
}
writeFileSync(OUT, text);
const n = JSON.stringify(out).match(/"\$value"/g).length;
console.log(`dtcg: wrote ${n} tokens to packages/tokens/tokens.dtcg.json`);
