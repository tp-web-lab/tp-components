/** Check published event descriptions and coverage of direct dispatch calls. */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
const root = resolve(import.meta.dirname, '../src/components');
const problems = [];
let count = 0;
for (const component of readdirSync(root)) {
 const path = resolve(root, component, `${component}.json`);
 if (!existsSync(path)) continue;
 const manifest = JSON.parse(readFileSync(path, 'utf8'));
 const names = new Set();
 for (const event of manifest.events ?? []) {
  count++; names.add(event.name);
  const description = String(event.description ?? '').trim();
  const inferred = `Emitted when ${event.name.replace(/^tp-/, '').replaceAll('-', ' ')} occurs.`;
  if (!description || description === inferred || /^(?:Event\.|\*|[-–—]\s)/.test(description))
   problems.push(`${component}.${event.name}: describe the trigger and meaning of the event`);
  if (!event.detail || event.detail === 'unknown')
   problems.push(`${component}.${event.name}: document the payload, or void when there is none`);
 }
 const sourcePath = resolve(root, component, `${component}.ts`);
 if (!existsSync(sourcePath)) continue;
 const source = ts.createSourceFile(sourcePath, readFileSync(sourcePath, 'utf8'), ts.ScriptTarget.Latest, true);
 function visit(node) {
  if (ts.isNewExpression(node) && ['CustomEvent', 'Event'].includes(node.expression.getText(source)) &&
   ts.isCallExpression(node.parent) && node.parent.expression.getText(source) === 'this.dispatchEvent') {
   const name = node.arguments?.[0];
   if (name && ts.isStringLiteral(name) && !names.has(name.text))
    problems.push(`${component}.${name.text}: dispatched event is absent from the API`);
  }
  ts.forEachChild(node, visit);
 }
 visit(source);
}
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
else console.log(`Verified descriptions, payloads and direct dispatch coverage of ${count} events.`);
