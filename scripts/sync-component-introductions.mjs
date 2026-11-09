/** Keep class documentation aligned with the functional introduction of each component. */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { documentedComponents } from './standardize-component-examples.mjs';

const root = resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
const changed = [];
for (const name of documentedComponents()) {
  const page = readFileSync(resolve(root, `public/docs/components/${name}/index.md`), 'utf8');
  const introduction = page.match(/^The custom[^\n]+/m)?.[0];
  const prefix = `The custom \`<tp-${name}>\` element `;
  if (!introduction?.startsWith(prefix)) throw new Error(`Missing introduction: ${name}`);
  const path = resolve(root, `src/components/${name}/${name}.ts`);
  const source = readFileSync(path, 'utf8');
  const parsed = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const comments = parsed.statements.filter(ts.isClassDeclaration).flatMap(node => node.jsDoc ?? [])
    .filter(doc => doc.tags?.some(tag => tag.tagName.text === 'tagname' && tag.comment === `tp-${name}`));
  if (comments.length !== 1) throw new Error(`Expected one component class comment: ${name}`);
  const doc = comments[0];
  const raw = source.slice(doc.pos, doc.end);
  const body = raw.slice(3, -2).replace(/^[ \t]+/, '').replace(/^([^\n]*?)\s+(?:\*\s*)?@(?=\w)/, '$1\n * @');
  const lines = body.split('\n').map(line => line.replace(/^\s*\* ?/, '').trimEnd());
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  // Replace the opening paragraph, preserving further explanations and every API tag.
  if (lines[0] && !lines[0].startsWith('@')) {
    let end = lines.findIndex(line => !line.trim() || line.startsWith('@'));
    if (end < 0) end = lines.length;
    lines.splice(0, end);
  }
  while (lines.length && !lines[0].trim()) lines.shift();
  const description = introduction.slice(prefix.length);
  const summary = description[0].toUpperCase() + description.slice(1);
  const summaryIndex = lines.findIndex(line => /^@summary\b/.test(line));
  if (summaryIndex >= 0) {
    let end = summaryIndex + 1;
    while (end < lines.length && !lines[end].startsWith('@')) end++;
    lines.splice(summaryIndex, end - summaryIndex, `@summary ${summary}`);
  } else {
    const tagIndex = lines.findIndex(line => line.startsWith('@'));
    lines.splice(tagIndex < 0 ? lines.length : tagIndex, 0, `@summary ${summary}`);
  }
  const nextComment = '/**\n' + [introduction, '', ...lines].map(line => line ? ` * ${line}` : ' *').join('\n') + '\n */';
  if (nextComment === raw) continue;
  changed.push(path);
  if (!check) writeFileSync(path, source.slice(0, doc.pos) + nextComment + source.slice(doc.end));
}
if (check && changed.length) {
  console.error(`Outdated class introductions (${changed.length}):\n${changed.join('\n')}`);
  process.exitCode = 1;
} else console.log(`Checked ${documentedComponents().length} class introductions; ${changed.length} updated.`);
