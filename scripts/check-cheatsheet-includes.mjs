import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
 const page = await browser.newPage();
 await page.goto(process.env.TP_DOCS_URL || 'http://127.0.0.1:4326/');
 const api = await page.evaluate(async () => {
  const {convertFile} = await import('/@tp/tp-components/components/markup-converter/markup-converter.js');
  const result = await convertFile('/docs/markup-cheatsheet-examples/included-fragment.adoc', 'auto', 'markdown');
  document.body.replaceChildren();
  const converter = document.createElement('tp-markup-converter');
  converter.setAttribute('src', '/docs/markup-cheatsheet-examples/includes.adoc');
  document.body.append(converter);
  await converter.getMarkup();
  return result;
 });
 assert(api.includes('**included fragment**'), api);
 for (const [index, language] of ['html','asciidoc','latex','markdown','restructuredtext'].entries()) {
  await page.locator('[data-converter-formats] > [role="tablist"] [role="tab"]').nth(index).click();
  await page.waitForFunction(language => {
   const doc = document.querySelector(`tp-${language}-viewer iframe`)?.contentDocument;
   return doc?.querySelector('strong')?.textContent === 'included fragment' && doc.querySelectorAll('li').length === 2;
  }, language, {timeout:60000});
  const code = await page.locator('tp-markup-converter').evaluate((converter, lang) => converter.getMarkup(lang), language);
  assert(code.includes('included-fragment.adoc'), code);
  assert(!code.includes('Practice'), code);
  console.log(`${language}: inclusion retained, included formatting and list rendered`);
 }
 const heightAfter = async html => {
  await page.locator('tp-markup-converter').evaluate(async (converter, html) => {
   converter.setSource(html, 'html');
   await converter.getMarkup();
  }, html);
  const frame = page.locator('tp-html-viewer iframe');
  await frame.waitFor();
  await page.waitForTimeout(500);
  return frame.evaluate(frame => frame.getBoundingClientRect().height);
 };
 const initial = await heightAfter('<p>Short.</p>');
 const grown = await heightAfter('<p>' + 'A paragraph that wraps as the viewport becomes narrower. '.repeat(80) + '</p>');
 assert(grown > initial, 'Viewer grows with replaced content');
 await page.setViewportSize({width:420, height:900});
 await page.waitForTimeout(500);
 const narrow = await page.locator('tp-html-viewer iframe').evaluate(frame => frame.getBoundingClientRect().height);
 assert(narrow > grown, 'Viewer adapts to wrapping');
 const shrunk = await heightAfter('<p>Short again.</p>');
 assert(shrunk < grown, 'Viewer shrinks after replacement');
 console.log('Viewer sizing: growth, wrapping and shrink verified');
} finally { await browser.close(); }
