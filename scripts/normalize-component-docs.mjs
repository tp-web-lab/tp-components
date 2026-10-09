import { imports } from './component-doc-imports.mjs';
import { componentUsage } from './component-doc-usage.mjs';
import { exampleFile, markupExample } from './component-basic-examples.mjs';
import { EXAMPLE_TABS_FENCE } from './component-example-tabs.mjs';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourceRoot = join(root, 'src/components');
const docsRoot = join(root, 'public/docs/components');

function walk(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const components = [];
for (const sourcePath of walk(sourceRoot).filter((path) => path.endsWith('.ts') && !path.endsWith('.test.ts'))) {
  const source = readFileSync(sourcePath, 'utf8');
  for (const match of source.matchAll(/customElements\.define\(\s*['"](tp-[a-z0-9-]+)['"]/g)) {
    components.push({ directory: basename(dirname(sourcePath)), sourcePath, source, tag: match[1] });
  }
}

function section(markdown, heading) {
  const expression = new RegExp(`^${heading.replaceAll('#', '\\#')}[ \\t]*$([\\s\\S]*?)(?=^##(?: |$)|(?![\\s\\S]))`, 'm');
  return expression.exec(markdown)?.[1]?.trim() ?? '';
}

function subsection(markdown, heading) {
  const expression = new RegExp(`^${heading.replaceAll('#', '\\#')}[ \\t]*$([\\s\\S]*?)(?=^###(?: |$)|^##(?: |$)|(?![\\s\\S]))`, 'm');
  return expression.exec(markdown)?.[1]?.trim() ?? '';
}

function componentSummary(component, manifest) {
  const moduleComment = component.source.match(/\/\*\*[\s\S]*?@module[^\n]*[\s\S]*?\*\//)?.[0] ?? '';
  const moduleSummary = moduleComment.match(/@summary\s+([^\r\n]+)/)?.[1]?.replace(/\s*\*\/\s*$/, '').trim();
  const manifestSummary = typeof manifest?.description === 'string' ? manifest.description.split(/\n\n|\r?\n/)[0].trim() : '';
  return moduleSummary || manifestSummary || `Component \`<${component.tag}>\`.`;
}

function titleOf(markdown, tag) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? tag.slice(3).replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function initialExample(markdown, tag) {
  const preamble = markdown.slice(0, markdown.search(/^##\s/m) < 0 ? markdown.length : markdown.search(/^##\s/m));
  const viewer = /(?:^|\n)(<tp-html-viewer\b[^>]*>[\s\S]*?<\/tp-html-viewer>)/m.exec(preamble)?.[1];
  if (viewer !== undefined) return viewer.trim();
  const escaped = tag.replaceAll('-', '\\-');
  const paired = new RegExp(`(?:^|\\n)(<${escaped}\\b[^>]*>[\\s\\S]*?<\\/${escaped}>)`, 'm').exec(preamble)?.[1];
  if (paired !== undefined) return paired.trim();
  const selfClosing = new RegExp(`(?:^|\\n)(<${escaped}\\b[^>]*/>)`, 'm').exec(preamble)?.[1];
  return selfClosing?.trim() ?? `<${tag}></${tag}>`;
}

function preambleExtra(markdown, example) {
  const end = markdown.search(/^##\s/m);
  const preamble = markdown.slice(0, end < 0 ? markdown.length : end);
  const position = preamble.indexOf(example);
  if (position < 0) return '';
  return preamble.slice(position + example.length).trim();
}

const cell = (value = '') => String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>').trim();
const code = (value = '') => value === '' ? '' : `<code>${cell(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#39;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('{', '&#123;').replaceAll('}', '&#125;').replaceAll('--', '&#45;&#45;')}</code>`;
const table = (headings, rows, noneColumns) => {
  const body = rows.length > 0 ? rows : [noneColumns];
  return `| ${headings.join(' | ')} |\n  | ${headings.map(() => '---').join(' | ')} |\n${body.map((row) => `  | ${row.join(' | ')} |`).join('\n')}`;
};

function apiFromManifest(manifest, tag, className) {
  const attributes = (manifest?.attributes ?? []).map((item) => [code(item.name), code(item.type), code(item.default), cell(item.description)]);
  const methods = (manifest?.methods ?? []).map((item) => {
    const signature = item.name ?? '';
    const name = signature.split('(')[0];
    return [code(name), code(signature), cell(item.description)];
  });
  const events = (manifest?.events ?? []).map((item) => [code(item.name), code(item.detail), cell(item.description)]);
  const css = (manifest?.cssproperties ?? []).map((item) => [code(item.name), code(item.default), cell(item.description)]);
  return `::: tp-tabs
Attributes
: ${table(['Attribute', 'Type', 'Default', 'Description'], attributes, ['None.', '', '', ''])}
  [Attributes of \`<${tag}>\`]

Methods
: ${table(['Method', 'Signature', 'Description'], methods, ['None.', '', ''])}
  [Public methods of \`${className}\`]

Events
: ${table(['Event', 'Detail', 'Description'], events, ['None.', '', ''])}
  [Events emitted by \`<${tag}>\`]

CSS properties
: ${table(['CSS property', 'Default', 'Description'], css, ['None.', '', ''])}
  [CSS properties of \`<${tag}>\`]
:::`;
}


function examplesTabs() {
  return `${EXAMPLE_TABS_FENCE} tp-tabs
<tp-icon name="file_type_html" library="languages" size="1.25em"></tp-icon> html
: ::include{examples/examples.html}

<tp-icon name="file_type_asciidoc" library="languages" size="1.25em"></tp-icon> tp-asciidoc
: ::include{examples/examples.adoc}

<tp-icon name="file_type_markdown" library="languages" size="1.25em"></tp-icon> tp-markdown
: ::include{examples/examples.md}

<tp-icon name="file_type_restructuredtext" library="languages" size="1.25em"></tp-icon> tp-restructuredtext
: ::include{examples/examples.rst}
${EXAMPLE_TABS_FENCE}`;
}

function attributesFromExample(example, tag) {
  const opening = new RegExp(`<${tag}\\b([^>]*)>`).exec(example)?.[1] ?? '';
  return [...opening.matchAll(/([a-zA-Z][\w-]*)(?:=("[^"]*"|'[^']*'|[^\s]+))?/g)].map((match) => {
    const value = match[2]?.replace(/^['"]|['"]$/g, '');
    return { name: match[1], value };
  });
}

function innerContent(example, tag) {
  return new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(example)?.[1]?.trim() ?? '';
}

function indent(value, spaces) {
  const prefix = ' '.repeat(spaces);
  return value.split(/\r?\n/).map((line) => `${prefix}${line}`).join('\n');
}

function generatedExamples(tag, title, example) {
  const attrs = attributesFromExample(example, tag);
  const inner = innerContent(example, tag);
  const mdAttrs = attrs.length === 0 ? '' : ` { ${attrs.map(({ name, value }) => value === undefined ? name : `${name}="${value}"`).join(' ')} }`;
  const adocAttrs = attrs.length === 0 ? '' : `,${attrs.map(({ name, value }) => value === undefined ? name : `${name}="${value}"`).join(',')}`;
  const rstAttrs = attrs.map(({ name, value }) => `         :${name}:${value === undefined ? '' : ` ${value}`}`).join('\n');
  const mdInner = inner === '' ? '' : `\n${inner}\n`;
  const adocInner = inner === '' ? '' : `\n${inner}`;
  const rstInner = inner === '' ? '' : `\n\n${indent(inner, 9)}`;
  return {
    html: `<tp-html-viewer label="${tag}">
${indent(example, 2)}
</tp-html-viewer>
`,
    adoc: `[tp-asciidoc-viewer, label="${tag}"]
=====
[script,type="tp/asciidoc"]
....
[${tag}${adocAttrs}]
--${adocInner}
--
....
=====
`,
    md: `:::::: tp-markdown-viewer { label="${tag}" }
:::: script { type="tp/markdown" }
::: ${tag}${mdAttrs}${mdInner}
:::
::::
::::::
`,
    rst: `.. tp-restructuredtext-viewer::
   :label: ${tag}

   .. script::
      :type: tp/restructuredtext

      .. ${tag}::${rstAttrs === '' ? '' : `\n${rstAttrs}`}${rstInner}
`,
  };
}

function convertHtmlComponentsToMarkdown(content, tag) {
  const expression = new RegExp(`<${tag}\\b[^>]*>\\s*<\\/${tag}>`, 'g');
  return content.replace(expression, (example) => {
    const attrs = attributesFromExample(example, tag);
    const suffix = attrs.length === 0 ? '' : ` { ${attrs.map(({ name, value }) => value === undefined ? name : `${name}="${value}"`).join(' ')} }`;
    return `::: ${tag}${suffix}\n:::`;
  });
}

function removeSingleExampleWrapper(extension, content) {
  if (extension === 'html' && (content.match(/role="example"/g) ?? []).length === 1) {
    const match = /^(\s*<tp-html-viewer\b[^>]*>)\s*<div\s+role="example"[^>]*>([\s\S]*?)<\/div>\s*(<\/tp-html-viewer>\s*)$/.exec(content);
    if (match?.[2] !== undefined) return `${match[1]}\n${match[2].trim()}\n${match[3]}`;
  }
  if (extension === 'md' && (content.match(/^```\s+example\b/gm) ?? []).length === 1) {
    return content.replace(/^```\s+example[^\n]*\n([\s\S]*?)^```[ \t]*$/m, '$1').replace(/\n{3,}/g, '\n\n');
  }
  if (extension === 'adoc' && (content.match(/^====[ \t]*$/gm) ?? []).length === 2) {
    return content.replace(/^\.[^\n]+\n====[ \t]*\n([\s\S]*?)^====[ \t]*$/m, '$1').replace(/\n{3,}/g, '\n\n');
  }
  if (extension === 'rst' && (content.match(/^\s*\.\. example::/gm) ?? []).length === 1) {
    return content.replace(/^   \.\. example::[^\n]*\n\n([\s\S]*)$/m, (_, body) => body.split(/\r?\n/).map((line) => line.startsWith('      ') ? line.slice(3) : line).join('\n'));
  }
  return content;
}

function ensureExampleFiles(directory, tag, title, example, oldExamples) {
  const examplesDirectory = join(docsRoot, directory, 'examples');
  mkdirSync(examplesDirectory, { recursive: true });
  const generated = Object.fromEntries(['html', 'adoc', 'md', 'rst'].map(extension => [extension, exampleFile(extension, tag, [{ label: 'Basic usage', source: markupExample(extension, example) }])]));
  for (const extension of ['html', 'adoc', 'md', 'rst']) {
    const path = join(examplesDirectory, `examples.${extension}`);
    const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
    let next;
    if (current.trim() !== '' && !/TO DO/i.test(current)) next = current;
    else if (extension === 'html' && oldExamples !== '') next = `${oldExamples.trim()}\n`;
    else next = generated[extension];
    if (extension === 'html' && !next.includes(`<${tag}`)) next = generated.html;
    if (extension === 'html') {
      const viewer = new RegExp(`^\\s*<tp-html-viewer\\b[^>]*\\blabel=["']${tag}["']`).test(next);
      if (!viewer) {
        const allowScript = /<script\b/i.test(next) ? ' allow-script' : '';
        next = `<tp-html-viewer label="${tag}"${allowScript}>\n${indent(next.trim(), 2)}\n</tp-html-viewer>\n`;
      }
    }
    if (extension === 'adoc' && !next.includes(`[${tag}`)) next = generated.adoc;
    if (extension === 'md' && !next.includes(`::: ${tag}`)) next = convertHtmlComponentsToMarkdown(next, tag);
    if (extension === 'md' && !next.includes(`::: ${tag}`)) next = generated.md;
    if (extension === 'rst' && !next.includes(`.. ${tag}::`)) next = generated.rst;
    if (next !== current) writeFileSync(path, next);
  }
}

function normalizeDependencies(block, tag) {
  if (block === '') {
    return `<!-- tp-docgen:dependencies:start -->
## Dependencies

### Internal

All tp-components used by \`<${tag}>\` are loaded automatically by this component if they have not already been loaded by another component.

None.

### External

No external dependency
<!-- tp-docgen:dependencies:end -->`;
  }
  return block
    .replace(/^### tp-components$/m, '### Internal')
    .replace(/^### credits$/m, '### External');
}

for (const component of components) {
  const docPath = join(docsRoot, component.directory, 'index.md');
  if (!existsSync(docPath)) continue;
  let markdown = readFileSync(docPath, 'utf8');
  const escapedTag = component.tag.replaceAll('-', '\\-');
  const brokenIntro = new RegExp(
    `^(<${escapedTag}\\b[^>]*>[\\s\\S]*?<\\/${escapedTag}>)\\n\\n## Usage\\n\\n<\\/template>\\n<\\/tp-html-viewer>`,
    'm',
  );
  markdown = markdown.replace(
    brokenIntro,
    '<tp-html-viewer lite>\n  <template>\n    $1\n  </template>\n</tp-html-viewer>\n\n## Usage',
  );
  const manifestPath = join(sourceRoot, component.directory, `${component.directory}.json`);
  let manifest;
  if (existsSync(manifestPath)) {
    try { manifest = JSON.parse(readFileSync(manifestPath, 'utf8')); } catch {}
  }
  const title = titleOf(markdown, component.tag);
  const summary = componentSummary(component, manifest);
  const example = initialExample(markdown, component.tag);
  const extra = preambleExtra(markdown, example);
  const oldUsage = section(markdown, '## Usage')
    .replace(/<!-- tp-docgen:dependencies:start -->[\s\S]*$/, '')
    .replace(/^```[ \t]*\r?\n/, '')
    .trim();
  const validUsage = oldUsage === '' || oldUsage === '```' ? '' : oldUsage;
  const usage = [extra, validUsage || `Use \`<${component.tag}>\` as shown below.\n\n\`\`\`html\n${example}\n\`\`\``].filter(Boolean).join('\n\n');
  const oldExamples = section(markdown, '## Examples');
  ensureExampleFiles(component.directory, component.tag, title, example, oldExamples);
  const className = manifest?.classname ?? component.source.match(/export class\s+(\w+)/)?.[1] ?? component.tag;
  const api = apiFromManifest(manifest, component.tag, className);
  const dependencyStart = markdown.lastIndexOf('<!-- tp-docgen:dependencies:start -->');
  const dependencyEnd = markdown.indexOf('<!-- tp-docgen:dependencies:end -->', dependencyStart);
  const dependencyBlock = dependencyStart >= 0 && dependencyEnd >= dependencyStart
    ? markdown.slice(dependencyStart, dependencyEnd + '<!-- tp-docgen:dependencies:end -->'.length)
    : '';
  const dependencies = normalizeDependencies(dependencyBlock, component.tag);
  const intro = `The custom \`<${component.tag}>\` element implements the ${title.toLowerCase()} functionality. ${summary}`;
  const next = `# ${title}

<tp-toc position="end" expand-all open brand></tp-toc>

${intro}

${example}

## Usage

${componentUsage(component.directory, usage)}

## Examples

${examplesTabs()}

## Programming

### API
<!-- tp-docgen:api ${className} -->
${api.replace(/^<!-- tp-docgen:api[^\n]*-->\s*|\s*<!-- \/tp-docgen:api -->$/g, '')}
<!-- /tp-docgen:api -->

### Imports

${imports(component.directory)}

${dependencies}
`;
  writeFileSync(docPath, next);
}

console.log(`Normalized ${components.length} component documentation pages.`);
