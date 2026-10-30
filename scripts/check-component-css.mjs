/** Reject missing or automatically inferred CSS property descriptions. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '../src/components');
const problems = [];
let count = 0;
for (const component of readdirSync(root)) {
 const path = resolve(root, component, `${component}.json`);
 if (!existsSync(path)) continue;
 const manifest = JSON.parse(readFileSync(path, 'utf8'));
 for (const property of manifest.cssproperties ?? []) {
  count++;
  const description = String(property.description ?? '').trim();
  if (!description || /^(?:Controls the\b|CSS custom property\b|Property\b|=)/i.test(description))
   problems.push(`${component}.${property.name}: provide a description of the styled element and the property's effect`);
  if (!String(property.default ?? '').trim())
   problems.push(`${component}.${property.name}: missing default or explicit runtime-only state`);
 }
}
if (problems.length) {
 console.error(problems.join('\n'));
 process.exitCode = 1;
} else console.log(`Verified descriptions and defaults of ${count} CSS properties.`);
