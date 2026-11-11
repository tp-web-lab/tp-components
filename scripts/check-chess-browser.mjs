/** Real browser checks for tp-chess: pointer/touch, keyboard, promotion and five-language examples. */
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({args:['--disable-features=LocalNetworkAccessChecks']});
try {
 const page=await browser.newPage({viewport:{width:1000,height:900},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.stack??e.message));
 await page.route('**/__chess_check',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_EXAMPLES_URL??'http://127.0.0.1:4197'}/__chess_check`);
 await page.evaluate(async()=>{await import('/src/tp-loader.ts');document.body.innerHTML='<tp-chess draggable-pieces></tp-chess>';});
 const game=page.locator('tp-chess');const square=name=>game.locator(`[data-square="${name}"]`);
 await expect(game.locator('[data-square]')).toHaveCount(64);await expect(game.locator('.tp-chess-piece [data-tp-icon-container] > svg')).toHaveCount(32);
 const assertCentered=async()=>{const geometry=await game.evaluate(el=>Array.from(el.querySelectorAll('[data-square]')).map(cell=>{const c=cell.getBoundingClientRect();const svg=cell.querySelector('[data-tp-icon-container] > svg');const p=svg?.getBoundingClientRect();return {square:Math.abs(c.width-c.height),icons:cell.querySelectorAll('svg').length,dx:p?Math.abs(p.x+p.width/2-c.x-c.width/2):0,dy:p?Math.abs(p.y+p.height/2-c.y-c.height/2):0};}));for(const cell of geometry){assert.ok(cell.square<1);assert.ok(cell.icons<=1);assert.ok(cell.dx<1&&cell.dy<1,JSON.stringify(cell));}};
 await assertCentered();await page.screenshot({path:"/tmp/chess-start.png"});
 await square('e2').click();await expect(square('e4')).toHaveAttribute('data-legal','');await square('e4').click();await expect(square('e4')).toHaveAttribute('aria-label','e4: White pawn');
 await square('e7').dragTo(square('e5'));await expect(square('e5')).toHaveAttribute('aria-label','e5: Black pawn');
 await square('g1').focus();await page.keyboard.press('Enter');await expect(square('f3')).toHaveAttribute('data-legal','');await square('f3').focus();await page.keyboard.press('Space');await expect(square('f3')).toHaveAttribute('aria-label','f3: White knight');
 await game.getByRole('button',{name:'Flip',exact:true}).click();await expect(game.locator('[data-square]').first()).toHaveAttribute('data-square','h1');
 await game.getByRole('button',{name:'Start',exact:true}).click();
 await game.evaluate(el=>{el.orientation='white';el.setPosition('7k/P7/8/8/8/8/8/4K3 w - - 0 1');});await square('a7').click();await square('a8').click();await game.locator('.tp-chess-promotion').getByRole('button',{name:'rook',exact:true}).click();await expect(square('a8')).toHaveAttribute('aria-label','a8: White rook');
 await game.evaluate(el=>{el.start();el.move('e2','e4');el.move('d7','d5');el.move('e4','d5');});await expect(game.locator('.tp-chess-last-move')).toHaveText('2. White pawn: e4 → d5');await expect(game.locator('.tp-chess-captured[data-color="b"] tp-icon')).toHaveCount(1);await game.getByRole('button',{name:'Flip',exact:true}).click();await expect(game.locator('.tp-chess-captured tp-icon')).toHaveCount(1);
 await game.evaluate(el=>{el.setPosition({d6:'bK',d4:'wP',e4:'wK'});el.highlightLegalMove('d4');});await page.screenshot({path:'/tmp/chess-desktop.png'});
 await page.setViewportSize({width:390,height:844});assert.equal(await game.evaluate(el=>el.scrollWidth<=el.clientWidth),true);
 const center=async name=>{const b=await square(name).boundingBox();return {x:b.x+b.width/2,y:b.y+b.height/2};};
 const cdp=await page.context().newCDPSession(page);const from=await center('d4'),to=await center('d5');await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[from]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[to]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(square('d5')).toHaveAttribute('aria-label','d5: White pawn');await assertCentered();await page.screenshot({path:'/tmp/chess-mobile.png'});
 await game.evaluate(el=>el.play('random/random','white',100));const fen=await game.getAttribute('fen');await expect.poll(()=>game.getAttribute('fen')).not.toBe(fen);await game.getByRole('button',{name:'Stop',exact:true}).click();
 await page.setViewportSize({width:1000,height:900});
 for(const extension of ['html','md','adoc','rst','latex']) {
  await page.evaluate(async extension=>{document.body.replaceChildren();const renderer={md:'markdown',adoc:'asciidoc',rst:'restructuredtext'}[extension];const url=`/docs/components/chess/examples/${extension==='latex'?'examples-latex.html':`examples.${extension}`}`;if(renderer){await import(`/src/components/${renderer}/${renderer}.ts`);const el=document.createElement(`tp-${renderer}`);el.setAttribute('src',url);document.body.append(el);}else document.body.innerHTML=await(await fetch(url)).text();},extension);
  for(const label of ['Basic usage','Javascript API','Black to move','Pawn promotion','Rook endgame']){
   await page.locator('select[aria-label="Example"]').first().selectOption({label});const frame=page.frameLocator('iframe').first();
   if(label==='Javascript API')await expect.poll(()=>frame.locator('script[type=module]').evaluateAll(nodes=>nodes.some(node=>/import.*chess/.test(node.textContent))),{timeout:30000}).toBe(true);
   await expect(frame.locator('tp-chess [data-square]')).toHaveCount(64,{timeout:30000});await expect(frame.locator('tp-chess .tp-chess-piece [data-tp-icon-container] > svg')).toHaveCount(3);
   if(label==='Black to move')await expect(frame.locator('tp-chess')).toHaveAttribute('orientation','black');
   console.log(`${extension}: ${label} passed`);
  }
 }
 assert.deepEqual(errors,[]);
 await page.evaluate(()=>document.body.innerHTML='<tp-component-viewer tag="tp-chess" src="/docs/components/chess/examples/introduction.html"></tp-component-viewer>');
 await page.locator('[data-component-mode] input').nth(1).check();const orientations=page.locator('[data-component-setting="orientation"]');await expect(orientations.locator('input')).toHaveCount(2);await orientations.getByRole('radio',{name:'black',exact:true}).check();
 await expect(page.frameLocator('[data-component-preview] iframe').locator('tp-chess [data-square]').first()).toHaveAttribute('data-square','h1');assert.deepEqual(errors,[]);
 await page.locator('[data-component-mode] input').nth(2).check();await page.frameLocator('.tp-component-viewer-api iframe').getByRole('heading',{name:/TpChess/}).first().waitFor();
 for(const error of errors)assert.ok(error.includes("reading 'endsWith'")&&error.includes('/api/assets/main.js'),error);
 console.log('Passed: mouse/touch, keyboard, promotion, autoplay, mobile layout, 25 examples and component viewer.');
}finally{await browser.close();}
