import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import ts from 'typescript';

const componentsRoot = resolve(import.meta.dirname, '../src/components');
const problems = [];

for (const directory of readdirSync(componentsRoot)) {
  const sourcePath = join(componentsRoot, directory, `${directory}.ts`);
  const manifestPath = join(componentsRoot, directory, `${directory}.json`);
  if (!existsSync(sourcePath) || !existsSync(manifestPath)) continue;

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const attributes = new Map((manifest.attributes ?? []).map((attribute) => [attribute.name, attribute]));

  for (const [name, attribute] of attributes) {
    for (const field of ['type', 'default', 'description']) {
      const value = attribute[field];
      if (value === undefined || String(value).trim() === '' || String(value).trim() === '*') {
        problems.push(`${manifestPath}: ${name} has no ${field}`);
      }
    }
    if (/^=\s/.test(String(attribute.description).trim())) {
      problems.push(`${manifestPath}: ${name} embeds its default value in description`);
    }
  }

  const source = readFileSync(sourcePath, 'utf8');
  for (const block of source.match(/\/\*\*[\s\S]*?\*\//g) ?? []) {
    if (!block.includes('@tagname')) continue;
    for (const line of block.split('\n')) {
      if (/^\s*\*\s+@attr\s+\{/.test(line) &&
          !/^\s*\*\s+@attr\s+\{[^}]+\}\s+[\w-]+\s+=\s+.+\s+-\s+\S/.test(line)) {
        problems.push(`${sourcePath}: incomplete compact attribute declaration: ${line.trim()}`);
      }
      if (/^\s*\*\s+@default\s+[\w-]+\s+.+/.test(line)) {
        problems.push(`${sourcePath}: named @default must be merged into its @attr declaration`);
      }
    }
  }
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const observed = new Set();

  const visit = (node) => {
    if (
      ts.isGetAccessorDeclaration(node) &&
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword) &&
      node.name?.getText(sourceFile) === 'observedAttributes'
    ) {
      const collect = (child) => {
        if (ts.isArrayLiteralExpression(child)) {
          for (const element of child.elements) {
            if (ts.isStringLiteralLike(element) && !element.text.startsWith('data-')) observed.add(element.text);
          }
        }
        ts.forEachChild(child, collect);
      };
      collect(node);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  for (const name of observed) {
    if (!attributes.has(name)) problems.push(`${sourcePath}: observed attribute ${name} is undocumented`);
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log('All component attributes have a type, default value, and description.');
}
