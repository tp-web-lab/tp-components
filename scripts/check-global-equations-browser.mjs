import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('**/__global-equations',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-equations');
 await page.evaluate(async()=>{
  await import('/src/components/ref/ref.ts');
  await import('/src/components/equanum/equanum.ts');
  await import('/src/components/math/math.ts');
  await import('/src/components/html-multi-pages/html-multi-pages.ts');
  const host=document.createElement('tp-html-multi-pages');host.setAttribute('repository','/docs/components/global-listof/examples/guide');host.setAttribute('menu','');document.body.append(host);
 });
 const open=async()=>{
  await page.locator('[data-role=sidebar]').getByRole('link',{name:'List of equations',exact:true}).click();
  await page.waitForFunction(()=>document.querySelectorAll('tp-global-listof a[data-tp-global-origin]').length===4);
  for(const heading of await page.locator('tp-global-listof tp-accordion dt').all()) {assert.equal(await heading.getAttribute('aria-expanded'),'false');await heading.click();}
 };
 await open();
 assert.deepEqual(await page.locator('tp-global-listof a').allTextContents(),['Equation (1)','Equation (2)','Equation (1)','Equation (2)']);
 await page.waitForFunction(()=>document.querySelectorAll('tp-global-listof li > div tp-math svg').length===4);
 assert.deepEqual(await page.locator('tp-global-listof li > div tp-math').evaluateAll(items=>items.map(math=>math.getAttribute('value'))),['E = mc^2','v = d / t','F = ma','p = mv']);
 assert.equal(await page.locator('tp-global-listof [data-mml-node=merror]').count(),0);
 assert.equal(await page.locator('tp-global-listof tp-equanum,tp-global-listof tp-ref').count(),0);
 assert.deepEqual(await page.locator('tp-global-listof tp-accordion dt').allTextContents(),['First chapter','Second chapter']);
 const heading=page.locator('tp-global-listof tp-accordion dt').first();
 await heading.click();assert.equal(await heading.getAttribute('aria-expanded'),'false');
 assert.equal(await page.locator('tp-global-listof li > div tp-math').first().isVisible(),false);
 await heading.press('Enter');assert.equal(await heading.getAttribute('aria-expanded'),'true');
 assert.ok(await page.locator('tp-global-listof li > div tp-math').first().isVisible());
 const routes=new Set();
 for(let i=0;i<4;i++) {
  if(i) await open();
  const link=page.locator('tp-global-listof a').nth(i);
  const route=await link.getAttribute('href');routes.add(route);await link.click();
  await page.waitForFunction(()=>document.querySelectorAll('tp-equanum > tp-math svg').length===2);
  assert.deepEqual(await page.locator('tp-equanum > [data-tp-equanum-generated]').allTextContents(),['(1)','(2)']);
  assert.equal(await page.locator('[data-mml-node=merror]').count(),0);
  const target=await page.evaluate(()=>{
   const id=decodeURIComponent(location.hash.split('#').at(-1));
   const anchor=document.getElementById(id);
   const equation=anchor?.matches('tp-equanum')?anchor:anchor?.nextElementSibling;
   return {tag:equation?.localName,number:equation?.getAttribute('number'),formula:equation?.querySelector('tp-math')?.getAttribute('value')};
  });
  assert.equal(target.tag,'tp-equanum');assert.equal(target.number,String(i%2+1));
  assert.equal(target.formula,['E = mc^2','v = d / t','F = ma','p = mv'][i]);
  const ref=page.locator('tp-ref[href="=law"] button').first();
  await ref.hover();
  await page.waitForFunction(()=>document.querySelector('tp-ref[href="=law"] tp-tooltip:popover-open tp-math svg'));
  assert.equal(await page.locator('tp-ref[href="=law"] tp-tooltip tp-math').getAttribute('value'),i<2?'E = mc^2':'F = ma');
  await page.mouse.move(0,0);
 }
 assert.equal(routes.size,4);
 console.log('Equations appendix: four source links, local numbers 1/2 on each page, MathJax rendering and scoped equation previews passed.');
} finally {await browser.close();}
