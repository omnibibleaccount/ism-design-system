#!/usr/bin/env node
/**
 * ISM usage linter.
 *
 * Fails on anything that drifts from the ISM design system: hardcoded colours,
 * off-palette fonts, numeric z-index, raw radius/shadow/gradient values, invented
 * ISM class names, Tailwind palette classes, emoji, "!" in button labels, two
 * primary buttons in one group, white logo files, missing alt/lang/dir, vague
 * button labels.
 *
 * Usage:
 *   node scripts/lint-usage.mjs [paths...]        lint files/dirs (default: .)
 *   --md             also lint code fences inside .md files
 *   --json           machine-readable output
 *   --strict         treat warnings as errors
 *   --data <file>    lint-data.json (default: specs/lint-data.json next to this repo,
 *                    else derived from packages/web/css/bundle.css + tokens/tokens.json)
 *   --emit-data      write specs/lint-data.json and exit
 *
 * Suppress one line:  ism-lint-disable-line   (in a comment on that line)
 * Suppress a file:    ism-lint-disable-file   (anywhere in the file)
 * Suppress one rule:  ism-lint-disable-line <rule-id>
 *
 * Exit code 1 if any error (or any warning with --strict).
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');

/* ---------------- lint data ---------------- */

export function deriveData(repo = REPO) {
  const css = readFileSync(join(repo, 'packages/web/css/bundle.css'), 'utf8');
  const classes = new Set();
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) classes.add(m[1]);
  const tokens = JSON.parse(readFileSync(join(repo, 'tokens/tokens.json'), 'utf8'));
  const radius = tokens.radius.tokens.map((t) => t.value);
  const spacing = tokens.spacing.tokens.map((t) => t.value);
  const fontFamilies = new Set(['Inter', 'Lora', 'Procerus']);
  for (const f of tokens.type.fonts) fontFamilies.add(f.family);
  for (const s of tokens.script?.scripts ?? []) if (s.font) fontFamilies.add(s.font);
  const cssVars = new Set();
  for (const m of readFileSync(join(repo, 'packages/web/css/tokens.css'), 'utf8').matchAll(/(--[\w-]+)\s*:/g)) cssVars.add(m[1]);
  return {
    version: tokens.version,
    classes: [...classes].sort(),
    cssVars: [...cssVars].sort(),
    radius,
    spacing,
    fontFamilies: [...fontFamilies].sort(),
  };
}

function loadData(dataPath) {
  if (dataPath) return JSON.parse(readFileSync(dataPath, 'utf8'));
  const p = join(REPO, 'specs/lint-data.json');
  if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8'));
  return deriveData();
}

/* ---------------- rule catalogue ---------------- */

export const RULES = {
  'hardcoded-color': ['error', 'Use a colour token (var(--...)), never a hex/rgb/hsl literal.'],
  'off-palette-font': ['error', 'Use var(--font-sans), var(--font-serif) (scripture only) or the script fallbacks.'],
  'numeric-z-index': ['error', 'Use a z-index token (var(--z-...)); never invent numbers.'],
  'raw-radius': ['error', 'Use a radius token (var(--radius-...)).'],
  'raw-shadow': ['error', 'Use a shadow token (var(--shadow-...)).'],
  'raw-gradient': ['error', 'Use a gradient token (var(--gradient-...)).'],
  'unknown-token': ['error', 'This CSS variable does not exist in the ISM tokens.'],
  'off-scale-spacing': ['warn', 'Spacing should come from the space scale (var(--space-...)).'],
  'raw-duration': ['warn', 'Use motion tokens (var(--dur-...), var(--ease-...)).'],
  'unknown-class': ['error', 'This class name looks like an ISM class but does not exist in bundle.css.'],
  'tailwind-palette': ['error', 'Tailwind palette/arbitrary colour classes bypass the tokens.'],
  'emoji': ['error', 'No emoji in ISM copy or UI.'],
  'button-exclamation': ['error', 'No exclamation marks in button labels.'],
  'vague-button-label': ['error', 'Button/link labels are verb-first and specific ("Read now", not "Click here").'],
  'multiple-primary': ['error', 'One primary button per group.'],
  'white-logo': ['error', 'Logos are black ink; invert with filter: brightness(0) invert(1) on dark.'],
  'logo-recolor': ['error', 'Never recolour, rotate or stretch a logo.'],
  'img-alt': ['error', 'Images need an alt attribute (alt="" if decorative).'],
  'html-lang': ['error', '<html> needs a lang attribute.'],
  'rtl-dir': ['error', 'RTL languages (ar, he, fa, ur) need dir="rtl".'],
  'pill-eyebrow': ['warn', 'Pills are for buttons, chips and badges, not eyebrows or headings.'],
  'uppercase-typed': ['warn', 'Do not type ALL CAPS; the eyebrow style applies uppercase in CSS.'],
  'component-override': ['warn', 'Do not restyle system classes (border, radius, background, colour, text-decoration, padding, margin). Wrap them in your own layout class, or report the gap.'],
};

/* ---------------- helpers ---------------- */

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{23E9}-\u{23F3}\u{FE0F}]/u;
const ALLOWED_SYMBOLS = /[←-⇿✓✕✗•·]/; // arrows, check, bullets are glyph text, not emoji
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b(?![\w-])/g;
const COLOR_FN = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\(/g;
const NAMED_OK = new Set(['transparent', 'currentcolor', 'inherit', 'none', 'initial', 'unset']);
const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur', 'ps', 'sd', 'yi', 'dv', 'ug']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const VAGUE = /^(click here|here|submit|ok|okay|yes|no|go|click)$/i;
const TW_PALETTE = /^(?:[a-z-]+:)*(?:bg|text|border|ring|fill|stroke|from|to|via|divide|outline|decoration|shadow|accent|caret)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)(?:-\d{2,3})?(?:\/\d+)?$/;
const TW_ARB = /^(?:[a-z-]+:)*[a-z-]+-\[(?:#|rgb|hsl|\d+px|\d+(?:\.\d+)?rem)[^\]]*\]$/;
// Visual properties a page must not change on a system class; layout (display, flex, gap, position, size, overflow, z-index) is fine.
const OVERRIDE_PROP = /^(?:border(?:-[\w-]+)?|background(?:-[\w-]+)?|color|text-decoration(?:-[\w-]+)?|padding(?:-[\w-]+)?|margin(?:-[\w-]+)?)$/;
const camelToKebab = (p) => p.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
// Page containers (rules/layout-motion.md): spacing around them is page layout, not a component restyle.
const LAYOUT_CONTAINERS = new Set(['wrap', 'narrow']);
const SPACING_PROP = /^(?:padding|margin)/;
const restyled = (cls, props) => (LAYOUT_CONTAINERS.has(cls) ? props.filter((p) => !SPACING_PROP.test(p)) : props);

function lineOf(text, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

/* ---------------- the linter ---------------- */

export function lintText(text, file, data, opts = {}) {
  const out = [];
  if (/ism-lint-disable-file/.test(text)) return out;
  const lines = text.split('\n');
  const ext = opts.ext ?? extname(file).toLowerCase();
  const isCss = ext === '.css' || ext === '.scss';
  const classSet = new Set(data.classes);
  const varSet = new Set(data.cssVars);
  const prefixCount = {};
  for (const c of data.classes) { const p = c.split('-')[0]; prefixCount[p] = (prefixCount[p] || 0) + 1; }
  const radiusOk = new Set(data.radius);
  const spacingOk = new Set(data.spacing.concat(['0px', '1px', '2px', '3px']));

  const add = (rule, idx, msg, lineNo) => {
    const ln = lineNo ?? lineOf(text, idx);
    const src = lines[ln - 1] ?? '';
    const m = src.match(/ism-lint-disable-line(?:\s+([\w-]+))?/);
    if (m && (!m[1] || !(m[1] in RULES) || m[1] === rule)) return;
    const [sev, why] = RULES[rule];
    out.push({ file, line: ln, rule, severity: sev, message: msg || why, fix: why });
  };

  /* ---- declaration-level checks (CSS, <style>, style="", JSX style objects) ---- */
  const declRe = /(?<![\w-])(color|background(?:-color)?|border(?:-(?:top|right|bottom|left))?(?:-color)?|outline(?:-color)?|fill|stroke|box-shadow|text-shadow|z-index|zIndex|border-radius|borderRadius|(?:border-(?:top|bottom)-(?:left|right)-radius)|font-family|fontFamily|background-image|backgroundImage|padding(?:-\w+)?|margin(?:-\w+)?|gap|row-gap|column-gap|transition(?:-duration)?|animation(?:-duration)?|boxShadow|backgroundColor|borderColor)\s*[:=]\s*(?:\{?\s*)(["'`]?)([^;{}\n]*?)\2?\s*(?:;|\}|,(?=\s*[a-zA-Z]+\s*:)|,\s*$|$|["'])/gim;
  for (const m of text.matchAll(declRe)) {
    const prop = m[1].toLowerCase().replace(/[A-Z]/g, (c) => c);
    const norm = m[1].replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).toLowerCase();
    const val = (m[3] || '').split(/,\s*[a-zA-Z]+\s*:/)[0].replace(/,\s*$/, '').replace(/^['"`]|['"`]$/g, '').trim();
    if (!val) continue;
    const idx = m.index;
    if (norm === 'z-index') {
      if (/^-?\d+$/.test(val)) add('numeric-z-index', idx, `z-index: ${val} is a raw number.`);
    } else if (/radius$/.test(norm)) {
      if (/^\d+$/.test(val) && val !== '0') add('raw-radius', idx, `${norm}: ${val} is a raw number.`);
      for (const px of val.matchAll(/(-?\d*\.?\d+)px/g)) {
        const v = `${px[1]}px`;
        if (px[1] !== '0' && !radiusOk.has(v)) add('raw-radius', idx, `${norm}: ${v} is not a radius token.`);
        else if (px[1] !== '0' && !/var\(/.test(val)) add('raw-radius', idx, `${norm}: ${val} should be var(--radius-...).`);
      }
    } else if (norm === 'font-family') {
      if (/var\(--font/.test(val) || /^(inherit|initial|unset)$/.test(val)) continue;
      const fams = val.split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
      const generic = new Set(['sans-serif', 'serif', 'monospace', 'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', '-apple-system', 'blinkmacsystemfont', 'cursive', 'fantasy']);
      const bad = fams.filter((f) => f && !generic.has(f.toLowerCase()) && !data.fontFamilies.some((a) => a.toLowerCase() === f.toLowerCase()) && !/^Noto /.test(f) && !/^var\(/.test(f));
      if (bad.length) add('off-palette-font', idx, `font-family uses ${bad.join(', ')}; ISM allows ${data.fontFamilies.slice(0, 6).join(', ')}… via tokens.`);
    } else if (/shadow/.test(norm)) {
      if (!/^(none|inherit|initial|unset|0)$/.test(val) && !/^var\(/.test(val)) add('raw-shadow', idx, `${norm}: ${val.slice(0, 60)} is not a shadow token.`);
    } else if (/^(padding|margin|gap|row-gap|column-gap)/.test(norm)) {
      if (/var\(|calc\(|env\(|clamp\(|min\(|max\(/.test(val)) continue;
      for (const px of val.matchAll(/(?<![\w.#-])(-?\d*\.?\d+)px/g)) {
        const v = `${px[1].replace(/^-/, '')}px`;
        if (!spacingOk.has(v)) { add('off-scale-spacing', idx, `${norm}: ${px[1]}px is not on the space scale (${data.spacing.join(', ')}).`); break; }
      }
    } else if (/^(transition|animation)/.test(norm)) {
      if (/\d*\.?\d+m?s\b/.test(val) && !/var\(--dur/.test(val)) add('raw-duration', idx, `${norm}: ${val.slice(0, 50)} uses a raw duration.`);
    }
  }

  /* gradients */
  for (const m of text.matchAll(/(?<![\w-])(?:repeating-)?(?:linear|radial|conic)-gradient\(([^)]*)/g)) {
    if (/ism-lint-disable/.test(lines[lineOf(text, m.index) - 1] || '')) continue;
    // allow gradients built only from var() tokens
    if (/#|rgb|hsl|\b(?:red|blue|green|white|black|gray|grey|orange|yellow|purple|pink)\b/i.test(m[1])) add('raw-gradient', m.index, `Gradient built from literal colours.`);
    else if (!/var\(/.test(m[1])) add('raw-gradient', m.index);
  }

  /* colours: every literal outside custom-property definitions in the token files */
  const stripped = text.replace(/\/\*[\s\S]*?\*\//g, (s) => s.replace(/[^\n]/g, ' '));
  for (const re of [HEX, COLOR_FN]) {
    for (const m of stripped.matchAll(re)) {
      const i = m.index;
      const lineNo = lineOf(text, i);
      const src = lines[lineNo - 1];
      if (isCss && /^\s*--[\w-]+\s*:/.test(src) && opts.allowTokenDefs) continue;
      // HTML entities like &#169; or anchors like href="#top" are not colours
      const before = stripped.slice(Math.max(0, i - 2), i);
      if (/&$/.test(before) || /["'(=]\s*$/.test(before) && /href|id=|url\(#|for=/.test(stripped.slice(Math.max(0, i - 12), i))) continue;
      if (re === HEX && /^#[0-9a-fA-F]{3,8}$/.test(m[0]) && /^#\d+$/.test(m[0]) && m[0].length !== 4 && m[0].length !== 7) continue;
      if (/^#[0-9a-fA-F]{3}$/.test(m[0]) && /(href|to|id|for|aria-\w+)=["']#/.test(src)) continue;
      add('hardcoded-color', i, `Hardcoded colour ${m[0].length > 12 ? m[0] : m[0]}${re === COLOR_FN ? '…)' : ''}; use a token.`);
    }
  }

  /* unknown tokens */
  for (const m of stripped.matchAll(/var\(\s*(--[\w-]+)/g)) {
    const name = m[1];
    if (!varSet.has(name) && !/^--(ism-|tw-|local-|_)/.test(name)) {
      // allow component-local vars defined in the same file
      if (new RegExp(`${name.replace(/[-]/g, '\\-')}\\s*:`).test(text)) continue;
      add('unknown-token', m.index, `var(${name}) is not an ISM token.`);
    }
  }

  /* ---- markup-level checks (html, jsx, tsx, vue, svelte, md fences) ---- */
  const isMarkup = /\.(html?|jsx?|tsx?|vue|svelte|mdx?|astro)$/.test(file) || ext === '.html';
  if (isMarkup) {
    // classes
    for (const m of text.matchAll(/\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{"([^"]*)"\}|\{'([^']*)'\})/g)) {
      const val = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5];
      for (const c of val.split(/\s+/).filter(Boolean)) {
        if (/[${}]/.test(c)) continue;
        if (TW_PALETTE.test(c) || TW_ARB.test(c)) { add('tailwind-palette', m.index, `Tailwind class "${c}" bypasses ISM tokens.`); continue; }
        const p = c.split('-')[0];
        if (!classSet.has(c) && c.includes('-') && prefixCount[p] >= 3 && classSet.has(p + '-' + (data.classes.find((k) => k.startsWith(p + '-'))?.slice(p.length + 1) ?? ''))) {
          add('unknown-class', m.index, `Class "${c}" is not defined in bundle.css (known ${p}-* classes: ${data.classes.filter((k) => k.startsWith(p + '-')).slice(0, 8).join(', ')}).`);
        }
      }
    }

    // img alt, logos
    for (const m of text.matchAll(/<img\b[^>]*>/gi)) {
      const tag = m[0];
      if (!/\balt\s*=/.test(tag) && !/\{\.\.\./.test(tag)) add('img-alt', m.index);
      const src = (tag.match(/\bsrc\s*=\s*["']([^"']+)["']/) || [])[1] || '';
      if (/logo/i.test(src) && /(white|light|reverse|inverse|negative)/i.test(basename(src))) add('white-logo', m.index, `Logo file "${basename(src)}" is a recoloured logo; use the black logo + filter.`);
      if (/logo/i.test(src) && /(rotate\(|scaleX|scaleY|hue-rotate|sepia|saturate|object-fit:\s*fill)/i.test(tag)) add('logo-recolor', m.index);
      if (/logo/i.test(src) && /width\s*[:=][^>]*height|height\s*[:=][^>]*width/i.test(tag) && /(?:width|height)\s*=\s*["']?\d+/.test(tag) && /(?:width)\s*=\s*["']?\d+[^>]*(?:height)\s*=\s*["']?\d+/.test(tag) === false) { /* skip */ }
    }

    // html lang / dir
    const htmlTag = text.match(/<html\b[^>]*>/i);
    if (htmlTag) {
      const lang = (htmlTag[0].match(/\blang\s*=\s*["']([\w-]+)["']/i) || [])[1];
      if (!lang) add('html-lang', htmlTag.index);
      else if (RTL_LANGS.has(lang.toLowerCase().split('-')[0]) && !/\bdir\s*=\s*["']rtl["']/i.test(htmlTag[0])) add('rtl-dir', htmlTag.index, `lang="${lang}" is right-to-left but <html> has no dir="rtl".`);
    }
    for (const m of text.matchAll(/<(\w+)\b[^>]*\blang\s*=\s*["'](ar|he|fa|ur)[\w-]*["'][^>]*>/gi)) {
      if (m[1].toLowerCase() !== 'html' && !/\bdir\s*=/.test(m[0])) add('rtl-dir', m.index, `lang="${m[2]}" element needs dir="rtl".`);
    }

    // emoji in visible text
    for (let i = 0; i < lines.length; i++) {
      const src = lines[i];
      for (const ch of src) {
        if (EMOJI.test(ch) && !ALLOWED_SYMBOLS.test(ch)) { add('emoji', 0, `Emoji "${ch}" in markup.`, i + 1); break; }
      }
    }

    // buttons & links: labels
    for (const m of text.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi)) {
      const attrs = m[2];
      const isBtn = m[1].toLowerCase() === 'button' || /class(?:Name)?\s*=\s*["'][^"']*\bbtn\b/.test(attrs);
      const label = m[3].replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();
      if (!label) continue;
      if (isBtn && /!/.test(label)) add('button-exclamation', m.index, `Button label "${label}" has an exclamation mark.`);
      if ((isBtn || m[1].toLowerCase() === 'a') && VAGUE.test(label.replace(/[↗→←↑↓]/g, '').trim())) add('vague-button-label', m.index, `Label "${label}" is vague; say what happens next.`);
      if (isBtn && label.length > 8 && label === label.toUpperCase() && /[A-Z]{3}/.test(label)) add('uppercase-typed', m.index, `Label "${label}" is typed in capitals.`);
    }

    // restyled system classes: <style> rules whose subject (last compound selector) is a system class, and inline styles on system-class elements
    const overrides = (decls) => decls.split(';').map((d) => camelToKebab(d.split(':')[0].trim().replace(/^["']|["']$/g, ''))).filter((p) => OVERRIDE_PROP.test(p));
    for (const sb of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
      const css = sb[1].replace(/\/\*[\s\S]*?\*\//g, (s) => s.replace(/[^\n]/g, ' '));
      const base = sb.index + sb[0].indexOf('>') + 1;
      for (const r of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (/^\s*@/.test(r[1])) continue;
        const props = overrides(r[2]);
        if (!props.length) continue;
        const hit = r[1].split(',').flatMap((sel) => [...(sel.trim().split(/[\s>+~]+/).pop() || '').matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((c) => c[1])).filter((c) => classSet.has(c) && restyled(c, props).length);
        if (hit.length) add('component-override', base + r.index + r[0].search(/\S/), `<style> sets ${[...new Set(restyled(hit[0], props))].join(', ')} on system class .${hit[0]}.`);
      }
    }
    for (const m of text.matchAll(/<[a-zA-Z][\w-]*\b[^>]*>/g)) {
      const tag = m[0];
      const cls = (tag.match(/\bclass(?:Name)?\s*=\s*["']([^"']*)["']/) || [])[1];
      const style = (tag.match(/\bstyle\s*=\s*"([^"]*)"/) || tag.match(/\bstyle\s*=\s*'([^']*)'/) || tag.match(/\bstyle\s*=\s*\{\{([^}]*)\}\}/) || [])[1];
      if (!cls || !style) continue;
      const props = overrides(style.replace(/,(?=\s*[\w"']+\s*:)/g, ';'));
      const sys = cls.split(/\s+/).find((c) => classSet.has(c) && restyled(c, props).length);
      if (sys) add('component-override', m.index, `Inline style sets ${[...new Set(restyled(sys, props))].join(', ')} on system class .${sys}.`);
    }

    // pill eyebrows
    for (const m of text.matchAll(/<(?:h[1-6]|p|span|div)\b[^>]*class(?:Name)?\s*=\s*["'][^"']*\b(eyebrow|overline)\b[^"']*\b(?:pill|chip|badge)\b/gi)) add('pill-eyebrow', m.index);
    for (const m of text.matchAll(/class(?:Name)?\s*=\s*["'][^"']*\b(?:pill|chip|badge)\b[^"']*\b(?:eyebrow|overline)\b/gi)) add('pill-eyebrow', m.index);

    // multiple primary buttons in one parent
    const tagRe = /<(\/?)([a-zA-Z][\w-]*)\b([^>]*?)(\/?)>/g;
    const stack = [{ tag: '#root', primaries: [], idx: 0 }];
    for (const m of text.matchAll(tagRe)) {
      const [, close, name0, attrs, selfClose] = m;
      const name = name0.toLowerCase();
      if (close) {
        // pop to matching
        for (let k = stack.length - 1; k > 0; k--) {
          if (stack[k].tag === name) {
            const done = stack.splice(k);
            for (const d of done) if (d.primaries.length > 1) add('multiple-primary', d.primaries[1], `${d.primaries.length} primary buttons inside one <${d.tag}>.`);
            break;
          }
        }
        continue;
      }
      const cls = (attrs.match(/class(?:Name)?\s*=\s*["']([^"']*)["']/) || [])[1] || '';
      const variant = (attrs.match(/variant\s*=\s*["']([^"']*)["']/) || [])[1];
      const isPrimary = /(^|\s)btn-primary(\s|$)/.test(cls) || (/^Button$/.test(name0) && (variant === 'primary' || (!variant && !/variant\s*=/.test(attrs))));
      if (isPrimary && !/disabled/.test(attrs) && stack.length) stack[stack.length - 1].primaries.push(m.index);
      if (!VOID.has(name) && !selfClose && !/^(script|style)$/.test(name) === true) stack.push({ tag: name, primaries: [], idx: m.index });
    }
    for (const d of stack.slice(1)) if (d.primaries.length > 1) add('multiple-primary', d.primaries[1], `${d.primaries.length} primary buttons inside one <${d.tag}>.`);
  }
  return out;
}

/* ---------------- markdown fences ---------------- */

function fencesOf(md) {
  const res = [];
  const re = /```(\w+)?\n([\s\S]*?)```/g;
  for (const m of md.matchAll(re)) {
    const lang = (m[1] || '').toLowerCase();
    if (!['html', 'css', 'jsx', 'tsx', 'vue', 'svelte'].includes(lang)) continue;
    const startLine = md.slice(0, m.index).split('\n').length + 1;
    res.push({ lang, body: m[2], startLine });
  }
  return res;
}

/* ---------------- file walk + CLI ---------------- */

const LINT_EXT = new Set(['.html', '.htm', '.css', '.scss', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro', '.mdx']);
const SKIP_DIR = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'docs', 'coverage', '.turbo', 'vendor', 'fixtures']);

function walk(p, acc, opts) {
  const st = statSync(p);
  if (st.isFile()) { acc.push(p); return; }
  for (const n of readdirSync(p)) {
    if (SKIP_DIR.has(n) && !opts.include) continue;
    walk(join(p, n), acc, opts);
  }
}

export function lintPaths(paths, data, opts = {}) {
  const files = [];
  for (const p of paths) walk(resolve(p), files, opts);
  const findings = [];
  let n = 0;
  for (const f of files) {
    const ext = extname(f).toLowerCase();
    const rel = relative(process.cwd(), f);
    const isMd = ext === '.md' && opts.md;
    if (!LINT_EXT.has(ext) && !isMd) continue;
    // token source files legitimately define raw values
    if (/(^|\/)(packages\/(tokens|web\/css)|specs|tokens)\//.test(f.replace(/\\/g, '/')) && !opts.noDefaultIgnore) continue;
    if (/(^|\/)components\/[^/]+\/preview\.html$/.test(f.replace(/\\/g, '/')) && !opts.noDefaultIgnore) continue; // specimen scaffolding
    if (/\.(min|legacy)\.js$|bundle\.legacy|\.d\.ts$/.test(f)) continue;
    const text = readFileSync(f, 'utf8');
    n++;
    if (isMd) {
      for (const fence of fencesOf(text)) {
        const sub = lintText(fence.body, rel, data, { ext: '.' + fence.lang, allowTokenDefs: false });
        for (const s of sub) { s.line += fence.startLine - 1; findings.push(s); }
      }
    } else {
      // inline <style> blocks in html use same checks (declRe runs on whole text)
      findings.push(...lintText(text, rel, data, { allowTokenDefs: false }));
    }
  }
  return { findings, files: n };
}

function main() {
  const argv = process.argv.slice(2);
  const flags = new Set(argv.filter((a) => a.startsWith('--') && a !== '--data'));
  const di = argv.indexOf('--data');
  const dataPath = di >= 0 ? argv[di + 1] : undefined;
  const paths = argv.filter((a, i) => !a.startsWith('--') && !(di >= 0 && i === di + 1));
  if (flags.has('--check-data')) {
    const f = join(REPO, 'specs/lint-data.json');
    const want = JSON.stringify(deriveData(), null, 2) + '\n';
    if (!existsSync(f) || readFileSync(f, 'utf8') !== want) { console.error('STALE specs/lint-data.json; run npm run build:lint-data'); process.exit(1); }
    console.log('lint-data: up to date');
    return;
  }
  if (flags.has('--emit-data')) {
    const d = deriveData();
    writeFileSync(join(REPO, 'specs/lint-data.json'), JSON.stringify(d, null, 2) + '\n');
    console.log(`lint-data: wrote ${d.classes.length} classes, ${d.cssVars.length} tokens to specs/lint-data.json`);
    return;
  }
  const data = loadData(dataPath);
  const { findings, files } = lintPaths(paths.length ? paths : ['.'], data, { md: flags.has('--md') });
  const errors = findings.filter((f) => f.severity === 'error');
  const warns = findings.filter((f) => f.severity === 'warn');
  if (flags.has('--json')) {
    console.log(JSON.stringify({ files, errors: errors.length, warnings: warns.length, findings }, null, 2));
  } else {
    for (const f of findings) console.log(`${f.file}:${f.line}  ${f.severity === 'error' ? 'error' : 'warn '}  ${f.rule}  ${f.message}`);
    console.log(`\nISM usage lint: ${files} files, ${errors.length} errors, ${warns.length} warnings`);
  }
  process.exit(errors.length || (flags.has('--strict') && warns.length) ? 1 : 0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
