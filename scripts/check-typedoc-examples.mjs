import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse } from 'parse5';

const children = node => node.childNodes ?? [];
const hasClass = (node, name) => node.attrs?.find(attr => attr.name === 'class')?.value.split(/\s+/).includes(name);
const find = (node, predicate) => predicate(node) ? node : children(node).map(child => find(child, predicate)).find(Boolean);
const text = node => node.nodeName === '#text' ? node.value : node.tagName === 'br' ? '\n' : children(node).map(text).join('');

export function checkExample(html, expected) {
  const document = parse(html);
  // Restrict this check to the class comment; methods can have their own examples.
  const comment = find(document, node => hasClass(node, 'tsd-comment'));
  const example = comment && find(comment, node => hasClass(node, 'tsd-tag-example'));
  if (!example) return 'Missing class example';
  const examples = children(example.parentNode).filter(node => hasClass(node, 'tsd-tag-example'));
  if (examples.length !== 1) return `Expected one class example, found ${examples.length}`;
  const code = find(example, node => node.tagName === 'code');
  if (!code || text(code).trim() !== expected.trim()) return 'Class example differs from introduction (including whitespace)';
  return null;
}

export function audit(root) {
  const docs = resolve(root, 'public/docs/components');
  const api = resolve(root, 'public/api/classes');
  const pages = readdirSync(api);
  const errors = [];
  let count = 0;
  for (const component of readdirSync(docs)) {
    if (!existsSync(resolve(docs, component, 'index.md'))) continue;
    const sourcePath = resolve(root, `src/components/${component}/${component}.ts`);
    // Abstract base classes and retired documentation placeholders are not custom elements.
    if (!existsSync(sourcePath)) continue;
    const source = readFileSync(sourcePath, 'utf8');
    if (!/@tagname\s+tp-/.test(source) && !/customElements\.define\(/.test(source)) continue;
    count += 1;
    const fail = message => errors.push(`${component}: ${message}`);
    const introPath = resolve(docs, component, 'examples/introduction.html');
    const metadataPath = resolve(root, `src/components/${component}/${component}.json`);
    if (!existsSync(introPath) || !existsSync(metadataPath)) {
      fail('Missing introduction or API metadata');
      continue;
    }
    const expected = readFileSync(introPath, 'utf8').trim();
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf8'));
    if (metadata.examples?.length !== 1 || metadata.examples[0].code.trim() !== expected) fail('API metadata differs from introduction');
    const matches = pages.filter(page => page.endsWith(`.${metadata.classname}.html`));
    if (matches.length !== 1) {
      fail(`Expected one class page, found ${matches.length}`);
      continue;
    }
    const error = checkExample(readFileSync(resolve(api, matches[0]), 'utf8'), expected);
    if (error) fail(error);
  }
  if (count === 0) errors.push('No documented components found');
  return { count, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const { count, errors } = audit(root);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else console.log(`Verified ${count} introductory examples: API metadata and TypeDoc match exactly, preserving line breaks.`);
}
