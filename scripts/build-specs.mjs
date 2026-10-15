#!/usr/bin/env node
// Builds machine-readable component specs from the component READMEs.
//   components/<Name>/spec.json   one per component
//   specs/index.json              summary list (name, group, summary, platforms, paths)
//   specs/all.json                every spec in one file, for LLMs that fetch a single URL
// The README is the authoring source; do not edit spec.json by hand. `--check` fails if outputs are stale.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { ROOT } from './lib/tokens.mjs';

const CHECK = process.argv.includes('--check');
const rd = (p) => readFileSync(resolve(ROOT, p), 'utf8');
const VERSION = JSON.parse(rd('package.json')).version;

const GROUPS = {
  Brand: ['Logos', 'Iconography'],
  Actions: ['Button', 'IconButton', 'Chip', 'Link', 'Badge', 'Eyebrow'],
  Cards: ['Card'],
  'Data display': ['Divider', 'AccentBar', 'ListRow', 'Table', 'Avatar', 'StatTile', 'Quote', 'DescriptionList', 'Accordion'],
  Forms: ['Input', 'SearchField', 'Select', 'Combobox', 'Checkbox', 'Radio', 'Switch', 'SegmentedControl', 'DatePicker', 'FileUpload', 'PhoneInput', 'MultiSelect', 'FormLayout', 'InlineSubscribe'],
  Feedback: ['Alert', 'Toast', 'Modal', 'Tooltip', 'Loader', 'Progress', 'EmptyState'],
  Navigation: ['SiteHeader', 'Footer', 'Breadcrumbs', 'Tabs', 'Pagination', 'AnchorNav', 'BackToTop', 'LanguageSwitcher', 'CookieBanner', 'SkipLink'],
  Patterns: ['Hero', 'PageIntro', 'SplitSection', 'NumberedList', 'CtaBand', 'CenteredCta'],
  Scripture: ['VerseBlock', 'ReadingView', 'BookPicker', 'AudioPlayer', 'BibleCard', 'LanguageRow', 'QrShare'],
  Ministry: ['StoreBadges', 'AppBanner', 'DonationWidget', 'NetworkMap', 'StationCard', 'PartnerCard', 'VideoPlayer', 'EventCard', 'NewsletterCard'],
  'App UI': ['AppBar', 'TabBar', 'BottomSheet', 'SettingsRow', 'SearchResults', 'DownloadState', 'Fab', 'AppHomeScreen'],
};
const groupOf = Object.fromEntries(Object.entries(GROUPS).flatMap(([g, names]) => names.map((n) => [n, g])));
const STATES = ['default', 'hover', 'focus', 'pressed', 'disabled', 'loading', 'error'];
const STATE_WORDS = { default: /default|rest/i, hover: /hover/i, focus: /focus/i, pressed: /pressed|active|press/i, disabled: /disabled/i, loading: /loading|busy|spinner|skeleton/i, error: /error|invalid/i };

const bundle = rd('packages/web/css/bundle.css') + rd('packages/web/css/states.css');
const classExists = (c) => new RegExp(`\\.${c.replace(/[-]/g, '\\-')}(?![a-z0-9_-])`, 'i').test(bundle);
const platforms = JSON.parse(rd('specs/platforms.json'));

const strip = (s) => s.replace(/`/g, '').replace(/\\\|/g, '|').trim();

function splitSections(md, level) {
  const re = new RegExp(`^${'#'.repeat(level)} (.+)$`, 'gm');
  const out = []; let m, last = null;
  const marks = [];
  // ignore headings inside code fences
  let inFence = false, offset = 0;
  const fenceRanges = [];
  for (const line of md.split('\n')) {
    if (/^```/.test(line)) { inFence = !inFence; }
    marks.push({ offset, inFence });
    offset += line.length + 1;
  }
  const inCode = (idx) => { let st = false; let pos = 0; for (const l of md.split('\n')) { if (pos > idx) break; if (/^```/.test(l) && pos < idx) st = !st; pos += l.length + 1; } return st; };
  while ((m = re.exec(md))) {
    if (inCode(m.index)) continue;
    if (last) last.end = m.index;
    last = { title: m[1].trim(), start: m.index + m[0].length, end: md.length };
    out.push(last);
  }
  return out.map((s) => ({ title: s.title, body: md.slice(s.start, s.end).trim() }));
}
const lists = (body) => {
  const items = []; let cur = null; let inFence = false;
  for (const line of body.split('\n')) {
    if (/^```/.test(line)) { inFence = !inFence; cur = null; continue; }
    if (inFence) continue;
    const m = /^\s*[-*] (.*)$/.exec(line);
    if (m) { cur = m[1]; items.push(cur); }
    else if (cur !== null && /^\s{2,}\S/.test(line)) items[items.length - 1] += ' ' + line.trim();
    else if (!line.trim()) cur = null;
  }
  return items.map((s) => s.trim());
};
const tables = (body) => {
  const out = []; let cur = null; let inFence = false;
  for (const line of body.split('\n')) {
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (/^\s*\|/.test(line)) {
      const cells = line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim());
      if (!cur) cur = { header: cells, rows: [], sep: false };
      else if (!cur.sep && cells.every((c) => /^:?-{2,}:?$/.test(c))) cur.sep = true;
      else cur.rows.push(cells);
    } else if (cur) { out.push(cur); cur = null; }
  }
  if (cur) out.push(cur);
  return out.map((t) => t.rows.map((r) => Object.fromEntries(t.header.map((h, i) => [strip(h).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || `col${i}`, strip(r[i] ?? '')]))));
};
const fences = (body) => [...body.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => ({ lang: m[1] || 'text', code: m[2].replace(/\s+$/, '') }));
const prose = (body) => body.replace(/```[\s\S]*?```/g, '').split('\n').filter((l) => l.trim() && !/^\s*\|/.test(l) && !/^\s*[-*] /.test(l) && !/^#/.test(l)).join(' ').trim();
const NEG = /^(do not|don't|dont|never|no |avoid|not )/i;

/** Read the real prop types from packages/react/src/components/<Name>.tsx (interface or type alias named <Name>Props). */
function reactApi(name, pkg = 'react') {
  const rel = `packages/${pkg}/src/components/${name}.tsx`;
  if (!existsSync(resolve(ROOT, rel))) return null;
  const sf = ts.createSourceFile(rel, rd(rel), ts.ScriptTarget.ES2022, true, ts.ScriptKind.TSX);
  const exported = [], props = [];
  const text = (n) => n.getText(sf).replace(/\s+/g, ' ');
  const addMembers = (members) => {
    for (const m of members) {
      if (!ts.isPropertySignature(m) || !m.name) continue;
      const doc = ts.getJSDocCommentsAndTags(m).map((d) => d).filter(Boolean);
      let description = '', def = null;
      for (const d of doc) {
        if (ts.isJSDoc(d)) {
          description = typeof d.comment === 'string' ? d.comment : (d.comment ?? []).map((c) => c.text).join('');
          for (const t of d.tags ?? []) if (t.tagName.text === 'default') def = (typeof t.comment === 'string' ? t.comment : (t.comment ?? []).map((c) => c.text).join('')).trim();
        }
      }
      props.push({ name: m.name.getText(sf), type: m.type ? text(m.type) : 'unknown', required: !m.questionToken, default: def, description: description.trim() });
    }
  };
  const hasExport = (n) => n.modifiers?.some((x) => x.kind === ts.SyntaxKind.ExportKeyword);
  const localIfaces = new Map(sf.statements.filter(ts.isInterfaceDeclaration).map((i) => [i.name.text, i]));
  const visitLiteralTypes = (t) => {
    if (ts.isTypeLiteralNode(t)) addMembers(t.members);
    else if (ts.isTypeReferenceNode(t) && localIfaces.has(t.typeName.getText(sf))) addMembers(localIfaces.get(t.typeName.getText(sf)).members);
    else if (ts.isIntersectionTypeNode(t) || ts.isUnionTypeNode(t) || ts.isParenthesizedTypeNode(t)) (t.types ?? [t.type]).forEach(visitLiteralTypes);
  };
  const propsName = sf.statements.some((st) => (ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) && st.name.text === `${name}Props`)
    ? `${name}Props`
    : (sf.statements.find((st) => ts.isInterfaceDeclaration(st) && hasExport(st) && /Props$/.test(st.name.text))?.name.text ?? `${name}Props`);
  let extendsList = [];
  for (const st of sf.statements) {
    if (ts.isVariableStatement(st) && hasExport(st)) st.declarationList.declarations.forEach((d) => exported.push(d.name.getText(sf)));
    else if ((ts.isFunctionDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st) || ts.isClassDeclaration(st)) && hasExport(st) && st.name) exported.push(st.name.text);
    if (ts.isInterfaceDeclaration(st) && st.name.text === propsName) {
      addMembers(st.members);
      extendsList = (st.heritageClauses ?? []).flatMap((h) => h.types.map(text));
    }
    if (ts.isTypeAliasDeclaration(st) && st.name.text === propsName) visitLiteralTypes(st.type);
    if (ts.isTypeAliasDeclaration(st) && st.name.text === propsName && !props.length) extendsList = [text(st.type)];
  }
  const seen = new Set(); const uniq = props.filter((p) => (seen.has(p.name) ? false : seen.add(p.name)));
  return { file: rel, exports: exported.filter((e) => !/Props$/.test(e)).sort(), props: uniq, extends: extendsList };
}

function parse(name, md) {
  const title = /^# (.+)$/m.exec(md)?.[1] ?? name;
  const afterTitle = md.slice(md.indexOf('\n') + 1);
  const summary = afterTitle.split(/\n\s*\n/)[0].replace(/^#.*$/m, '').trim();
  const sec = Object.fromEntries(splitSections(md, 2).map((s) => [s.title.toLowerCase(), s.body]));
  const pick = (re) => Object.entries(sec).find(([k]) => re.test(k))?.[1] ?? '';
  const when = pick(/when to use/), anat = pick(/anatomy/), variants = pick(/variants/), rules = pick(/^rules/), a11y = pick(/accessibility/), content = pick(/^content/);

  const sub = splitSections(anat, 3);
  const subReact = sub.find((s) => /react/i.test(s.title)), subHtml = sub.find((s) => /html|css/i.test(s.title));
  const anatomyText = prose(anat.split(/^### /m)[0]);
  const propTable = tables(subReact?.body ?? '').find((rows) => rows.length && ('prop' in rows[0] || 'name' in rows[0] || 'props' in rows[0]));
  const props = (propTable ?? []).map((r) => ({ name: strip(r.prop ?? r.name ?? r.props), type: r.type ?? '', default: r.default && r.default !== '—' ? r.default : null, description: r.notes ?? r.description ?? '' }));
  // 13 READMEs split Anatomy into ### React / ### HTML / CSS; the rest put fenced blocks straight under Anatomy.
  const allFences = fences(anat);
  const reactCode = subReact ? fences(subReact.body).filter((f) => /^(jsx|tsx|js|ts|text)$/.test(f.lang)) : allFences.filter((f) => /^(jsx|tsx|js|ts)$/.test(f.lang));
  const htmlCode = subHtml ? fences(subHtml.body).filter((f) => /^(html|text)$/.test(f.lang)) : allFences.filter((f) => /^(html|text)$/.test(f.lang));
  const otherSnippets = fences(anat).filter((f) => !reactCode.includes(f) && !htmlCode.includes(f));
  const reactNotes = prose(subReact?.body ?? '');
  const htmlNotes = prose(subHtml?.body ?? '');

  const variantTables = tables(variants);
  const statesLine = /^States?:\s*(.+)$/im.exec(variants)?.[1]?.trim() ?? null;

  const whenItems = lists(when);
  const ruleItems = lists(rules);
  const all = [...whenItems, ...ruleItems];
  const dont = all.filter((s) => NEG.test(s));
  const doItems = all.filter((s) => !NEG.test(s));

  const classMentions = new Set([...md.matchAll(/`(\.[a-z][a-z0-9_-]*)`/gi)].map((m) => m[1].slice(1)));
  for (const f of htmlCode) for (const m of f.code.matchAll(/class="([^"]+)"/g)) for (const c of m[1].split(/\s+/)) if (/^[a-z][a-z0-9_-]*$/i.test(c)) classMentions.add(c);
  const classes = [...classMentions].sort();
  const knownClasses = classes.filter(classExists);
  const unknownClasses = classes.filter((c) => !classExists(c));

  const stateText = md.slice(md.search(/## Variants/i) >= 0 ? md.search(/## Variants/i) : 0);
  const stateCoverage = Object.fromEntries(STATES.map((s) => [s, STATE_WORDS[s].test(stateText)]));

  const platformsFor = {
    web: true, react: true,
    reactNative: platforms.reactNative.includes(name),
    ios: platforms.ios.includes(name),
    android: platforms.android.includes(name),
  };

  return {
    $schema: '../../specs/spec.schema.json',
    name, title, group: groupOf[name] ?? null, version: VERSION,
    summary,
    whenToUse: whenItems.filter((s) => !NEG.test(s)),
    whenNotToUse: whenItems.filter((s) => NEG.test(s)),
    anatomy: { description: anatomyText, markup: htmlNotes || null },
    react: (() => {
      const api = reactApi(name);
      return {
        import: `import { ${name} } from '@ism/ui'`,
        source: api?.file ?? null,
        exports: api?.exports ?? [],
        extends: api?.extends ?? [],
        props: api && api.props.length ? api.props : props,
        propsSource: api && api.props.length ? 'typescript' : 'readme',
        notes: reactNotes || null,
      };
    })(),
    reactNative: platformsFor.reactNative ? (() => {
      const api = reactApi(name, 'react-native');
      return { import: `import { ${name} } from '@ism/ui-native'`, source: api?.file ?? null, exports: api?.exports ?? [], props: api?.props ?? [] };
    })() : null,
    ios: platformsFor.ios ? { module: 'ISMDesignSystem', source: `packages/ios/Sources/ISMDesignSystem/Components` } : null,
    android: platformsFor.android ? { module: 'bible.ism.design.components', source: 'packages/android/ism-design-system/src/main/kotlin/bible/ism/design/components' } : null,
    cssClasses: knownClasses,
    variants: variantTables.flat().length ? variantTables : [],
    variantNotes: [...lists(variants), prose(variants)].filter(Boolean),
    states: { documented: statesLine, coverage: stateCoverage, universal: 'See rules/states.md for the seven required states and their hooks.' },
    rules: ruleItems,
    do: doItems,
    dont,
    accessibility: lists(a11y),
    content: lists(content),
    snippets: {
      react: reactCode.map((f) => f.code),
      html: htmlCode.map((f) => f.code),
      other: otherSnippets.map((f) => ({ lang: f.lang, code: f.code })),
    },
    platforms: platformsFor,
    files: { readme: `components/${name}/README.md`, spec: `components/${name}/spec.json` },
    diagnostics: { unknownClasses, missingSections: ['when to use', 'anatomy', 'variants', 'rules', 'accessibility', 'content'].filter((k) => !Object.keys(sec).some((s) => s.includes(k))) },
  };
}

const compRoot = resolve(ROOT, 'components');
const names = readdirSync(compRoot).filter((n) => statSync(resolve(compRoot, n)).isDirectory() && existsSync(resolve(compRoot, n, 'README.md'))).sort();
const specs = names.map((n) => parse(n, rd(`components/${n}/README.md`)));

for (const list of [platforms.reactNative, platforms.ios, platforms.android]) for (const n of list) if (!names.includes(n)) { console.error(`platforms.json lists unknown component ${n}`); process.exit(1); }
const ungrouped = specs.filter((s) => !s.group).map((s) => s.name);
if (ungrouped.length) console.warn(`no group for: ${ungrouped.join(', ')}`);

const index = {
  name: 'ISM Design System component index', version: VERSION, count: specs.length,
  groups: Object.fromEntries(Object.entries(GROUPS).map(([g, ns]) => [g, ns.filter((n) => names.includes(n))])),
  components: specs.map((s) => ({ name: s.name, group: s.group, summary: s.summary, platforms: s.platforms, spec: s.files.spec, readme: s.files.readme })),
};
const all = { name: 'ISM Design System component specs', version: VERSION, count: specs.length, components: specs };

const stale = [];
const out = (rel, data) => {
  const abs = resolve(ROOT, rel);
  const text = JSON.stringify(data, null, 2) + '\n';
  if (CHECK) { const cur = existsSync(abs) ? readFileSync(abs, 'utf8') : ''; if (cur !== text) stale.push(rel); return; }
  mkdirSync(resolve(abs, '..'), { recursive: true });
  writeFileSync(abs, text);
};
for (const s of specs) out(`components/${s.name}/spec.json`, s);
out('specs/index.json', index);
out('specs/all.json', all);
if (CHECK) { if (stale.length) { console.error(`STALE specs (${stale.length}): ${stale.slice(0, 5).join(', ')}…`); process.exit(1); } console.log('specs: up to date'); }
else {
  const unknown = specs.filter((s) => s.diagnostics.unknownClasses.length);
  console.log(`specs: wrote ${specs.length} component specs + index.json + all.json`);
  if (unknown.length) console.log(`note: ${unknown.length} specs mention classes not found in bundle.css: ${unknown.map((s) => `${s.name}(${s.diagnostics.unknownClasses.slice(0, 3).join(' ')})`).join('; ')}`);
  const missing = specs.filter((s) => s.diagnostics.missingSections.length);
  if (missing.length) console.log(`note: sections missing in: ${missing.map((s) => `${s.name}[${s.diagnostics.missingSections.join(',')}]`).join('; ')}`);
}
