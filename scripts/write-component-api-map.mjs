/** Write stable component tags mapped to the actual TypeDoc class-page filenames. */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export function writeComponentApiMap(componentsRoot, apiRoot) {
  const pages = readdirSync(join(apiRoot, 'classes'));
  const map = {};
  for (const directory of readdirSync(componentsRoot)) {
    const path = join(componentsRoot, directory, `${directory}.json`);
    if (!existsSync(path)) continue;
    const manifest = JSON.parse(readFileSync(path, 'utf8'));
    if (!manifest.tagname || !manifest.classname) continue;
    const page = pages.find(page => page.endsWith(`.${manifest.classname}.html`));
    if (!page) throw new Error(`Missing TypeDoc page for ${manifest.tagname}`);
    map[manifest.tagname] = `classes/${page}`;
  }
  writeFileSync(join(apiRoot, 'component-pages.json'), `${JSON.stringify(map, null, 2)}\n`);
}
