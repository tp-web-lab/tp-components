import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const componentsRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');
const checkOnly = process.argv.includes('--check');
const componentIndex = process.argv.indexOf('--component');
const selected = componentIndex < 0 ? null : process.argv[componentIndex + 1]?.replace(/^tp-/, '');
if (componentIndex >= 0 && (!selected || !existsSync(join(componentsRoot, selected, `${selected}.ts`)))) {
  throw new Error('Provide a valid component after --component (NAME or tp-NAME).');
}
const outdated = [];
let updated = 0;

/** Writes changed generated blocks only, or reports drift without modifying files. */
function synchronize(path, next) {
  if (readFileSync(path, 'utf8') === next) return;
  if (checkOnly) outdated.push(relative(root, path));
  else { writeFileSync(path, next); updated += 1; }
}
const sourceStart = '// tp-docgen:dependencies:start';
const sourceEnd = '// tp-docgen:dependencies:end';
const docsStart = '<!-- tp-docgen:dependencies:start -->';
const docsEnd = '<!-- tp-docgen:dependencies:end -->';
const sourceBlockExpression = new RegExp(`${sourceStart.replaceAll('/', '\\/')}[\\s\\S]*?${sourceEnd.replaceAll('/', '\\/')}\\n?`);

const credits = {
  'leaflet': ['Leaflet', 'https://leafletjs.com/', 'Interactive geographic maps.'],
  'runtime:openstreetmap': ['OpenStreetMap', 'https://www.openstreetmap.org/copyright', 'Map tiles and geographic data; attribution required.'],
  '@codemirror': ['CodeMirror', 'https://codemirror.net/', 'Code editing and language support.'],
  '@formulajs/formulajs': ['Formula.js', 'https://formulajs.info/', 'Excel-compatible formula functions.'],
  '@lezer/highlight': ['Lezer', 'https://lezer.codemirror.net/', 'Syntax tree highlighting.'],
  '@tp/tp-asciidoc': ['tp-asciidoc', 'https://www.npmjs.com/package/@tp/tp-asciidoc', 'AsciiDoc parsing and rendering.'],
  '@tp/tp-markdown': ['tp-markdown', 'https://www.npmjs.com/package/@tp/tp-markdown', 'Markdown parsing and rendering.'],
  '@tp/tp-restructuredtext': ['tp-restructuredtext', 'https://www.npmjs.com/package/@tp/tp-restructuredtext', 'reStructuredText parsing and rendering.'],
  '@tp/tp-utilities': ['tp-utilities', 'https://www.npmjs.com/package/@tp/tp-utilities', 'Shared parsers, games and rendering utilities.'],
  'dompurify': ['DOMPurify', 'https://github.com/cure53/DOMPurify', 'HTML sanitization.'],
  'es-module-lexer': ['es-module-lexer', 'https://github.com/guybedford/es-module-lexer', 'ECMAScript module import analysis.'],
  'prosemirror': ['ProseMirror', 'https://prosemirror.net/', 'Rich-text editing.'],
  'typescript': ['TypeScript', 'https://www.typescriptlang.org/', 'TypeScript transpilation and language services.'],
  'xlsx': ['SheetJS', 'https://sheetjs.com/', 'XLSX workbook import and export.'],
  'zod': ['Zod', 'https://zod.dev/', 'Runtime schema validation.'],
  'runtime:asciidoctor': ['Asciidoctor.js', 'https://asciidoctor.org/docs/asciidoctor.js/', 'AsciiDoc conversion in the browser.'],
  'runtime:chai': ['Chai', 'https://www.chaijs.com/', 'Assertions in browser tests.'],
  'runtime:highlight': ['highlight.js', 'https://highlightjs.org/', 'Source-code syntax highlighting.'],
  'runtime:lit': ['Lit', 'https://lit.dev/', 'Web-component examples and import maps.'],
  'runtime:mathjax': ['MathJax', 'https://www.mathjax.org/', 'Mathematical notation rendering.'],
  'runtime:mocha': ['Mocha', 'https://mochajs.org/', 'Browser test execution.'],
  'runtime:pyodide': ['Pyodide', 'https://pyodide.org/', 'Python execution in the browser.'],
  'runtime:scryer': ['Scryer Prolog', 'https://www.scryer.pl/', 'Prolog execution in the browser.'],
  'runtime:shoelace': ['Shoelace', 'https://shoelace.style/', 'Web-component examples and import maps.'],
  'runtime:sqljs': ['sql.js', 'https://sql.js.org/', 'SQLite execution in the browser.'],
};

const runtimeCreditPatterns = {
  'runtime:openstreetmap': /https:\/\/tile\.openstreetmap\.org\//,
  'runtime:asciidoctor': /cdn\.jsdelivr\.net\/npm\/@asciidoctor\/core/,
  'runtime:chai': /cdn\.jsdelivr\.net\/npm\/chai@/,
  'runtime:highlight': /highlightjs\/cdn-release/,
  'runtime:lit': /cdn\.jsdelivr\.net\/npm\/lit@/,
  'runtime:mathjax': /cdn\.jsdelivr\.net\/npm\/mathjax@/,
  'runtime:mocha': /cdn\.jsdelivr\.net\/npm\/mocha@/,
  'runtime:pyodide': /pyodide\.org|cdn\.jsdelivr\.net\/pyodide/,
  'runtime:scryer': /esm\.sh\/scryer/,
  'runtime:shoelace': /cdn\.jsdelivr\.net\/npm\/@shoelace-style\/shoelace/,
  'runtime:sqljs': /cdn\.jsdelivr\.net\/npm\/sql\.js@/,
};

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const sourceFiles = walk(componentsRoot).filter((path) => path.endsWith('.ts') && !path.endsWith('.test.ts'));
// Shared utilities can import components used by an extracted editor workflow.
const utilityFiles = walk(join(root, 'src/utilities')).filter((path) => path.endsWith('.ts') && !path.endsWith('.test.ts'));
const sourceByResolvedPath = new Map([...sourceFiles, ...utilityFiles].map((path) => [resolve(path), path]));
const tagsByFile = new Map();
const fileByTag = new Map();

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  const tags = [...source.matchAll(/customElements\.define\(\s*['"](tp-[^'"]+)['"]/g)].map((match) => match[1]);
  if (tags.length > 0) tagsByFile.set(file, tags);
  for (const tag of tags) fileByTag.set(tag, file);
}

const summaryByTag = new Map();
for (const [tag, file] of fileByTag) {
  const source = readFileSync(file, 'utf8').replace(sourceBlockExpression, '');
  const moduleComment = source.match(/\/\*\*[\s\S]*?@module[^\n]*[\s\S]*?\*\//)?.[0] ?? '';
  const summary = moduleComment
    .match(/@summary\s+([^\r\n]+)/)?.[1]
    ?.replace(/\s*\*\/\s*$/, '')
    .trim();
  if (summary !== undefined && summary !== '') summaryByTag.set(tag, summary);
}
for (const manifestPath of walk(componentsRoot).filter((path) => path.endsWith('.json'))) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    if (typeof manifest.tagname === 'string' && !summaryByTag.has(manifest.tagname) && typeof manifest.description === 'string') {
      summaryByTag.set(manifest.tagname, manifest.description);
    }
  } catch { /* Data JSON files are not component manifests. */ }
}

function dependencySummary(tag) {
  return summaryByTag.get(tag) ?? `Component \`<${tag}>\`.`;
}

function importsOf(file) {
  const source = readFileSync(file, 'utf8').replace(sourceBlockExpression, '');
  // Component dependencies describe the modules needed when the component is
  // loaded. Dynamic imports belong to an optional feature and must not turn a
  // foundational component into a structural dependency of the imported one.
  return [...source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map((match) => match[1]);
}

function resolveLocalImport(file, specifier) {
  if (!specifier.startsWith('.')) return null;
  const plain = specifier.replace(/[?#].*$/, '');
  const candidates = [resolve(dirname(file), plain), resolve(dirname(file), plain.replace(/\.js$/, '.ts'))];
  return candidates.find((candidate) => sourceByResolvedPath.has(candidate)) ?? null;
}

function creditKey(specifier) {
  if (specifier.startsWith('@codemirror/')) return '@codemirror';
  if (specifier.startsWith('prosemirror-')) return 'prosemirror';
  if (specifier.startsWith('@tp/tp-asciidoc')) return '@tp/tp-asciidoc';
  if (specifier.startsWith('@tp/tp-markdown')) return '@tp/tp-markdown';
  if (specifier.startsWith('@tp/tp-restructuredtext')) return '@tp/tp-restructuredtext';
  if (specifier.startsWith('@tp/tp-utilities')) return '@tp/tp-utilities';
  const scoped = specifier.match(/^(@[^/]+\/[^/]+)/)?.[1];
  return scoped ?? specifier.split('/')[0];
}

function analyze(entryFile, ownerTags) {
  const dependencies = new Set();
  const externalCredits = new Set();
  const visited = new Set();
  const visit = (file) => {
    if (visited.has(file)) return;
    visited.add(file);
    const fileSource = readFileSync(file, 'utf8').replace(sourceBlockExpression, '');
    for (const [key, pattern] of Object.entries(runtimeCreditPatterns)) {
      if (pattern.test(fileSource)) externalCredits.add(key);
    }
    for (const specifier of importsOf(file)) {
      const local = resolveLocalImport(file, specifier);
      if (local !== null) {
        const importedTags = tagsByFile.get(local) ?? [];
        const otherTags = importedTags.filter((tag) => !ownerTags.includes(tag));
        if (otherTags.length > 0) for (const tag of otherTags) dependencies.add(tag);
        else visit(local);
      } else if (!specifier.startsWith('/') && !specifier.endsWith('.css') && !specifier.includes('?')) {
        const key = creditKey(specifier);
        if (credits[key] !== undefined) externalCredits.add(key);
      }
    }
  };
  visit(entryFile);
  return { dependencies: [...dependencies].sort(), credits: [...externalCredits].sort() };
}

function sourceBlock(data) {
  const blocks = [];
  for (const tag of data.dependencies) blocks.push(`/**\n * @tp-dependency ${tag}\n * @summary ${dependencySummary(tag)}\n */`);
  for (const key of data.credits) {
    const [name, url, summary] = credits[key];
    blocks.push(`/**\n * @credit ${name} ${url}\n * @summary ${summary}\n */`);
  }
  return `${sourceStart}\n${blocks.join('\n')}\n${sourceEnd}`;
}

function replaceSourceBlock(source, block) {
  if (sourceBlockExpression.test(source)) return source.replace(sourceBlockExpression, `${block}\n`);
  const moduleComment = source.match(/^\/\*\*[\s\S]*?\*\/\s*/);
  return moduleComment === null ? `${block}\n\n${source}` : `${moduleComment[0]}${block}\n\n${source.slice(moduleComment[0].length)}`;
}

for (const [file, tags] of tagsByFile) {
  if (selected && !tags.includes(`tp-${selected}`)) continue;
  const source = readFileSync(file, 'utf8');
  const next = replaceSourceBlock(source, sourceBlock(analyze(file, tags)));
  synchronize(file, next);
}

for (const manifestPath of walk(componentsRoot).filter((path) => path.endsWith('.json'))) {
  let manifest;
  try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch { continue; }
  const sourceFile = typeof manifest.tagname === 'string' ? fileByTag.get(manifest.tagname) : undefined;
  if (selected && manifest.tagname !== `tp-${selected}`) continue;
  if (sourceFile === undefined) continue;
  const data = analyze(sourceFile, tagsByFile.get(sourceFile) ?? [manifest.tagname]);
  manifest.dependencies = data.dependencies.map((name) => ({
    name,
    summary: dependencySummary(name),
  }));
  manifest.credits = data.credits.map((key) => {
    const [name, url, summary] = credits[key];
    return { name, url, summary };
  });
  synchronize(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function docsEntryForDependency(tag) {
  const directory = tag.slice(3);
  const link = existsSync(join(docsRoot, directory, 'index.md')) ? `../${directory}/index.md` : null;
  const label = `\`<${tag}>\``;
  const summary = dependencySummary(tag);
  return {
    metadata: `<!--\n@tp-dependency ${tag}\n@summary ${summary}\n-->`,
    item: `- ${link === null ? label : `[${label}](${link})`} : ${summary.replace(/\s+/g, ' ')}`,
  };
}

/** Keeps metadata outside the contiguous Markdown list so comments do not split it. */
function docsList(entries) {
  return entries.length === 0 ? '' : `${entries.map(entry => entry.metadata).join('\n')}\n\n${entries.map(entry => entry.item).join('\n')}`;
}

function docsBlock(data, tag) {
  const componentEntries = data.dependencies.map(docsEntryForDependency);
  const creditEntries = data.credits.map((key) => {
    const [name, url, summary] = credits[key];
    return {
      metadata: `<!--\n@credit ${name} ${url}\n@summary ${summary}\n-->`,
      item: `- [${name}](${url}) : ${summary.replace(/\s+/g, ' ')}`,
    };
  });
  const noComponents = '<!--\n@summary This component has no tp-components dependencies.\n-->\nNo internal dependency';
  const noCredits = '<!--\n@summary No external dependency.\n-->\nNo external dependency';
  const componentPreamble = `All tp-components used by \`<${tag}>\` are loaded automatically by this component if they have not already been loaded by another component.`;
  const internalDependencies = componentEntries.length === 0
    ? noComponents
    : `${componentPreamble}\n\n${docsList(componentEntries)}`;
  return `${docsStart}\n## Dependencies\n\n### Internal\n\n${internalDependencies}\n\n### External\n\n${docsList(creditEntries) || noCredits}\n${docsEnd}`;
}

for (const doc of walk(docsRoot).filter((path) => path.endsWith('/index.md'))) {
  const markdown = readFileSync(doc, 'utf8');
  const componentDirectory = relative(docsRoot, dirname(doc));
  if (selected && componentDirectory !== selected) continue;
  if (componentDirectory === '') continue;
  const manifestDirectory = join(componentsRoot, componentDirectory);
  const manifest = existsSync(manifestDirectory)
    ? readdirSync(manifestDirectory).find((name) => name.endsWith('.json'))
    : undefined;
  let manifestTag;
  if (manifest !== undefined) {
    try { manifestTag = JSON.parse(readFileSync(join(manifestDirectory, manifest), 'utf8')).tagname; } catch { manifestTag = undefined; }
  }
  const directoryTag = `tp-${componentDirectory}`;
  const documentedTags = [...markdown.matchAll(/<tp-[a-z0-9-]+/g)].map((match) => match[0].slice(1));
  const tag = typeof manifestTag === 'string'
    ? manifestTag
    : fileByTag.has(directoryTag)
      ? directoryTag
      : documentedTags.find((candidate) => fileByTag.has(candidate)) ?? directoryTag;
  const sourceFile = fileByTag.get(tag);
  const data = sourceFile === undefined ? { dependencies: [], credits: [] } : analyze(sourceFile, tagsByFile.get(sourceFile) ?? [tag]);
  const block = docsBlock(data, tag);
  const expression = new RegExp(`${docsStart}[\\s\\S]*?${docsEnd}\\n?`);
  const next = expression.test(markdown)
    ? markdown.replace(expression, `${block}\n`)
    : `${markdown.trimEnd()}\n\n${block}\n`;
  synchronize(doc, next);
}

if (outdated.length > 0) {
  console.error(`Outdated component dependencies:\n${outdated.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(checkOnly ? 'Component dependencies are up to date.' : `Updated dependencies in ${updated} files.`);
}
