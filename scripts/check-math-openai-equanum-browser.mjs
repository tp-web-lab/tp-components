import assert from 'node:assert/strict';import {chromium} from '@playwright/test';
const browser=await chromium.launch();try{
const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(`${process.env.MATH_OPENAI_URL || 'http://127.0.0.1:4336'}/#/main.tex`);
await page.waitForFunction(()=>document.querySelectorAll('tp-equanum').length>0,null,{timeout:60000});
await page.waitForFunction(()=>[...document.querySelectorAll('tp-math')].filter(e=>!e.closest('tp-tooltip')).every(e=>e.querySelector('mjx-container')),null,{timeout:60000});
const counts=await page.evaluate(()=>({equations:document.querySelectorAll('tp-equanum').length,math:[...document.querySelectorAll('tp-math')].filter(e=>!e.closest('tp-tooltip')).length,refs:document.querySelectorAll('tp-ref[href^="="]').length,errors:document.querySelectorAll('[data-mml-node="merror"]').length}));assert.equal(counts.math,284);assert.equal(counts.errors,0);assert.ok(counts.equations>0&&counts.refs>0);
const ref=page.locator('tp-ref[href^="="] button').first();await ref.scrollIntoViewIfNeeded();await page.waitForTimeout(400);await ref.hover();
await page.waitForFunction(()=>document.querySelector('tp-ref[href^="="] tp-tooltip:popover-open tp-math svg'),null,{timeout:30000});
await page.screenshot({path:'/tmp/math-openai-equation-preview.png'});
const row = await page.evaluate(()=>{
 const def=[...document.querySelectorAll('tp-equanum[data-latex-equation-preview]')].find(d=>[...document.querySelectorAll('tp-ref')].some(r=>r.getAttribute('href')==='='+d.getAttribute('ref')));
 return def?{key:def.getAttribute('ref'),value:decodeURIComponent(def.getAttribute('data-latex-equation-preview'))}:null;
});
assert.ok(row,'An align row must be referenced in the paper');
const rowButton=page.locator(`tp-ref[href="=${row.key}"] button`).first();await rowButton.scrollIntoViewIfNeeded();await rowButton.hover();
await page.waitForFunction(key=>[...document.querySelectorAll('tp-ref')].find(r=>r.getAttribute('href')==='='+key)?.querySelector('tp-tooltip:popover-open tp-math svg'),row.key);
assert.equal(await page.locator(`tp-ref[href="=${row.key}"] tp-tooltip tp-math`).first().getAttribute('value'),row.value);
await page.screenshot({path:'/tmp/math-openai-align-row.png'});
await rowButton.dispatchEvent('mouseleave');

await ref.focus();assert.ok(await page.locator('tp-ref[href^="="] tp-tooltip:popover-open').count());
await page.keyboard.press('Escape');assert.equal(await page.locator('tp-ref[href^="="] tp-tooltip:popover-open').count(),0);
assert.deepEqual(errors,[]);console.log(counts);console.log('Math OpenAI: hover, focus, Escape and original formulas passed.');
}finally{await browser.close();}
