#!/usr/bin/env node
// Copies the static font files to every native package so they cannot drift. Run after `python3 scripts/build-static-fonts.py`.
//   packages/react-native/fonts/                                   (also done by that package's build)
//   packages/ios/Sources/ISMDesignSystem/Resources/Fonts/
//   packages/android/ism-design-system/src/main/res/font/           (inter_semibold.ttf style names)
import { readdirSync, copyFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './lib/tokens.mjs';
const CHECK = process.argv.includes('--check');
const src = resolve(ROOT, 'packages/web/assets/fonts-static');
const snake = (f) => f.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
const targets = [
  ['packages/react-native/fonts', (f) => f],
  ['packages/ios/Sources/ISMDesignSystem/Resources/Fonts', (f) => f],
  ['packages/android/ism-design-system/src/main/res/font', (f) => snake(f.replace(/\.ttf$/, '')) + '.ttf'],
];
let stale = 0;
for (const [dir, rename] of targets) {
  for (const f of readdirSync(src).filter((x) => x.endsWith('.ttf'))) {
    const dest = resolve(ROOT, dir, rename(f));
    if (CHECK) { if (!existsSync(dest) || !readFileSync(dest).equals(readFileSync(resolve(src, f)))) { console.error(`STALE font: ${dir}/${rename(f)}`); stale++; } continue; }
    mkdirSync(resolve(ROOT, dir), { recursive: true });
    copyFileSync(resolve(src, f), dest);
  }
}
if (CHECK) process.exit(stale ? 1 : 0);
console.log('native fonts synced');
