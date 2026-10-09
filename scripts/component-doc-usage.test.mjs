import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { componentUsage } from './component-doc-usage.mjs';

const root = resolve(import.meta.dirname, '..');

test('every public component separates reader controls from author directives', () => {
  let count = 0;
  for (const name of readdirSync(resolve(root, 'public/docs/components'))) {
    if (!existsSync(resolve(root, 'src/components', name, `${name}.ts`))) continue;
    const markdown = readFileSync(resolve(root, 'public/docs/components', name, 'index.md'), 'utf8');
    const usage = markdown.split('\n## Usage\n')[1]?.split('\n## Examples\n')[0];
    assert.ok(usage, name);
    assert.deepEqual([...usage.matchAll(/^### (.+)$/gm)].map(match => match[1]), ['User interactions', 'Author directives'], name);
    const reader = usage.split('### User interactions\n')[1].split('### Author directives\n')[0];
    assert.ok(reader.trim().length > 40, name);
    assert.doesNotMatch(reader, /^\s*```(?:html|js|ts)|\battribute\b|`<tp-/m, name);
    assert.doesNotMatch(usage, /in HTML, or use the corresponding component extension/, name);
    count += 1;
  }
  assert.ok(count >= 143);
});

test('moves command tables but keeps declaration tabs and nested source intact', () => {
  const source = '### Initial viewer content\n\n::: tp-tabs\nscript\n: ```html\n  <tp-html-viewer></tp-html-viewer>\n  ```\n:::\n\n### Commands\n\n| Command | Action |\n| --- | --- |\n| Run | Render the source. |';
  const result = componentUsage('html-viewer', source);
  assert.ok(result.indexOf('#### Commands') < result.indexOf('### Author directives'));
  assert.ok(result.indexOf('#### Initial viewer content') > result.indexOf('### Author directives'));
  assert.match(result, /: ```html\n  <tp-html-viewer><\/tp-html-viewer>\n  ```/);
});

test('does not demote headings inside a fenced example', () => {
  const source = '```markdown\n### Commands\nKeep this source heading.\n```';
  assert.ok(componentUsage('markdown', source).includes(source));
});

test('preserves an already reviewed Usage section', () => {
  const source = '### User interactions\n\nReviewed instructions.\n\n### Author directives\n\nReviewed configuration.';
  assert.equal(componentUsage('future-component', source), source);
});

test('requires editorial instructions for an unknown new component', () => {
  assert.throws(() => componentUsage('future-component', 'Declare the component.'), /Document user interactions/);
});

test('synchronization is idempotent, including an author section without old content', () => {
  const converted = componentUsage('color-picker', 'Click a color to copy its CSS reference.');
  assert.equal(componentUsage('color-picker', converted), converted);
  assert.match(execFileSync(process.execPath, ['scripts/sync-component-doc-usage.mjs', '--check'], { cwd: root, encoding: 'utf8' }), /\d+ component Usage sections; 0 outdated/);
});
