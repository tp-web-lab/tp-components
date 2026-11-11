import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
const games=['binary','checkers','chess','crossword','cryptarithm','kakuro','logigram','loto','mastermind','memory','puzzle','solitaire','sudoku','tangram','wari','yakazu'];
const browser=await chromium.launch({args:['--disable-features=LocalNetworkAccessChecks']});
try{
 const page=await browser.newPage({viewport:{width:1400,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.stack??e.message));
 await page.route('**/__game_headers',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_EXAMPLES_URL??'http://127.0.0.1:4197'}/__game_headers`);
 await page.evaluate(async()=>{await import('/src/tp-loader.ts');});
 for(const slug of games){
  await page.evaluate(async slug=>{document.body.innerHTML=await(await fetch(`/docs/components/${slug}/examples/introduction.html`)).text();},slug);
  const game=page.locator(`tp-${slug}`).first();const header=game.locator('.tp-game-header');await expect(header).toHaveCount(1,{timeout:20000});
  const types=await header.locator('.tp-game-header-actions').evaluate(el=>Array.from(el.children,e=>e.tagName));assert.deepEqual(types,['TP-ICON-BUTTON','TP-ICON-BUTTON','TP-ICON-BUTTON','TP-ICON-BUTTON','TP-CHRONOMETER','TP-COLOR','TP-THEME','TP-FULLSCREEN'],slug);
  assert.deepEqual(await header.locator('.tp-game-header-actions > tp-icon-button').evaluateAll(nodes=>nodes.map(n=>n.dataset.gameCommand)),['reset','undo','redo','help'],slug);
  await expect(header.locator('.tp-game-header-title tp-icon')).toHaveAttribute('name',slug);
  const geom=await header.evaluate(el=>{const title=el.querySelector('.tp-game-header-title').getBoundingClientRect(),actions=el.querySelector('.tp-game-header-actions').getBoundingClientRect(),button=el.querySelector('[data-game-command="reset"] button');return {left:title.x,right:actions.x,radius:getComputedStyle(button).borderRadius,border:getComputedStyle(button).borderTopWidth};});assert.ok(geom.left<=geom.right,slug);assert.notEqual(geom.radius,'0px',slug);assert.equal(geom.border,'1px',slug);
  const checkButtons=async()=>{
   for(const button of await header.locator('tp-icon-button > button').all()){
    const style=await button.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return {width:r.width,height:r.height,padding:s.padding,background:s.backgroundColor,color:s.color};});
    assert.ok(Math.abs(style.width-style.height)<1,`${slug}: circular button geometry ${JSON.stringify(style)}`);
    assert.equal(style.padding,'0px',`${slug}: inherited legacy padding`);
    assert.equal(style.background,'rgba(0, 0, 0, 0)',`${slug}: inherited legacy background`);
    await expect.poll(async()=>button.evaluate(el=>getComputedStyle(el).color)).toBe(await button.evaluate(el=>getComputedStyle(el.parentElement).color));
   }
  };
  await page.mouse.move(1390,990);await checkButtons();
  if(['binary','crossword','cryptarithm','sudoku','yakazu'].includes(slug)) await header.screenshot({path:`/tmp/game-header-${slug}-light.png`});
  await header.locator('[data-game-command="help"]').click();await expect(header.locator('.tp-game-help')).toHaveAttribute('open','');assert.ok(await header.locator('[data-game-help]').count()>0,slug);
  const rulesItem=header.locator('[data-game-help="rules"]');
  await expect(rulesItem).toHaveText('Rules of the game');
  await expect(rulesItem.locator('xpath=preceding-sibling::*[1]/tp-divider')).toHaveCount(1);
  await rulesItem.focus();await page.keyboard.press('Enter');
  const drawer=game.locator('tp-drawer.tp-game-rules');await expect(drawer).toHaveAttribute('open','');
  assert.ok(await drawer.locator('ol > li').count()>=3,`${slug}: missing rules`);
  await expect(drawer.locator('[data-tp-drawer-header] > tp-icon').first()).toHaveAttribute('name',slug);
  await expect(drawer.locator('[data-tp-drawer-title]')).toHaveText(await header.locator('.tp-game-header-title').innerText());
  await expect(drawer.locator('[data-tp-drawer-content] > h3')).toHaveText('Rules of the game');
  assert.deepEqual(await drawer.locator('[data-tp-drawer-actions]').evaluate(el=>Array.from(el.children,e=>e.tagName)),['TP-COLOR','TP-THEME','TP-ICON-BUTTON','TP-ICON-BUTTON','TP-ICON-BUTTON']);
  await drawer.locator('tp-color').evaluate(el=>el.setAttribute('preset','tp-green'));await expect(drawer).toHaveClass(/tp-green/);await expect(game).not.toHaveClass(/tp-green/);
  await drawer.locator('tp-theme').evaluate(el=>el.setAttribute('mode','dark'));await expect(drawer).toHaveClass(/tp-dark/);await expect(game).not.toHaveClass(/tp-dark/);
  const layout=await drawer.locator('[data-tp-drawer-header]').evaluate(el=>{
   const icon=el.querySelector('tp-icon').getBoundingClientRect(),title=el.querySelector('[data-tp-drawer-title]').getBoundingClientRect(),actions=el.querySelector('[data-tp-drawer-actions]').getBoundingClientRect();
   return {ordered:icon.right<=title.left&&title.right<=actions.left,aligned:Math.abs((icon.top+icon.bottom-actions.top-actions.bottom)/2)<1};
  });assert.ok(layout.ordered&&layout.aligned,`${slug}: drawer header alignment`);

  await page.keyboard.press('Escape');await expect(drawer).not.toHaveAttribute('open','');
  await page.keyboard.press('Escape');
  await header.locator('.tp-game-header-actions > tp-color').evaluate(el=>el.setAttribute('preset','tp-red'));await expect(game).toHaveClass(/tp-red/);assert.equal(await page.evaluate(()=>document.body.classList.contains('tp-red')),false);
  await header.locator('.tp-game-header-actions > tp-theme').evaluate(el=>el.setAttribute('mode','dark'));await expect(game).toHaveClass(/tp-dark/);assert.equal(await page.evaluate(()=>document.body.classList.contains('tp-dark')),false);
  await page.mouse.move(1390,990);await checkButtons();
  if(['binary','crossword','cryptarithm','sudoku','yakazu'].includes(slug)) await header.screenshot({path:`/tmp/game-header-${slug}-dark.png`});
  for(const tag of ['tp-color','tp-theme']) {
   const button=header.locator(`.tp-game-header-actions > ${tag} > tp-icon-button > button`);
   const expected=await button.evaluate(el=>getComputedStyle(el.parentElement).color);
   await button.hover();
   await expect.poll(()=>button.evaluate(el=>getComputedStyle(el.querySelector('tp-icon')).color)).toBe(expected);
  }
  await page.mouse.move(1390,990);
  const scope=await game.getAttribute('data-tp-game-scope');for(const tag of ['tp-color','tp-theme','tp-fullscreen'])await expect(header.locator(tag).first()).toHaveAttribute('anchor',`[data-tp-game-scope="${scope}"]`);
  if(slug==='mastermind'||slug==='wari'){await header.locator('tp-fullscreen tp-icon-button').click();await expect.poll(()=>page.evaluate(()=>document.fullscreenElement?.tagName)).toBe(`TP-${slug.toUpperCase()}`);await page.evaluate(()=>document.exitFullscreen());}
  if(slug==='mastermind'){
   await game.locator('.tp-mastermind-color').first().click();await expect(game).toHaveClass(/tp-red/);await expect(game).toHaveClass(/tp-dark/);
   await header.locator('[data-game-command="undo"]').click();await expect(game.locator('.tp-mastermind-peg.filled')).toHaveCount(0);await header.locator('[data-game-command="redo"]').click();await expect(game.locator('.tp-mastermind-peg.filled')).toHaveCount(1);
   await page.screenshot({path:'/tmp/game-header-mastermind.png'});
  }
  await header.locator('.tp-game-header-actions > tp-theme').evaluate(el=>el.setAttribute('mode','light'));
  await page.setViewportSize({width:390,height:844});const fits=await header.evaluate(el=>el.scrollWidth<=el.clientWidth+1);assert.ok(fits,`${slug} header overflows on mobile`);
  if(slug==='wari')await page.screenshot({path:'/tmp/game-header-mobile.png'});
  await page.setViewportSize({width:1400,height:1000});console.log(`${slug}: header, help, scope, rounded controls and mobile passed`);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
