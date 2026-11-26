import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from '@playwright/test';
const browser = await ({chromium,firefox,webkit}[process.env.BROWSER ?? 'chromium']).launch();
try {
 const page = await browser.newPage();
 page.on("pageerror", error => console.error(error));
 await page.route('**/__copy-button-test', route => route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_EXAMPLES_URL ?? 'http://127.0.0.1:4174'}/__copy-button-test`);
 await page.evaluate(async () => {
  await import('/src/components/textfield/textfield.ts');
  window.copies=[]; window.parentKeys=0;
  Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copies.push(text);}}});
  document.body.innerHTML='<pre id="source" class="tp-code-block-copy"><code>const answer = 42;</code><tp-copy-code for="source" data-tp-code-block-copy></tp-copy-code></pre><tp-textfield id="field" value="editable text" clearable copy-code></tp-textfield>';
  document.querySelector('#field').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')window.parentKeys++;});
 });
 const copy=page.locator('pre > tp-copy-code');
 const button=copy.locator('tp-icon-button button');
 assert.equal(await copy.getAttribute('role'),null);
 assert.equal(await copy.getAttribute('tabindex'),null);
 assert.equal(await button.count(),1);
 assert.equal(await copy.evaluate(e=>getComputedStyle(e).opacity),'0');
 await page.locator('pre').hover();
 await button.click();
 assert.deepEqual(await page.evaluate(()=>window.copies),['const answer = 42;']);
 assert.equal(await copy.locator('tp-icon-button').getAttribute('variant'),'success');
 await button.focus();
 await button.press('Enter');
 assert.equal(await page.evaluate(()=>window.copies.length),2);
 await button.press('Space');
 assert.equal(await page.evaluate(()=>window.copies.length),3);
 const fieldButton=page.locator('#field tp-copy-code tp-icon-button button');
 const clearButton=page.locator('#field [data-tp-textfield-clear] button');
 for (const direction of ['ltr', 'rtl']) {
  await page.locator('#field').evaluate((field, direction)=>{field.style.direction=direction;}, direction);
  const clearBox=await clearButton.boundingBox();
  const copyBox=await fieldButton.boundingBox();
  const gap=direction==='ltr' ? copyBox.x-clearBox.x-clearBox.width : clearBox.x-copyBox.x-copyBox.width;
  assert.ok(Math.abs(gap-4)<1, `Clear/copy gap in ${direction}: ${gap}px`);
 }
 await page.locator('#field').evaluate(field=>{field.style.direction='ltr';});
 await fieldButton.focus();
 await fieldButton.press('Enter');
 await fieldButton.press('Space');
 assert.equal(await page.evaluate(()=>window.copies.length),5);
 assert.equal(await page.evaluate(()=>window.copies.at(-1)),'editable text');
 assert.equal(await page.evaluate(()=>window.parentKeys),0);
 await page.evaluate(()=>{navigator.clipboard.writeText=async()=>{throw new Error('Denied');};});
 await fieldButton.click();
 assert.equal(await page.locator('#field tp-copy-code tp-icon-button').getAttribute('variant'),'danger');
 assert.equal(await fieldButton.getAttribute('aria-label'),'Copy failed — retry');
 await page.waitForFunction(()=>document.querySelector('#field tp-copy-code').dataset.state==='idle');
 assert.equal(await page.locator('#field tp-copy-code tp-icon-button').getAttribute('name'),'copy');
 assert.equal(await page.locator('#field tp-copy-code tp-icon-button').getAttribute('variant'),'brand');
 console.log('Native copy buttons: hover, click, Enter, Space, single activation, field keyboard isolation, success, error and reset passed.');
} finally { await browser.close(); }
