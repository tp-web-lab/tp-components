/** @module scripts/test-component */

/**
 * Runs the dedicated Vitest tests for one component.
 *
 * Run from the tp-components package root with workspace dependencies installed. Supply a
 * component directory name, optionally prefixed with tp-. Additional command-line arguments are
 * not forwarded.
 *
 * @example
 * node scripts/test-component.mjs button
 *
 * @example
 * node scripts/test-component.mjs tp-textfield
 */

import { spawn } from 'node:child_process';
import process from 'node:process';
import { getComponentTestTarget } from './component-test-target.mjs';

let target;
try {
  target = getComponentTestTarget(process.argv[2]);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const executable = process.platform === 'win32'
  ? 'node_modules/.bin/vitest.cmd'
  : 'node_modules/.bin/vitest';
const child = spawn(executable, [
  'run',
  ...target.tests,
], { cwd: target.root, stdio: 'inherit' });

child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once('exit', (code) => {
  process.exitCode = code ?? 1;
});
