/** Keep the first example in all five languages synchronized with introduction.html. */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFragment } from 'parse5';
import { exampleFile, markupExample, namedExamples, viewerSource } from './component-basic-examples.mjs';
import { latexMarkup } from '../src/utilities/latex-markup.js';

export function basicLatex(component, intro) {
  // Preserve the native TikZ demonstration, deriving its drawing and scale from the introduction.
  if (component === 'tikz') {
    const node = parseFragment(intro).childNodes.find(node => node.tagName === 'tp-tikz');
    const script = node?.childNodes.find(node => node.tagName === 'script');
    const scale = node?.attrs.find(attr => attr.name === 'scale')?.value;
    if (!script || !scale) throw new Error('Missing introductory TikZ drawing or scale');
    const drawing = script.childNodes.map(node => node.value ?? '').join('').trim();
    return `\\documentclass{article}\n\\usepackage{tikz}\n\\begin{document}\n${drawing.replace(/\\begin\{tikzpicture\}\[/, `\\begin{tikzpicture}[scale=${scale},transform shape,`)}\n\\end{document}`;
  }
  return `\\documentclass{article}\n${component === 'carousel' ? '\\usepackage{graphicx}\n' : ''}\\begin{document}\n${latexMarkup(intro)}\n\\end{document}`;
}

export function synchronizeBasicUsage({ root = resolve(import.meta.dirname, '..'), check = true } = {}) {
  const docs = resolve(root, 'public/docs/components');
  const issues = [];
  let count = 0;
  const update = (path, content) => {
    if (existsSync(path) && readFileSync(path, 'utf8') === content) return;
    issues.push(path.slice(root.length + 1));
    if (!check) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, content); }
  };
  for (const component of readdirSync(docs)) {
    const folder = resolve(docs, component, 'examples');
    const introPath = resolve(folder, 'introduction.html');
    if (!existsSync(resolve(root, `src/components/${component}/${component}.json`))) continue;
    if (!existsSync(resolve(docs, component, 'index.md'))) continue;
    if (!existsSync(introPath)) throw new Error(`Missing introduction: ${component}`);
    const intro = readFileSync(introPath, 'utf8').trim();
    count++;
    for (const language of ['html', 'adoc', 'tex', 'md', 'rst']) {
      const path = resolve(folder, `examples.${language}`);
      let content = readFileSync(path, 'utf8');
      if (language === 'html' && !/^<tp-html-viewer\b[^>]*\bpreserve-source/.test(content)) {
        content = content.replace('<tp-html-viewer ', '<tp-html-viewer preserve-source ');
        update(path, content);
      }
      if (language === 'tex') {
        const sections = [...content.matchAll(/^% !tp-example (.+)\n/gm)];
        if (sections[0]?.[1] !== 'Basic usage' || sections.filter(match => match[1] === 'Basic usage').length !== 1) throw new Error(`${component}/tex: expected exactly one Basic usage, first`);
        const start = sections[0].index + sections[0][0].length;
        const end = sections[1]?.index ?? content.length;
        const expected = basicLatex(component, intro);
        if (content.slice(start, end).trim() !== expected) update(path, content.slice(0, start) + expected + '\n\n' + content.slice(end));
        continue;
      }
      const examples = namedExamples(language, viewerSource(language, content));
      if (examples[0]?.label !== 'Basic usage' || examples.filter(example => example.label === 'Basic usage').length !== 1) throw new Error(`${component}/${language}: expected exactly one Basic usage, first`);
      const expected = markupExample(language, intro, { onAsset: (url, source) => update(resolve(root, 'public' + url), source + '\n') });
      if (examples[0].source !== expected) {
        examples[0].source = expected;
        update(path, exampleFile(language, `tp-${component}`, examples));
      }
    }
  }
  if (!count) throw new Error('No component introductions found');
  return { count, issues };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const check = !process.argv.includes('--write');
  const {count, issues} = synchronizeBasicUsage({check});
  console.log(`${check ? 'Checked' : 'Synchronized'} ${count} components / ${count * 5} Basic usage examples; ${issues.length} ${check ? 'outdated' : 'updated'} files.`);
  if (issues.length) console.log(issues.join('\n'));
  if (check && issues.length) process.exitCode = 1;
}
