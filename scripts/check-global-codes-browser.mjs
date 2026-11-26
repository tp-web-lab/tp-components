import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('**/__global-codes',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-codes');
 await page.evaluate(async()=>{
  await import('/src/components/html-multi-pages/html-multi-pages.ts');
  const host=document.createElement('tp-html-multi-pages');host.setAttribute('repository','/docs/components/global-listof/examples/guide');host.setAttribute('menu','');document.body.append(host);
 });
 const open=async()=>{
  await page.locator('[data-role=sidebar]').getByRole('link',{name:'List of codes',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('tp-global-listof li > pre > code').length===4);
 };
 await open();
 assert.deepEqual(await page.locator('tp-global-listof tp-accordion dt').allTextContents(),['First chapter','Second chapter']);
 assert.deepEqual(await page.locator('tp-global-listof a[data-tp-global-origin]').allTextContents(),['Greeting','Total duration','Greeting','Total duration']);
 const sources=await page.locator('tp-global-listof li > pre > code').allTextContents();
 assert.ok(sources[1].includes('\n  return sum + value;\n'));
 assert.ok(sources[3].includes('\n    total += duration'));
 const routes=new Set();
 for(let i=0;i<4;i++) {
  if(i) await open();
  const headers=page.locator('tp-global-listof tp-accordion dt');
  assert.ok((await headers.evaluateAll(items=>items.map(el=>el.getAttribute('aria-expanded')))).every(value=>value==='false'));
  assert.equal(await page.locator('tp-global-listof pre:visible').count(),0);
  await headers.nth(Math.floor(i/2)).press('Enter');
  assert.equal(await page.locator('tp-global-listof pre:visible').count(),2);
  const link=page.locator('tp-global-listof a[data-tp-global-origin]').nth(i);
  routes.add(await link.getAttribute('href'));await link.click();
  await page.waitForFunction(()=>!document.querySelector('tp-global-listof') && document.querySelector('pre[label]'));
  const source=await page.evaluate(()=>{
   const anchor=document.getElementById(decodeURIComponent(location.hash.split('#').at(-1)));
   const pre=anchor?.matches('pre')?anchor:anchor?.nextElementSibling;
   return pre?.querySelector('code')?.textContent;
  });
  assert.equal(source,sources[i]);
 }
 assert.equal(routes.size,4);
 console.log('Four labelled codes, preserved whitespace, two closed chapter panels, keyboard expansion and all source links passed.');
}finally{await browser.close();}
