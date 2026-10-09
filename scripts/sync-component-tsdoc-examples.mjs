import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const componentsRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');
let synchronized = 0;

function introductoryHtml(directory, tag) {
  const documentationPath = join(docsRoot, directory, 'index.md');
  if (!existsSync(documentationPath)) return `<${tag}></${tag}>`;

  const markdown = readFileSync(documentationPath, 'utf8');
  const preambleEnd = markdown.search(/^##\s/m);
  const preamble = markdown.slice(0, preambleEnd < 0 ? markdown.length : preambleEnd);
  const viewer = /<tp-html-viewer\b[^>]*>([\s\S]*?)<\/tp-html-viewer>/m.exec(preamble)?.[1] ?? '';
  const template = /<template>([\s\S]*?)<\/template>/m.exec(viewer)?.[1]?.trim();
  if (template !== undefined && template !== '') return template;

  const escapedTag = tag.replaceAll('-', '\\-');
  const direct = new RegExp(`^([ \\t]*<${escapedTag}\\b[^>]*>[\\s\\S]*?<\\/${escapedTag}>)`, 'm')
    .exec(viewer || preamble)?.[1]
    ?.trim();
  return direct || `<${tag}></${tag}>`;
}

for (const directory of readdirSync(componentsRoot)) {
  const sourcePath = join(componentsRoot, directory, `${directory}.ts`);
  if (!existsSync(sourcePath)) continue;

  let source = readFileSync(sourcePath, 'utf8');
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const changes = [];
  const runtimeTags = new Map(
    [...source.matchAll(/customElements\.define\(\s*['"](tp-[a-z0-9-]+)['"]\s*,\s*(\w+)/g)]
      .map((match) => [match[2], match[1]]),
  );
  const moduleSummary = source.match(/^\/\*\*[\s\S]*?@summary\s+(.+?)(?=\s+@[a-z-]+|\s*\*\/)/)?.[1]
    ?.replace(/^\s*\*\s?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const visit = (node) => {
    if (ts.isClassDeclaration(node)) {
      const tags = ts.getJSDocTags(node);
      const tag = tags.find((item) => item.tagName.text === 'tagname');
      const declaredTag = typeof tag?.comment === 'string' ? tag.comment.trim() : '';
      const tagName = declaredTag || (node.name ? runtimeTags.get(node.name.text) : undefined) || '';
      const jsDoc = node.jsDoc?.at(-1);
      if (tagName.startsWith('tp-') && jsDoc === undefined) {
        const html = introductoryHtml(directory, tagName);
        const lines = html.split(/\r?\n/).map((line) => ` * ${line}`).join('\n');
        const summary = moduleSummary || `The \`<${tagName}>\` component.`;
        changes.push({
          start: node.getStart(sourceFile),
          end: node.getStart(sourceFile),
          text: `/**\n * @summary ${summary}\n * @tagname ${tagName}\n * @example\n${lines}\n */\n`,
        });
      } else if (tagName.startsWith('tp-') && jsDoc !== undefined && !declaredTag) {
        const html = introductoryHtml(directory, tagName);
        const lines = html.split(/\r?\n/).map((line) => ` * ${line}`).join('\n');
        changes.push({
          start: jsDoc.end - 2,
          end: jsDoc.end - 2,
          text: ` * @tagname ${tagName}\n * @example\n${lines}\n `,
        });
      } else if (tagName.startsWith('tp-') && jsDoc !== undefined) {
        const introductoryExamples = tags
          .filter((item) => item.tagName.text === 'example');
        const html = introductoryHtml(directory, tagName);
        const lines = html.split(/\r?\n/).map((line) => ` * ${line}`).join('\n');
        const text = `@example\n${lines}\n `;
        const current = introductoryExamples[0];
        for (const duplicate of introductoryExamples.slice(1)) {
          changes.push({
            start: source.lastIndexOf('\n', duplicate.getStart(sourceFile)) + 1,
            end: source.lastIndexOf('\n', duplicate.end) + 1,
            text: '',
          });
        }

        if (current !== undefined) {
          if (current.getFullText(sourceFile) !== text) {
            const nextExample = introductoryExamples[1];
            const end = nextExample
              ? Math.min(current.end, source.lastIndexOf('\n', nextExample.getStart(sourceFile)) + 1)
              : current.end;
            changes.push({ start: current.getStart(sourceFile), end, text });
          }
        } else {
          changes.push({ start: jsDoc.end - 2, end: jsDoc.end - 2, text: `* ${text}` });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  for (const change of changes.sort((a, b) => b.start - a.start)) {
    source = `${source.slice(0, change.start)}${change.text}${source.slice(change.end)}`;
  }
  if (changes.length > 0) {
    writeFileSync(sourcePath, source);
    synchronized += changes.length;
  }
}

console.log(`Synchronized ${synchronized} introductory TypeDoc examples from the documentation.`);
