import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const docsRoot = join(root, 'public/docs');
const indexPath = join(docsRoot, 'components/index.md');
const sidebar = readFileSync(join(docsRoot, 'sidebar.md'), 'utf8');
const current = readFileSync(indexPath, 'utf8');

const descriptions = new Map();
for (const match of current.matchAll(/^\| (?:<tp-icon\b[^>]*><\/tp-icon> )?\[`<([^>]+)>`\]\(([^/)]+)\/index\.md\) \| (.+) \|$/gm)) {
  descriptions.set(match[2], match[3]);
}

const updatedDescriptions = {
  numberfield: 'Numeric field with an optional native range slider.',
  diagram: 'Accessible diagrams rendered from Mermaid source.',
  asciidoc: 'Semantic AsciiDoc rendering component.',
  'asciidoc-viewer': 'Interactive AsciiDoc viewer with editable source and parser outputs.',
  slider: 'Horizontally scrollable row with configurable item width, gap, and scrollbar.',
  base: 'Shared base class and custom element foundation for `tp-*` components.',
  fullscreen: 'Fullscreen controller button scoped to its containing component.',
  lang: 'Documentation language selector.',
  restructuredtext: 'reStructuredText rendering component.',
  'restructuredtext-viewer': 'Interactive reStructuredText viewer with editable source and parser outputs.',
  'save-image': 'Downloads an anchored image as SVG, PNG, or WebP.',
  source: 'Source repository link button.',
  toc: 'Table of contents generated from the current page headings.',
  question: 'Semantic base container shared by interactive question components.',
  'multi-choice-question': 'Multiple-choice question with feedback and a solution.',
  turtle: 'SVG renderer for the tp turtle drawing language.',
  'xy-plot': 'Interactive SVG plot generated from the tp XY graph language.',
};

const groupDescriptions = {
  Base: 'Shared foundations used to build higher-level components.',
  Controllers: 'Direction, color, language, fullscreen, and theme controls.',
  Documentations: 'Single-page and multi-page documentation renderers.',
  Editors: 'Interactive editors for code, prose, graphs, and spreadsheets.',
  Feedbacks: 'Status, messages, and runtime feedback.',
  Files: 'File trees, file systems, includes, and embedded documents.',
  Forms: 'Buttons and reusable form controls.',
  Games: 'Puzzle and game activities.',
  Layouts: 'Page structure, spacing, alignment, and responsive composition.',
  'Markup Languages': 'Markup-language rendering components.',
  Overlays: 'Dialogs, menus, popovers, and floating contextual content.',
  Pickers: 'Visual selection of colors, emoji, formulas, icons, and symbols.',
  Playgrounds: 'Interactive execution environments for languages and markup formats.',
  Plots: 'Programmatic drawing and mathematical plotting.',
  Quizzes: 'Answer widgets and educational question workflows.',
  Questions: 'Quizzes and programming exercises using viewers or playgrounds.',
  References: 'Notes, bibliography, glossary, inline references and generated lists.',
  Simulators: 'Interactive automata, circuits, optics, and query simulations.',
  Time: 'Clocks, alarms, timers, and chronometers.',
  Utilities: 'Reusable interaction and media helpers.',
  Viewers: 'Rendering and inspection of structured content.',
};

function stripIcons(value) {
  return value.replace(/<tp-icon\b[^>]*><\/tp-icon>\s*/g, '');
}

function firstDescription(directory) {
  if (updatedDescriptions[directory] !== undefined) return updatedDescriptions[directory];
  if (descriptions.has(directory)) {
    return stripIcons(descriptions.get(directory).replace(/ Also:.*$/, ''));
  }
  const markdown = readFileSync(join(docsRoot, 'components', directory, 'index.md'), 'utf8');
  const lines = markdown.split(/\r?\n/);
  const titleIndex = lines.findIndex((line) => line.startsWith('# '));
  for (const line of lines.slice(titleIndex + 1)) {
    const value = line.trim();
    if (value === '' || value.startsWith('<') || value.startsWith('#')) continue;
    return stripIcons(value.replace(/\s+/g, ' '));
  }
  return `Component \`<tp-${directory}>\`.`;
}

function componentTag(directory) {
  const manifestPath = join(root, 'src/components', directory, `${directory}.json`);
  if (existsSync(manifestPath)) {
    try {
      const tagname = JSON.parse(readFileSync(manifestPath, 'utf8')).tagname;
      if (typeof tagname === 'string' && tagname.startsWith('tp-')) return tagname;
    } catch {}
  }
  const markdown = readFileSync(join(docsRoot, 'components', directory, 'index.md'), 'utf8');
  return markdown.match(/<tp-[a-z0-9-]+/)?.[0].slice(1) ?? `tp-${directory}`;
}

const groups = new Map();
let activeGroup = '';
for (const line of sidebar.split(/\r?\n/)) {
  const groupMatch = /^ {4}- (?:\[([^\]]+)\]\([^)]+\)|(.+))$/.exec(line);
  if (groupMatch !== null) {
    activeGroup = (groupMatch[1] ?? groupMatch[2] ?? '').trim();
    if (!groups.has(activeGroup)) groups.set(activeGroup, []);
    continue;
  }
  const componentMatch = /^ {6,}- \[([^\]]+)\]\(components\/([^/]+)\/index\.md\)$/.exec(line);
  if (componentMatch !== null && activeGroup !== '') {
    const directory = componentMatch[2];
    if (existsSync(join(root, 'src/components', directory))) {
      groups.get(activeGroup).push({ directory, label: componentMatch[1] });
    }
  }
}

for (const [group, entries] of groups) {
  if (entries.length === 0) groups.delete(group);
}

const themeRows = [...groups].map(([group, entries]) =>
  `| [${group}](#${group.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}) | ${entries.length} | ${groupDescriptions[group] ?? `Components in the ${group} family.`} |`,
);
const totalComponents = [...groups.values()].reduce((total, entries) => total + entries.length, 0);
themeRows.push(`| **Total** | **${totalComponents}** | |`);

const sections = [...groups].map(([group, entries]) => {
  const rows = [...entries].sort((a, b) => a.directory.localeCompare(b.directory)).map(({ directory }) => {
    const tag = componentTag(directory);
    const iconName = tag.replace(/^tp-/, '');
    return `| <tp-icon name="${iconName}" library="components" size="1.25em"></tp-icon> [\`<${tag}>\`](${directory}/index.md) | ${firstDescription(directory)} |`;
  });
  return `## ${group}\n\n| Component | Description |\n| --- | --- |\n${rows.join('\n')}`;
});

const oldIntroduction = 'The components in the `tp-components` library can be categorised';
const currentIntroduction = 'The components in the `tp-components` library are grouped by their primary purpose.';
const start = current.includes(currentIntroduction)
  ? current.indexOf(currentIntroduction)
  : current.indexOf(oldIntroduction);
const footer = '[`tp-components` component library]';
if (start < 0) throw new Error('Component catalogue introduction marker not found.');
const prefix = current.slice(0, start);
const next = `${prefix}The components in the \`tp-components\` library are grouped by their primary purpose. Every documented component appears once in the tables below.\n\n| Theme | Components | Use it for |\n| --- | ---: | --- |\n${themeRows.join('\n')}\n[Classification of the components in \`tp-components\` by main themes]\n\n${sections.join('\n\n')}\n\n${footer}\n`;
writeFileSync(indexPath, next);
console.log(`Updated ${groups.size} tables with ${[...groups.values()].flat().length} component entries.`);
