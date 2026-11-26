import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium,firefox,webkit} from '@playwright/test';
const browser=await ({chromium,firefox,webkit}[process.env.TP_TEST_BROWSER||'chromium']).launch();
const base=process.env.TP_TEST_BASE_URL||'http://127.0.0.1:4173';
const docs=new URL('../../tp-examples/packages/math-openai/public/docs/',import.meta.url);
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/__amsplain',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.route('**/fixtures/paper.tex',route=>route.fulfill({contentType:'text/plain',body:readFileSync(new URL('main.tex',docs),'utf8')}));
 let reads=0;
 await page.route('**/fixtures/references.bib',route=>{reads++;return route.fulfill({contentType:'text/plain',body:readFileSync(new URL('references.bib',docs),'utf8')});});
 await page.goto(base+'/__amsplain');
 await page.evaluate(async()=>{await import('/src/components/latex/latex.ts');document.body.innerHTML='<tp-latex src="/fixtures/paper.tex"></tp-latex>';});
 await page.waitForFunction(()=>document.querySelector('tp-latex')?.hasAttribute('data-tp-latex-rendered'),{},{timeout:60000});
 assert.equal(await page.locator('tp-latex tp-biblio').count(),9);assert.equal(reads,1);
 assert.deepEqual(await page.locator('tp-latex tp-ref[href="@OpenAI26Potts"]').evaluateAll(nodes=>nodes.map(e=>e.getAttribute('label'))),['7','7']);
 for(const style of ['amsplain','amsalpha']) {
 const converted=await page.evaluate(async ({base,style})=>{
  const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
  const source=String.raw`\usepackage{hyperref}\bibliographystyle{${style}}\cite{OpenAI26Potts,EKPS00}\bibliography{references}`;
  const html=await markupToHtml(source,'latex',base+'/fixtures/paper.tex');
  const latex=htmlToMarkup(html,'latex');
  const roundtrip=await markupToHtml(latex,'latex',base+'/fixtures/paper.tex');
  const root=document.createElement('div');root.innerHTML=roundtrip;
  return {latex,keys:[...root.querySelectorAll('tp-biblio')].map(e=>e.getAttribute('ref')),labels:[...root.querySelectorAll('tp-ref')].map(e=>e.getAttribute('label'))};
 },{base,style});
 assert.match(converted.latex,/\\begin\{thebibliography\}/);assert.deepEqual(converted.keys,['EKPS00','OpenAI26Potts']);assert.deepEqual(converted.labels,style==='amsalpha'?['Ope26','EKPS00']:['2','1']);
 }
 assert.deepEqual(errors,[]);console.log('Direct loading, all nine entries, OpenAI [7] and native bibliography roundtrips for amsplain and amsalpha passed.');
} finally {await browser.close();}
