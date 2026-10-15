#!/usr/bin/env node
/**
 * Builds the hosted copy of the design system into site/ (gitignored), for GitHub Pages.
 * Every file an LLM or design tool needs, at stable URLs, with no Git LFS and open CORS:
 *   tokens/ rules/ specs/ components/<Name>/{README.md,spec.json} previews/ screenshots/
 *   css/ assets/ lint/ prompts/ AGENTS.md llms.txt manifest.json index.html
 * Base URL: SITE_BASE env (default https://omnibibleaccount.github.io/ism-design-system).
 * Run build:previews, build:prompts and lint-data first (npm run build:site does).
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = (process.env.SITE_BASE || 'https://omnibibleaccount.github.io/ism-design-system').replace(/\/$/, '');
const OUT = join(ROOT, 'site');
const p = (...a) => join(ROOT, ...a);
const need = (f) => { if (!existsSync(p(f))) { console.error(`site: missing ${f}; run the build first (npm run build:site)`); process.exit(1); } };

for (const f of ['tokens/tokens.json', 'packages/tokens/tokens.dtcg.json', 'rules/rules.json', 'specs/all.json', 'specs/lint-data.json',
  'docs/previews/Button.html', 'docs/screenshots/Button.png', 'prompts/ism-system-prompt.md', 'packages/web/css/ism.css']) need(f);

// LFS pointer guard: refuse to publish pointer stubs instead of real binaries
const isPointer = (f) => { const b = readFileSync(f); return b.length < 200 && b.toString('utf8').startsWith('version https://git-lfs'); };
const guard = [];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const cp = (from, to) => { mkdirSync(dirname(join(OUT, to)), { recursive: true }); cpSync(p(from), join(OUT, to), { recursive: true }); };

cp('tokens/tokens.json', 'tokens/tokens.json');
cp('packages/tokens/tokens.dtcg.json', 'tokens/tokens.dtcg.json');
cp('packages/tokens/tokens.flat.json', 'tokens/tokens.flat.json');
cp('rules', 'rules');
cp('specs', 'specs');
cp('docs/screenshots', 'screenshots');
cp('prompts', 'prompts');
cp('AGENTS.md', 'AGENTS.md');
cp('scripts/lint-usage.mjs', 'lint/lint-usage.mjs');
cp('specs/lint-data.json', 'lint/lint-data.json');
// css + assets keep the packages/web layout so url(../assets/...) in ism.css keeps working
for (const f of readdirSync(p('packages/web/css'))) cp(`packages/web/css/${f}`, `css/${f}`);
cp('packages/web/assets', 'assets');
// the lint script derives data from the repo; hosted copy reads lint-data.json beside it
const lintPath = join(OUT, 'lint/lint-usage.mjs');
writeFileSync(lintPath, readFileSync(lintPath, 'utf8').replace("const p = join(REPO, 'specs/lint-data.json');", "const p = join(HERE, 'lint-data.json');"));

for (const name of readdirSync(p('components'))) {
  if (!statSync(p('components', name)).isDirectory()) continue;
  for (const f of ['README.md', 'spec.json']) if (existsSync(p('components', name, f))) cp(`components/${name}/${f}`, `components/${name}/${f}`);
}
// standalone previews, rewritten for the site layout
mkdirSync(join(OUT, 'previews/vendor'), { recursive: true });
for (const f of readdirSync(p('docs/previews'))) {
  const src = p('docs/previews', f);
  if (statSync(src).isDirectory()) { cpSync(src, join(OUT, 'previews', f), { recursive: true }); continue; }
  if (!f.endsWith('.html')) continue;
  const html = readFileSync(src, 'utf8').replaceAll('../../packages/web/css/', '../css/').replaceAll('../../packages/web/assets/', '../assets/').replaceAll('../../packages/web/', '../');
  writeFileSync(join(OUT, 'previews', f), html);
}

// site llms.txt with absolute URLs
const u = (x) => `${BASE}/${x}`;
const idx = JSON.parse(readFileSync(p('specs/index.json'), 'utf8'));
writeFileSync(join(OUT, 'llms.txt'), `# ISM Design System (hosted)

> Source of truth for International Scripture Ministries (ISM) and dot.Bible interfaces. Build only from these files; never invent values. Start with ${u('prompts/ism-system-prompt.md')}.

## Read first
- [System prompt](${u('prompts/ism-system-prompt.md')}): method, rules, tokens, self-check
- [AGENTS.md](${u('AGENTS.md')}): order of authority and non-negotiable rules
- [Manifest](${u('manifest.json')}): every hosted file with SHA-256

## Machine-readable
- [tokens.json](${u('tokens/tokens.json')}): all tokens (authoritative)
- [tokens.dtcg.json](${u('tokens/tokens.dtcg.json')}): W3C DTCG format for Figma, Tokens Studio, Style Dictionary
- [rules.json](${u('rules/rules.json')}): behaviour rules; prose in ${u('rules/')}*.md
- [index.json](${u('specs/index.json')}): ${idx.components.length} components; [all.json](${u('specs/all.json')}): every spec
- Component: ${u('components/<Name>/spec.json')} and ${u('components/<Name>/README.md')}

## Visual reference
- Screenshots: ${u('screenshots/<Name>.png')}; live specimens: ${u('previews/<Name>.html')}

## Code
- [ism.css](${u('css/ism.css')}), [rtl.css](${u('css/rtl.css')}); fonts and images under ${u('assets/')}
- Usage linter: [lint-usage.mjs](${u('lint/lint-usage.mjs')}) with [lint-data.json](${u('lint/lint-data.json')})
`);

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cards = idx.components.map((c) => `<a href="previews/${c.name}.html"><img loading="lazy" src="screenshots/${c.name}.png" alt="${esc(c.name)} specimen"><b>${esc(c.name)}</b><span>${esc(c.group)}</span></a>`).join('');
writeFileSync(join(OUT, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ISM Design System</title>
<link rel="stylesheet" href="css/ism.css"><style>.g{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-4)}.g a{display:flex;flex-direction:column;gap:var(--space-1);text-decoration:none;color:inherit;background:var(--white);border-radius:var(--radius-lg);box-shadow:var(--shadow-card-light);padding:var(--space-3)}.g img{width:100%;height:160px;object-fit:cover;object-position:top;border-radius:var(--radius-sm)}.g span{color:var(--gray-600);font-size:14px}</style></head>
<body><main class="wrap" style="padding-block:var(--space-7)"><p class="eyebrow">ISM Design System</p><h1 class="h1">Source of truth</h1>
<p class="lead">Hosted tokens, rules, specs, stylesheet, fonts, screenshots and linter. Start with <a href="prompts/ism-system-prompt.md">the system prompt</a>, <a href="llms.txt">llms.txt</a> or <a href="manifest.json">manifest.json</a>.</p>
<p><a href="tokens/tokens.json">tokens.json</a> · <a href="tokens/tokens.dtcg.json">tokens.dtcg.json</a> · <a href="rules/rules.json">rules.json</a> · <a href="specs/index.json">specs</a> · <a href="css/ism.css">ism.css</a> · <a href="lint/lint-usage.mjs">linter</a></p>
<div class="g" style="margin-top:var(--space-6)">${cards}</div></main></body></html>`);
writeFileSync(join(OUT, '.nojekyll'), '');
// CORS note: GitHub Pages serves Access-Control-Allow-Origin: * by default.

// manifest
const files = [];
(function walk(d) { for (const n of readdirSync(d)) { const f = join(d, n); statSync(f).isDirectory() ? walk(f) : files.push(f); } })(OUT);
const manifest = { name: 'ism-design-system', version: JSON.parse(readFileSync(p('tokens/tokens.json'), 'utf8')).version, base: BASE, files: {} };
for (const f of files.sort()) {
  const rel = relative(OUT, f).split(sep).join('/');
  if (/\.(ttf|otf|png|jpg|jpeg)$/i.test(rel) && isPointer(f)) guard.push(rel);
  const b = readFileSync(f);
  manifest.files[rel] = { bytes: b.length, sha256: createHash('sha256').update(b).digest('hex'), url: `${BASE}/${rel}` };
}
if (guard.length) { console.error(`site: ${guard.length} files are Git LFS pointers, not real binaries (run git lfs checkout): ${guard.slice(0, 5).join(', ')}`); process.exit(1); }
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log(`site: ${files.length + 1} files in site/ for ${BASE}`);
