import assert from 'node:assert/strict';
import {chromium,firefox,webkit} from '@playwright/test';
for(const [name,engine] of Object.entries({chromium,firefox,webkit})) {
 if(process.env.BROWSER && process.env.BROWSER!==name)continue;
 const browser=await engine.launch();
 try {
  const page=await browser.newPage({ignoreHTTPSErrors:true,viewport:{width:900,height:500}});
  page.on('requestfailed',request=>console.log(name,request.url(),request.failure()?.errorText));
  await page.route('**/__flalign-width',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
  await page.goto(`${process.env.TP_COMPONENTS_URL || 'http://127.0.0.1:4174'}/__flalign-width`);
  await page.evaluate(async()=>{await import('/src/components/latex/latex.ts');const doc=new DOMParser().parseFromString(await(await fetch('/docs/components/equanum/examples/examples.html')).text(),'text/html');document.body.append(doc.querySelector('template').content.querySelector('[label="flalign row previews"]'));});
  for(const width of [900,420,320,800]) {
   await page.setViewportSize({width,height:500});
   await page.waitForFunction(()=>{
    const math=document.querySelector('tp-latex .tp-latex-output > tp-math') ?? [...document.querySelectorAll('tp-math')].find(m=>!m.closest('tp-tooltip'));
    if(!math?.querySelector('svg')||math.getAttribute('aria-busy')==='true')return false;
    const rect=math.getBoundingClientRect();
    const glyphs=[...math.querySelectorAll('svg use')];
    return glyphs.length>0 && glyphs.every(g=>{const r=g.getBoundingClientRect();return r.left>=rect.left-1&&r.right<=rect.right+1;}) && math.scrollWidth<=math.clientWidth+1;
   },null,{timeout:30000}).catch(async error=>{console.log(name,width,await page.evaluate(()=>[...document.querySelectorAll('tp-math')].map(e=>({html:e.innerHTML.slice(0,500),width:e.clientWidth,scroll:e.scrollWidth,busy:e.getAttribute('aria-busy'),rect:e.getBoundingClientRect().toJSON(),glyphs:[...e.querySelectorAll('svg use')].map(g=>g.getBoundingClientRect().toJSON())}))));throw error;});
   assert.equal(await page.locator('[data-mml-node="merror"], tp-math tp-callout').count(),0);
  }
  await page.screenshot({path:`/tmp/flalign-width-${name}.png`});
  console.log(`${name}: equation glyphs and numbers remain visible at 900, 420, 320 and 800 px.`);
 }finally {await browser.close();}
}
