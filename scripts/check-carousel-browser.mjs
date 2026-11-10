import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser = await chromium.launch();
const base = process.env.TP_CAROUSEL_TEST_URL ?? 'http://127.0.0.1:4197';
try {
 const page = await browser.newPage({viewport:{width:1000,height:850},reducedMotion:'reduce'});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${base}/docs/components/carousel/examples/introduction.html`);
 await page.evaluate(async () => { await import('/src/components/carousel/carousel.ts'); document.body.style.width='600px'; });
 const carousel=page.locator('tp-carousel');
 const viewport=carousel.locator('tp-slider');
 await carousel.locator('[data-carousel-counter]').waitFor();
 async function aligned(index,vertical=false) {
  await page.waitForFunction(({index,vertical})=>{
   const c=document.querySelector('tp-carousel'); const v=c.querySelector('tp-slider');
   const a=v.getBoundingClientRect();const b=v.children[index].getBoundingClientRect();
   return c.index===index && Math.abs(vertical?b.top-a.top:b.left-a.left)<2;
  },{index,vertical});
 }
 await aligned(0);
 assert.equal(await carousel.locator('img').first().evaluate(img=>getComputedStyle(img).objectFit),'contain');
 await carousel.getByRole('button',{name:'Next image',exact:true}).click();
 await aligned(1);
 await viewport.focus(); await page.keyboard.press('End'); await aligned(2);
 await page.keyboard.press('Home'); await aligned(0);
 await carousel.evaluate(c=>{c.orientation='vertical';});
 await viewport.focus(); await page.keyboard.press('ArrowDown'); await aligned(1,true);
 await page.keyboard.press('End'); await aligned(2,true);
 await carousel.evaluate(c=>{c.loop=true;c.next();}); await aligned(0,true);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await viewport.evaluate(v=>v.scrollTo({top:v.clientHeight,behavior:'instant'})); await aligned(1,true);
 await carousel.evaluate(c=>{c.orientation='horizontal';c.goTo(2);}); await aligned(2);
 await page.evaluate(()=>{document.body.style.width='350px';}); await aligned(2);
 await carousel.evaluate(c=>{c.querySelector('tp-slider > img:last-child').remove();}); await aligned(1);
 assert.equal(await carousel.locator('[data-carousel-counter]').textContent(),'2 / 2');
 assert.deepEqual(errors,[]);
 console.log('Passed: horizontal and vertical navigation, buttons, keyboard, loop, scroll synchronization, resizing and removal.');
 await page.goto(`${base}/#/components/carousel/index.md`);
 await page.locator('.tp-component-doc-example > tp-carousel [data-carousel-counter]').waitFor({timeout:60000});
 assert.equal(await page.locator('#usage').count(),1);
 assert.equal(await page.locator('#examples').count(),1);
 const viewer=page.locator('tp-component-viewer[tag="tp-carousel"]');
 await viewer.locator('[data-component-mode] input').first().waitFor({timeout:60000});
 await viewer.locator('[data-component-mode] input').nth(2).check();
 await page.waitForTimeout(500);
 assert.match(await viewer.textContent(),/orientation/);
 assert.doesNotMatch(await viewer.textContent(),/Failed to load|not found/i);
 await viewer.locator('[data-component-mode] input').nth(1).check();
 await viewer.locator('iframe').first().waitFor();
 await viewer.frameLocator('iframe').first().locator('tp-carousel [data-carousel-counter]').waitFor();
 assert.equal(await page.locator('.tp-component-doc-example tp-carousel img').first().evaluate(img=>getComputedStyle(img).objectFit),'contain');
 for (const label of ['HTML','tp-markdown','tp-asciidoc','tp-restructuredtext','tp-latex']) {
  console.log('Checking',label);
  await page.getByRole('tab',{name:new RegExp(`(?:^| )${label}$`)}).last().click();
  const tag = {'HTML':'tp-html-viewer','tp-markdown':'tp-markdown-viewer','tp-asciidoc':'tp-asciidoc-viewer','tp-restructuredtext':'tp-restructuredtext-viewer','tp-latex':'tp-latex-viewer'}[label];
  const exampleViewer = page.locator(`${tag}[label="tp-carousel"]`);
  await exampleViewer.scrollIntoViewIfNeeded();
  const frame = exampleViewer.frameLocator('iframe').first();
  await frame.locator('tp-carousel [data-carousel-counter]').waitFor({timeout:60000});
  assert.equal(await frame.locator('tp-carousel').first().evaluate(c=>c.count),3,label);
  assert.equal(await frame.locator('tp-carousel img').first().evaluate(img=>getComputedStyle(img).objectFit),'contain',label);
  const fits = await frame.locator('tp-carousel').first().evaluate(c=>{const v=c.querySelector('tp-slider').getBoundingClientRect();const i=c.querySelector('img').getBoundingClientRect();return i.height<=v.height+1 && i.width<=v.width+1;});
  assert.ok(fits,`${label}: image fits its viewport`);
  const topGap = await frame.locator('tp-carousel').first().evaluate(c=>c.querySelector('tp-slider').getBoundingClientRect().top-c.getBoundingClientRect().top);
  assert.ok(Math.abs(topGap)<1,`${label}: no extra line before the image viewport`);
 }
 assert.deepEqual(errors,[]);
 console.log('Passed: documentation introduction, component viewer API and Demo.');
} finally {await browser.close();}
