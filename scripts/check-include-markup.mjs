import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser = await chromium.launch();
try {
 const page = await browser.newPage();
 await page.goto(process.env.TP_DOCS_URL || 'http://127.0.0.1:4320/');
 const sources = {html:'<p>Included <strong>fragment</strong>.</p>',md:'Included **fragment**.',adoc:'Included *fragment*.',tex:'Included \\textbf{fragment}.',rst:'Included **fragment**.'};
 await page.route('**/include-check/**', route => {
  const url = new URL(route.request().url());
  const body = url.pathname.endsWith('nested.md') ? '::include{fragment.rst}' : sources[url.pathname.split('.').pop()];
  return route.fulfill({body,contentType:'text/plain'});
 });
 await page.evaluate(async () => { await import('/@tp/tp-components/components/include/include.js'); document.body.replaceChildren(); });
 for (const filename of [...Object.keys(sources).map(ext => `fragment.${ext}`), 'nested.md']) {
  const result = await page.evaluate(filename => new Promise(resolve => {
   document.body.replaceChildren();
   const element = document.createElement('tp-include');
   element.src = `/include-check/${filename}?version=1`;
   element.addEventListener('tp-include-load', () => resolve({bold:element.querySelector('strong')?.textContent}));
   element.addEventListener('tp-include-error', event => resolve({error:event.detail.error}));
   document.body.append(element);
  }),filename);
  assert.equal(result.bold,'fragment',`${filename}: ${JSON.stringify(result)}`);
  console.log(`${filename}: converted and displayed before load event`);
 }
} finally { await browser.close(); }
