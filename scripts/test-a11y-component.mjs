/**
 * Runs Playwright accessibility checks for one component's HTML examples.
 *
 * Run from the tp-components package root with workspace dependencies installed. Supply a
 * component directory name, optionally prefixed with tp-. Additional command-line arguments are
 * not forwarded.
 *
 * @example
 * node scripts/test-a11y-component.mjs button
 *
 * @example
 * node scripts/test-a11y-component.mjs tp-textfield
 */

import { spawn } from 'node:child_process';
import process from 'node:process';
import { getComponentTestTarget } from './component-test-target.mjs';

let target;
try {
  target = getComponentTestTarget(process.argv[2], { requireExamples: true });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const executable = process.platform === 'win32'
  ? 'node_modules/.bin/playwright.cmd'
  : 'node_modules/.bin/playwright';
const child = spawn(executable, [
  'test',
  '--config',
  'playwright.a11y.config.ts',
  'components.a11y.test.ts',
  '--grep',
  `tp-${target.component}$`,
], { cwd: target.root, stdio: 'inherit' });

child.once('error', (error) => {
  console.error(error);
  process.exitCode = 1;
});
child.once('exit', (code) => {
  process.exitCode = code ?? 1;
});
