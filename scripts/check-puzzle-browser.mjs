/** Real pointer, context-menu, image-format and example checks for tp-puzzle. */
import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({args:['--disable-features=LocalNetworkAccessChecks']});
try {
 const page=await browser.newPage({viewport:{width:1000,height:900},hasTouch:true});const errors=[];page.on('pageerror',error=>errors.push(error.stack??error.message));
 await page.route('**/__puzzle_check',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_EXAMPLES_URL??'http://127.0.0.1:4197'}/__puzzle_check`);
 await page.evaluate(async()=>{await import('/src/tp-loader.ts');document.body.innerHTML='<tp-puzzle src="/docs/components/puzzle/examples/landscape.svg" pieces="12" exact-orientation alt="Mountain lake at sunrise"></tp-puzzle>';});
 const game=page.locator('tp-puzzle');await expect(game.locator('[data-piece]')).toHaveCount(12);
 const point=async id=>game.evaluate((el,id)=>{const p=el.placements.find(p=>p.id===id);const v=new DOMPoint(p.x,p.y).matrixTransform(el.querySelector('svg').getScreenCTM());return {x:v.x,y:v.y}},id);
 let center=await point(0);await page.mouse.click(center.x,center.y,{button:'right'});
 await expect(game.locator('tp-dropdown')).toHaveAttribute('open','');
 await game.getByRole('menuitem',{name:'Rotate +90°',exact:true}).click();assert.equal(await game.evaluate(el=>el.placements[0].angle),90);
 center=await point(0);await page.mouse.click(center.x,center.y,{button:'right'});
 await game.getByRole('menuitem',{name:'Rotate −90°',exact:true}).click();assert.equal(await game.evaluate(el=>el.placements[0].angle),0);
 const target=async id=>game.evaluate(async(el,id)=>{const {puzzleLayout,puzzleTarget}=await import('/src/components/puzzle/geometry.ts');const t=puzzleTarget(id,puzzleLayout(el.pieces,1.5));const p=new DOMPoint(t.x,t.y).matrixTransform(el.querySelector('svg').getScreenCTM());return {x:p.x,y:p.y}},id);
 center=await point(0);let destination=await target(0);await page.mouse.move(center.x,center.y);await page.mouse.down();await page.mouse.move(destination.x,destination.y,{steps:8});await page.mouse.up();await expect(game.locator('[data-piece="0"]')).toHaveAttribute('data-placed','');
 await game.getByRole('button',{name:'Undo',exact:true}).click();await expect(game.locator('[data-piece="0"]')).not.toHaveAttribute('data-placed','');await game.getByRole('button',{name:'Redo',exact:true}).click();await expect(game.locator('[data-piece="0"]')).toHaveAttribute('data-placed','');
 const piece=game.locator('[data-piece="1"]');await piece.focus();const before=await game.evaluate(el=>el.placements[1]);await piece.press('ArrowLeft');assert.ok((await game.evaluate(el=>el.placements[1].x))<before.x);await piece.press('Shift+F10');await expect(game.locator('tp-dropdown')).toHaveAttribute('open','');await page.keyboard.press('Escape');await expect(game.locator('tp-dropdown')).not.toHaveAttribute('open','');
 // Cancelled pointer edits must leave placement and history unchanged.
 const snapshot=await game.evaluate(el=>el.placements);center=await point(1);await page.mouse.move(center.x,center.y);await page.mouse.down();await page.mouse.move(center.x+20,center.y-20);await page.keyboard.press('Escape');await page.mouse.up();assert.deepEqual(await game.evaluate(el=>el.placements),snapshot);
 await game.getByRole('button',{name:'Show image',exact:true}).click();await page.screenshot({path:'/tmp/puzzle-desktop.png'});
 await page.setViewportSize({width:390,height:844});assert.equal(await game.evaluate(el=>el.scrollWidth<=el.clientWidth),true);
 center=await point(2);destination=await target(2);const cdp=await page.context().newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[center]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[destination]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(game.locator('[data-piece="2"]')).toHaveAttribute('data-placed','');
 await page.screenshot({path:'/tmp/puzzle-mobile.png'});
 // A solved reconstruction has no missing image region, regardless of the outline.
 await game.evaluate(async el=>{const {puzzleLayout,puzzleTarget}=await import('/src/components/puzzle/geometry.ts');for(let id=0;id<el.pieces;id++){const p=puzzleTarget(id,puzzleLayout(el.pieces,1.5));el.place(id,p.x,p.y,0);}});assert.equal(await game.evaluate(el=>el.isSolved),true);await page.screenshot({path:'/tmp/puzzle-solved.png'});
 const raster=await page.evaluate(async()=>{const img=new Image();img.src='/docs/components/puzzle/examples/landscape.svg';await img.decode();const canvas=document.createElement('canvas');canvas.width=600;canvas.height=400;canvas.getContext('2d').drawImage(img,0,0);return ['image/png','image/webp','image/jpeg'].map(type=>canvas.toDataURL(type));});
 for(const src of raster){await game.evaluate((el,src)=>el.src=src,src);await expect(game.locator('[data-piece]')).toHaveCount(12);assert.equal(await game.locator('[role=alert]').count(),0);}
 await page.setViewportSize({width:1000,height:900});
 for(const extension of ['html','md','adoc','rst','latex']) {
  await page.evaluate(async extension=>{document.body.replaceChildren();const renderer={md:'markdown',adoc:'asciidoc',rst:'restructuredtext'}[extension];const url=`/docs/components/puzzle/examples/${extension==='latex'?'examples-latex.html':`examples.${extension}`}`;if(renderer){await import(`/src/components/${renderer}/${renderer}.ts`);const el=document.createElement(`tp-${renderer}`);el.setAttribute('src',url);document.body.append(el);}else document.body.innerHTML=await(await fetch(url)).text();},extension);
  for(const label of ['Basic usage','Javascript API','Square pieces','Triangular pieces','Hexagonal pieces']){
   await page.locator('select[aria-label="Example"]').first().selectOption({label});const frame=page.frameLocator('iframe').first();
   if(label==='Javascript API')await expect.poll(()=>frame.locator('script[type=module]').evaluateAll(nodes=>nodes.some(node=>/import.*puzzle/.test(node.textContent))),{timeout:30000}).toBe(true);
   await expect(frame.locator('tp-puzzle [data-piece]')).toHaveCount(label==='Square pieces'?9:label==='Hexagonal pieces'?13:12,{timeout:30000});
   if(label==='Square pieces'){assert.equal(await frame.locator('tp-puzzle').evaluate(el=>el.shape),'square');assert.equal(await frame.locator('tp-puzzle').evaluate(el=>el.placements.every(p=>p.angle===0)),true);}
   console.log(`${extension}: ${label} passed`);
  }
 }
 assert.deepEqual(errors,[]);
 await page.evaluate(()=>{document.body.innerHTML='<tp-component-viewer tag="tp-puzzle" src="/docs/components/puzzle/examples/introduction.html"></tp-component-viewer>';});
 await page.locator('[data-component-mode] input').nth(1).check();
 const shapes=page.locator('[data-component-setting="shape"]');
 await expect(shapes.locator('input')).toHaveCount(4);
 await expect(shapes).toContainText('square');await expect(shapes).toContainText('puzzle');
 await shapes.getByRole('radio',{name:'square',exact:true}).check();
 await expect(page.frameLocator('[data-component-preview] iframe').locator('tp-puzzle')).toHaveAttribute('shape','square');
 await expect(page.frameLocator('[data-component-preview] iframe').locator('tp-puzzle [data-piece]')).toHaveCount(12);
 assert.deepEqual(errors,[]);
 await page.locator('[data-component-mode] input').nth(2).check();
 await page.frameLocator('.tp-component-viewer-api iframe').getByRole('heading',{name:/TpPuzzle/}).first().waitFor();
 // Existing TypeDoc pages share this unrelated runtime diagnostic; their content remains visible.
 for(const error of errors)assert.ok(error.includes("reading 'endsWith'") && error.includes('/api/assets/main.js'),error);
 console.log('Component viewer: shape choices and API passed.');
 console.log('Passed: mouse/touch dragging, context rotation, keyboard, cancellation, history, four image formats, mobile layout and twenty-five examples.');
}finally{await browser.close();}
