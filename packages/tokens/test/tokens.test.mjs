import test from 'node:test';
import assert from 'node:assert/strict';
import { color, spacing, zIndex, typography, scriptFor, isRtl, directionFor, lineHeightFor, cssVar, tokens } from '../dist/index.js';
import { nativeTokens, shadow } from '../dist/native.js';
import flat from '../tokens.flat.json' with { type: 'json' };

test('core brand values', () => {
  assert.equal(color['horizon-blue'], '#046de3');
  assert.equal(color['action-primary'], '#046de3'); // reference resolved
  assert.equal(spacing['space-5'], '24px');
  assert.equal(flat['horizon-blue-dim'], '#0455ad');
});

test('z-index scale is strictly ordered and toast sits above modal', () => {
  const order = ['z-dropdown', 'z-sticky', 'z-header', 'z-scrim', 'z-drawer', 'z-cookie', 'z-float', 'z-modal', 'z-toast', 'z-tooltip', 'z-skip'];
  const values = order.map((n) => Number(zIndex[n]));
  assert.deepEqual(values, [...values].sort((a, b) => a - b));
  assert.equal(new Set(values).size, values.length);
});

test('web h1 is bold 700, others 600', () => {
  assert.equal(typography['web-h1'].fontWeight, 700);
  assert.equal(typography['web-h2'].fontWeight, 600);
});

test('script helpers', () => {
  assert.equal(scriptFor('am-ET').id, 'ethiopic');
  assert.equal(scriptFor('my').id, 'myanmar');
  assert.equal(scriptFor('en').id, 'latin');
  assert.equal(scriptFor('xx').id, 'latin');
  for (const l of ['ar', 'fa', 'ur', 'ur-PK']) assert.equal(isRtl(l), true, l);
  for (const l of ['en', 'am', 'my', 'sw']) assert.equal(isRtl(l), false, l);
  assert.equal(directionFor('fa'), 'rtl');
  assert.ok(lineHeightFor('my') > lineHeightFor('en'));
  assert.ok(lineHeightFor('ar', 'heading') >= 1.3);
});

test('cssVar', () => assert.equal(cssVar('gray-700'), 'var(--gray-700)'));

test('native tokens are numeric', () => {
  assert.equal(nativeTokens.spacing['space-4'], 16);
  assert.equal(nativeTokens.radius['radius-pill'], 999);
  assert.equal(nativeTokens.duration['duration-fast'], 150);
  assert.equal(shadow['shadow-card-light'].shadowOffset.height, 8);
  assert.equal(nativeTokens.typography['web-h1'].lineHeight, 70.4);
  assert.equal(typeof nativeTokens.gradient['gradient-signature'].colors[0], 'string');
});

test('every token group is exported', () => {
  for (const k of ['color', 'spacing', 'radius', 'shadow', 'gradient', 'layout', 'tracking', 'blur', 'zIndex', 'duration', 'easing', 'opacity', 'size', 'typography', 'scripts']) {
    assert.ok(k in tokens, k);
  }
});
