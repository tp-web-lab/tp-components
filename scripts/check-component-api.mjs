import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const componentsRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');
const problems = [];

const hasModifier = (node, kind) => ts.canHaveModifiers(node) &&
  (ts.getModifiers(node) ?? []).some((modifier) => modifier.kind === kind);
const hasTag = (node, name) => ts.getJSDocTags(node).some((tag) => tag.tagName.text === name);

for (const directory of readdirSync(componentsRoot)) {
  const sourcePath = join(componentsRoot, directory, `${directory}.ts`);
  const manifestPath = join(componentsRoot, directory, `${directory}.json`);
  const docsPath = join(docsRoot, directory, 'index.md');
  if (!existsSync(sourcePath) || !existsSync(manifestPath)) continue;
  let manifest;
  try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch { continue; }
  if (typeof manifest.tagname !== 'string' || !manifest.tagname.startsWith('tp-')) continue;
  const source = readFileSync(sourcePath, 'utf8');
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true);
  let componentClass;
  const visitClass = (node) => {
    if (ts.isClassDeclaration(node) && node.name?.text === manifest.classname) componentClass = node;
    ts.forEachChild(node, visitClass);
  };
  visitClass(sourceFile);
  if (!componentClass) {
    problems.push(`${sourcePath}: component class ${manifest.classname} not found`);
    continue;
  }

  const attributes = new Set((manifest.attributes ?? []).map((item) => item.name));
  const methods = new Set((manifest.methods ?? []).map((item) => String(item.name).split('(')[0]));
  const events = new Set((manifest.events ?? []).map((item) => item.name));
  const cssProperties = new Set((manifest.cssproperties ?? []).map((item) => item.name));

  for (const member of componentClass.members) {
    if (ts.isGetAccessorDeclaration(member) && hasModifier(member, ts.SyntaxKind.StaticKeyword) && member.name?.getText(sourceFile) === 'observedAttributes') {
      const collect = (node) => {
        if (ts.isStringLiteralLike(node) && !node.text.startsWith('data-') && !attributes.has(node.text))
          problems.push(`${sourcePath}: attribute ${node.text} is absent from JSON`);
        ts.forEachChild(node, collect);
      };
      collect(member);
    }
    if (ts.isMethodDeclaration(member) && ts.isIdentifier(member.name) &&
      !hasModifier(member, ts.SyntaxKind.PrivateKeyword) && !hasModifier(member, ts.SyntaxKind.ProtectedKeyword) &&
      !hasModifier(member, ts.SyntaxKind.StaticKeyword) && !hasTag(member, 'internal') &&
      !['connectedCallback', 'disconnectedCallback', 'attributeChangedCallback'].includes(member.name.text) &&
      !methods.has(member.name.text)) {
      problems.push(`${sourcePath}: public method ${member.name.text} is absent from JSON`);
    }
  }

  const visitEvents = (node) => {
    if (ts.isNewExpression(node) && node.expression.getText(sourceFile) === 'CustomEvent' &&
      ts.isStringLiteralLike(node.arguments?.[0]) && !events.has(node.arguments[0].text)) {
      problems.push(`${sourcePath}: event ${node.arguments[0].text} is absent from JSON`);
    }
    ts.forEachChild(node, visitEvents);
  };
  visitEvents(componentClass);

  const cssPath = join(componentsRoot, directory, `${directory}.css`);
  const cssSource = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';
  const prefix = `--tp-${directory}-`;
  for (const match of `${source}\n${cssSource}`.matchAll(/(?:var\(\s*(--[a-zA-Z0-9_-]+)|(--[a-zA-Z0-9_-]+)\s*:)/g)) {
    const name = match[1] ?? match[2];
    if (name.startsWith(prefix) && !cssProperties.has(name))
      problems.push(`${sourcePath}: CSS property ${name} is absent from JSON`);
  }

  const required = [
    ['attribute', manifest.attributes ?? [], ['name', 'type', 'default', 'description']],
    ['method', manifest.methods ?? [], ['name', 'description']],
    ['event', manifest.events ?? [], ['name', 'detail', 'description']],
    ['CSS property', manifest.cssproperties ?? [], ['name', 'default', 'description']],
  ];
  for (const [kind, entries, fields] of required) {
    for (const entry of entries) for (const field of fields) {
      if (entry[field] === undefined || String(entry[field]).trim() === '')
        problems.push(`${manifestPath}: ${kind} ${entry.name ?? '?'} has no ${field}`);
    }
  }

  if (!existsSync(docsPath)) {
    problems.push(`${docsPath}: documentation is missing`);
    continue;
  }
  const docs = readFileSync(docsPath, 'utf8');
  const api = docs.match(/<!-- tp-docgen:api[^>]*-->([\s\S]*?)<!-- \/tp-docgen:api -->/)?.[1]
    ?.replaceAll('&#45;', '-').replaceAll('&lt;', '<').replaceAll('&gt;', '>') ?? '';
  for (const entries of [manifest.attributes ?? [], manifest.methods ?? [], manifest.events ?? [], manifest.cssproperties ?? []]) {
    for (const entry of entries) {
      const name = String(entry.name).split('(')[0];
      if (!api.includes(`<code>${name}</code>`)) problems.push(`${docsPath}: ${name} is absent from Programming/API`);
    }
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('All public attributes, methods, events, and CSS properties match TypeScript/CSS, JSON, and documentation.');
}
