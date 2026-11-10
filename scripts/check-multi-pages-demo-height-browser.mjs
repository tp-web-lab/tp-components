import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try{
 const page=await browser.newPage();page.setDefaultTimeout(12000);
 await page.route('**/helpdocs/**',route=>{
 const file=new URL(route.request().url()).pathname.split('/').pop();
 const sources={'sample.html':'<tp-markup-multi-pages repository="/helpdocs" menu langs="en,fr" git="https://example.org" logo="/src/components/icon/icons/components/latex.svg"></tp-markup-multi-pages>','cover.md':'# Cover\n[Chapter](chapter.md)','chapter.md':'# Chapter','last.md':'# Last','sidebar.md':'- [Cover](cover.md)\n- [Chapter](chapter.md)\n- [Last](last.md)'};
 return route.fulfill({status:sources[file]?200:404,contentType:file.endsWith('html')?'text/html':'text/plain',body:sources[file]??''});
 });
 await page.route('**/__check',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));await page.goto('http://127.0.0.1:4197/__check');
 await page.evaluate(async()=>{document.body.replaceChildren();history.replaceState({},"","/");await import('/src/components/component-viewer/component-viewer.ts');const v=document.createElement('tp-component-viewer');v.setAttribute('tag','tp-markup-multi-pages');v.setAttribute('src','/helpdocs/sample.html');document.body.append(v);});
 console.log('mounted');await page.locator('[data-component-mode] input').nth(1).check();console.log('demo');
 const frame=page.frameLocator('iframe').first();await frame.locator('main h1').waitFor();console.log('loaded');
 await frame.locator('main a').first().evaluate(el=>el.click());await frame.locator('main h1').filter({hasText:'Chapter'}).waitFor();
 await page.waitForFunction(()=>document.querySelector('[data-component-buttons]')?.textContent.includes('Next page'),null,{timeout:10000});

 const iframe=page.locator('iframe').first();
 await page.waitForFunction(()=>document.querySelector('iframe').getBoundingClientRect().height>150);
 const initial=await iframe.evaluate(el=>el.getBoundingClientRect().height);
 console.log('initial height',initial);
 assert.ok(initial>150);
 const docBefore=await page.locator('[data-component-buttons]').textContent();
 await frame.locator('main').evaluate(el=>{const block=document.createElement('div');block.id='growth';block.style.height='700px';el.append(block);});
 await page.waitForFunction(h=>document.querySelector('iframe').getBoundingClientRect().height>h+600,initial);
 await frame.locator('#growth').evaluate(el=>el.remove());
 await page.waitForFunction(h=>document.querySelector('iframe').getBoundingClientRect().height<h+40,initial);
 await frame.locator('main').evaluate(el=>{const p=document.createElement('p');p.id='wrap';p.textContent='Long text '.repeat(200);el.append(p);});
 const wide=await iframe.evaluate(el=>el.getBoundingClientRect().height);
 await page.setViewportSize({width:450,height:900});
 await page.waitForFunction(h=>document.querySelector('iframe').getBoundingClientRect().height>h+100,wide);
 await frame.locator('#wrap').evaluate(el=>el.remove());
 await page.setViewportSize({width:1280,height:720});
 await page.waitForFunction(h=>document.querySelector('iframe').getBoundingClientRect().height<h+80,initial);
 assert.equal(await page.locator('[data-component-buttons]').textContent(),docBefore);
 console.log('Passed: height growth, shrink, wrapping, width restoration, stable Doc');
}finally{await browser.close();}
