import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('**/__global-tables',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-tables');
 await page.evaluate(async()=>{
  await import('/src/components/html-multi-pages/html-multi-pages.ts');
  const host=document.createElement('tp-html-multi-pages');host.setAttribute('repository','/docs/components/global-listof/examples/guide');host.setAttribute('menu','');document.body.append(host);
 });
 const open=async()=>{
  await page.locator('[data-role=sidebar]').getByRole('link',{name:'List of tables',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('tp-global-listof li > table').length===4);
 };
 await open();
 assert.deepEqual(await page.locator('tp-global-listof tp-accordion dt').allTextContents(),['First chapter','Second chapter']);
 const captions=await page.locator('tp-global-listof table > caption').allTextContents();
 assert.deepEqual(captions,['First chapter activities','First chapter schedule','Second chapter activities','Second chapter schedule']);
 const hrefs=await page.locator('tp-global-listof a[data-tp-global-origin]').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
 await page.evaluate(()=>document.querySelector('tp-global-listof').merge=true);
 await page.waitForFunction(()=>!document.querySelector('tp-global-listof tp-accordion') && document.querySelectorAll('tp-global-listof li > table').length===4);
 assert.equal(await page.locator('tp-global-listof ul').count(),1);
 assert.equal(await page.locator('tp-global-listof table:visible').count(),4);
 assert.deepEqual(await page.locator('tp-global-listof a[data-tp-global-origin]').evaluateAll(links=>links.map(link=>link.getAttribute('href'))),hrefs);
 await page.evaluate(()=>document.querySelector('tp-global-listof').merge=false);
 await page.waitForFunction(()=>document.querySelectorAll('tp-global-listof tp-accordion dt').length===2);
 assert.equal(await page.locator('tp-global-listof table:visible').count(),0);
 const routes=new Set();
 for(let i=0;i<4;i++) {
  if(i) await open();
  const headers=page.locator('tp-global-listof tp-accordion dt');
  assert.ok((await headers.evaluateAll(items=>items.map(el=>el.getAttribute('aria-expanded')))).every(value=>value==='false'));
  const table=page.locator('tp-global-listof li > table').nth(i);
  assert.equal(await table.isVisible(),false);
  await headers.nth(Math.floor(i/2)).press('Enter');
  assert.equal(await page.locator('tp-global-listof table:visible').count(),2);
  assert.ok(await table.isVisible());
  assert.equal(await table.locator('thead th').count(),2);
  assert.equal(await table.locator('tbody tr').count(),2);
  const link=page.locator('tp-global-listof a[data-tp-global-origin]').nth(i);
  routes.add(await link.getAttribute('href'));await link.click();
  await page.waitForFunction(()=>!document.querySelector('tp-global-listof') && document.querySelector('table'));
  const caption=await page.evaluate(()=>{
   const anchor=document.getElementById(decodeURIComponent(location.hash.split('#').at(-1)));
   const table=anchor?.matches('table')?anchor:anchor?.nextElementSibling;
   return table?.querySelector('caption')?.textContent;
  });
  assert.equal(caption,captions[i]);
 }
 assert.equal(routes.size,4);
 console.log('Four tables and captions, closed sections, keyboard expansion, table structure and all source destinations passed.');
}finally{await browser.close();}
