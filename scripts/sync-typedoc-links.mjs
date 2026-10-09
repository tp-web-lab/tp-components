import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const componentsRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');
const classesRoot = join(root, 'public/api/classes');
const startMarker = '<!-- tp-docgen:typedoc:start -->';
const endMarker = '<!-- tp-docgen:typedoc:end -->';
const generatedBlock = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}\\n?`, 'g');

if (!existsSync(classesRoot)) {
  throw new Error(`TypeDoc classes directory not found: ${classesRoot}`);
}

const classPages = readdirSync(classesRoot).filter((name) => name.endsWith('.html'));
let linked = 0;

for (const componentDirectory of readdirSync(componentsRoot)) {
  const sourceDirectory = join(componentsRoot, componentDirectory);
  const documentationPath = join(docsRoot, componentDirectory, 'index.md');
  if (!statSync(sourceDirectory).isDirectory() || !existsSync(documentationPath)) continue;

  let manifest;
  for (const manifestName of readdirSync(sourceDirectory).filter((name) => name.endsWith('.json'))) {
    try {
      const candidate = JSON.parse(readFileSync(join(sourceDirectory, manifestName), 'utf8'));
      if (typeof candidate.tagname === 'string' && typeof candidate.classname === 'string') {
        manifest = candidate;
        break;
      }
    } catch {
      // Ignore component data files which are not API manifests.
    }
  }

  if (manifest === undefined || manifest.classname === '') continue;
  const suffix = `.${manifest.classname}.html`;
  const classPage = classPages.find((name) => name.endsWith(suffix));
  if (classPage === undefined) {
    throw new Error(`No TypeDoc page found for ${manifest.tagname} (${manifest.classname})`);
  }

  const markdown = readFileSync(documentationPath, 'utf8').replace(generatedBlock, '');
  const apiEnd = '<!-- /tp-docgen:api -->';
  const block = `${startMarker}\n[More details…](/api/classes/${classPage})\n${endMarker}`;
  const next = markdown.includes(apiEnd)
    ? markdown.replace(apiEnd, `${apiEnd}\n\n${block}`)
    : markdown.replace('\n### Imports', `\n${block}\n\n### Imports`);

  if (next !== markdown) writeFileSync(documentationPath, next);
  linked += 1;
}

console.log(`Linked ${linked} component pages to the generated TypeDoc API.`);
