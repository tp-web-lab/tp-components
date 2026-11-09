import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { sections, transformPage, dependencyIntroduction } from './sync-component-doc-layout.mjs';
import { documentedComponents, readExamples } from './standardize-component-examples.mjs';

test('every component follows the requested layout and reuses its introductory example', () => {
  for (const name of documentedComponents()) {
    const page = readFileSync(`public/docs/components/${name}/index.md`, 'utf8');
    const parts = sections(page, 2);
    assert.deepEqual(parts.map(s => s.title), ['Component viewer', 'Usage', 'Examples', 'Dependencies'], name);
    assert.equal((page.match(/<!-- tp-docgen:dependencies:start -->/g) ?? []).length, 1, name);
    assert.match(page, /<tp-toc position="end" expand-all><\/tp-toc>/, name);
    assert.match(page, new RegExp('The custom `<tp-' + name + '>` element '), name);
    const usage = sections(parts[1].text, 3);
    assert.equal(usage.at(-1).title, 'Importing', name);
    const initial = usage.findIndex(s => s.title === 'Initial content');
    assert.ok(initial === -1 || initial === 0, name);
    assert.deepEqual(sections(parts[3].text, 3).map(s => s.title), ['Internal', 'External'], name);
    assert.ok(parts[3].text.includes(dependencyIntroduction), name);
    for (const lang of ['html','adoc','md','rst']) assert.ok(parts[2].text.includes(`examples/examples.${lang}`), name);
    const examples = readExamples(name, 'html');
    const path = `public/docs/components/${name}/examples/introduction.html`;
    assert.ok(existsSync(path), name);
    assert.equal(readFileSync(path,'utf8').trim(), examples[0].source.trim(), name);
    assert.equal(transformPage(name, page, examples[0].source, examples.map(e=>e.label)), page, name);
    const description = page.match(/^The custom[^\n]+/m)[0];
    assert.doesNotMatch(description, /@example|@tagname|functionality:|provides an? (?:checks|stacks|associates)/, name);
  }
});
