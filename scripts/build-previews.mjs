#!/usr/bin/env node
// Builds standalone static previews: docs/previews/<Name>.html from each spec's HTML snippets, styled by packages/web/css/ism.css.
// Open docs/previews/index.html in a browser. Pass --rtl to see how the page looks with dir="rtl".
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
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
const links = [];
for (const c of all.components) {
  const snippets = c.snippets.html.length ? c.snippets.html : [];
  const body = `<h1 class="h2">${c.name}</h1><p>${esc(c.summary)}</p>` + (snippets.length
    ? snippets.map((h, i) => `<div class="pv-box${/sec-ink|on-dark/.test(h) ? ' pv-dark' : ''}">${fixAssets(h)}</div>`).join('\n')
    : '<p><em>No static HTML example in this component README.</em></p>');
  writeFileSync(resolve(out, `${c.name}.html`), page(c.name, body));
  links.push(`<li><a href="${c.name}.html">${c.name}</a> <small>${c.group}</small></li>`);
}
writeFileSync(resolve(out, 'index.html'), page('Components', `<h1 class="h1">ISM Design System</h1><p>${all.count} components. Static previews generated from the component READMEs.</p><ul style="columns:3;font:16px var(--font-sans);line-height:2">${links.join('')}</ul>`));
console.log(`previews: wrote ${all.count} pages to docs/previews`);
