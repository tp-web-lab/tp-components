/** Cache TypeDoc generation during development; explicit docs:api/build stay forced. */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

function filesBelow(root, directory) {
  const path = join(root, directory);
  if (!existsSync(path)) return [];
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => {
    const relative = join(directory, entry.name);
    if (entry.isDirectory()) return filesBelow(root, relative);
    return entry.isFile() ? [relative] : [];
  });
}

function fingerprint(root, paths) {
  const hash = createHash('sha256');
  for (const path of [...new Set(paths)].sort()) {
    hash.update(path).update('\0');
    if (existsSync(join(root, path))) hash.update(readFileSync(join(root, path)));
    else hash.update('<missing>');
    hash.update('\0');
  }
  return hash.digest('hex');
}

export function inputFingerprint(root) {
  return fingerprint(root, [
    ...filesBelow(root, 'src'),
    ...readdirSync(root).filter(name => /^(typedoc|tsconfig).*\.json$/.test(name)),
    ...filesBelow(root, 'scripts').filter(name => /typedoc/i.test(name)),
    'README.md', 'package.json', 'pnpm-lock.yaml',
    'node_modules/typescript/package.json', 'node_modules/typedoc/package.json',
  ]);
}

function outputFingerprint(root) {
  // This map is regenerated separately by sync-typedoc-links, including on cache hits.
  const files = filesBelow(root, 'public/api').filter(path => path !== join('public/api', 'component-pages.json'));
  if (!files.includes(join('public/api', 'index.html')) || !files.some(path => path.startsWith(join('public/api', 'classes') + '/'))) return null;
  return fingerprint(root, files);
}

export function generateTypeDoc(root, { ifNeeded = false, run, log = console.log } = {}) {
  const cachePath = join(root, 'node_modules/.cache/tp-components/typedoc.json');
  const input = inputFingerprint(root);
  let cache;
  try { cache = JSON.parse(readFileSync(cachePath, 'utf8')); } catch { /* Missing or invalid cache: rebuild. */ }
  if (ifNeeded && cache?.input === input && cache.output && cache.output === outputFingerprint(root)) {
    log('TypeDoc unchanged: reusing public/api.');
    return false;
  }
  // A failed or interrupted generation must never leave a usable cache stamp.
  rmSync(cachePath, { force: true });
  log('Generating TypeDoc API documentation…');
  if (run) run();
  else {
    const result = spawnSync('pnpm', ['exec', 'typedoc'], { cwd: root, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`TypeDoc failed (${result.status ?? result.signal}).`);
  }
  const output = outputFingerprint(root);
  if (!output) throw new Error('TypeDoc did not produce its index and class pages.');
  // Do not mark an obsolete snapshot current if source files changed during generation.
  if (inputFingerprint(root) === input) {
    mkdirSync(dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, JSON.stringify({ input, output }) + '\n');
  }
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  generateTypeDoc(fileURLToPath(new URL('..', import.meta.url)), { ifNeeded: process.argv.includes('--if-needed') });
}
