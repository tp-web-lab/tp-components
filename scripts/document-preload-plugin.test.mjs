import assert from 'node:assert/strict';
import test from 'node:test';
import { collectDocumentPreloads, documentPreloadPlugin } from './document-preload-plugin.mjs';

test('preloads static dependencies once, excluding dynamic and external imports', () => {
 const bundle = {
  'markdown.js': { type:'chunk', fileName:'markdown.js', facadeModuleId:'/repo/src/components/markdown/markdown.ts', imports:['base.js', 'shared.js'], dynamicImports:['editor.js'] },
  'base.js': {type:'chunk', fileName:'base.js', imports:['shared.js', 'external']},
  'shared.js': {type:'chunk', fileName:'shared.js', imports:['base.js']},
  'editor.js': {type:'chunk', fileName:'editor.js', imports:[]},
 };
 assert.deepEqual(collectDocumentPreloads(bundle), {'tp-markdown':['markdown.js','base.js','shared.js']});
});
test('embeds the manifest without changing unrelated chunk code', () => {
 const bundle = { 'loader.js': {type:'chunk', code:'const manifest = `__TP_DOCUMENT_PRELOADS__`;', imports:[]}, 'other.js': {type:'chunk', code:'export const unchanged = true;', imports:[]} };
 const plugin = documentPreloadPlugin();
 const result = plugin.renderChunk(bundle['loader.js'].code, {}, {}, {chunks: bundle});
 assert.equal(result.code, 'const manifest = "{}";');
 assert.ok(result.map.mappings);
 assert.equal(plugin.renderChunk(bundle['other.js'].code, {}, {}, {chunks: bundle}), null);
});
