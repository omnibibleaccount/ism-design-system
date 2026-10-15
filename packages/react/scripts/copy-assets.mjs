// Copies the CSS and the assets it references into this package so `@ism/ui/css` resolves fonts and images
// (css/ism.css refers to ../assets/fonts/...). Only the one image the CSS references is copied; serve the rest of the imagery from your own CDN or @ism/web.
import { cpSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const web = resolve(root, '../web');
mkdirSync(resolve(root, 'css'), { recursive: true });
for (const f of ['ism.css', 'rtl.css']) copyFileSync(resolve(web, 'css', f), resolve(root, 'css', f));
for (const d of ['fonts', 'icons', 'ui-icons', 'logos', 'patterns']) cpSync(resolve(web, 'assets', d), resolve(root, 'assets', d), { recursive: true });
mkdirSync(resolve(root, 'assets/imagery'), { recursive: true });
copyFileSync(resolve(web, 'assets/imagery/leather-black.jpg'), resolve(root, 'assets/imagery/leather-black.jpg')); // the only image the CSS references
console.log('react: css and assets copied');
