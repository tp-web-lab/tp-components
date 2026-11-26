import assert from 'node:assert/strict';
import { chromium, firefox } from '@playwright/test';
const name=process.env.BROWSER || 'chrome';
const browser=await (name==='firefox'?firefox:chromium).launch(name==='chrome'?{channel:'chrome'}:{});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.route('**/__trace-list-arrows.html',r=>r.fulfill({contentType:'text/html',body:'<tp-python-tracer trace="/docs/components/python-tracer/examples/students.trace.json"></tp-python-tracer><script type="module" src="/src/components/python-tracer/python-tracer.ts"></script>'}));
 await page.goto('http://127.0.0.1:4386/__trace-list-arrows.html');
 await page.waitForFunction(()=>document.querySelector('[data-role=status]')?.textContent.startsWith('Step '));
 await page.locator('tp-python-tracer').evaluate(e=>e.goTo(11));
 for(const width of [1440,760,340]) {
  await page.setViewportSize({width,height:1000});
  await page.waitForTimeout(150);
  const edges=await page.locator('.reference-arrows g path').evaluateAll(paths=>paths.map(path=>{
   const source=document.getElementById(path.dataset.from);
   const a=path.getPointAtLength(0), b=path.getPointAtLength(1);
   return {sequence:!!source.closest('.sequence'), dx:b.x-a.x,dy:b.y-a.y,exit:path.dataset.exit,lane:path.dataset.lane};
  }));
  const list=edges.filter(e=>e.sequence);
  assert.ok(list.length>=2);
  assert.ok(list.every(e=>Math.abs(e.dx)<0.01 && e.dy>0));
  assert.equal(new Set(list.map(e=>e.lane)).size,list.length);
  assert.equal(new Set(list.map(e=>e.exit)).size,list.length);
  assert.ok(edges.filter(e=>!e.sequence).every(e=>e.dx>0 && Math.abs(e.dy)<0.01));
  await page.screenshot({path:`/tmp/trace-list-arrows-${name}-${width}.png`,fullPage:true});
 }
 console.log(name+': vertical list departures, separate lanes, horizontal attribute departures passed at 1440/760/340px');
} finally {await browser.close();}
