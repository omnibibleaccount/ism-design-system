#!/usr/bin/env node
// Builds standalone static previews in docs/previews/<Name>.html, styled by packages/web/css/ism.css.
// Source: components/<Name>/preview.html when it exists (the full, real-icon specimen page), else the HTML snippets in the README.
// Open docs/previews/index.html in a browser. Pass --rtl to see how the page looks with dir="rtl".
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT } from './lib/tokens.mjs';

const all = JSON.parse(readFileSync(resolve(ROOT, 'specs/all.json'), 'utf8'));
const out = resolve(ROOT, 'docs/previews');
mkdirSync(out, { recursive: true });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fixAssets = (h) => h.replace(/(src|href)="(?:\.\/)?assets\//g, '$1="../../packages/web/assets/').replace(/url\((['"]?)(?:\.\/)?assets\//g, 'url($1../../packages/web/assets/');
const page = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · ISM Design System</title>
<link rel="stylesheet" href="../../packages/web/css/ism.css">
<link rel="stylesheet" href="../../packages/web/css/rtl.css" media="not all" id="rtl">
<style>.pv-wrap{max-width:1100px;margin:0 auto;padding:32px 24px}.pv-nav{font:14px var(--font-sans);margin-bottom:24px}.pv-box{background:#fff;border:1px solid var(--gray-200);border-radius:16px;padding:24px;margin:16px 0}.pv-dark{background:#000;color:#fff}pre{background:var(--gray-100);padding:12px;border-radius:8px;overflow:auto;font-size:12px}</style></head>
<body><div class="pv-wrap"><p class="pv-nav"><a href="index.html">← All components</a></p>${body}</div></body></html>
`;
// The README snippets abbreviate icon markup and attributes with an ellipsis ("<svg ...>...</svg>"). Replace those with a neutral
// placeholder icon of the right size so the static preview and its screenshot keep the true layout. Icons in screenshots are placeholders.
const ph = (attrs) => {
  const w = /width="(\d+)"/.exec(attrs)?.[1] ?? '20';
  const h = /height="(\d+)"/.exec(attrs)?.[1] ?? w;
  const aria = /aria-label="[^"]*"/.exec(attrs)?.[0] ?? 'aria-hidden="true"';
  const body = /QR/i.test(attrs) ? '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM19 19h2v2h-2z"/>' : '<circle cx="12" cy="12" r="8"/>';
  return `<svg width="${w}" height="${h}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ${/QR/i.test(attrs) ? 'role="img" ' : ''}${aria}>${body}</svg>`;
};
const cleanSnippet = (h) => h
  .replace(/<svg\b([^>]*)\/>/g, (m, a) => (m.includes('…') ? ph(a) : m))
  .replace(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g, (m, a, body) => (m.includes('…') ? ph(a) : m))
  .replace(/<[^>]*…[^>]*>/g, (tag) => tag.replace(/…[^"<>=]*?(?=["\s/>])/g, '').replace(/…/g, ''))
  .replace(/…[A-Za-z ]{0,24}…/g, '')
  .replace(/…/g, '');
mkdirSync(resolve(out, 'vendor'), { recursive: true });
for (const [from, to] of [['scripts/vendor/react.production.min.js', 'react.js'], ['scripts/vendor/react-dom.production.min.js', 'react-dom.js'], ['reference/bundle.legacy.js', 'ism-react-legacy.js']]) copyFileSync(resolve(ROOT, from), resolve(out, 'vendor', to));
// A full specimen page, wrapped so it renders on its own: design-system CSS, the legacy React bundle for the few React specimens, repo asset paths.
const standalone = (html) => html
  .replace('</head>', `<link rel="stylesheet" href="../../packages/web/css/ism.css">
<link rel="stylesheet" href="../../packages/web/css/rtl.css" media="not all" id="rtl">
<script src="vendor/react.js"></script><script src="vendor/react-dom.js"></script><script src="vendor/ism-react-legacy.js"></script>
</head>`)
  .replace(/(src|href)="(?:\.\.\/)+assets\//g, '$1="../../packages/web/assets/')
  .replace(/url\((['"]?)(?:\.\.\/)+assets\//g, 'url($1../../packages/web/assets/');
const links = [];
for (const c of all.components) {
  const snippets = c.snippets.html.length ? c.snippets.html : [];
  const body = `<h1 class="h2">${c.name}</h1><p>${esc(c.summary)}</p>` + (snippets.length
    ? snippets.map((h, i) => `<div class="pv-box${/sec-ink|on-dark/.test(h) ? ' pv-dark' : ''}">${fixAssets(cleanSnippet(h))}</div>`).join('\n')
    : '<p><em>No static HTML example in this component README.</em></p>');
  const full = resolve(ROOT, 'components', c.name, 'preview.html');
  writeFileSync(resolve(out, `${c.name}.html`), existsSync(full) ? standalone(readFileSync(full, 'utf8')) : page(c.name, body));
  links.push(`<li><a href="${c.name}.html">${c.name}</a> <small>${c.group}</small></li>`);
}
writeFileSync(resolve(out, 'index.html'), page('Components', `<h1 class="h1">ISM Design System</h1><p>${all.count} components. Static previews generated from the component READMEs.</p><ul style="columns:3;font:16px var(--font-sans);line-height:2">${links.join('')}</ul>`));
console.log(`previews: wrote ${all.count} pages to docs/previews`);
