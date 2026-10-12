import test from 'node:test';
import assert from 'node:assert/strict';
import { selectComponents } from './select-accessibility-components.mjs';
const graph = new Map([['button', new Set()], ['editor', new Set(['button'])], ['playground', new Set(['editor'])], ['clock', new Set()]]);
test('selects changed components and transitive dependents', () => {
 assert.deepEqual(selectComponents(['src/components/button/button.css'], graph), {full:false, components:['button','editor','playground']});
});
test('includes changed documentation fixtures and their consumers', () => {
 assert.deepEqual(selectComponents(['public/docs/components/editor/examples/sample.txt'], graph).components, ['editor','playground']);
});
test('shared assets, dependencies, workflow and unknown changes require full audit', () => {
 for (const path of ['src/utilities/shared.ts','pnpm-lock.yaml','.github/workflows/accessibility.yml','public/docs/components/_shared/component-preview.js','src/components/removed/removed.ts']) assert.equal(selectComponents([path],graph).full,true,path);
});
test('editorial navigation changes and empty diffs skip the audit', () => {
 assert.deepEqual(selectComponents(['public/docs/sidebar.md'],graph).components,[]);
 assert.deepEqual(selectComponents([],graph).components,[]);
});
test('dependency cycles terminate', () => {
 assert.deepEqual(selectComponents(['src/components/a/a.ts'],new Map([['a',new Set(['b'])],['b',new Set(['a'])]])).components,['a','b']);
});
