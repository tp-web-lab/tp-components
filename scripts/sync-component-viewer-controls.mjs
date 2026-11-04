import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { attributeControl } from './interactive-attribute-examples.mjs';

const root = resolve(import.meta.dirname, '..');
const catalog = {};
for (const component of readdirSync(`${root}/src/components`)) {
  const file = `${root}/src/components/${component}/${component}.json`;
  if (!existsSync(file)) continue;
  const api = JSON.parse(readFileSync(file, 'utf8'));
  const fixturesFile = `${root}/public/docs/components/${component}/examples/attributes-fixtures.json`;
  const fixtures = existsSync(fixturesFile) ? JSON.parse(readFileSync(fixturesFile, 'utf8')) : {};
  catalog[api.tagname] = Object.fromEntries((api.attributes ?? []).flatMap(attribute => {
    const control = attributeControl(component, attribute);
    const choices = fixtures[attribute.name];
    return choices ? [[attribute.name, { choices }]] : control?.values ? [[attribute.name, { values: control.values }]] : [];
  }));
}
const file = `${root}/src/components/component-viewer/controls.json`;
const output = `${JSON.stringify(catalog, null, 2)}\n`;
if (process.argv.includes('--check')) {
  if (readFileSync(file, 'utf8') !== output) throw new Error('Component viewer controls are stale. Run pnpm viewer:sync-controls.');
} else writeFileSync(file, output);
