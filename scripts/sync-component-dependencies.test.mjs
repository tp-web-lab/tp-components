/**
 * Tests dependency synchronization, rendered list structure and unknown-component rejection.
 *
 * Run with the Node.js test runner from the tp-components package root after installing
 * workspace dependencies.
 *
 * @example
 * node --test scripts/sync-component-dependencies.test.mjs
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, copyFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
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


test('only eager runtime imports and re-exports become dependencies', () => {
  const root = mkdtempSync(join(tmpdir(), 'tp-dependencies-'));
  try {
    mkdirSync(join(root, 'scripts'), { recursive: true });
    mkdirSync(join(root, 'src/utilities'), { recursive: true });
    mkdirSync(join(root, 'public/docs/components'), { recursive: true });
    symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
    copyFileSync('scripts/sync-component-dependencies.mjs', join(root, 'scripts/sync-component-dependencies.mjs'));
    for (const name of ['owner', 'eager', 'shared', 'exported', 'types', 'lazy', 'example']) {
      const dir = join(root, 'src/components', name);
      mkdirSync(dir, { recursive: true });
      const imports = name === 'owner' ? `
import '../eager/eager.js';
import type { Types } from '../types/types.js';
import { type Types } from '../types/types.js';
export type { Types } from '../types/types.js';
export { type Types } from '../types/types.js';
export { value } from '../exported/exported.js';
import { helper } from '../../utilities/helper.js';
// import '../example/example.js';
const example = "import '../example/example.js'";
const load = () => import('../lazy/lazy.js');
` : '';
      writeFileSync(join(dir, `${name}.ts`), `${imports}\nclass Component {}\ncustomElements.define('tp-${name}', Component);\n`);
      writeFileSync(join(dir, `${name}.json`), JSON.stringify({tagname:`tp-${name}`,classname:'Component'}));
    }
    writeFileSync(join(root, 'src/utilities/helper.ts'), "import '../components/shared/shared.js'; export const helper = 1;");
    const script = join(root, 'scripts/sync-component-dependencies.mjs');
    execFileSync(process.execPath, [script], {encoding:'utf8'});
    const path = join(root, 'src/components/owner/owner.json');
    const before = readFileSync(path, 'utf8');
    assert.deepEqual(JSON.parse(before).dependencies.map(item => item.name), ['tp-eager', 'tp-exported', 'tp-shared']);
    execFileSync(process.execPath, [script, '--check'], {encoding:'utf8'});
    assert.equal(readFileSync(path, 'utf8'), before);
  } finally { rmSync(root, {recursive:true, force:true}); }
});
