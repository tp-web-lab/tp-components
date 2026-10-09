import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFragment } from 'parse5';

const docsRoot = fileURLToPath(new URL('../public/docs/components/', import.meta.url));

function children(node) {
  return node.childNodes ?? [];
}

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value;
}

function findFirst(node, predicate) {
  if (predicate(node)) return node;
  for (const child of children(node)) {
    const match = findFirst(child, predicate);
    if (match) return match;
  }
  return undefined;
}

function htmlLabels(source) {
  const root = findFirst(parseFragment(source), (node) => node.tagName === 'tp-html-viewer');
  const template = children(root ?? {}).find(node => node.tagName === 'template');
  const labels = children(template?.content ?? root ?? {}).filter((node) =>
    node.tagName === 'div' && attribute(node, 'role') === 'example'
  ).map((node) => attribute(node, 'label')?.trim() || 'Example');
  return labels.length > 0 ? labels : ['Example'];
}

function markdownLabels(source, hasNamedExamples) {
  if (!hasNamedExamples) return ['Example'];
  const lines = source.split(/\r?\n/);
  const labels = [];
  for (let index = 0; index < lines.length; index += 1) {
    const open = lines[index].match(/^(`{3,}|~{3,})\s*example\s*(.*)$/);
    if (!open) continue;
    const fence = open[1];
    const args = open[2];
    const match = args.match(/(?:^|[\s{])label\s*=\s*("[^"]*"|'[^']*'|[^\s}]+)/);
    labels.push(match?.[1]?.replace(/^['"]|['"]$/g, '') || `Example ${labels.length + 1}`);
    index += 1;
    while (index < lines.length && lines[index].trim() !== fence) index += 1;
  }
  return labels.length > 0 ? labels : ['Example'];
}

function asciidocLabels(source, hasNamedExamples) {
  if (!hasNamedExamples) return ['Example'];
  const lines = source.split(/\r?\n/);
  const labels = [];
  for (let index = 0; index < lines.length - 1; index += 1) {
    const title = lines[index].match(/^\.([^.].*)$/)?.[1]?.trim();
    const delimiter = lines[index + 1].trim();
    if (!title || !/^={4,}$/.test(delimiter)) continue;
    labels.push(title);
    index += 2;
    while (index < lines.length && lines[index].trim() !== delimiter) index += 1;
  }
  return labels.length > 0 ? labels : ['Example'];
}

function restructuredTextLabels(source, hasNamedExamples) {
  if (!hasNamedExamples) return ['Example'];
  const matches = Array.from(source.matchAll(/^([ \t]*)\.\. example::\s*(.+)$/gm));
  if (matches.length === 0) return ['Example'];
  const minimumIndent = Math.min(...matches.map((match) => match[1].length));
  return matches.filter((match) => match[1].length === minimumIndent).map((match) => match[2].trim());
}

const failures = [];
let checked = 0;
for (const entry of readdirSync(docsRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const directory = join(docsRoot, entry.name, 'examples');
  let sources;
  try {
    sources = Object.fromEntries(['html', 'adoc', 'md', 'rst'].map((extension) => [
      extension,
      readFileSync(join(directory, `examples.${extension}`), 'utf8'),
    ]));
  } catch {
    continue;
  }

  checked += 1;
  const expectedLabels = htmlLabels(sources.html);
  const hasNamedExamples = expectedLabels.length > 1 || expectedLabels[0] !== 'Example';
  const labels = {
    html: expectedLabels,
    adoc: asciidocLabels(sources.adoc, hasNamedExamples),
    md: markdownLabels(sources.md, hasNamedExamples),
    rst: restructuredTextLabels(sources.rst, hasNamedExamples),
  };
  const expected = JSON.stringify(labels.html);
  for (const language of ['adoc', 'md', 'rst']) {
    if (JSON.stringify(labels[language]) !== expected) {
      failures.push(`${entry.name}: html=${expected}, ${language}=${JSON.stringify(labels[language])}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Example labels differ between markup languages:\n${failures.join('\n')}`);
}

console.log(`Checked matching labels in ${checked} component example sets.`);
