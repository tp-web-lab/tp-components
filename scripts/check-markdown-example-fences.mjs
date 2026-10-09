import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../public/docs/components/', import.meta.url));
const files = [];

function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (entry.name === 'examples.md') files.push(path);
  }
}

function audit(lines, file, failures) {
  const stack = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const codeOpen = line.match(/^\s*(?::\s*)?(`{3,}|~{3,})\s*(.*)$/);
    if (codeOpen) {
      const fence = codeOpen[1];
      const info = codeOpen[2];
      const body = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== fence) {
        body.push(lines[index]);
        index += 1;
      }
      if (/(?:^|\s)example(?:\s|$)/.test(info)) audit(body, file, failures);
      continue;
    }

    const open = line.match(/^\s*(?:(?:[-*+]|\d+\.)\s+|:\s+)?(:{3,})\s+\S/);
    if (open) {
      const length = open[1].length;
      const parent = stack.at(-1);
      if (parent?.length === length) {
        failures.push(
          `${file}:${index + 1}: ${length} colons repeat the enclosing delimiter from line ${parent.line}.`,
        );
      }
      stack.push({ length, line: index + 1 });
      continue;
    }

    const close = line.match(/^\s*(:{3,})\s*$/);
    if (close) {
      const length = close[1].length;
      const matchingIndex = stack.map((item) => item.length).lastIndexOf(length);
      if (matchingIndex >= 0) stack.splice(matchingIndex);
    }
  }
}

collect(root);
const failures = [];
for (const file of files) {
  audit(readFileSync(file, 'utf8').split(/\r?\n/), file, failures);
}

if (failures.length > 0) {
  throw new Error(`Invalid nested Markdown web-component fences:\n${failures.join('\n')}`);
}

console.log(`Checked ${files.length} Markdown example files.`);
