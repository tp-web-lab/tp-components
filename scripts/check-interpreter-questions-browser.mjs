import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
const base = process.env.TP_BASE_URL || 'http://127.0.0.1:4174';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.routeWebSocket('**', () => {});
page.setDefaultTimeout(60000);
await page.route('**/__interpreter-questions', route => route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
const results=[];
try {
 for (const [lang,ext] of [['javascript','js'],['typescript','ts'],['scheme','scm'],['ocaml','ml'],['prolog','pl'],['python','py']]) {
  if (process.env.TP_LANGUAGES && !process.env.TP_LANGUAGES.split(',').includes(lang)) continue;
  const tag=`${lang}-interpreter-question`; console.log('Starting',lang);
  const intro=await readFile(new URL(`../public/docs/components/${tag}/examples/introduction.html`,import.meta.url),'utf8');
  const solved=await readFile(new URL(`../public/docs/components/${tag}/examples/double-solved.${ext}`,import.meta.url),'utf8');
  await page.goto(`${base}/__interpreter-questions`); console.log('Page ready');
  await page.evaluate(async({tag,intro})=>{await import(`/src/components/${tag}/${tag}.ts`);document.body.innerHTML=intro;},{tag,intro}); console.log('Mounted');
  await page.waitForFunction(tag=>{const q=document.querySelector(`tp-${tag}`);return q?.ready && q.querySelector('tp-code-editor')?.getValue()?.includes('double');},tag);
  console.log('Source ready');
  const run=()=>page.evaluate(async lang=>{await document.querySelector(`tp-${lang}`).run();},lang);
  await Promise.race([run(), new Promise((_, reject)=>setTimeout(()=>reject(Error('Interpreter run timeout')),60000))]);
  console.log('Query finished');
  const original=await page.locator(`tp-${lang} tp-code-editor`).evaluate(el=>el.getValue());
  const initial=await page.locator(`tp-${lang} [role=log]`).textContent();
  assert(!initial.includes('ERROR:'),`${lang}: ${initial}`);
  await page.locator(`[data-action="submit"] button`).click();
  await page.waitForFunction(() => /Tests failed|failed: [1-9]|[1-9] failed|FAIL|AssertionError/i.test(document.querySelector('[data-tp-question-feedback-box]')?.textContent || ''),null,{timeout:60000});
  await page.locator(`tp-${lang} tp-code-editor`).evaluate((el,source)=>el.setValue(source),solved);
  // Submit before Run: the grading snapshot must already contain the edits.
  await page.locator(`[data-action="submit"] button`).click();
  await page.waitForFunction(() => /PlUnit: passed|Tests passed: 3|3 passing|3 passed|3 tests passed|All tests passed/i.test(document.querySelector('[data-tp-question-feedback-box]')?.textContent || ''),null,{timeout:60000});
  await run();
  const output=await page.locator(`tp-${lang} [role=log]`).textContent();
  assert(output.includes('Program reloaded.'),`${lang}: missing reload notice: ${output}`);
  assert(output.includes('6'),`${lang}: missing result: ${output}`);
  await page.getByRole('button', {name:'Reset response', exact:true}).click();
  await page.waitForFunction(({lang,original})=>document.querySelector(`tp-${lang} tp-code-editor`)?.getValue() === original,{lang,original});
  const item={language:lang,query:initial.trim(),grading:'failed then passed',reset:true};results.push(item);console.log(JSON.stringify(item));
 }
} catch(error) {console.error(await page.evaluate(()=>({body:document.body.innerText,frames:[...document.querySelectorAll('iframe')].map(f=>f.contentDocument?.body?.innerText)})));throw error;}
finally{await browser.close();}
console.log(`Verified ${results.length} interpreter questions.`);
