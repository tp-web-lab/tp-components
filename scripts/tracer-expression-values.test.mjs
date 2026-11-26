import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recordJavaScript } from '../src/components/javascript-tracer/recorder.js';
import { recordTypeScript } from '../src/components/typescript-tracer/recorder.js';
import { recordScheme, initializeSchemeRecorder } from '../src/components/scheme-tracer/recorder.js';
import * as lips from '../src/components/scheme-tracer/vendor/lips.js';
import { parseTrace } from '../src/components/trace/trace-file.js';

for (const [language,record] of [['javascript',recordJavaScript],['typescript',recordTypeScript]]) {
 test(`${language}: constant results, original ranges and replay`, () => {
  const code='const emoji = "😀"; console.log(3 * (2 * 4 + (3 + 5)) + ((10 - 7) + 6));';
  const result=record(code), values=result.trace.filter(s=>typeof s.expression?.value==='number');
  assert.deepEqual(values.map(s=>s.expression.value),[8,8,16,48,3,9,57]);
  assert.deepEqual(values.map(s=>code.slice(s.source_range.start,s.source_range.end)),['2 * 4','3 + 5','2 * 4 + (3 + 5)','3 * (2 * 4 + (3 + 5))','10 - 7','(10 - 7) + 6','3 * (2 * 4 + (3 + 5)) + ((10 - 7) + 6)']);
  assert.equal(result.trace.at(-1).stdout,'57\n');
  assert.deepEqual(parseTrace(JSON.stringify(result)),result);
 });
 test(`${language}: no repeated getters, updates, calls or skipped branches`, () => {
  const result=record('let reads=0; const obj={get n(){reads++; return 3;}, value:7, get(){return this.value;}}; let n=0; false && ++n; true || ++n; null?.run(++n); console.log(obj.n + obj.n, reads, n++, n, obj.get());');
  assert.equal(result.trace.at(-1).stdout,'6 2 0 1 7\n');
  assert.equal(result.trace.at(-1).exception_msg,undefined);
 });
 test(`${language}: temporary object values retain their heap entries`, () => {
  const result=record('function make(){return {n:3};} make();');
  const step=result.trace.find(s=>s.expression?.value?.[0]==='REF');
  assert.ok(step.heap[step.expression.value[1]]);
 });
}

test('Scheme: native continuations preserve operation values and short circuiting', async () => {
 await initializeSchemeRecorder(new URL('../src/components/scheme-tracer/vendor/',import.meta.url).pathname+'std.xcb',lips);
 const code='(+ (* 3 (+ (* 2 4) (+ 3 5))) (+ (- 10 7) 6))';
 const result=await recordScheme(code);
 assert.deepEqual(result.trace.filter(s=>s.expression).map(s=>s.expression.value),[8,8,16,48,3,9,57].map(n=>['SCHEME',String(n)]));
 assert.deepEqual(result.trace.filter(s=>s.expression).map(s=>code.slice(s.source_range.start,s.source_range.end)),['(* 2 4)','(+ 3 5)','(+ (* 2 4) (+ 3 5))','(* 3 (+ (* 2 4) (+ 3 5)))','(- 10 7)','(+ (- 10 7) 6)',code]);
 assert.deepEqual(parseTrace(JSON.stringify(result)),result);
 const mutations=await recordScheme('(define n 0) (define (tick) (set! n (+ n 1)) n) (and #f (tick)) (or #t (tick)) (+ (tick) (tick)) n');
 assert.equal(mutations.trace.at(-1).stdout,'#f\n#t\n3\n2\n');
 assert.ok(!mutations.trace.some(s=>s.exception_msg));
 const ref=await recordScheme('(cons 1 2)');
 const step=ref.trace.find(s=>s.expression?.value?.[0]==='REF');
 assert.ok(step.heap[step.expression.value[1]]);
});
