import Module, { register } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
register('./rnw-hooks.mjs', import.meta.url);
// CommonJS requires need the same remap.
const stub = resolve(dirname(fileURLToPath(import.meta.url)), 'svg-stub.mjs');
const orig = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request === 'react-native') request = 'react-native-web';
  if (request === 'react-native-svg') return stub;
  return orig.call(this, request, ...rest);
};
