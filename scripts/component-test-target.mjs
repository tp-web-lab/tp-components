import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const componentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Resolves and validates the component name supplied to a targeted test command. */
export function getComponentTestTarget(argument, { requireExamples = false } = {}) {
  const component = (argument ?? '').replace(/^tp-/, '');
  if (!componentPattern.test(component)) {
    throw new Error('Expected one component name, for example: text-to-speech or tp-text-to-speech.');
  }

  const root = resolve(import.meta.dirname, '..');
  const directory = join(root, 'src/components', component);
  if (!existsSync(join(directory, `${component}.ts`))) {
    throw new Error(`Unknown component: tp-${component}`);
  }

  if (requireExamples && !existsSync(join(root, 'public/docs/components', component, 'examples/examples.html'))) {
    throw new Error(`tp-${component} has no HTML examples to scan with axe-core.`);
  }

  const tests = readdirSync(directory)
    .filter((name) => name.endsWith('.test.ts'))
    .map((name) => `src/components/${component}/${name}`)
    .sort();
  if (!requireExamples && tests.length === 0) {
    throw new Error(`tp-${component} has no dedicated component test file.`);
  }

  return { component, root, tests };
}
