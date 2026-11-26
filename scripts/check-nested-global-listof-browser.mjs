import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();try{
 const page=await browser.newPage();const failed=[];
 page.on('request',request=>{if(request.url().includes('/examples/guide/components/'))failed.push(request.url());});
 await page.route('**/__nested-guide',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__nested-guide#/components/global-listof/index.md');
 await page.evaluate(async()=>{
 await import('/src/components/html-multi-pages/html-multi-pages.ts');
 await import('/src/components/markdown-multi-pages/markdown-multi-pages.ts');
 const shell=document.createElement('tp-markdown-multi-pages');shell.setAttribute('repository','/docs');document.body.append(shell);
 });
 const inner=page.locator('tp-markdown-multi-pages > .tp-markdown-multi-pages-root tp-html-multi-pages').first();
 await inner.locator('[data-role=sidebar] a').filter({hasText:'List of figures'}).click({timeout:90000});
 await page.waitForFunction(()=>document.querySelector('tp-html-multi-pages tp-global-listof[selector=figure]')?.querySelectorAll('a[data-tp-global-origin]').length===4,null,{timeout:90000});
 for(const heading of await inner.locator('tp-global-listof tp-accordion dt').all()) {assert.equal(await heading.getAttribute('aria-expanded'),'false');await heading.click();}
 assert.equal(await inner.locator('tp-global-listof a').count(),4);
 assert.equal(await inner.locator('tp-global-listof li > figure').count(),4);
 assert.deepEqual(await inner.locator('tp-global-listof li > figure > figcaption').allTextContents(),['First chapter diagram','First chapter detail without an authored ID','Second chapter diagram','Second chapter detail without an authored ID']);
 for(const figure of await inner.locator('tp-global-listof li > figure').all()) assert.ok(await figure.isVisible());
 await page.waitForFunction(()=>[...document.querySelectorAll('tp-html-multi-pages tp-global-listof figure img')].length===4 && [...document.querySelectorAll('tp-html-multi-pages tp-global-listof figure img')].every(img=>img.complete && img.naturalWidth>0));
 const sizes=await inner.locator('tp-global-listof figure').evaluateAll(figures=>figures.map(figure=>({width:figure.getBoundingClientRect().width,imageHeight:figure.querySelector('img').getBoundingClientRect().height})));
 const rem=await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize));
 assert.ok(sizes.every(size=>size.width<=20*rem+1 && size.imageHeight<=14*rem+1),JSON.stringify({sizes,rem}));
 const outerRoute=await page.evaluate(()=>location.hash);
 await inner.locator('tp-global-listof a').nth(1).click();
 await inner.locator('[data-tp-global-anchor]').waitFor({state:'attached',timeout:30000});
 assert.equal(await page.evaluate(()=>location.hash),outerRoute);
 assert.ok((await inner.locator('[data-tp-global-anchor]').evaluate(a=>a.nextElementSibling?.textContent)).includes('detail without an authored ID'));
 await inner.locator('[data-role="sidebar"] a').filter({hasText:'Overview'}).first().click();
 await inner.locator('#global-lists-overview').waitFor({timeout:30000});
 await inner.locator('[data-role=sidebar] a').filter({hasText:'List of notes'}).click();
 await page.waitForFunction(()=>document.querySelector('tp-html-multi-pages tp-global-listof')?.querySelectorAll('a').length===2);
 for(const heading of await inner.locator('tp-global-listof tp-accordion dt').all()) await heading.click();
 assert.deepEqual(await inner.locator('tp-global-listof ol > li').evaluateAll(items=>items.map(item=>item.value)),[1,1]);
 assert.deepEqual(await inner.locator('tp-global-listof ol > li > div').allTextContents(),['A local note for First chapter.','A local note for Second chapter.']);
 await inner.locator('tp-global-listof a').last().click();
 await inner.locator('[data-tp-global-anchor]').waitFor({state:'attached'});
 assert.equal(await inner.locator('[data-tp-global-anchor]').evaluate(a=>a.nextElementSibling?.localName),'tp-note');
 assert.equal(await page.evaluate(()=>location.hash),outerRoute);
 for(const [title,tag] of [['Glossary','tp-glossary'],['Index','tp-index']]) {
  for(let i=0;i<6;i++) {
   await inner.locator('[data-role=sidebar]').getByRole('link',{name:title,exact:true}).click();
   await page.waitForFunction(tag=>document.querySelector(`tp-html-multi-pages tp-global-listof[selector="${tag}"]`)?.querySelectorAll('dt').length===6,tag);
   const definitions=inner.locator(`tp-global-listof[selector="${tag}"] dl > dd`);
   assert.equal(await definitions.count(),6);
   assert.ok((await definitions.nth(i).textContent()).trim().length>10);
   assert.ok(await definitions.nth(i).isVisible());
   if(tag==='tp-biblio') assert.equal(await definitions.locator('em').count(),2);
   await inner.locator(`tp-global-listof[selector="${tag}"] a[data-tp-global-origin]`).nth(i).click();
   await inner.locator('[data-tp-global-anchor]').waitFor({state:'attached'});
   assert.equal(await inner.locator('[data-tp-global-anchor]').evaluate(a=>a.nextElementSibling?.localName),tag);
   assert.equal(await page.evaluate(()=>location.hash),outerRoute);
  }
 }
 assert.deepEqual(failed,[]);
 console.log('Actual documentation: nested guide loads its cover, follows page/anchor links and returns to Overview without changing the parent route.');
}finally{await browser.close();}
