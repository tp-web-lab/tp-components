import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import MarkdownIt from 'markdown-it';

test('each generated Internal and External section renders as a single list', () => {
  const parser = new MarkdownIt({ html: true });
  for (const directory of readdirSync('public/docs/components')) {
    const path = `public/docs/components/${directory}/index.md`;
    if (!existsSync(path)) continue;
    const block = readFileSync(path, 'utf8').match(/<!-- tp-docgen:dependencies:start -->([\s\S]*?)<!-- tp-docgen:dependencies:end -->/)?.[1];
    if (!block) continue;
    for (const [heading, content] of [...block.matchAll(/### (Internal|External)\n([\s\S]*?)(?=### |$)/g)].map(match => [match[1], match[2]])) {
      const expected = [...content.matchAll(/^@(?:tp-dependency|credit) /gm)].length;
      const tokens = parser.parse(content, {});
      assert.equal(tokens.filter(token => token.type === 'bullet_list_open').length, expected > 0 ? 1 : 0, `${directory}: ${heading} list count`);
      assert.equal(tokens.filter(token => token.type === 'list_item_open').length, expected, `${directory}: ${heading} item count`);
    }
  }
});

test('text-to-speech dependencies stay synchronized with imports in source, JSON and documentation', () => {
  const paths = [
    'src/components/text-to-speech/text-to-speech.ts',
    'src/components/text-to-speech/text-to-speech.json',
    'public/docs/components/text-to-speech/index.md',
  ];
  const before = paths.map(path => readFileSync(path, 'utf8'));
  const output = execFileSync(process.execPath, ['scripts/sync-component-dependencies.mjs', '--check', '--component', 'tp-text-to-speech'], { encoding: 'utf8' });
  assert.match(output, /up to date/);
  assert.deepEqual(paths.map(path => readFileSync(path, 'utf8')), before);
  const manifest = JSON.parse(before[1]);
  for (const tag of ['tp-base', 'tp-button-group', 'tp-dropdown', 'tp-icon-button']) {
    assert.ok(manifest.dependencies.some(dependency => dependency.name === tag));
    assert.ok(before[0].includes(`@tp-dependency ${tag}`));
    assert.ok(before[2].includes(`@tp-dependency ${tag}`));
  }
});

test('rejects an unknown component instead of updating every component', () => {
  assert.throws(() => execFileSync(process.execPath, ['scripts/sync-component-dependencies.mjs', '--component', 'does-not-exist'], { stdio: 'pipe' }));
});
