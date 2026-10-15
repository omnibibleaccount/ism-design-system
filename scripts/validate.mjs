#!/usr/bin/env node
// Validates the whole design system: tokens, contrast pairs from rules.json, CSS variable usage,
// component folders and specs, and that every generated file is up to date.
// Usage: node scripts/validate.mjs [--skip-generated]
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, loadTokens, flatten, parseColor, contrast } from './lib/tokens.mjs';

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const rd = (p) => readFileSync(resolve(ROOT, p), 'utf8');

// 1. Tokens
let flat = [];
try { flat = flatten(loadTokens()); } catch (e) { fail(`tokens: ${e.message}`); }
const byName = new Map(flat.map((t) => [t.name, t]));
for (const t of flat) {
  if (!t.usage) warn(`token ${t.name} has no usage text`);
  if (t.group === 'color') {
    if (!parseColor(t.value)) fail(`color token ${t.name} is not a parseable colour: ${t.value}`);
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.name)) fail(`token name is not kebab-case: ${t.name}`);
}

// 2. Contrast pairs
let rules = {};
try { rules = JSON.parse(rd('rules/rules.json')); } catch (e) { fail(`rules/rules.json: ${e.message}`); }
for (const p of rules.accessibility?.contrastPairs ?? []) {
  const fg = byName.get(p.fg), bg = byName.get(p.bg);
  if (!fg || !bg) { fail(`contrast pair references unknown token: ${p.fg} / ${p.bg}`); continue; }
  const bgc = parseColor(bg.value), fgc = parseColor(fg.value);
  if (!bgc || !fgc) { fail(`contrast pair is not colours: ${p.fg} / ${p.bg}`); continue; }
  const r = contrast(fgc, bgc);
  if (r < p.min) fail(`contrast ${p.fg} on ${p.bg} is ${r.toFixed(2)}:1, needs ${p.min}:1 (${p.use})`);
}

// 3. z-index ordering from rules.json must match tokens
const z = Object.fromEntries(flat.filter((t) => t.group === 'zIndex').map((t) => [t.name.replace(/^z-/, ''), +t.value]));
for (const [k, v] of Object.entries(rules.layout?.zIndex ?? {})) {
  if (typeof v === 'number' && z[k] !== v) fail(`z-index ${k}: rules.json says ${v}, tokens.json says ${z[k]}`);
}
if (!(z.toast > z.modal)) fail('z-toast must sit above z-modal');

// 4. CSS variable usage: every var(--x) WITHOUT a fallback must be defined in tokens.css or locally.
//    (var(--x, fallback) is a component-level hook set inline, e.g. --sx-progress, and is allowed.)
const cssFiles = ['bundle.css', 'states.css', 'scripts.css', 'rtl-extra.css'].map((f) => `packages/web/css/${f}`);
const defined = new Set([...rd('packages/web/css/tokens.css').matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
for (const f of cssFiles) for (const m of rd(f).matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(m[1]);
for (const f of cssFiles) {
  const used = new Set([...rd(f).matchAll(/var\((--[a-z0-9-]+)\s*\)/gi)].map((m) => m[1]));
  for (const u of used) if (!defined.has(u)) fail(`${f}: var(${u}) is not defined anywhere`);
}

// 5. Components
const compDir = resolve(ROOT, 'components');
const comps = readdirSync(compDir).filter((n) => statSync(resolve(compDir, n)).isDirectory());
const REQUIRED_SECTIONS = ['When to use', 'Anatomy', 'Variants', 'Rules', 'Accessibility', 'Content'];
for (const c of comps) {
  if (c === 'Cover') continue;
  for (const f of ['README.md']) if (!existsSync(resolve(compDir, c, f))) fail(`components/${c}/${f} missing`);
  if (existsSync(resolve(compDir, c, 'README.md'))) {
    const md = rd(`components/${c}/README.md`);
    for (const s of REQUIRED_SECTIONS) if (!new RegExp(`^##\\s+.*${s}`, 'mi').test(md)) warn(`components/${c}/README.md has no "${s}" section`);
  }
  if (existsSync(resolve(ROOT, 'specs/index.json')) && !existsSync(resolve(compDir, c, 'spec.json'))) fail(`components/${c}/spec.json missing (run npm run build:specs)`);
}

// 6. Generated files up to date
if (!process.argv.includes('--skip-generated')) {
  for (const [label, args] of [['tokens', ['scripts/build-tokens.mjs', '--check']], ['web', ['packages/web/scripts/build-web.mjs', '--check']], ['specs', ['scripts/build-specs.mjs', '--check']]]) {
    if (!existsSync(resolve(ROOT, args[0]))) continue;
    const r = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8' });
    if (r.status !== 0) fail(`${label}: generated files are stale. ${r.stderr.trim() || r.stdout.trim()}`);
  }
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`ERROR ${e}`);
console.log(`validate: ${flat.length} tokens, ${rules.accessibility?.contrastPairs?.length ?? 0} contrast pairs, ${comps.length} component folders, ${warnings.length} warnings, ${errors.length} errors`);
process.exit(errors.length ? 1 : 0);
