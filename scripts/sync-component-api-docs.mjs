import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { syncImports } from './component-doc-imports.mjs';

const root = resolve(import.meta.dirname, '..');
const componentsRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');

const cell = (value = '') => String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>').trim();
const code = (value = '') => value === '' ? '' : `<code>${cell(value)
  .replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('{', '&#123;').replaceAll('}', '&#125;')
  .replaceAll('--', '&#45;&#45;')}</code>`;
const table = (headings, rows, empty) => {
  const body = rows.length === 0 ? [empty] : rows;
  return `| ${headings.join(' | ')} |\n  | ${headings.map(() => '---').join(' | ')} |\n${body.map((row) => `  | ${row.join(' | ')} |`).join('\n')}`;
};

// TypeScript permits multiline unions with a leading separator; display them inline.
const inlineType = (value = '') => String(value)
  .replace(/^\s*\|\s*/, '')
  .replace(/\s*[\r\n]+\s*/g, ' ')
  .trim();

function apiBlock(manifest) {
  const attributes = (manifest.attributes ?? []).map((item) =>
    [code(item.name), code(inlineType(item.type)), code(item.default), cell(item.description)]);
  const methods = (manifest.methods ?? []).map((item) => {
    const signature = item.name ?? '';
    return [code(signature.split('(')[0]), code(signature), cell(item.description)];
  });
  const events = (manifest.events ?? []).map((item) =>
    [code(item.name), code(item.detail), cell(item.description)]);
  const css = (manifest.cssproperties ?? []).map((item) =>
    [code(item.name), code(item.default), cell(item.description)]);
  return `::: tp-tabs
Attributes
: ${table(['Attribute', 'Type', 'Default', 'Description'], attributes, ['None.', '', '', ''])}
  [Attributes of \`<${manifest.tagname}>\`]

Methods
: ${table(['Method', 'Signature', 'Description'], methods, ['None.', '', ''])}
  [Public methods of \`${manifest.classname}\`]

Events
: ${table(['Event', 'Detail', 'Description'], events, ['None.', '', ''])}
  [Events emitted by \`<${manifest.tagname}>\`]

CSS properties
: ${table(['CSS property', 'Default', 'Description'], css, ['None.', '', ''])}
  [CSS properties of \`<${manifest.tagname}>\`]
:::`;
}

let synchronized = 0;
const checkOnly = process.argv.includes('--check');
const componentIndex = process.argv.indexOf('--component');
const selected = componentIndex < 0 ? null : process.argv[componentIndex + 1]?.replace(/^tp-/, '');
if (componentIndex >= 0 && (!selected || !existsSync(join(componentsRoot, selected, `${selected}.json`)))) {
  throw new Error('Provide a valid component after --component (NAME or tp-NAME).');
}
const outdated = [];
for (const directory of readdirSync(componentsRoot)) {
  if (selected && selected !== directory) continue;
  const manifestPath = join(componentsRoot, directory, `${directory}.json`);
  const documentationPath = join(docsRoot, directory, 'index.md');
  if (!existsSync(manifestPath) || !existsSync(documentationPath)) continue;
  let manifest;
  try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch { continue; }
  if (typeof manifest.tagname !== 'string' || typeof manifest.classname !== 'string') continue;
  const markdown = readFileSync(documentationPath, 'utf8');
  const startMarker = `<!-- tp-docgen:api ${manifest.classname} -->`;
  const endMarker = '<!-- /tp-docgen:api -->';
  const start = markdown.indexOf(startMarker);
  const end = markdown.indexOf(endMarker, start);
  if (start < 0 || end < 0) continue;
  const next = syncImports(`${markdown.slice(0, start + startMarker.length)}\n${apiBlock(manifest)}\n${markdown.slice(end)}`, directory);
  if (next !== markdown) {
    if (checkOnly) outdated.push(documentationPath);
    else {
      writeFileSync(documentationPath, next);
      synchronized += 1;
    }
  }
}

if (outdated.length > 0) {
  console.error(`Outdated component API documentation:\n${outdated.join('\n')}`);
  process.exitCode = 1;
} else if (checkOnly) {
  console.log('Component API tables and Imports sections are up to date.');
} else {
  console.log(`Synchronized API tables and Imports in ${synchronized} component documentation pages.`);
}
