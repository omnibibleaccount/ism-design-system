// Renders every component's example on the server and checks the markup uses classes that exist in the CSS.
// Each component adds test/examples/<Name>.tsx with a default export that renders its README examples.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const css = ['bundle.css', 'states.css'].map((f) => readFileSync(resolve(root, 'packages/web/css', f), 'utf8')).join('\n');
const specs = JSON.parse(readFileSync(resolve(root, 'specs/all.json'), 'utf8')).components as Array<{ name: string; cssClasses: string[] }>;
const names = readdirSync(resolve(here, 'examples')).filter((f) => f.endsWith('.tsx')).map((f) => f.replace(/\.tsx$/, '')).sort();

test('every component has an example', () => {
  const missing = specs.map((s) => s.name).filter((n) => !names.includes(n));
  assert.deepEqual(missing, [], `missing test/examples/<Name>.tsx for: ${missing.join(', ')}`);
});

for (const name of names) {
  test(`${name} renders on the server with known classes`, async () => {
    const mod = await import(`./examples/${name}.tsx`);
    const html = renderToStaticMarkup(createElement(mod.default));
    assert.ok(html.length > 0, 'renders something');
    assert.ok(!/undefined|\[object Object\]|NaN/.test(html), `suspicious output: ${html.match(/.{0,30}(undefined|\[object Object\]|NaN).{0,30}/)?.[0]}`);
    const used = new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean));
    const unknown = [...used].filter((c) => !new RegExp(`\\.${c.replace(/[-]/g, '\\-')}(?![a-z0-9_-])`).test(css));
    // allow state/utility hooks that are documented but may be defined elsewhere
    const tolerated = new Set(['is-pressed', 'is-loading', 'is-error', 'is-focus', 'is-hover', 'is-disabled']);
    const bad = unknown.filter((c) => !tolerated.has(c));
    assert.deepEqual(bad, [], `${name} uses classes not in bundle.css/states.css: ${bad.join(' ')}`);
  });
}
