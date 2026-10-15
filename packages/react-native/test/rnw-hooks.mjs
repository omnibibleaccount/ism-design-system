// Node module-resolution hook: "react-native" resolves to react-native-web and "react-native-svg" to a plain-SVG stub,
// so components can be rendered on the server without a device.
import { pathToFileURL } from 'node:url';
import { resolve as resolvePath, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const stub = pathToFileURL(resolvePath(dirname(fileURLToPath(import.meta.url)), 'svg-stub.mjs')).href;
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'react-native') return nextResolve('react-native-web', context);
  if (specifier === 'react-native-svg') return { url: stub, shortCircuit: true };
  return nextResolve(specifier, context);
}
