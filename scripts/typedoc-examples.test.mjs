import assert from 'node:assert/strict';
import test from 'node:test';
import { checkExample } from './check-typedoc-examples.mjs';

const example = code => `<div class="tsd-tag-example"><pre><code>${code}</code></pre></div>`;
const comment = body => `<div class="tsd-comment">${body}</div>`;

test('TypeDoc spans, entities, blank lines and indentation preserve the introductory source', () => {
  const source = '<tp-box heading="A & B">\n\n  Text\n</tp-box>';
  const html = '<span>&lt;tp-box heading="A &amp; B"&gt;</span><br/><br/>  Text<br/>&lt;/tp-box&gt;';
  assert.equal(checkExample(comment(example(html)), source), null);
});

test('trailing metadata and missing newlines fail exact comparison', () => {
  assert.match(checkExample(comment(example('&lt;tp-box&gt;&lt;/tp-box&gt;<br/>@event change')), '<tp-box></tp-box>'), /differs/);
  assert.match(checkExample(comment(example('&lt;tp-box&gt;&lt;/tp-box&gt;')), '<tp-box>\n</tp-box>'), /differs/);
});

test('missing and duplicate class examples fail, method examples remain independent', () => {
  assert.match(checkExample(comment(''), '<tp-box></tp-box>'), /Missing/);
  const block = example('&lt;tp-box&gt;&lt;/tp-box&gt;');
  assert.match(checkExample(comment(block + block), '<tp-box></tp-box>'), /found 2/);
  assert.equal(checkExample(comment(block) + comment(example('method example')), '<tp-box></tp-box>'), null);
  assert.match(checkExample(comment('Class without example') + comment(block), '<tp-box></tp-box>'), /Missing/);
});
