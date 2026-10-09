import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const componentsRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');
const baselinePath = join(root, 'config/accessibility-static-review-baseline.json');
const checkOnly = process.argv.includes('--check');
const baseline = existsSync(baselinePath)
  ? new Set(JSON.parse(readFileSync(baselinePath, 'utf8')))
  : new Set();

function classComment(source) {
  const classIndex = source.search(/export\s+class\s+\w+/);
  if (classIndex < 0) return '';
  const start = source.lastIndexOf('/**', classIndex);
  if (start < 0) return '';
  const end = source.indexOf('*/', start);
  return end < 0 ? '' : source.slice(start, end + 2);
}

function tags(comment, name) {
  const expression = new RegExp(`^\\s*\\*\\s*@${name}\\s+(.+)$`, 'gm');
  return [...comment.matchAll(expression)].map((match) => match[1].trim());
}

function synchronize(markdown) {
  return markdown.replace(/^## Accessibility[^\S\n]*\r?\n[\s\S]*?(?=^## |$(?![\s\S]))/gm, '');
}

const outdated = [];
const undocumented = [];
let synchronized = 0;
const staticReviewDirectories = [];
for (const directory of readdirSync(docsRoot)) {
  const sourcePath = join(componentsRoot, directory, `${directory}.ts`);
  const documentationPath = join(docsRoot, directory, 'index.md');
  if (!existsSync(documentationPath)) continue;

  const source = existsSync(sourcePath) ? readFileSync(sourcePath, 'utf8') : '';
  const hasDetailedContract = tags(classComment(source), 'accessibility').length > 0;
  if (!hasDetailedContract) {
    staticReviewDirectories.push(directory);
    if (baseline.size > 0 && !baseline.has(directory)) undocumented.push(directory);
  }
  const markdown = readFileSync(documentationPath, 'utf8');
  const next = synchronize(markdown);
  if (next === markdown) continue;

  if (checkOnly) outdated.push(documentationPath);
  else {
    writeFileSync(documentationPath, next);
    synchronized += 1;
  }
}

if (!existsSync(baselinePath) && !checkOnly) {
  mkdirSync(join(root, 'config'), { recursive: true });
  writeFileSync(baselinePath, `${JSON.stringify(staticReviewDirectories.sort(), null, 2)}\n`);
}

if (undocumented.length > 0) {
  console.error(`New components require explicit accessibility metadata:\n${undocumented.join('\n')}`);
  process.exitCode = 1;
} else if (outdated.length > 0) {
  console.error(`Outdated component accessibility documentation:\n${outdated.join('\n')}`);
  process.exitCode = 1;
} else if (checkOnly) {
  console.log('Component pages have no redundant Accessibility section.');
} else {
  console.log(`Removed ${synchronized} component accessibility sections.`);
}
