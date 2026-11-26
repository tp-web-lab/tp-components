import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();try{
 const page=await browser.newPage();await page.route('**/__global-bibliography',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-bibliography');
 await page.evaluate(async()=>{await import('/src/components/ref/ref.ts');await import('/src/components/listof/listof.ts');await import('/src/components/html-multi-pages/html-multi-pages.ts');const host=document.createElement('tp-html-multi-pages');host.setAttribute('repository','/docs/components/global-listof/examples/guide');host.setAttribute('menu','');document.body.append(host);});

 for(const [title,kind,prefix] of [['Glossary','glossary','%'],['Index','index','!']]) {
  const open=async()=>{await page.locator('[data-role=sidebar]').getByRole('link',{name:title,exact:true}).click();await page.waitForFunction(()=>document.querySelector('tp-global-listof')?.getAttribute('aria-busy')===null && document.querySelectorAll('tp-global-listof [data-tp-global-occurrence]').length===8);};
  await open();
  assert.equal(await page.locator('tp-global-listof dl[data-tp-global-definitions]').count(),1);
  assert.equal(await page.locator('tp-global-listof dt').count(),6);
  const shared=page.locator('tp-global-listof dd').filter({hasText:'A common definition'});
  assert.equal(await shared.count(),1);
  assert.deepEqual(await shared.locator(':scope > p [data-tp-global-occurrence]').allTextContents(),['1','2','1','2']);
  assert.equal(await page.locator('tp-global-listof dt').filter({hasText:'Local term'}).count(),2);
  if(kind==='index') {
   assert.equal(await shared.locator(':scope > dl > dt').count(),2);
   assert.equal(await page.locator('[data-tp-global-index-crossref]').count(),3);
   const route=await page.evaluate(()=>location.hash);
   for(const link of await page.locator('[data-tp-global-index-crossref]').all()) {
    const href=await link.getAttribute('href');await link.click();
    assert.equal(await page.evaluate(()=>document.activeElement?.id),href.split('#').at(-1));
    assert.equal(await page.evaluate(()=>location.hash),route);
   }
  }
  const seen=new Set();
  for(let i=0;i<8;i++){
   if(i) await open();
   const link=page.locator('[data-tp-global-occurrence]').nth(i);
   const href=await link.getAttribute('href');assert.ok(!seen.has(href));seen.add(href);
   await link.click();
   await page.waitForFunction(()=>!document.querySelector('tp-global-listof') && document.querySelector('tp-ref'));
   const result=await page.evaluate(()=>{
    const id=decodeURIComponent(location.hash.slice(location.hash.indexOf('#',2)+1));
    const anchor=[...document.querySelectorAll('[id]')].find(e=>e.id===id);
    const ref=anchor?.matches('tp-ref')?anchor:anchor?.nextElementSibling;
    return {tag:ref?.localName,href:ref?.getAttribute('href'),anchor:!!anchor};
   });
   assert.equal(result.tag,'tp-ref');assert.ok(result.href.startsWith(prefix));assert.ok(result.anchor);
  }
  await open();await page.locator('[data-tp-global-uncited]').click();
  await page.waitForFunction(()=>!!document.querySelector('[data-tp-global-anchor]'));
  assert.equal(await page.locator('[data-tp-global-anchor]').evaluate(a=>a.nextElementSibling?.getAttribute('ref')),'unused-term');
  console.log(title+': fusion, conflicts, all eight occurrences and unused definition passed.');
 }
}finally{await browser.close();}
