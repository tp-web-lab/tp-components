import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,copyFileSync,symlinkSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {test} from 'node:test';

test('synchronizes one complete example, preserves following tags and supports a read-only check',()=>{
 const fixture=mkdtempSync(join(tmpdir(),'tp-tsdoc-'));
 try {
  for(const path of ['scripts','src/components/demo','public/docs/components/demo/examples'])mkdirSync(join(fixture,path),{recursive:true});
  copyFileSync(new URL('./sync-component-tsdoc-examples.mjs',import.meta.url),join(fixture,'scripts/sync-component-tsdoc-examples.mjs'));
  symlinkSync(resolve('node_modules'),join(fixture,'node_modules'));
  const sourcePath=join(fixture,'src/components/demo/demo.ts');
  const source='/**\n * The custom `<tp-demo>` element demonstrates a puzzle.\n * @tagname tp-demo\n * @example\n * <tp-demo></tp-demo>\n * @attr {string} label - Game label.\n * @example\n * <tp-demo>old duplicate</tp-demo>\n * @event done Emitted on completion.\n */\nexport class TpDemo {}\n';
  writeFileSync(sourcePath,source);
  writeFileSync(join(fixture,'public/docs/components/demo/index.md'),'<!-- tp-docgen:page-layout:v2 -->');
  writeFileSync(join(fixture,'public/docs/components/demo/examples/introduction.html'),'<tp-demo>\n  <ol><li>1010</li></ol>\n\n</tp-demo>\n');
  const script='scripts/sync-component-tsdoc-examples.mjs';
  assert.equal(spawnSync(process.execPath,[script,'--check'],{cwd:fixture}).status,1);
  assert.equal(readFileSync(sourcePath,'utf8'),source);
  execFileSync(process.execPath,[script],{cwd:fixture});
  const synced=readFileSync(sourcePath,'utf8');
  assert.equal(synced.match(/@example/g).length,1);
  assert.ok(synced.includes(' *   <ol><li>1010</li></ol>\n *\n * </tp-demo>'));
  assert.ok(synced.includes(' * @attr {string} label - Game label.'));
  assert.ok(synced.includes(' * @event done Emitted on completion.'));
  execFileSync(process.execPath,[script,'--check'],{cwd:fixture});
 } finally {rmSync(fixture,{recursive:true,force:true});}
});
