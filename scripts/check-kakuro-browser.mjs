/** Browser regression for the Wikipedia Kakuro and all five example languages. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium, expect} from '@playwright/test';
const browser=await chromium.launch({args:['--disable-features=LocalNetworkAccessChecks']});
try {
 const page=await browser.newPage({viewport:{width:1000,height:850}});
 const errors=[];page.on('pageerror',error=>errors.push(error.stack ?? error.message));
 await page.route('**/__kakuro_check',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_EXAMPLES_URL ?? 'http://127.0.0.1:4197'}/__kakuro_check`);
 await page.evaluate(()=>import('/src/tp-loader.ts'));
 await page.evaluate(html=>{document.body.innerHTML=html;},readFileSync('public/docs/components/kakuro/examples/introduction.html','utf8'));
 const game=page.locator('tp-kakuro');await game.locator('input').first().waitFor();
 assert.equal(await game.locator('input').count(),36);
 await game.locator('input').first().fill('9');
 await game.getByRole('button',{name:'Notes',exact:true}).click();
 await game.locator('input').nth(1).press('2');
 assert.equal(await game.locator('input').nth(1).getAttribute('title'),'Notes: 2');
 assert.equal(await game.getByRole('button',{name:'Notes',exact:true}).getAttribute('aria-pressed'),'true');
 await game.getByRole('button',{name:'Notes',exact:true}).click();
 await game.getByRole('button',{name:'Reveal solution',exact:true}).click();
 assert.match(await game.getByRole('status').textContent(),/Solved!/);
 await game.getByRole('button',{name:'Reset',exact:true}).click();
 assert.equal(await game.locator('input').first().inputValue(),'');
 await game.getByRole('button',{name:'Undo',exact:true}).click();
 assert.equal(await game.locator('input').first().inputValue(),'9');
 await page.screenshot({path:'/tmp/kakuro-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 assert.equal(await game.evaluate(el=>el.scrollWidth<=el.clientWidth),true);
 await page.screenshot({path:'/tmp/kakuro-mobile.png'});
 await page.setViewportSize({width:1000,height:850});
 for(const extension of ['html','md','adoc','rst','latex']) {
  await page.evaluate(async extension=>{
   document.body.replaceChildren();
   const renderer={md:'markdown',adoc:'asciidoc',rst:'restructuredtext'}[extension];
   const url=`/docs/components/kakuro/examples/${extension==='latex'?'examples-latex.html':`examples.${extension}`}`;
   if(renderer){await import(`/src/components/${renderer}/${renderer}.ts`);const el=document.createElement(`tp-${renderer}`);el.setAttribute('src',url);document.body.append(el);}
   else document.body.innerHTML=await(await fetch(url)).text();
  },extension);
  for(const label of ['Basic usage','Javascript API']) {
   await page.locator('select[aria-label="Example"]').first().selectOption({label});
   const frame=page.frameLocator('iframe').first();
   if(label==='Javascript API')await expect.poll(()=>frame.locator('script[type=module]').evaluateAll(nodes=>nodes.some(node=>/import.*kakuro/.test(node.textContent))),{timeout:30000}).toBe(true);
   await frame.locator('tp-kakuro input').first().waitFor({timeout:30000});
   await expect(frame.locator('tp-kakuro input')).toHaveCount(36);
   await frame.getByRole('button',{name:'Reveal solution',exact:true}).click();
   assert.match(await frame.getByRole('status').textContent(),/Solved!/);
   if(label==='Javascript API')assert.equal(await frame.locator('script').evaluateAll(nodes=>nodes.some(node=>/import\s*['"][^'"]*tp-loader/.test(node.textContent))),false);
   console.log(`${extension}: ${label} passed`);
  }
 }
 assert.deepEqual(errors,[], 'Kakuro and its examples must not raise browser errors');
 await page.evaluate(()=>{document.body.innerHTML='<tp-component-viewer tag="tp-kakuro" src="/docs/components/kakuro/examples/introduction.html"></tp-component-viewer>';});
 await page.locator('[data-component-mode] input').nth(2).check();
 await page.frameLocator('.tp-component-viewer-api iframe').getByRole('heading',{name:/TpKakuro/}).first().waitFor();
 // TypeDoc currently raises this same runtime error in existing component API frames.
 for(const error of errors)assert.ok(error.includes("reading 'endsWith'") && error.includes('/api/assets/main.js'),error);
 if(errors.length)console.log('Known TypeDoc runtime diagnostic reproduced; API content is visible.');
 console.log('Passed: interactions, responsive layout, ten examples and Component viewer API.');
} finally {await browser.close();}
