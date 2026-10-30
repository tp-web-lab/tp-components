/** Check that every published component method has a useful description. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../src/components');
const verbs = { adds: 'add', sets: 'set', gets: 'get', returns: 'get', exports: 'export', imports: 'import', reads: 'read', moves: 'move', deletes: 'delete', inserts: 'insert', resets: 'reset', toggles: 'toggle', registers: 'register', unregisters: 'unregister', removes: 'remove', finds: 'find' };
function words(value) {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean).map(word => verbs[word] ?? word).join(' ');
}
let count = 0;
const problems = [];
for (const component of readdirSync(root)) {
  const path = resolve(root, component, `${component}.json`);
  if (!existsSync(path)) continue;
  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  for (const method of manifest.methods ?? []) {
    count++;
    const name = String(method.name ?? '').split('(')[0];
    const description = String(method.description ?? '').trim();
    if (!name || !description || /^(?:API documentation summary|Method\b)/i.test(description) || words(description) === words(name)) {
      problems.push(`${component}.${name}: describe the method's effect, inputs or result instead of repeating its name`);
    }
  }
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else console.log(`Verified descriptions of ${count} public method signatures.`);
