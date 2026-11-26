import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 page.on("console", message=>{if(message.text().startsWith("row-check:"))console.log(message.text());});
 await page.route('**/__equanum-rows',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_COMPONENTS_URL || 'http://127.0.0.1:4174'}/__equanum-rows`);
 const results=await page.evaluate(async()=>{
  await import('/src/components/ref/ref.ts'); await import('/src/components/math/math.ts');
  const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
  const results=[];let rendered='';
  for(const [env,first,second] of [['alignat','{2}x&=1 & z&=3','y&=2 & w&=4'],['flalign','x&=1&&','y&=2&&'],['gather','x=1','y=2'],['eqnarray','x&=&1','y&=&2']]) {
   const source=String.raw`\begin{${env}}${first}\label{first}\\${second}\tag{B}\label{second}\end{${env}}See \eqref{first} and \eqref{second}.`;
   const html=await markupToHtml(source,'latex',location.href);
   for(const language of ['html','markdown','asciidoc','restructuredtext','latex']) {
    console.log("row-check:",env,language);
    const code=htmlToMarkup(html,language);const back=await markupToHtml(code,language,location.href);
    const root=document.createElement('template');root.innerHTML=back;
    const preview=decodeURIComponent(root.content.querySelector('tp-equanum[ref="second"]').getAttribute('data-latex-equation-preview'));
    const latex=htmlToMarkup(back,'latex');
    results.push({env,language,preview,valid:preview.includes(second)&&!preview.includes('x')&&preview.includes(String.raw`\tag{B}`)&&latex.includes(`\\begin{${env}}`)&&latex.includes(String.raw`\label{second}`)&&!latex.includes('wcTpRef')});
    rendered+=`<article data-env="${env}" data-language="${language}">${back}</article>`;
   }
  }
  document.body.innerHTML=rendered;return results;
 });
 for(const result of results)assert.ok(result.valid,JSON.stringify(result));
 await page.waitForFunction(()=>[...document.querySelectorAll('tp-math')].every(m=>m.querySelector('svg')),null,{timeout:60000}).catch(async error=>{console.log(await page.evaluate(()=>[...document.querySelectorAll('tp-math')].filter(m=>!m.querySelector('svg')).map(m=>({env:m.closest('article')?.dataset.env,language:m.closest('article')?.dataset.language,value:m.getAttribute('value'),text:m.textContent})))) ;throw error;});
 assert.equal(await page.locator('[data-mml-node="merror"]').count(),0);
 for(const env of ['alignat','flalign','gather','eqnarray']) {
  const article=page.locator(`article[data-env="${env}"][data-language="html"]`);
  await article.locator('tp-ref[href="=second"] button').hover();
  await page.waitForFunction(env=>document.querySelector(`article[data-env="${env}"] tp-ref[href="=second"] tp-tooltip:popover-open tp-math svg`),env);
  assert.ok((await article.locator('tp-ref[href="=second"] tp-tooltip tp-math').getAttribute('value')).includes('y'));
 }
 await page.evaluate(async()=>{
  await import('/src/components/latex/latex.ts');
  const html=await (await fetch('/docs/components/equanum/examples/examples.html')).text();
  const parsed=new DOMParser().parseFromString(html,'text/html');
  const examples=[...parsed.querySelector('template').content.querySelectorAll('[role="example"]')].filter(e=>e.getAttribute('label').endsWith('row previews'));
  document.body.replaceChildren(...examples);
 });
 await page.waitForFunction(()=>document.querySelectorAll('tp-equanum').length===10 && [...document.querySelectorAll('tp-math')].every(m=>m.querySelector('svg')),null,{timeout:60000});
 assert.equal(await page.locator('[data-mml-node="merror"], tp-math tp-callout').count(),0);
 await page.screenshot({path:'/tmp/equanum-row-examples.png'});
 for(const env of ['align','alignat','flalign','gather','eqnarray']) {
  const example=page.locator(`[role="example"][label="${env} row previews"]`);
  for(const key of ['first','second']) {
   await example.locator(`tp-ref[href="=row:${key}"] button`).hover();
   await page.waitForFunction(({env,key})=>document.querySelector(`[role="example"][label="${env} row previews"] tp-ref[href="=row:${key}"] tp-tooltip:popover-open tp-math svg`),{env,key});
   const value=await example.locator(`tp-ref[href="=row:${key}"] tp-tooltip tp-math`).getAttribute('value');
   assert.match(value,key==='first'?/\bx\s*[&=]/:/\by\s*[&=]/);
   assert.doesNotMatch(value,key==='first'?/\by\s*[&=]/:/\bx\s*[&=]/);
  }
 }
 console.log('All five documentation examples and their ten row previews passed.');
 console.log('20 five-language roundtrips and MathJax row previews passed.');
} finally {await browser.close();}
