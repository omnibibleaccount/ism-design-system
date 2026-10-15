// Renders every component example with react-native-web on the server (no device needed) and checks it does not throw.
// Each component adds test/examples/<Name>.tsx with a default export `Example`. This catches runtime errors and obvious
// output problems; it does NOT replace testing on a device or simulator.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../..');
const platforms = JSON.parse(readFileSync(resolve(root, 'specs/platforms.json'), 'utf8')) as { reactNative: string[] };
const names = readdirSync(resolve(here, 'examples')).filter((f) => f.endsWith('.tsx')).map((f) => f.replace(/\.tsx$/, '')).sort();

test('every React Native component in specs/platforms.json has an example', () => {
  const missing = platforms.reactNative.filter((n) => !names.includes(n));
  assert.deepEqual(missing, [], `missing test/examples/<Name>.tsx for: ${missing.join(', ')}`);
});

for (const name of names) {
  test(`${name} renders`, async () => {
    const mod = await import(`./examples/${name}.tsx`);
    const html = renderToStaticMarkup(createElement(mod.default));
    assert.ok(html.length > 0, 'renders something');
    assert.ok(!/\[object Object\]|NaN/.test(html), 'no [object Object] or NaN in output');
  });
}
