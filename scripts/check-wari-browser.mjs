/** Browser checks for Oware interactions, responsive layout, examples and component help. */
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({args:['--disable-features=LocalNetworkAccessChecks']});
try {
 const page=await browser.newPage({viewport:{width:1150,height:850},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.stack??e.message));
 await page.route('**/__wari_check',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_EXAMPLES_URL??'http://127.0.0.1:4197'}/__wari_check`);
 await page.evaluate(async()=>{await import('/src/tp-loader.ts');document.body.innerHTML='<tp-wari interactive></tp-wari>';});
 const game=page.locator('tp-wari');const pit=n=>game.locator(`[data-pit="${n}"]`);
 await expect(game.locator('[data-pit]')).toHaveCount(12);await expect(game.locator('.tp-wari-seed')).toHaveCount(48);
 await pit(3).click();await expect(game.locator('.tp-wari-last-move')).toHaveText('1. South: 3 → 7');
 await pit(7).focus();await page.keyboard.press('Enter');await expect(game.locator('.tp-wari-last-move')).toHaveText('1… North: 7 → 12');
 await game.getByRole('button',{name:'Previous move',exact:true}).click();await expect(game.locator('.tp-wari-last-move')).toHaveText('1. South: 3 → 7');
 await game.getByRole('button',{name:'Play one move',exact:true}).click();await expect(game.locator('.tp-wari-last-move')).toHaveText('1… North: 7 → 12');
 await game.evaluate(el=>el.setPosition('S:4,0,0,0,3,0,1,2,1,0,0,0:18,19'));await pit(5).click();await expect(game.locator('.tp-wari-scores [data-side="south"]')).toHaveText('South: 23 captured');await expect(game.locator('.tp-wari-last-move')).toHaveText('1. South: 5 → 8 (5 captured)');
 await game.getByRole('button',{name:'Previous move',exact:true}).click();await expect(pit(5)).toHaveAttribute('aria-label','South pit 5: 3 seeds');
 await game.evaluate(el=>el.setPosition('S:1,0,0,0,0,1,0,0,0,0,0,0:23,23'));await expect(pit(1)).toHaveAttribute('aria-disabled','true');await expect(pit(6)).toHaveAttribute('aria-disabled','false');const before=await game.getAttribute('position');await pit(1).click({force:true});assert.equal(await game.getAttribute('position'),before);
 await game.evaluate(el=>el.setPosition('S:1,0,0,0,0,1,1,0,0,0,0,0:22,23'));await pit(6).click();await expect(game.locator('.tp-wari-move-detail')).toContainText('Grand slam');await expect(pit(7)).toHaveAttribute('aria-label','North pit 7: 2 seeds');
 await game.getByRole('button',{name:'Flip',exact:true}).click();await expect(game.locator('[data-pit]').first()).toHaveAttribute('data-pit','6');await pit(6).focus();await page.keyboard.press('ArrowDown');await expect(pit(7)).toBeFocused();
 await game.evaluate(el=>{el.orientation='south';el.start();el.move(3);el.move(7);});
 const geometry=await game.evaluate(el=>{const rect=s=>el.querySelector(s).getBoundingClientRect().toJSON();return {board:rect('.tp-wari-board'),footer:rect('.tp-wari-footer'),sidebar:rect('.tp-wari-sidebar')};});assert.ok(geometry.footer.y>=geometry.board.bottom);assert.ok(geometry.sidebar.x>=geometry.board.right);
 await page.screenshot({path:'/tmp/wari-desktop.png'});
 await page.setViewportSize({width:390,height:844});await game.evaluate(el=>el.start());await pit(3).tap();await expect(game.locator('.tp-wari-last-move')).toHaveText('1. South: 3 → 7');assert.equal(await game.evaluate(el=>el.scrollWidth<=el.clientWidth),true);await page.screenshot({path:'/tmp/wari-mobile.png'});
 await game.evaluate(el=>el.play('random/random','south',100));const pos=await game.getAttribute('position');await expect.poll(()=>game.getAttribute('position')).not.toBe(pos);await game.getByRole('button',{name:'Pause',exact:true}).click();
 await page.setViewportSize({width:1150,height:850});
 for(const extension of ['html','md','adoc','rst','latex']){
  await page.evaluate(async extension=>{document.body.replaceChildren();const renderer={md:'markdown',adoc:'asciidoc',rst:'restructuredtext'}[extension];const url=`/docs/components/wari/examples/${extension==='latex'?'examples-latex.html':`examples.${extension}`}`;if(renderer){await import(`/src/components/${renderer}/${renderer}.ts`);const el=document.createElement(`tp-${renderer}`);el.setAttribute('src',url);document.body.append(el);}else document.body.innerHTML=await(await fetch(url)).text();},extension);
  for(const label of ['Basic usage','Javascript API','Capturing seeds','Feeding the opponent','Void grand slam']){
   await page.locator('select[aria-label="Example"]').first().selectOption({label});const frame=page.frameLocator('iframe').first();
   if(label==='Javascript API')await expect.poll(()=>frame.locator('script[type=module]').evaluateAll(nodes=>nodes.some(node=>/import.*wari/.test(node.textContent))),{timeout:30000}).toBe(true);
   await expect(frame.locator('tp-wari [data-pit]')).toHaveCount(12,{timeout:30000});
   const seeds={'Basic usage':48,'Javascript API':48,'Capturing seeds':11,'Feeding the opponent':2,'Void grand slam':3}[label];await expect(frame.locator('tp-wari .tp-wari-seed')).toHaveCount(seeds);
   if(label==='Capturing seeds'){await frame.locator('[data-pit="5"]').click();await expect(frame.locator('.tp-wari-last-move')).toHaveText('1. South: 5 → 8 (5 captured)');}
   console.log(`${extension}: ${label} passed`);
  }
 }
 assert.deepEqual(errors,[]);
 await page.evaluate(()=>document.body.innerHTML='<tp-component-viewer tag="tp-wari" src="/docs/components/wari/examples/introduction.html"></tp-component-viewer>');
 await page.locator('[data-component-mode] input').nth(1).check();const orientations=page.locator('[data-component-setting="orientation"]');await expect(orientations.locator('input')).toHaveCount(2);await orientations.getByRole('radio',{name:'north',exact:true}).check();await expect(page.frameLocator('[data-component-preview] iframe').locator('tp-wari [data-pit]').first()).toHaveAttribute('data-pit','6');assert.deepEqual(errors,[]);
 await page.locator('[data-component-mode] input').nth(2).check();await page.frameLocator('.tp-component-viewer-api iframe').getByRole('heading',{name:/TpWari/}).first().waitFor();
 for(const error of errors)assert.ok(error.includes("reading 'endsWith'")&&error.includes('/api/assets/main.js'),error);
 console.log('Passed: sowing, captures, feeding, grand slams, keyboard/touch, playback, responsive layout, 25 examples and Demo/API.');
}finally{await browser.close();}
