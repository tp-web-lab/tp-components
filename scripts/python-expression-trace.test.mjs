import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compactTraceSteps } from '../src/components/trace/visible-steps.js';
import { parseTrace } from '../src/components/trace/trace-file.js';

test('expression values survive grouping and JSON replay', () => {
  const step = { event: 'expression', line: 1, source_range: { start: 0, end: 3 } };
  const trace = [{ ...step, expression: { value: 1 } }, { ...step, expression: { value: 2 } }];
  assert.equal(compactTraceSteps(trace).length, 2);
  const recording = { version: 1, code: 'a+b', trace };
  assert.deepEqual(parseTrace(JSON.stringify(recording)), recording);
  assert.throws(() => parseTrace(JSON.stringify({ ...recording, trace: [{ ...step, expression: {} }] })));
  assert.throws(() => parseTrace(JSON.stringify({ ...recording, trace: [{ event: 'expression', expression: { value: 2 } }] })));
  assert.equal(parseTrace(JSON.stringify({ ...recording, trace: [{ event: 'step_line', line: 1 }] })).trace.length, 1);
});
