/// <reference types="node" />

import {
  existsSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';

const PUBLIC_ROOT = join(process.cwd(), 'public');
const EXAMPLES_ROOT = join(PUBLIC_ROOT, 'examples');

const ignoredNames = new Set([
  '.DS_Store',
  'node_modules',
  'project.json',
  'index.json',
  '.files.json',
]);

interface TpExamplesRootIndex {
  groups: Record<string, Record<string, string>>;
}

function isDirectory(path: string): boolean {
  return statSync(path).isDirectory();
}

function listDirectories(path: string): string[] {
  if (!existsSync(path)) {
    return [];
  }

  return readdirSync(path)
    .map((name) => join(path, name))
    .filter((path) => isDirectory(path))
    .sort();
}

function hasProjectJson(path: string): boolean {
  return existsSync(join(path, 'project.json'));
}

function listFiles(directory: string, root = directory): string[] {
  return readdirSync(directory)
    .filter((name) => !ignoredNames.has(name))
    .flatMap((name) => {
      const fullPath = join(directory, name);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        return listFiles(fullPath, root);
      }

      return [relative(root, fullPath).replaceAll('\\', '/')];
    })
    .sort();
}

function toPublicUrl(path: string): string {
  return `/${relative(PUBLIC_ROOT, path).replaceAll('\\', '/')}`;
}

function inferShortGroupName(directoryName: string): string {
  return directoryName
    .replace(/-playground$/, '')
    .replace(/-notebook$/, '')
    .replace(/-examples$/, '');
}

function build(): void {
  const rootIndex: TpExamplesRootIndex = {
    groups: {},
  };

  const categoryDirectories = listDirectories(EXAMPLES_ROOT);

  for (const categoryDirectory of categoryDirectories) {
    const categoryName = categoryDirectory.split(/[\\/]/).at(-1);

    if (categoryName === undefined) {
      continue;
    }

    rootIndex.groups[categoryName] = {};

    const groupDirectories = listDirectories(categoryDirectory);

    for (const groupDirectory of groupDirectories) {
      const groupDirectoryName = groupDirectory.split(/[\\/]/).at(-1);

      if (groupDirectoryName === undefined) {
        continue;
      }

      const exampleDirectories = listDirectories(groupDirectory).filter(
        hasProjectJson,
      );

      if (exampleDirectories.length === 0) {
        continue;
      }

      const groupName = inferShortGroupName(groupDirectoryName);
      rootIndex.groups[categoryName][groupName] = toPublicUrl(groupDirectory);

      const examples = exampleDirectories
        .map((exampleDirectory) => exampleDirectory.split(/[\\/]/).at(-1))
        .filter((name): name is string => typeof name === 'string')
        .sort();

      writeFileSync(
        join(groupDirectory, 'index.json'),
        `${JSON.stringify({ examples }, null, 2)}\n`,
      );

      for (const example of examples) {
        const exampleDirectory = join(groupDirectory, example);

        writeFileSync(
          join(exampleDirectory, '.files.json'),
          `${JSON.stringify({ files: listFiles(exampleDirectory) }, null, 2)}\n`,
        );
      }
    }
  }

  writeFileSync(
    join(EXAMPLES_ROOT, 'index.json'),
    `${JSON.stringify(rootIndex, null, 2)}\n`,
  );
}

build();