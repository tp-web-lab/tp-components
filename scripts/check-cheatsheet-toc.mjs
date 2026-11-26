import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
 const page = await browser.newPage({ viewport: { width: Number(process.env.TP_VIEWPORT_WIDTH || 1100), height: 900 } });
 await page.goto(process.env.TP_DOCS_URL || 'http://127.0.0.1:4326/');
 await page.evaluate(theme => document.documentElement.classList.add(`tp-${theme}`), process.env.TP_THEME || 'light');
 await page.evaluate(async () => {
  await import('/@tp/tp-components/components/markup-converter/markup-converter.js');
  document.body.replaceChildren();
  const converter = document.createElement('tp-markup-converter');
  converter.setAttribute('src', '/docs/markup-cheatsheet-examples/toc.adoc');
  document.body.append(converter);
  await converter.getMarkup();
 });
 let reference;
 for (const [index, language] of ['html','asciidoc','latex','markdown','restructuredtext'].entries()) {
  await page.locator('[data-converter-formats] > [role="tablist"] [role="tab"]').nth(index).click();
  await page.waitForFunction(language => {
   const doc = document.querySelector(`tp-${language}-viewer iframe`)?.contentDocument;
   return doc?.querySelector('a[href]') && doc.querySelector('h3');
  }, language, {timeout: 60000});
  const result = await page.locator(`tp-${language}-viewer iframe`).evaluate(frame => {
   const doc = frame.contentDocument;
   return {html:doc.body.innerHTML, links:[...doc.querySelectorAll('nav a[href], details[data-markdown-toc] a[href]')].filter(a => ['Preparation','Practice','Review'].includes(a.textContent.trim())).map(a => ({text:a.textContent.trim(), target:!!doc.getElementById(a.getAttribute('href').split('#').pop())}))};
  });
  assert.equal(result.links.length, 3, `${language}: ${result.html}`);
  assert(result.links.every(a => a.target), `${language}: ${JSON.stringify(result.links)}`);
  await page.locator(`tp-${language}-viewer iframe`).evaluate((frame, theme) => {
   for (const element of [frame.contentDocument.documentElement, frame.contentDocument.body]) {
    element.classList.remove('tp-light', 'tp-dark');
    element.classList.add(`tp-${theme}`);
   }
  }, process.env.TP_THEME || 'light');
  await page.waitForTimeout(350); // Let the shared link-color transition settle.
  const geometry = await page.locator(`tp-${language}-viewer iframe`).evaluate(frame => {
   const doc = frame.contentDocument;
   const nav = doc.querySelector('nav');
   const bounds = nav.getBoundingClientRect();
   const top = bounds.top;
   const title = nav.querySelector(':scope > p, :scope > #toctitle');
   return [title, ...nav.querySelectorAll('li a')].map(element => {
    const rect = element.getBoundingClientRect();
    const style = frame.contentWindow.getComputedStyle(element);
    return { text: element.textContent.trim(), y: rect.top-top, x: rect.left-bounds.left, color:style.color, font:style.fontSize, line:style.lineHeight, weight:style.fontWeight };
   });
  });
  if (reference) assert.deepEqual(geometry, reference, `${language}: TOC presentation`);
  else reference = geometry;
  if (language === 'restructuredtext') {
   const backlink = page.frameLocator('tp-restructuredtext-viewer iframe').locator('h2 > a.toc-backref').first();
   for (const hovered of [false, true]) {
    if (hovered) await backlink.hover();
    await page.waitForTimeout(200);
    const presentation = await backlink.evaluate(link => {
     const style = getComputedStyle(link);
     const heading = getComputedStyle(link.parentElement);
     return { decoration: style.textDecorationLine, color: style.color, weight: style.fontWeight,
      headingColor: heading.color, headingWeight: heading.fontWeight,
      target: !!link.ownerDocument.getElementById(link.getAttribute('href').slice(1)) };
    });
    assert.equal(presentation.decoration, 'none');
    assert.equal(presentation.color, presentation.headingColor);
    assert.equal(presentation.weight, presentation.headingWeight);
    assert(presentation.target);
   }
  }
  const code = await page.locator('tp-markup-converter').evaluate((converter, language) => converter.getMarkup(language), language);
  const expected = {asciidoc: 'toc::[]', markdown: '[[toc]]', latex: '\\tableofcontents', restructuredtext: '.. contents::'}[language];
  if (expected) assert(code.includes(expected), `${language}: ${code}`);
  console.log(`${language}: native TOC with three valid heading links`);
 }
 const returned = await page.locator('tp-markup-converter').evaluate(async converter => {
  const rst = await converter.getMarkup('restructuredtext');
  converter.setSource(rst, 'restructuredtext');
  return await converter.getMarkup('markdown');
 });
 assert(returned.includes('[[toc]]'), returned);
 console.log('RST → Markdown: automatic TOC preserved');
} finally { await browser.close(); }
