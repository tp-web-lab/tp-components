import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();try{
 const page=await browser.newPage();await page.route('**/__global-bibliography',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-bibliography');
 await page.evaluate(async()=>{await import('/src/components/ref/ref.ts');await import('/src/components/listof/listof.ts');await import('/src/components/html-multi-pages/html-multi-pages.ts');const host=document.createElement('tp-html-multi-pages');host.setAttribute('repository','/docs/components/global-listof/examples/guide');host.setAttribute('menu','');document.body.append(host);});
 const bibliography=async()=>{await page.locator('[data-role=sidebar]').getByRole('link',{name:'Bibliography',exact:true}).click();await page.waitForFunction(()=>document.querySelector('tp-global-listof[selector="tp-biblio"]')?.getAttribute('aria-busy')===null && document.querySelectorAll('tp-global-listof [data-tp-global-citation]').length===8);};
 await bibliography();
 assert.equal(await page.locator('tp-global-listof dl').count(),1);
 assert.equal(await page.locator('tp-global-listof dl > dt').count(),6);
 const shared=page.locator('tp-global-listof dd').filter({hasText:'A shared modelling handbook'});
 assert.equal(await shared.count(),1);
 assert.deepEqual(await shared.locator('[data-tp-global-citation]').allTextContents(),['1','2','1','2']);
 assert.ok((await shared.textContent()).includes('First chapter: 1, 2 · Second chapter: 1, 2'));
 assert.equal(await page.locator('tp-global-listof dt').filter({hasText:'Regional guide'}).count(),2);
 assert.equal(await page.locator('[data-tp-global-uncited]').count(),1);
 const seen=new Set();
 for(let i=0;i<8;i++) {
  if(i) await bibliography();
  const link=page.locator('[data-tp-global-citation]').nth(i);const href=await link.getAttribute('href');assert.ok(!seen.has(href));seen.add(href);
  await link.click();
  await page.waitForFunction(()=>!document.querySelector('tp-global-listof') && document.querySelector('tp-ref'));
  const result=await page.evaluate(()=>{
   const id=decodeURIComponent(location.hash.slice(location.hash.indexOf('#',2)+1));
   const target=[...document.querySelectorAll('[id]')].find(e=>e.id===id);
   const citation=target?.matches('tp-ref')?target:target?.nextElementSibling;
   return {tag:citation?.localName,href:citation?.getAttribute('href'),visible:citation?.getBoundingClientRect().height};
  });
  assert.equal(result.tag,'tp-ref');assert.ok(result.href.startsWith('@'));assert.ok(result.visible>0);
 }
 await bibliography();await page.locator('[data-tp-global-uncited]').click();
 await page.waitForFunction(()=>!!document.querySelector('[data-tp-global-anchor]'));
 assert.equal(await page.locator('[data-tp-global-anchor]').evaluate(a=>a.nextElementSibling?.getAttribute('ref')),'further-reading');
 console.log('Global bibliography: one dl, six distinct entries, identical handbook merged, two conflicting guides preserved, eight unique citation destinations and uncited-definition fallback passed.');
}finally{await browser.close();}
