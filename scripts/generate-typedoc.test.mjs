import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateTypeDoc } from './generate-typedoc.mjs';

test('TypeDoc cache invalidates changed inputs and output, and never caches failed generation', t => {
  const root = mkdtempSync(join(tmpdir(), 'tp-typedoc-cache-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const write = (path, value) => {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), value);
  };
  write('src/example.ts', 'export const value = 1;');
  write('typedoc.json', '{}');
  let runs = 0;
  const options = { ifNeeded: true, log() {}, run() {
    runs++;
    write('public/api/index.html', 'index');
    write('public/api/classes/Example.html', 'class');
  } };
  const generate = () => generateTypeDoc(root, options);
  assert.equal(generate(), true);
  assert.equal(generate(), false);
  // Rewriting identical content is not a source change.
  write('src/example.ts', 'export const value = 1;');
  write('public/api/component-pages.json', '{}');
  assert.equal(generate(), false);
  for (const [path, content] of [
    ['src/example.ts', 'export const value = 2;'],
    ['src/added.ts', 'export const other = 3;'],
    ['typedoc.json', '{"excludePrivate":true}'],
    ['scripts/typedoc.css', 'code { color: red; }'],
    ['node_modules/typedoc/package.json', '{"version":"new"}'],
    ['public/api/classes/Example.html', 'damaged'],
  ]) {
    write(path, content);
    assert.equal(generate(), true, path);
    assert.equal(generate(), false, path);
  }
  rmSync(join(root, 'src/added.ts'));
  assert.equal(generate(), true);
  rmSync(join(root, 'public/api/classes/Example.html'));
  assert.equal(generate(), true);
  assert.equal(generateTypeDoc(root, { ...options, ifNeeded: false }), true);
  write('src/example.ts', 'changed');
  assert.throws(() => generateTypeDoc(root, { ...options, run() { throw Error('failed'); } }), /failed/);
  assert.equal(generate(), true);
  const count = runs;
  assert.equal(generate(), false);
  assert.equal(runs, count);
  const cache = join(root, 'node_modules/.cache/tp-components/typedoc.json');
  writeFileSync(cache, '{');
  assert.equal(generate(), true);
  write('src/example.ts', 'before');
  generateTypeDoc(root, { ...options, run() { options.run(); write('src/example.ts', 'during'); } });
  assert.equal(generate(), true, 'change during generation must not be cached');
  assert.equal(JSON.parse(readFileSync(cache, 'utf8')).input.length, 64);
});
