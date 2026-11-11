/** Real browser checks for tp-checkers: pointer/touch, keyboard, promotion and five-language examples. */
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({args:['--disable-features=LocalNetworkAccessChecks']});
try {
 const page=await browser.newPage({viewport:{width:1000,height:900},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.stack??e.message));
 await page.route('**/__checkers_check',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_EXAMPLES_URL??'http://127.0.0.1:4197'}/__checkers_check`);
 await page.evaluate(async()=>{await import('/src/tp-loader.ts');document.body.innerHTML='<tp-checkers draggable-pieces></tp-checkers>';});
 const game=page.locator('tp-checkers');const square=name=>game.locator(`[data-square="${name}"]`);
 await expect(game.locator('[data-square]')).toHaveCount(50);await expect(game.locator('.tp-checkers-piece [data-tp-icon-container] > svg')).toHaveCount(40);
 const assertCentered=async()=>{const geometry=await game.evaluate(el=>Array.from(el.querySelectorAll('[data-square]')).map(cell=>{const c=cell.getBoundingClientRect();const svg=cell.querySelector('[data-tp-icon-container] > svg');const p=svg?.getBoundingClientRect();return {square:Math.abs(c.width-c.height),icons:cell.querySelectorAll('svg').length,dx:p?Math.abs(p.x+p.width/2-c.x-c.width/2):0,dy:p?Math.abs(p.y+p.height/2-c.y-c.height/2):0};}));for(const cell of geometry){assert.ok(cell.square<1);assert.ok(cell.icons<=1);assert.ok(cell.dx<1&&cell.dy<1,JSON.stringify(cell));}};
 await assertCentered();await page.screenshot({path:"/tmp/checkers-start.png"});
 await game.evaluate(el=>el.setPosition('W:W32:B17,27'));
 await square('32').click();await expect(square('12')).toHaveAttribute('data-legal','');await square('12').click();
 await expect(game.locator('.tp-checkers-last-move')).toHaveText('1. White man: 32 → 21 → 12');
 await expect(game.locator('.tp-checkers-captured tp-icon')).toHaveCount(2);
 await game.getByRole('button',{name:'Previous move',exact:true}).click();await expect(square('32')).toHaveAttribute('aria-label','32: White man');
 await square('32').dragTo(square('12'));await expect(square('12')).toHaveAttribute('aria-label','12: White man');
 await game.evaluate(el=>el.setPosition('W:W7:B40'));await square('7').focus();await page.keyboard.press('Enter');await square('1').focus();await page.keyboard.press('Space');await expect(square('1')).toHaveAttribute('aria-label','1: White king');
 await game.evaluate(el=>el.setPosition('W:WK47:BK38,K8,K35,K18,K40,K9'));await square('47').click();await square('45').click();await expect(game.locator('.tp-checkers-paths tp-button')).toHaveCount(3);await game.locator('.tp-checkers-paths tp-button').first().click();await expect(game.locator('.tp-checkers-captured tp-icon')).toHaveCount(5);
 await game.getByRole('button',{name:'Flip',exact:true}).click();await expect(game.locator('[data-square]').first()).toHaveAttribute('data-square','50');
 await game.evaluate(el=>{el.orientation='white';el.setPosition('W:W32,34,K46:B17,19,K5');el.highlightLegalMove(32);});
 await assertCentered();await page.screenshot({path:'/tmp/checkers-desktop.png'});
 const desktop=await game.evaluate(el=>{const b=el.querySelector('.tp-checkers-board').getBoundingClientRect(),f=el.querySelector('.tp-checkers-footer').getBoundingClientRect(),a=el.querySelector('.tp-checkers-sidebar').getBoundingClientRect();return {board:b.toJSON(),footer:f.toJSON(),aside:a.toJSON()};});assert.ok(desktop.footer.y>=desktop.board.bottom);assert.ok(desktop.aside.x>=desktop.board.right);
 await page.setViewportSize({width:390,height:844});assert.equal(await game.evaluate(el=>el.scrollWidth<=el.clientWidth),true);
 await game.evaluate(el=>el.setPosition('W:W32:B17,27'));
 const center=async name=>{const b=await square(name).boundingBox();return {x:b.x+b.width/2,y:b.y+b.height/2};};
 const cdp=await page.context().newCDPSession(page);const from=await center('32'),to=await center('12');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[to]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(square('12')).toHaveAttribute('aria-label','12: White man');await assertCentered();await page.screenshot({path:'/tmp/checkers-mobile.png'});
 await game.evaluate(el=>{el.start();el.play('random/random','white',100);});const fen=await game.getAttribute('fen');await expect.poll(()=>game.getAttribute('fen')).not.toBe(fen);await game.getByRole('button',{name:'Stop',exact:true}).click();
 await page.setViewportSize({width:1000,height:900});
 for(const extension of ['html','md','adoc','rst','latex']) {
  await page.evaluate(async extension=>{document.body.replaceChildren();const renderer={md:'markdown',adoc:'asciidoc',rst:'restructuredtext'}[extension];const url=`/docs/components/checkers/examples/${extension==='latex'?'examples-latex.html':`examples.${extension}`}`;if(renderer){await import(`/src/components/${renderer}/${renderer}.ts`);const el=document.createElement(`tp-${renderer}`);el.setAttribute('src',url);document.body.append(el);}else document.body.innerHTML=await(await fetch(url)).text();},extension);
  for(const label of ['Basic usage','Javascript API','Majority capture','Flying kings','Crowning a man']){
   await page.locator('select[aria-label="Example"]').first().selectOption({label});const frame=page.frameLocator('iframe').first();
   if(label==='Javascript API')await expect.poll(()=>frame.locator('script[type=module]').evaluateAll(nodes=>nodes.some(node=>/import.*checkers/.test(node.textContent))),{timeout:30000}).toBe(true);
   await expect(frame.locator('tp-checkers [data-square]')).toHaveCount(50,{timeout:30000});await expect(frame.locator('tp-checkers .tp-checkers-piece [data-tp-icon-container] > svg')).toHaveCount({'Basic usage':6,'Javascript API':6,'Majority capture':5,'Flying kings':3,'Crowning a man':2}[label]);
   console.log(`${extension}: ${label} passed`);
  }
 }
 assert.deepEqual(errors,[]);
 await page.evaluate(()=>document.body.innerHTML='<tp-component-viewer tag="tp-checkers" src="/docs/components/checkers/examples/introduction.html"></tp-component-viewer>');
 await page.locator('[data-component-mode] input').nth(1).check();const orientations=page.locator('[data-component-setting="orientation"]');await expect(orientations.locator('input')).toHaveCount(2);await orientations.getByRole('radio',{name:'black',exact:true}).check();
 await expect(page.frameLocator('[data-component-preview] iframe').locator('tp-checkers [data-square]').first()).toHaveAttribute('data-square','50');assert.deepEqual(errors,[]);
 await page.locator('[data-component-mode] input').nth(2).check();await page.frameLocator('.tp-component-viewer-api iframe').getByRole('heading',{name:/TpCheckers/}).first().waitFor();
 for(const error of errors)assert.ok(error.includes("reading 'endsWith'")&&error.includes('/api/assets/main.js'),error);
 console.log('Passed: mouse/touch, keyboard, promotion, autoplay, mobile layout, 25 examples and component viewer.');
}finally{await browser.close();}
