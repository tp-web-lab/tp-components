import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
try {
 const page = await browser.newPage();
 await page.goto(process.env.TP_DOCS_URL || 'http://127.0.0.1:4320/');
 const samples = {html:'<p>Included <strong>fragment</strong>.</p>', md:'Included **fragment**.', adoc:'Included *fragment*.', tex:'Included \\textbf{fragment}.', rst:'Included **fragment**.'};
 await page.route('**/include-test/**', async route => {
  const url = new URL(route.request().url());
  const name = url.pathname.split('/').pop();
  if (name === 'missing.md') return route.fulfill({status:404,body:'Not found'});
  if (name === 'loop.md') return route.fulfill({body:'::include{loop.md}'});
  if (name === 'chapter.adoc') return route.fulfill({body:'include::nested/fragment.md[]'});
  const content = samples[name.split('.').pop()];
  return route.fulfill({body:content || 'Unknown file',contentType:'text/plain'});
 });
 await page.evaluate(async () => {
  document.body.replaceChildren();
  for (const lang of ['markdown','asciidoc','latex','restructuredtext']) await import(`/@tp/tp-components/components/${lang}/${lang}.js`);
 });
 for (const lang of ['markdown','asciidoc','latex','restructuredtext']) {
  for (const ext of Object.keys(samples)) {
   const path = `nested/fragment.${ext}`;
   const code = {markdown:`::include{${path}}`, asciidoc:`include::${path}[]`,latex:`\\input{${path}}`,restructuredtext:`.. include:: ${path}`}[lang];
   await page.evaluate(({lang,code}) => {
    document.body.replaceChildren();
    const component = document.createElement(`tp-${lang}`);
    component.setAttribute('data-tp-source', location.origin+'/include-test/document.'+({latex:'tex',restructuredtext:'rst',markdown:'md',asciidoc:'adoc'}[lang]));
    if (lang === 'latex') component.setAttribute('value', code);
    else { const script = document.createElement('script'); script.type=`tp/${lang}`; script.textContent=code; component.append(script); }
    document.body.append(component);
   },{lang,code});
   await page.waitForFunction(lang => document.querySelector(`tp-${lang}`)?.hasAttribute(`data-tp-${lang}-rendered`),lang,{timeout:60000});
   const result = await page.locator(`tp-${lang}`).evaluate(el => ({bold:el.querySelector('strong')?.textContent, error:el.querySelector('[role="alert"]')?.textContent}));
   assert.equal(result.bold,'fragment',`${lang} includes ${ext}: ${JSON.stringify(result)}`);
  }
  console.log(`${lang}: includes all five source formats directly`);
 }
 await page.evaluate(() => {
  document.body.replaceChildren();
  const component = document.createElement('tp-asciidoc');
  component.setAttribute('src', '/include-test/chapter.adoc');
  document.body.append(component);
 });
 await page.waitForFunction(() => document.querySelector('tp-asciidoc strong')?.textContent === 'fragment');
 console.log('External src: nested relative inclusion rendered');
 for (const file of ['missing.md','loop.md']) {
  await page.evaluate(file => {
   document.body.replaceChildren();
   const component = document.createElement('tp-latex');
   component.setAttribute('value', `\\input{/include-test/${file}}`);
   document.body.append(component);
  },file);
  await page.waitForFunction(() => document.querySelector('tp-latex [role="alert"]'));
 }
 console.log('Missing files and cycles: errors displayed');
} finally { await browser.close(); }
