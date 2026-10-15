import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const css = (f) => readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../css', f), 'utf8');

test('ism.css bundles tokens, components, states and scripts', () => {
  const c = css('ism.css');
  for (const marker of ['--horizon-blue:', '.btn-primary', '.btn-primary:active', 'aria-busy', ':lang(am)', '--z-toast']) assert.ok(c.includes(marker), `ism.css contains ${marker}`);
});
test('rtl.css contains only rtl rules and mirrors the skip link', () => {
  const r = css('rtl.css');
  assert.ok(r.includes('[dir="rtl"] .skip'));
  assert.ok(!r.includes('@font-face') && !r.includes('@import'));
  assert.ok(r.length < 40000, 'rtl.css stays small');
});
test('no raw z-index above the skip layer', () => {
  const nums = [...css('bundle.css').matchAll(/z-index:(\d+)/g)].map((m) => +m[1]);
  assert.ok(nums.every((n) => n < 10), `only local layering literals remain: ${nums.join(',')}`);
});
test('scripts.css removes letter-spacing for non-Latin scripts', () => {
  const s = css('scripts.css');
  assert.match(s, /letter-spacing:\s*0\s*!important/);
});
