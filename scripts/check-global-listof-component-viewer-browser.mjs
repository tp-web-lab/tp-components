import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();try{
 const page=await browser.newPage();
 await page.route('**/__global-component-viewer',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__global-component-viewer');
 await page.evaluate(async()=>{
 await import('/src/components/component-viewer/component-viewer.ts');
 const viewer=document.createElement('tp-component-viewer');viewer.setAttribute('tag','tp-global-listof');viewer.setAttribute('src','/docs/components/global-listof/examples/component-viewer.html');document.body.append(viewer);
 });
 await page.locator('[data-component-mode]').waitFor({timeout:30000});
 assert.equal(await page.locator('tp-component-viewer > [role=alert]').count(),0);
 await page.evaluate(()=>{const mode=document.querySelector('[data-component-mode]');mode.value='2';mode.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.waitForFunction(()=>[...document.querySelectorAll('iframe')].some(f=>f.contentDocument?.querySelectorAll('tp-html-multi-pages tp-global-listof[data-demo-list] a').length===4),null,{timeout:90000});
 const preview=await (await page.locator('.tp-component-viewer-preview iframe').first().elementHandle()).contentFrame();
 assert.ok(preview,'Demo render frame exists');
 await page.evaluate(()=>{for(const [name,value] of [['selector','tp-note'],['title','Notes across the guide']]){const field=document.querySelector(`[data-component-setting="${name}"]`);field.value=value;field.dispatchEvent(new Event('change',{bubbles:true}));}});
 await page.waitForFunction(()=>[...document.querySelectorAll('iframe')].some(f=>f.contentDocument?.querySelectorAll('tp-html-multi-pages tp-global-listof[data-demo-list] a').length===2));
 const frame=page.frames().find(f=>f===preview);
 assert.equal(await frame.locator('tp-global-listof[data-demo-list] h2').textContent(),'Notes across the guide');
 assert.deepEqual(await frame.locator('tp-global-listof[data-demo-list] ol > li').evaluateAll(items=>items.map(item=>item.value)),[1,1]);
 assert.deepEqual(await frame.locator('tp-global-listof[data-demo-list] ol > li > div').allTextContents(),['A local note for First chapter.','A local note for Second chapter.']);
 for(const heading of await frame.locator('tp-global-listof tp-accordion dt').all()) await heading.click();
 await frame.locator('tp-global-listof[data-demo-list] a').nth(1).click();
 await frame.locator('[data-tp-global-anchor]').waitFor({state:'attached',timeout:30000});
 if (!(await frame.locator('[data-role="sidebar"] a').filter({hasText:'List of figures'}).first().isVisible())) await frame.locator('[data-action="menu"]').click();
 await frame.locator('[data-role="sidebar"] a').filter({hasText:'List of figures'}).first().click();
 await frame.waitForFunction(()=>document.querySelectorAll('tp-global-listof[data-demo-list] a').length===2);
 assert.equal(await frame.locator('tp-global-listof[data-demo-list] h2').textContent(),'Notes across the guide');
 assert.deepEqual(await frame.locator('tp-global-listof[data-demo-list] ol > li').evaluateAll(items=>items.map(item=>item.value)),[1,1]);
 assert.deepEqual(await frame.locator('tp-global-listof[data-demo-list] ol > li > div').allTextContents(),['A local note for First chapter.','A local note for Second chapter.']);
 assert.ok(await page.locator('.tp-component-viewer-preview iframe').first().evaluate(f=>f.getBoundingClientRect().height>100));
 console.log('Component viewer: Doc opens, Demo has four figure entries, selector/title controls update the authored instance, navigation back preserves values, render iframe has a usable height.');
}finally{await browser.close();}
