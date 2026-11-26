import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 for(const kind of ['biblio','glossary','index']) {
 const page=await browser.newPage();
 await page.route('**/__global-references',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-references');
 await page.evaluate(async kind=>{
 await import('/src/components/ref/ref.ts');
 await import('/src/components/listof/listof.ts');
 await import('/src/components/html-multi-pages/html-multi-pages.ts');
 const host=document.createElement('tp-html-multi-pages');host.setAttribute('repository',`/docs/components/global-listof/examples/${kind}-guide`);document.body.append(host);
 },kind);
 for(let i=0;i<4;i++) {
 if(i)await page.evaluate(()=>{location.hash='#/cover.html';});
 await page.waitForFunction(()=>document.querySelectorAll('tp-global-listof a[data-tp-global-origin]').length===4);
 assert.equal(await page.locator('tp-global-listof dl > dd').count(),4);
 assert.ok((await page.locator('tp-global-listof dl > dd').nth(i).textContent()).trim().length>10);
 const link=page.locator('tp-global-listof a[data-tp-global-origin]').nth(i);const href=await link.getAttribute('href');
 const expectedPage=href.startsWith('#/first.html')?'first':'second';
 assert.ok(href.startsWith(`#/${expectedPage}.html`));
 const expectedRef=href.endsWith('#shared-definition')?'shared':expectedPage;
 await link.click();
 await page.waitForFunction(()=>!!document.querySelector('[data-tp-global-anchor]'));
 const result=await page.locator('[data-tp-global-anchor]').evaluate(anchor=>{
 const target=anchor.nextElementSibling;
 return {tag:target.localName,ref:target.getAttribute('ref'),display:getComputedStyle(target).display,anchorRects:anchor.getClientRects().length,content:target.textContent};
 });
 assert.equal(result.tag,`tp-${kind}`);
 assert.equal(result.ref,expectedRef);
 assert.equal(result.display,'none');
 assert.ok(result.anchorRects>0,'Scroll anchor must have a layout box');
 await page.locator('tp-ref button').first().hover();
 await page.waitForFunction(()=>document.querySelector('tp-ref tp-tooltip')?.textContent.trim().length>0);
 const tooltip=await page.locator('tp-ref tp-tooltip').first().textContent();
 assert.ok(tooltip.toLowerCase().includes(expectedPage),`${kind}: local definition must remain page-specific`);
 assert.equal(await page.locator(`tp-listof[selector="tp-${kind}"]`).count(),1);
 }
 console.log(`${kind}: four definition links, explicit/generated anchors, CSS-hidden targets and local tooltips passed`);
 await page.close();
 }
}finally{await browser.close();}
