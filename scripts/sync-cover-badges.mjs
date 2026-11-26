/** Refresh the documentation cover inventory without executing test cases.
 * Components: documented component pages with API metadata.
 * Examples: distinct selectable HTML examples (language variants counted once).
 * Tests: cases collected by the normal Vitest configuration, not passing results.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { documentedComponents } from './standardize-component-examples.mjs';
import { exampleLabels } from './sync-component-example-descriptions.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const check = process.argv.includes('--check');
const path = join(root, 'public/docs/cover.md');
const original = readFileSync(path, 'utf8');
const components = documentedComponents();
const examples = components.reduce((count, name) => count + exampleLabels(readFileSync(join(root, `public/docs/components/${name}/examples/examples.html`), 'utf8')).length, 0);
const temporary = mkdtempSync(join(tmpdir(), 'tp-cover-tests-'));
let tests;
try {
 const output = join(temporary, 'tests.json');
 execFileSync(process.execPath, [join(root, 'node_modules/vitest/vitest.mjs'), 'list', '--maxWorkers=1', '--no-file-parallelism', `--json=${output}`], {cwd:root, stdio:['ignore','pipe','pipe']});
 const collected = JSON.parse(readFileSync(output, 'utf8'));
 if (!Array.isArray(collected) || !collected.length || collected.some(test => typeof test.file !== 'string' || typeof test.name !== 'string')) throw new Error('Invalid or empty Vitest test inventory');
 tests = collected.length;
} finally {
 rmSync(temporary, {recursive:true, force:true});
}
let updated = original;
for (const [label, value] of Object.entries({Components:components.length, Examples:examples, Tests:tests})) {
 const pattern = new RegExp(`^(${label} <tp-divider[^>]*><\\/tp-divider> )(?:[XYZ]+|[\\d ,]+)$`, 'gm');
 if ([...updated.matchAll(pattern)].length !== 1) throw new Error(`Expected one ${label} badge`);
 updated = updated.replace(pattern, (_match, prefix) => prefix + value);
}
const datePattern = /^Update (?:yyyy\/mm\/dd|\d{4}\/\d{2}\/\d{2})$/gm;
if ([...updated.matchAll(datePattern)].length !== 1) throw new Error('Expected one cover update date');
// A check validates inventory freshness, not that a correctly dated cover was edited today.
if (!check) {
 const parts = new Intl.DateTimeFormat('en', {timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const value = type => parts.find(part => part.type === type).value;
 updated = updated.replace(datePattern, `Update ${value('year')}/${value('month')}/${value('day')}`);
}
if (check && (updated !== original || original.includes('Update yyyy/mm/dd'))) {
 console.error('Cover badges are outdated. Run pnpm docs:sync-cover.');
 process.exitCode = 1;
} else {
 if (!check && updated !== original) writeFileSync(path, updated);
 console.log(`${check ? 'Checked' : 'Updated'} cover: ${components.length} components, ${examples} examples, ${tests} collected tests; ${updated.match(/^Update .*$/m)[0]}.`);
}
