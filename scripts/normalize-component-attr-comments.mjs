import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const componentsRoot = resolve(import.meta.dirname, '../src/components');

function formatDefault(value) {
  const text = String(value).trim();
  if (/^(?:true|false|null|undefined|-?(?:\d+\.?\d*|\.\d+))$/.test(text)) return text;
  if ((text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))) return text;
  return JSON.stringify(text);
}

function normalizeBlock(block, manifest) {
  if (!block.includes('@tagname') || !block.includes('@attr {')) return block;

  const defaults = new Map();
  for (const match of block.matchAll(/^\s*\*\s+@default\s+([\w-]+)\s+(.+)$/gm)) {
    defaults.set(match[1], match[2].trim());
  }
  for (const attribute of manifest?.attributes ?? []) {
    if (!defaults.has(attribute.name) && attribute.default !== undefined) {
      defaults.set(attribute.name, String(attribute.default));
    }
  }

  const lines = block.split('\n');
  const output = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const attribute = line.match(/^(\s*\*\s+)@attr\s+\{([^}]+)\}\s+([\w-]+)(?:\s+(.*))?$/);
    if (attribute !== null) {
      const [, prefix, type, name] = attribute;
      const remainder = attribute[4] ?? '';
      const compact = remainder.match(
        /^=\s+((?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\S+))\s+-\s+(.+)$/,
      );
      const descriptionParts = [compact?.[2] ?? remainder];
      while (index + 1 < lines.length) {
        const continuation = lines[index + 1]?.match(/^\s*\*\s+(?!@)(.+)$/);
        if (continuation === null) break;
        descriptionParts.push(continuation[1]);
        index += 1;
      }
      const description = descriptionParts.join(' ').trim().replace(/^[-–—]\s*/, '');
      const fallback = manifest?.attributes?.find((item) => item.name === name)?.default;
      const defaultValue = compact?.[1] ?? defaults.get(name) ??
        (fallback === undefined ? '' : String(fallback));
      output.push(`${prefix}@attr {${type.trim()}} ${name} = ${formatDefault(defaultValue)} - ${description}`);
      continue;
    }
    if (/^\s*\*\s+@default\s+[\w-]+\s+.+$/.test(line)) continue;
    output.push(line);
  }
  return output.join('\n');
}

let changed = 0;
for (const directory of readdirSync(componentsRoot)) {
  const sourcePath = join(componentsRoot, directory, `${directory}.ts`);
  if (!existsSync(sourcePath)) continue;
  const manifestPath = join(componentsRoot, directory, `${directory}.json`);
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : undefined;
  const source = readFileSync(sourcePath, 'utf8');
  const normalized = source.replace(/\/\*\*[\s\S]*?\*\//g, (block) => normalizeBlock(block, manifest));
  if (normalized === source) continue;
  writeFileSync(sourcePath, normalized);
  changed += 1;
}

console.log(`Normalized attribute comments in ${changed} component files.`);
