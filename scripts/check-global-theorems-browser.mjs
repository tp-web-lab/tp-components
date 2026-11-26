import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('**/__global-theorems',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-theorems');
 await page.evaluate(async()=>{
  await import('/src/components/theorem/theorem.ts');
  await import('/src/components/html-multi-pages/html-multi-pages.ts');
  const host=document.createElement('tp-html-multi-pages');host.setAttribute('repository','/docs/components/global-listof/examples/guide');host.setAttribute('menu','');document.body.append(host);
 });
 assert.equal(await page.locator('[data-role=sidebar]').getByRole('link',{name:'List of lemmas',exact:true}).count(),0);
 assert.equal(await page.locator('[data-role=sidebar]').getByRole('link',{name:'List of proofs',exact:true}).count(),0);
 const routes=new Set();
 for(const [name,type,numbers,chapters] of [
  ['theorems','theorem',['1','2','1','2'],['First chapter','Second chapter']],
  ['definitions','definition',['1'],['First chapter']],
 ]) {
  const open=async()=>{
   await page.locator('[data-role=sidebar]').getByRole('link',{name:`List of ${name}`,exact:true}).click();
   await page.waitForFunction(count=>document.querySelectorAll('tp-global-listof li > tp-theorem').length===count,numbers.length);
  };
  await open();
  assert.deepEqual(await page.locator('tp-global-listof tp-accordion dt').allTextContents(),chapters);
  assert.deepEqual(await page.locator('tp-global-listof li > tp-theorem').evaluateAll(items=>items.map(item=>item.getAttribute('number'))),numbers);
  assert.ok((await page.locator('tp-global-listof li > tp-theorem').evaluateAll(items=>items.map(item=>item.getAttribute('type')||'theorem'))).every(value=>value===type));
  const texts=await page.locator('tp-global-listof li > tp-theorem > p').allTextContents();
  for(let i=0;i<numbers.length;i++) {
   if(i) await open();
   const headers=page.locator('tp-global-listof tp-accordion dt');
   assert.ok((await headers.evaluateAll(items=>items.map(el=>el.getAttribute('aria-expanded')))).every(value=>value==='false'));
   await headers.nth(type==='theorem'?Math.floor(i/2):0).press('Enter');
   if(type==='proof') assert.equal(await page.locator('tp-global-listof [data-tp-theorem-generated="qed"]').textContent(),'□');
   const link=page.locator('tp-global-listof a[data-tp-global-origin]').nth(i);
   const prefix=type.charAt(0).toUpperCase()+type.slice(1)+(numbers[i]?` ${numbers[i]}`:'');
   assert.ok((await link.textContent()).startsWith(prefix+' — '));
   routes.add(await link.getAttribute('href'));await link.click();
   await page.waitForFunction(()=>!document.querySelector('tp-global-listof') && document.querySelectorAll('tp-theorem > [data-tp-theorem-generated="heading"]').length>=3);
   const result=await page.evaluate(()=>{
    const anchor=document.getElementById(decodeURIComponent(location.hash.split('#').at(-1)));
    const theorem=anchor?.matches('tp-theorem')?anchor:anchor?.nextElementSibling;
    return {text:theorem?.querySelector('p')?.textContent,heading:theorem?.querySelector('[data-tp-theorem-generated="heading"]')?.textContent};
   });
   assert.equal(result.text,texts[i]);assert.ok(result.heading.startsWith(prefix));
   const chapter=await page.locator('h1').first().textContent();
   if(chapter==='First chapter') assert.equal(await page.locator('tp-theorem[type="lemma"]').count(),1);
   if(chapter==='Second chapter') assert.equal(await page.locator('tp-theorem[type="proof"]').count(),1);
  }
 }
 assert.equal(routes.size,5);
 console.log('Two type-filtered appendices: only matching statements, local numbers, closed chapter panels and five source links passed.');
}finally{await browser.close();}
