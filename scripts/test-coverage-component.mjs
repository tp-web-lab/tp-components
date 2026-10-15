/** @module scripts/test-coverage-component */

/**
 * Runs one component's Vitest tests with V8 coverage for its production sources.
 *
 * Run from the tp-components package root with workspace dependencies installed. Supply a
 * component directory name, optionally prefixed with tp-. Additional command-line arguments are
 * not forwarded.
 *
 * @example
 * node scripts/test-coverage-component.mjs button
 *
 * @example
 * node scripts/test-coverage-component.mjs tp-textfield
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
  '--coverage.enabled',
  '--coverage.provider=v8',
  '--coverage.reporter=text',
  `--coverage.include=src/components/${target.component}/*.ts`,
  '--coverage.exclude=src/**/*.test.ts',
  `--coverage.reportsDirectory=test-results/component-coverage/${target.component}`,
], { cwd: target.root, stdio: 'inherit' });

child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once('exit', (code) => {
  process.exitCode = code ?? 1;
});
