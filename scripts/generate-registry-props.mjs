#!/usr/bin/env node
/**
 * Fills the `props` / `deprecatedProps` fields on every component in
 * registry.json, so an agent that has picked a component and knows how to
 * import it also knows how to call it.
 *
 *   node scripts/generate-registry-props.mjs          # write
 *   node scripts/generate-registry-props.mjs --check  # report only, exit 1 on drift
 *
 * Source of truth, in order:
 *   1. a TypeScript `<Name>Props` interface / type alias
 *   2. the component's runtime `propTypes`
 *
 * Deprecated props are pulled OUT of `props` and listed by name in
 * `deprecatedProps`. That separation is the whole point: @m-next/button
 * declares 23 props of which 17 are deprecated, and an agent handed the raw
 * list will happily reach for `buttonStyle` or `isDangerous`.
 *
 * Output is marked `propsStatus: "auto-generated"`. Hand-curate an entry and
 * set it to "reviewed" — this script then leaves that entry alone.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const MAX_TYPE = 90;

const walk = (dir, out = []) => {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '__snapshots__') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

/**
 * Split an interface body on top-level `;`, respecting nesting.
 *
 * Comment regions are copied through verbatim without being scanned for
 * quotes or braces. Prose is not code: a JSDoc line reading "don't render the
 * button instead" would otherwise open a string on the apostrophe and swallow
 * every member after it.
 */
const splitMembers = (body) => {
  const out = [];
  let buf = '', depth = 0, inStr = null;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    const two = body.slice(i, i + 2);
    if (!inStr && two === '/*') {
      const end = body.indexOf('*/', i + 2);
      const stop = end === -1 ? body.length : end + 2;
      buf += body.slice(i, stop); i = stop - 1; continue;
    }
    if (!inStr && two === '//') {
      const end = body.indexOf('\n', i);
      const stop = end === -1 ? body.length : end;
      buf += body.slice(i, stop); i = stop - 1; continue;
    }
    if (inStr) { buf += ch; if (ch === inStr && body[i - 1] !== '\\') inStr = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; buf += ch; continue; }
    // Deliberately NOT tracking < >. They are ambiguous in TypeScript: the `>`
    // in an arrow type (`(e?: any) => void`) would decrement depth and merge
    // the next member into this one. Generic payloads that actually need
    // protection carry braces or parens anyway (`Array<{ a: string; b: X }>`).
    if ('({['.includes(ch)) depth++;
    if (')}]'.includes(ch)) depth--;
    if (ch === ';' && depth === 0) { out.push(buf); buf = ''; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf);
  return out;
};

/** Resolve `type Foo = 'a' | 'b'` aliases declared in the same file. */
const resolveAlias = (type, src) => {
  const m = /^([A-Z]\w*)$/.exec(type.trim());
  if (!m) return type;
  const re = new RegExp(`type\\s+${m[1]}\\s*=\\s*([^;]+);`);
  const hit = re.exec(src);
  if (!hit) return type;
  const val = hit[1].replace(/\s+/g, ' ').trim();
  return /^['"]/.test(val) || val.includes('|') ? val : type;
};

const tidy = (t) => {
  const s = t.replace(/\s+/g, ' ').trim();
  return s.length > MAX_TYPE ? `${s.slice(0, MAX_TYPE - 1)}…` : s;
};

/** Locate `interface X ... {` / `type X = {` and return its brace body + heritage clause. */
function findBlock(src, typeName) {
  const decl = new RegExp(`(?:interface|type)\\s+${typeName}\\b([^{]*)\\{`).exec(src);
  if (!decl) return null;
  let i = decl.index + decl[0].length, depth = 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  return { body: src.slice(decl.index + decl[0].length, i - 1), heritage: decl[1] || '' };
}

/**
 * Collect a type's own members plus those of any base declared in the same
 * file. Layout's BoxProps declares nothing itself and takes all ~25 of its
 * props from CommonBoxProps; without this, Box looks like it has no API.
 * React.* / Omit<...> bases are skipped on purpose — inheriting every HTML
 * attribute would bury the real props.
 */
function collectBody(src, typeName, seen = new Set()) {
  if (seen.has(typeName)) return '';
  seen.add(typeName);
  const block = findBlock(src, typeName);
  if (!block) return '';
  let out = block.body;
  const ext = /extends\s+([^{]+)/.exec(block.heritage);
  if (ext) {
    for (const base of ext[1].split(',')) {
      const b = base.trim().replace(/<[\s\S]*$/, '');
      if (!/^[A-Z]\w*$/.test(b) || b.startsWith('React') || b === 'Omit' || b === 'Pick') continue;
      const inherited = collectBody(src, b, seen);
      if (inherited) out = `${inherited};\n${out}`;
    }
  }
  return out;
}

function fromTypeScript(pkgDir, name) {
  const files = walk(path.join(pkgDir, 'src')).filter((f) => /\.(d\.ts|ts|tsx)$/.test(f));
  files.push(path.join(pkgDir, 'index.d.ts'));
  // The registry name and the package's internal type name don't always agree
  // — @m-next/pill-tab is catalogued as SegmentedControl but declares
  // PillTabProps. Try the registry name first, then the package name.
  const pascalPkg = path.basename(pkgDir).split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const candidates = [...new Set([`${name}Props`, `${pascalPkg}Props`])];
  for (const f of files) {
    let src;
    try { src = fs.readFileSync(f, 'utf8'); } catch { continue; }
    const typeName = candidates.find((c) => new RegExp(`(?:interface|type)\\s+${c}\\b`).test(src));
    if (!typeName) continue;
    const body = collectBody(src, typeName);
    if (!body) continue;

    const props = [], deprecated = [];
    for (const raw of splitMembers(body)) {
      if (!raw.trim()) continue;
      const isDep = /@deprecated/.test(raw);
      const doc = /\/\*\*\s*([\s\S]*?)\*\//.exec(raw);
      // strip comments, then read `name?: type`
      const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim();
      const sig = /^\s*(?:readonly\s+)?([A-Za-z_$][\w$]*)\s*(\?)?\s*:\s*([\s\S]+)$/.exec(code);
      if (!sig) continue;
      const [, pname, optional, ptype] = sig;
      if (isDep) { deprecated.push(pname); continue; }
      const entry = { name: pname, type: tidy(resolveAlias(ptype, src)), required: !optional };
      if (doc) {
        const d = doc[1].replace(/^\s*\*\s?/gm, ' ').replace(/\s+/g, ' ').trim();
        if (d && !d.startsWith('@')) entry.doc = d.length > 140 ? `${d.slice(0, 139)}…` : d;
      }
      props.push(entry);
    }
    if (props.length || deprecated.length) {
      const byName = new Map();
      for (const p of props) byName.set(p.name, p); // later (own) decl wins over inherited
      return {
        props: [...byName.values()],
        deprecated: [...new Set(deprecated)],
        source: `ts:${path.relative(ROOT, f)}`,
      };
    }
  }
  return null;
}

function fromPropTypes(pkgDir, name) {
  const files = walk(path.join(pkgDir, 'src')).filter(
    (f) => /\.(jsx|js|tsx)$/.test(f) && !/\.(test|spec|stories)\./.test(f),
  );
  for (const f of files) {
    let src;
    try { src = fs.readFileSync(f, 'utf8'); } catch { continue; }
    const decl = new RegExp(`(?:${name}\\.propTypes|propTypes)\\s*=\\s*\\{`).exec(src);
    if (!decl) continue;
    let i = decl.index + decl[0].length, depth = 1;
    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
      i++;
    }
    const body = src.slice(decl.index + decl[0].length, i - 1);
    const props = [];
    for (const raw of splitMembers(body.replace(/,\s*\n/g, ';\n'))) {
      const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim();
      const sig = /^([A-Za-z_$][\w$]*)\s*:\s*([\s\S]+)$/.exec(code);
      if (!sig) continue;
      const [, pname, ptype] = sig;
      const t = ptype.replace(/PropTypes\./g, '').replace(/\s+/g, ' ').trim();
      props.push({
        name: pname,
        type: tidy(t.replace(/\.isRequired$/, '')),
        required: /\.isRequired\b/.test(ptype),
      });
    }
    if (props.length) return { props, deprecated: [], source: `propTypes:${path.relative(ROOT, f)}` };
  }
  return null;
}

const registryPath = path.join(ROOT, 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

let generated = 0, reviewed = 0, unresolved = [];
for (const c of registry.components) {
  if (c.propsStatus === 'reviewed') { reviewed++; continue; }
  const pkgDir = path.join(ROOT, 'packages', c.package.split('/').pop());
  const res = fromTypeScript(pkgDir, c.name) || fromPropTypes(pkgDir, c.name);
  if (!res) { unresolved.push(c.name); delete c.props; delete c.deprecatedProps; c.propsStatus = 'unresolved'; continue; }
  c.props = res.props;
  if (res.deprecated.length) c.deprecatedProps = res.deprecated;
  else delete c.deprecatedProps;
  c.propsStatus = 'auto-generated';
  c.propsSource = res.source;
  generated++;
}

// keep key order stable and readable
const ORDER = ['name', 'package', 'import', 'category', 'summary', 'use', 'dontUse',
  'variants', 'props', 'deprecatedProps', 'story', 'status', 'propsStatus', 'propsSource'];
registry.components = registry.components.map((c) => {
  const out = {};
  for (const k of ORDER) if (k in c) out[k] = c[k];
  for (const k of Object.keys(c)) if (!(k in out)) out[k] = c[k];
  return out;
});

const next = `${JSON.stringify(registry, null, 2)}\n`;
const prev = fs.readFileSync(registryPath, 'utf8');

console.log(`generated: ${generated}  reviewed(skipped): ${reviewed}  unresolved: ${unresolved.length}`);
if (unresolved.length) console.log(`  unresolved: ${unresolved.join(', ')}`);

if (CHECK) {
  if (next !== prev) { console.error('registry.json props are stale — run: node scripts/generate-registry-props.mjs'); process.exit(1); }
  console.log('registry.json props are up to date.');
} else {
  fs.writeFileSync(registryPath, next);
  console.log('registry.json written.');
}
