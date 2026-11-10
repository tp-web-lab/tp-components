/** Check the programmed examples in real render frames, without implicit component loading. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 await page.route('**/__javascript_check',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(new URL('/__javascript_check',process.env.TP_EXAMPLES_URL ?? 'http://127.0.0.1:4197').href);
 await page.evaluate(()=>import('/src/tp-loader.ts'));
 const cases=['button','button-group','word-cloud','carousel','control','icon-button','markdown','latex','latex-viewer','html-viewer','markup-multi-pages','latex-multi-pages','latex-multi-slides','notebook','dialog','menu','dropdown','slider','audio-playlist','code-editor','ref','blank'];
 for(const component of cases) {
  const api=JSON.parse(readFileSync(`src/components/${component}/${component}.json`,'utf8'));
  for(const extension of component==='button' || component==='latex-multi-pages' ? ['html','md','adoc','rst','latex'] : ['html']) {
   const errors=[];
   const errorHandler=error=>errors.push(error.message);page.on('pageerror',errorHandler);
   await page.evaluate(async({component,extension})=>{
    document.body.replaceChildren();
    const renderer={md:'markdown',adoc:'asciidoc',rst:'restructuredtext'}[extension];
    const url=`/docs/components/${component}/examples/${extension==='latex'?'examples-latex.html':`examples.${extension}`}`;
    if(renderer){await import(`/src/components/${renderer}/${renderer}.ts`);const el=document.createElement(`tp-${renderer}`);el.setAttribute('src',url);document.body.append(el);}
    else document.body.innerHTML=await(await fetch(url)).text();
   },{component,extension});
   await page.locator('select[aria-label="Example"]').first().selectOption({label:'Javascript API'});
   const frame=page.frameLocator('iframe').first();
   await frame.locator(api.tagname).first().waitFor({state:'attached',timeout:20000});
   assert.equal(await frame.locator('script').evaluateAll(nodes=>nodes.some(n=>/import\s*['"][^'"]*tp-loader/.test(n.textContent))),false,`${component}: unexpected loader`);
   await frame.locator(api.tagname).first().evaluate(async el=>{await customElements.whenDefined(el.localName);});
   if(component==='button-group') {
    await frame.locator('[data-next]').click();
    assert.equal(await frame.locator('[data-page-status]').textContent(),'Page 2 of 5');
   }
   assert.deepEqual(errors,[],`${component}/${extension}`);
   page.off('pageerror',errorHandler);
   console.log(`${component}/${extension}: Javascript API rendered`);
  }
 }
} finally {await browser.close();}
