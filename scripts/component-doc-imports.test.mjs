import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { imports, syncImports } from './component-doc-imports.mjs';

test('generates the three standard tabs with closed script tags', () => {
  const block = imports('text-to-speech');
  assert.match(block, /script\n: Autoloading:/);
  assert.match(block, /import\n:/);
  assert.match(block, /bundler\n:/);
  assert.equal((block.match(/<script /g) ?? []).length, 2);
  assert.equal((block.match(/<\/script>/g) ?? []).length, 2);
  assert.ok(block.includes('/components/text-to-speech/text-to-speech.js'));
});

test('replaces a manual Imports section without touching adjacent content', () => {
  const before = '# Component\n\nAuthor content.\n\n';
  const after = '<!-- tp-docgen:dependencies:start -->\n## Dependencies\n\nKeep this.\n';
  const result = syncImports(`${before}### Imports\n\nOld import\n\n${after}`, 'example');
  assert.equal(result, `${before}### Imports\n\n${imports('example')}\n\n${after}`);
  assert.equal(syncImports(result, 'example'), result);
});

test('handles a final section and preserves a following heading', () => {
  assert.equal(syncImports('### Imports\nOld', 'example'), `### Imports\n\n${imports('example')}\n\n`);
  assert.ok(syncImports('### Imports\nOld\n### Next\nKeep', 'example').endsWith('### Next\nKeep'));
});

test('inserts missing Imports after the generated API', () => {
  const result = syncImports('<!-- /tp-docgen:api -->\n## Dependencies', 'example');
  assert.ok(result.includes(imports('example')));
  assert.equal(syncImports('No generated API', 'example'), 'No generated API');
});

test('the text-to-speech Imports section matches the shared generator', () => {
  const markdown = readFileSync(new URL('../public/docs/components/text-to-speech/index.md', import.meta.url), 'utf8');
  assert.equal(syncImports(markdown, 'text-to-speech'), markdown);
});
