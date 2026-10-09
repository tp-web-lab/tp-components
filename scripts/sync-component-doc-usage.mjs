import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { componentUsage } from './component-doc-usage.mjs';

const root = resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
let total = 0;
let changed = 0;
for (const name of readdirSync(resolve(root, 'public/docs/components'))) {
  const path = resolve(root, 'public/docs/components', name, 'index.md');
  if (!existsSync(path) || !existsSync(resolve(root, 'src/components', name, `${name}.ts`))) continue;
  const markdown = readFileSync(path, 'utf8');
  const start = markdown.indexOf('\n## Usage\n');
  const end = markdown.indexOf('\n## Examples\n', start);
  if (start < 0 || end < 0) throw new Error(`Missing Usage or Examples in ${name}`);
  const next = `${markdown.slice(0, start)}\n## Usage\n\n${componentUsage(name, markdown.slice(start + '\n## Usage\n'.length, end))}\n${markdown.slice(end)}`;
  total += 1;
  if (next === markdown) continue;
  changed += 1;
  if (!check) writeFileSync(path, next);
}
console.log(`Checked ${total} component Usage sections; ${changed} ${check ? 'outdated' : 'updated'}.`);
if (check && changed) process.exitCode = 1;
