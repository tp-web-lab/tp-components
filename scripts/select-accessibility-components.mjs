/** @module scripts/select-accessibility-components */

/**
 * Selects changed components and transitive dependents for an accessibility audit using a Git
 * comparison.
 *
 * Run from the tp-components package root with workspace dependencies installed. Set
 * A11Y_BASE_SHA and A11Y_HEAD_SHA to full commit hashes; A11Y_EVENT=pull_request uses a merge-
 * base comparison. Missing or invalid revisions select the full suite. Prints JSON and appends
 * CI outputs when GITHUB_OUTPUT or GITHUB_STEP_SUMMARY is set.
 *
 * @example
 * node scripts/select-accessibility-components.mjs
 *
 * @example
 * A11Y_BASE_SHA=$(git rev-parse HEAD~1) A11Y_HEAD_SHA=$(git rev-parse HEAD) node scripts/select-accessibility-components.mjs
 */

import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function selectComponents(files, dependencies) {
  const all = [...dependencies.keys()].sort();
  const changed = new Set();
  for (const file of files) {
    const match = /^(?:src\/components|public\/docs\/components)\/([^/]+)\//.exec(file);
    if (match && dependencies.has(match[1])) {
      if (match[1] === 'base' || match[1] === 'icon') return { full: true, components: all };
      changed.add(match[1]);
      continue;
    }
    // Editorial pages do not alter the component fixtures. Unknown executable
    // or configuration changes fall back to the complete suite.
    if (/^public\/docs\//.test(file) && !file.includes('/_shared/')) continue;
    if (/^(?:README|CHANGELOG|LICENSE|AGENTS)(?:\.|$)/.test(file)) continue;
    return { full: true, components: all };
  }
  let previous;
  do {
    previous = changed.size;
    for (const [component, uses] of dependencies) {
      if ([...uses].some((dependency) => changed.has(dependency))) changed.add(component);
    }
  } while (previous !== changed.size);
  return { full: false, components: [...changed].sort() };
}

function dependencyMap(root) {
  const docs = join(root, 'public/docs/components');
  const names = readdirSync(docs).filter(name => existsSync(join(docs, name, 'examples/examples.html')));
  const graph = new Map(names.map(name => [name, new Set()]));
  // Include manifest dependencies, imports and literal custom-element uses in
  // implementation and examples, so shared controls also select their consumers.
  const readTree = path => {
    if (!existsSync(path)) return '';
    return readdirSync(path, { withFileTypes: true }).map(entry => {
      const file = join(path, entry.name);
      if (entry.isDirectory()) return readTree(file);
      return /\.(?:ts|js|json|html|md|css)$/.test(file) && !/\.test\./.test(file) ? readFileSync(file, 'utf8') : '';
    }).join('\n');
  };
  for (const name of names) {
    const source = readTree(join(root, 'src/components', name)) + readTree(join(docs, name, 'examples'));
    const used = graph.get(name);
    for (const match of source.matchAll(/\btp-([a-z][a-z0-9-]*)\b/g)) {
      if (graph.has(match[1]) && match[1] !== name) used.add(match[1]);
    }
    for (const match of source.matchAll(/(?:\.\.\/|components\/)([a-z][a-z0-9-]*)\//g)) {
      if (graph.has(match[1]) && match[1] !== name) used.add(match[1]);
    }
  }
  return graph;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(import.meta.dirname, '..');
  const graph = dependencyMap(root);
  let result;
  const base = process.env.A11Y_BASE_SHA;
  const head = process.env.A11Y_HEAD_SHA;
  try {
    if (!base || /^0+$/.test(base) || !head) throw new Error('Full audit requested or no comparison base');
    if (![base, head].every(ref => /^[a-f0-9]{40,64}$/i.test(ref))) throw new Error('Invalid revision');
    const comparison = process.env.A11Y_EVENT === 'pull_request' ? `${base}...${head}` : `${base}..${head}`;
    const files = execFileSync('git', ['diff', '--no-renames', '--name-only', '-z', comparison], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
    result = selectComponents(files, graph);
  } catch (error) {
    console.log(`Using full audit: ${error.message}`);
    result = { full: true, components: [...graph.keys()].sort() };
  }
  console.log(JSON.stringify(result, null, 2));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `components=${JSON.stringify(result.components)}\nfull=${result.full}\nrun=${result.components.length > 0}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Accessibility scope\n\n${result.full ? 'Full audit' : 'Changed components and their dependents'}: ${result.components.length} components.\n\n${result.components.join(', ') || 'No component examples affected.'}\n`);
}
