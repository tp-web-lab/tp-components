/** Verify the three LaTeX document shells in all five example languages. */
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('**/__latex_check',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
 await page.goto(new URL('/__latex_check',process.env.TP_LATEX_TEST_URL ?? 'http://127.0.0.1:4197/').href);
 await page.evaluate(()=>import('/src/tp-loader.ts'));
 await page.evaluate(()=>document.body.replaceChildren());
 for(const kind of ['single-page','multi-pages','multi-slides']) for(const [extension,renderer] of [['html',null],['md','markdown'],['adoc','asciidoc'],['rst','restructuredtext'],['examples-latex.html',null]]) {
 const file=extension==='examples-latex.html'?extension:`examples.${extension}`;
 await page.evaluate(async({kind,file,renderer})=>{
 document.body.replaceChildren();
 const url=`/docs/components/latex-${kind}/examples/${file}`;
 if(renderer){await import(`/src/components/${renderer}/${renderer}.ts`);const el=document.createElement(`tp-${renderer}`);el.setAttribute('src',url);document.body.append(el);}
 else document.body.innerHTML=await (await fetch(url)).text();
 },{kind,file,renderer});
 await page.locator('iframe').first().waitFor();
 await page.frameLocator('iframe').first().locator(`tp-latex-${kind} tp-latex h2`).first().waitFor({timeout:15000});
 console.log(kind,file,'passed');
 }
} finally {await browser.close();}
