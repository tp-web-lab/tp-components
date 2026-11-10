import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import MarkdownIt from 'markdown-it';
import rawHtml from '@tp/tp-markdown/markdown/extensions/raw-html/index';
const parser = new MarkdownIt({html:true}).use(rawHtml);
import {liveIntroduction} from './sync-component-doc-layout.mjs';

test('the RST viewer introduction keeps its script isolated from the rest of the page', async () => {
  const page = readFileSync('public/docs/components/restructuredtext-viewer/index.md', 'utf8');
  const introduction = readFileSync('public/docs/components/restructuredtext-viewer/examples/introduction.html', 'utf8').trim();
  const html = await parser.render(page);
  assert.ok(html.includes(introduction));
  const source = html.match(/<script type="tp\/restructuredtext">([\s\S]*?)<\/script>/)?.[1];
  assert.equal(source, introduction.match(/<script type="tp\/restructuredtext">([\s\S]*?)<\/script>/)?.[1]);
  assert.doesNotMatch(source, /<pre>|Component viewer|Initial content/);
  assert.match(html, /<h2>Component viewer<\/h2>/);
});

test('live introductions preserve blank lines and embedded Markdown fences in raw-text elements', async () => {
  const source = '<tp-markdown><script type="tp/markdown">\n\n```js\nconst n = 1;\n```\n\n</script></tp-markdown>';
  const html = await parser.render(liveIntroduction(source));
  assert.equal(html.trim(), source);
  assert.equal(liveIntroduction('<tp-button>Save</tp-button>'), '<tp-button>Save</tp-button>');
});
