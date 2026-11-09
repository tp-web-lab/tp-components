/** Normalize public component pages around the live introduction and component viewer.
 * Run with --check to validate without writing; --component NAME limits the migration.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import MarkdownIt from 'markdown-it';
import deflist from 'markdown-it-deflist';
import { namedExamples, viewerSource } from './component-basic-examples.mjs';
import { imports } from './component-doc-imports.mjs';
import { synchronizeDescriptions } from './sync-component-example-descriptions.mjs';

const root = resolve(import.meta.dirname, '..');
const parser = new MarkdownIt({ html: true }).use(deflist);
const read = path => readFileSync(path, 'utf8');
export const dependencyIntroduction = 'All tp-components and external tools used by this component are loaded automatically by this component if they have not already been loaded by another component.';
const clean = text => text.replace(/<!-- tp-docgen:dependencies:(?:start|end) -->/g, '').replace(/^<!-- -->\s*$/gm, '').replace(/\n(?:[ \t]*\n){2,}/g, '\n\n').trim();
export function sections(source, level) {
  const lines = source.split('\n');
  const tokens = parser.parse(source, {});
  const headings = tokens.flatMap((token, index) => token.type === 'heading_open' && token.markup === '#'.repeat(level)
    ? [{ title: tokens[index + 1].content, start: token.map[0], body: token.map[1] }] : []);
  return headings.map((heading, index) => ({ ...heading, text: lines.slice(heading.body, headings[index + 1]?.start ?? lines.length).join('\n') }));
}
function summary(name, existing) {
  const known = {
    animation: 'animates a target element and provides playback controls.',
    'button-group': 'groups related buttons with optional attached borders and vertical layout.',
    contextmenu: 'opens a menu of actions at the pointer position.',
    'file-tree': 'displays folders and files as an expandable tree.',
    'icon-button': 'provides an icon action button with an accessible text label.',
    'emoji-picker': 'lets readers browse and select Unicode emoji.',
    'game-life': 'simulates Conway’s Game of Life on an editable grid.',
    'prose-editor': 'edits rich text with formatting, lists, tables and embedded media.',
    'symbol-picker': 'lets readers browse and select HTML symbols.',
    'xy-plot': 'plots functions, points and curves on labelled coordinate axes.',
    'slope-simulator': 'shows how uphill and downhill gradients affect the effort needed to move a point.',
    yakazu: 'presents a Yakazu number puzzle with pencil marks, validation and undo controls.',
    accordion: 'organizes content into sections that readers can expand and collapse.',
    callout: 'highlights a short message with an optional heading, icon and close button.',
    button: 'provides an action button or navigation link, with configurable appearance and loading feedback.',
    'component-viewer': 'documents a component and lets readers try its attributes on a live example.',
    base: 'provides shared styling, attributes and contextual help for the component library.',
  };
  if (known[name]) return `The custom \`<tp-${name}>\` element ${known[name]}`;
  const paragraph = existing.match(/^The custom[^\n]+/m)?.[0];
  if (paragraph && !paragraph.includes(' functionality:') && !paragraph.includes('implements the ')) return paragraph.split(/\s*\*?\s*@/)[0].replace(/\s+\*\s*$/, '').replace(/provides an? (?=(?:checks|associates|inserts|previews|combines|stacks|solves|transcribes|progressively reveals)\b)/, '').trim().replace(/\.?$/, '.');
  const source = read(join(root, `src/components/${name}/${name}.ts`));
  const classIndex = source.search(/export\s+(?:abstract\s+)?class\s+/);
  const comment = source.slice(source.lastIndexOf('/**', classIndex), classIndex);
  let description = comment.match(/@summary\s+([^\n]+)/)?.[1]?.split(/\s*\*?\s*@/)[0].trim().replace(/\s*\*\/?$/, '')
    ?? paragraph?.split('functionality:').at(-1)?.trim()
    ?? JSON.parse(read(join(root, `src/components/${name}/${name}.json`))).description?.split('\n')[0];
  if (!description) throw Error(`Missing description: ${name}`);
  description = description.replace(/\s*\*\s*$/, '').replace(/^<tp-[^>]+>\s*/, '').replace(/[.!]$/, '');
  description = description[0].toLowerCase() + description.slice(1);
  if (!/^(?:displays?|renders?|provides?|implements?|loads?|wraps?|shows?|adds?|creates?|manages?|supports?|lets|allows?|converts?|plays?|records?|reads?|writes?|captures?|edits?|controls?|selects?|copies|groups?|generates?|hosts?|opens?|switches|presents?|collects?|arranges?|animates?|runs?|saves?|exports?|speaks?|formats?|highlights?|compares?|embeds?|tracks?|represents?|resolves?|builds?|turns?|applies?|draws?|visualizes?|inspects?|connects?|filters?|positions?|distributes?|centers?|scales?|transforms?|handles?|enables?|evaluates?|executes?|navigates?|synchronizes?|marks?|contains?|defines?|extends?|offers?)\b/i.test(description)) {
    description = `provides ${/^(?:a |an |the )/.test(description) ? '' : /^[aeiou]/i.test(description) ? 'an ' : 'a '}${description}`;
  }
  return `The custom \`<tp-${name}>\` element ${description}.`;
}
function normalizeUsage(text) {
  // Remove the generic authoring container while keeping its specific headings.
  let result = sections(`## Usage\n${text}`, 3).map(section => {
    if (/^Import(?:s|ing)$/.test(section.title) || section.title === 'User interactions') return '';
    if (section.title === 'Author directives') {
      const body = clean(section.text).replace(/^#### /gm, '### ');
      return body.startsWith('### ') ? body : `### Authoring\n\n${body}`;
    }
    return `### ${section.title}\n\n${clean(section.text)}`;
  }).join('\n\n');
  const firstH3 = text.search(/^### /m);
  const leading = clean(firstH3 < 0 ? text : text.slice(0, firstH3));
  if (leading) result = `### Configuration\n\n${leading}\n\n${result}`;
  const parts = sections(result, 3);
  const initial = parts.filter(part => /^Initial (?:.*?\s)?(?:content|source)$/i.test(part.title));
  const rest = parts.filter(part => !initial.includes(part));
  return [...initial.map(part => ({ ...part, title: 'Initial content' })), ...rest]
    .map(part => `### ${part.title}\n\n${clean(part.text)}`).join('\n\n');
}
export function transformPage(name, markdown, basic, labels) {
  const existingSections = sections(markdown, 2);
  const get = title => existingSections.find(section => section.title === title)?.text ?? '';
  const h1 = markdown.match(/^# ([^\n]+)/m)?.[1]?.replace(/<tp-icon\b[^>]*>[\s\S]*?<\/tp-icon>\s*/, '').trim();
  if (!h1) throw Error(`Missing title: ${name}`);
  const firstH2 = existingSections[0]?.start ?? markdown.split('\n').length;
  const preamble = markdown.split('\n').slice(0, firstH2).join('\n');
  const isolated = name === 'lang' || /-multi-(?:pages|slides)$/.test(name);
  const live = isolated
    ? `<tp-iframe src="/docs/components/${name}/examples/introduction-frame.html" title="tp-${name} — Basic usage" style="display: flow-root; inline-size: auto; height: 32rem;"></tp-iframe>`
    : basic.trim();
  let usage = get('Usage');
  // Preserve meaningful notes that used to follow the introductory example.
  if (!markdown.includes('<!-- tp-docgen:page-layout:v2 -->')) {
    const lastExample = isolated ? preamble.indexOf('</tp-iframe>') + '</tp-iframe>'.length : preamble.lastIndexOf(basic.trim()) + basic.trim().length;
    if (lastExample >= basic.trim().length || (isolated && lastExample >= '</tp-iframe>'.length)) {
      const tail = clean(preamble.slice(lastExample));
      if (tail && !tail.startsWith('## ')) usage = `${tail}\n\n${usage}`;
    }
  }
  usage = normalizeUsage(usage);
  // Keep authored reference notes; API tables and import snippets now have dedicated homes.
  const legacy = clean(get('Programming')
    .replace(/<!-- tp-docgen:api [\s\S]*?<!-- \/tp-docgen:api -->/g, '')
    .replace(/<!-- tp-docgen:typedoc:start -->[\s\S]*?<!-- tp-docgen:typedoc:end -->/g, '')
    .replace(/^### API\s*$/gm, '')
    .replace(/^### Import(?:s|ing)\b[\s\S]*?(?=^### |$(?![\s\S]))/m, ''));
  if (legacy) usage += `\n\n### Programming notes\n\n${legacy}`;
  for (const section of existingSections) {
    if (['Component viewer', 'Usage', 'Examples', 'Programming', 'API', 'Dependencies'].includes(section.title)) continue;
    usage += `\n\n### ${section.title}\n\n${clean(section.text).replace(/^### /gm, '#### ')}`;
  }
  let dependencies = clean(get('Dependencies')).replace(/^### Internal\s*\n/, '');
  // Remove the old per-component preamble (or the new shared one on subsequent runs).
  dependencies = dependencies.replace(/^All tp-components[^\n]*\n*/gm, '')
    .replace(/<!-- tp-docgen:dependencies:(?:start|end) -->/g, '').trim().replace(/^### Internal\s*\n/, '').trim();
  if (!dependencies) throw Error(`Missing dependency section: ${name}`);
  const examples = clean(get('Examples')).replace(/<!-- tp-docgen:dependencies:start -->\s*$/, '');
  let next = `<!-- tp-docgen:page-layout:v2 -->\n<!-- -->\n# <tp-icon name="${name}" library="components" size="1.25em"></tp-icon> ${h1}\n\n<div class="tp-component-doc-overview">\n\n<div class="tp-component-doc-toc">\n<tp-toc position="end" expand-all></tp-toc>\n</div>\n\n<div class="tp-component-doc-intro">\n\n${summary(name, preamble)}\n\n<div class="tp-component-doc-example">\n\n<!-- tp-docgen:introduction:start -->\n${live}\n<!-- tp-docgen:introduction:end -->\n\n</div>\n\n</div>\n\n</div>\n\n<!-- -->\n## Component viewer\n\n<tp-component-viewer tag="tp-${name}" src="/docs/components/${name}/examples/introduction.html"></tp-component-viewer>\n\n<!-- -->\n## Usage\n\n${clean(usage)}\n\n### Importing\n\n${imports(name)}\n\n<!-- -->\n## Examples\n\n${examples}\n\n<!-- -->\n<!-- tp-docgen:dependencies:start -->\n## Dependencies\n\n${dependencyIntroduction}\n\n### Internal\n\n${dependencies}\n<!-- tp-docgen:dependencies:end -->\n`;
  next = synchronizeDescriptions(next, name, labels);
  return next.replace(/\n(?:[ \t]*\n){2,}/g, '\n\n');
}
export function syncComponentDocLayout({check = false, component} = {}) {
  const changed = [];
  let count = 0;
  const pending = [];
  for (const name of readdirSync(join(root, 'public/docs/components')).sort()) {
    if (component && component !== name) continue;
    const path = join(root, `public/docs/components/${name}/index.md`);
    const examplesPath = join(root, `public/docs/components/${name}/examples/examples.html`);
    if (!existsSync(path) || !existsSync(examplesPath) || !existsSync(join(root, `src/components/${name}/${name}.json`))) continue;
    const examples = namedExamples('html', viewerSource('html', read(examplesPath)));
    const basic = examples.find(example => example.label === 'Basic usage')?.source;
    if (!basic) throw Error(`Missing Basic usage: ${name}`);
    const source = read(path);
    const instructions = sections(source, 2).find(section => section.title === 'Usage');
    const interactions = instructions && sections(instructions.text, 3).find(section => section.title === 'User interactions');
    if (interactions) pending.push([join(root, `public/docs/components/${name}/interactions.md`), `### User interactions\n\n${clean(interactions.text)}\n`]);
    pending.push([path, transformPage(name, source, basic, examples.map(example => example.label))]);
    pending.push([join(root, `public/docs/components/${name}/examples/introduction.html`), `${basic.trim()}\n`]);
    count++;
  }
  for (const [path, next] of pending) {
    if (existsSync(path) && read(path) === next) continue;
    changed.push(path);
    if (!check) writeFileSync(path, next);
  }
  if (check && changed.length) throw Error(`Outdated documentation layout:\n${changed.join('\n')}`);
  return { pages: count, changed: changed.length };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(syncComponentDocLayout({check: process.argv.includes('--check'), component: process.argv.includes('--component') ? process.argv[process.argv.indexOf('--component') + 1] : undefined}));
}
