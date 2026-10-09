import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { EXAMPLE_TABS_FENCE, normalizeExampleTabs } from './component-example-tabs.mjs';
import { exampleFile } from './component-basic-examples.mjs';

test('updates both language-tab delimiters without changing ordinary tabs', () => {
  const ordinary = '::: tp-tabs\nOne\n: Content\n:::';
  const examples = '::::::::: tp-tabs\nMarkdown\n: ::include{examples/examples.md}\n:::::::::';
  const result = normalizeExampleTabs(`${ordinary}\n\n${examples}`);
  assert.ok(result.startsWith(ordinary));
  assert.ok(result.endsWith(`${EXAMPLE_TABS_FENCE} tp-tabs\nMarkdown\n: ::include{examples/examples.md}\n${EXAMPLE_TABS_FENCE}`));
  assert.equal(normalizeExampleTabs(result), result);
});

test('all public component language tabs use 15 colons outside shorter Markdown fences', () => {
  let count = 0;
  for (const name of readdirSync('public/docs/components')) {
    if (!existsSync(`src/components/${name}/${name}.ts`)) continue;
    const markdown = readFileSync(`public/docs/components/${name}/index.md`, 'utf8');
    const blocks = [...markdown.matchAll(/^(:{3,})[ \t]+tp-tabs[^\n]*\n([\s\S]*?)^\1[ \t]*$/gm)].filter(match => match[2].includes('::include{examples/examples.md}'));
    assert.equal(blocks.length, 1, name);
    assert.equal(blocks[0][1], EXAMPLE_TABS_FENCE, name);
    const included = readFileSync(`public/docs/components/${name}/examples/examples.md`, 'utf8');
    for (const match of included.matchAll(/^(:{3,})(?=\s|$)/gm)) {
      assert.ok(match[1].length < 15, `${name}: nested fence has ${match[1].length} colons`);
    }
    count++;
  }
  assert.ok(count >= 143);
});

test('generation rejects example nesting that would close the surrounding language tabs', () => {
  assert.throws(() => exampleFile('md', 'tp-test', [{ label: 'Basic usage', source: ':'.repeat(13) + '\ncontent\n' + ':'.repeat(13) }]), /shorter nested fences/);
});
