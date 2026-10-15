import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { lintText, deriveData } from '../../scripts/lint-usage.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const data = deriveData();
const run = (name) => lintText(readFileSync(join(here, 'fixtures', name), 'utf8'), name, data);
const rules = (f) => new Set(f.map((x) => x.rule));

test('good fixture passes with zero findings', () => {
  assert.deepEqual(run('good.html'), []);
});

test('bad.html trips every drift rule it contains', () => {
  const r = rules(run('bad.html'));
  for (const id of ['hardcoded-color', 'raw-radius', 'raw-shadow', 'numeric-z-index', 'off-palette-font', 'raw-gradient',
    'unknown-token', 'multiple-primary', 'unknown-class', 'vague-button-label', 'button-exclamation',
    'tailwind-palette', 'emoji', 'white-logo', 'img-alt', 'html-lang', 'pill-eyebrow', 'off-scale-spacing', 'raw-duration']) {
    assert.ok(r.has(id), `expected rule ${id} to fire; got ${[...r].join(', ')}`);
  }
});

test('RTL language without dir is an error', () => {
  assert.ok(rules(run('bad-rtl.html')).has('rtl-dir'));
});

test('restyling system classes warns (component-override)', () => {
  const f = run('override.html').filter((x) => x.rule === 'component-override');
  assert.ok(f.length >= 3, `expected .ap-tab, .sx-reader and inline overrides; got ${f.map((x) => x.message).join(' | ')}`);
  assert.ok(f.every((x) => x.severity === 'warn'));
  assert.ok(f.some((x) => /\.ap-tab\b/.test(x.message)) && f.some((x) => /\.sx-reader\b/.test(x.message)));
});

test('layout-only CSS and own classes do not trigger component-override', () => {
  assert.deepEqual(run('override-clean.html'), []);
});

test('JSX style objects and Button components are checked', () => {
  const r = rules(run('bad.tsx'));
  for (const id of ['hardcoded-color', 'numeric-z-index', 'off-palette-font', 'button-exclamation', 'multiple-primary']) assert.ok(r.has(id), id);
});

test('every real component README snippet is clean', async () => {
  const { lintPaths } = await import('../../scripts/lint-usage.mjs');
  const { findings } = lintPaths([join(here, '../../components')], data, { md: true });
  assert.deepEqual(findings.filter((f) => f.severity === 'error'), []);
});
