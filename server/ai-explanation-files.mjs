import { lstat, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';

/** Only public Markdown explanation pairs may be written; never follow symlinks. */
export async function explanationTarget(config, href, origin) {
  if (!config.publicDir || typeof href !== 'string') throw new Error('Invalid destination');
  const url = new URL(href);
  if (url.origin !== origin || url.search || url.hash) throw new Error('Invalid destination');
  const base = new URL(config.base || '/', origin).pathname;
  if (!url.pathname.startsWith(base)) throw new Error('Invalid destination');
  const segments = decodeURIComponent(url.pathname.slice(base.length)).split('/');
  if (segments.some(part => !part || part === '.' || part === '..' || /[\\\x00-\x1f]/.test(part)) || !segments.slice(0, -1).includes('explanations')) throw new Error('Invalid destination');
  const name = segments.at(-1);
  if (!name.endsWith('.md') || name.endsWith('.prompt.md')) throw new Error('Invalid destination');
  const root = resolve(config.publicDir);
  const target = join(root, ...segments);
  const rel = relative(root, target);
  if (rel.startsWith('..') || rel.startsWith(sep)) throw new Error('Invalid destination');
  // Check ancestors too: a symlinked public directory must not escape the project.
  const paths = [];
  for (let path = dirname(target); ; path = dirname(path)) {
    paths.unshift(path);
    if (dirname(path) === path) break;
  }
  paths.push(target, target.replace(/\.md$/, '.prompt.md'));
  for (const path of paths) {
    try { if ((await lstat(path)).isSymbolicLink()) throw new Error('Symlink destination'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return target;
}

const writes = new Map();
export async function saveExplanation(target, prompt, text) {
  const previous = writes.get(target) || Promise.resolve();
  const task = previous.catch(() => {}).then(async () => {
    const companion = target.replace(/\.md$/, '.prompt.md');
    const suffix = `.${randomUUID()}.tmp`;
    await mkdir(dirname(target), { recursive: true });
    try {
      await writeFile(target + suffix, text, { flag: 'wx' });
      await writeFile(companion + suffix, prompt, { flag: 'wx' });
      // Invalidate the pair before replacing either member. Interrupted writes cannot
      // make an old prompt authenticate a new explanation.
      await rm(companion, { force: true });
      await rename(target + suffix, target);
      await rename(companion + suffix, companion);
    } finally {
      await Promise.all([rm(target + suffix, { force: true }), rm(companion + suffix, { force: true })]);
    }
  });
  writes.set(target, task);
  try { await task; } finally { if (writes.get(target) === task) writes.delete(target); }
}
