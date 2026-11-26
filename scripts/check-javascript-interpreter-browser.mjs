import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const typescriptVersion=createRequire(import.meta.url)('typescript/package.json').version;
import { chromium, firefox, webkit } from '@playwright/test';
const language=process.env.INTERPRETER??'javascript';
const browser=await ({chromium,firefox,webkit}[process.env.BROWSER??'chromium']).launch();
try {
 const page=await browser.newPage();
 await page.route('**/__javascript-interpreter',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__javascript-interpreter');
 await page.evaluate(async language=>{
  await import(`/src/components/${language}/${language}.ts`);
  const signature=language==='typescript'?'(x: number): number':'(x)';
  document.body.innerHTML=`<tp-${language} data-test-interpreter query="square(7)"><script type="tp/${language}">\n function square${signature} { return x*x; }\n</script></tp-${language}>`;
 },language);
 const checkEngine=async()=>{
  const text=await page.locator('[data-test-interpreter] [role=log]').textContent();
  assert.match(text,/Engine: .*JavaScript · Browser: (Chrome|Firefox|Safari) [\d.]+/);
  if(language==='typescript')assert.ok(text.includes(`Engine: TypeScript ${typescriptVersion} → JavaScript`));
 };
 await checkEngine();
 const run=async code=>page.evaluate(async code=>{const el=document.querySelector('[data-test-interpreter]');await el.run(code);return el.querySelector('[role=log]').textContent;},code);
 assert.match(await run('square(7)'),/49\n$/);
 if(language==='typescript') {
  assert.match(await run('interface Item { value: number }; const item: Item = { value: 42 }; item.value'),/42\n$/);
  assert.match(await run('function identity<T>(value: T): T { return value; }; identity<number>(7)'),/7\n$/);
  assert.match(await run('enum Color { Red, Blue }; Color.Blue'),/1\n$/);
  assert.match(await run('class Counter { value: number = 4; }; new Counter().value'),/4\n$/);
  assert.match(await run('const invalid: = 2'),/ERROR:.*Line 1/);
 }

 assert.match(await run('let count = 2; count'),/2\n$/);
 assert.match(await run('count += 3'),/5\n$/);
 assert.match(await run('const fixed = 9; fixed'),/9\n$/);
 assert.match(await run('fixed = 10'),/ERROR:/);
 assert.match(await run('fixed'),/9\n$/);
 assert.match(await run('await Promise.resolve(square(3))'),/9\n$/);
 assert.match(await run('console.log("hello", {value: count})'),/hello/);
 assert.match(await run('throw new Error("expected")'),/ERROR:.*expected/);
 assert.match(await run('let = ;'),/ERROR:/);
 assert.match(await run('square(4)'),/16\n$/);
 await page.evaluate(()=>document.querySelector('[data-test-interpreter]').clear());
 assert.match(await run('count'),/5\n$/);
 await page.evaluate(()=>document.querySelector('[data-test-interpreter]').reset());
 await checkEngine();
 assert.match(await run('typeof count'),/undefined\n$/);
 assert.match(await run('square(2)'),/4\n$/);
 await page.evaluate(()=>document.querySelector('[data-test-interpreter]').toggleSource());
 const heights=await page.evaluate(async()=>{
  const el=document.querySelector('[data-test-interpreter]');const editor=el.querySelector('tp-code-editor');
  const measure=()=>el.getBoundingClientRect().height;
  const wait=()=>new Promise(r=>setTimeout(r,400));
  await wait();const small=measure();editor.value=Array.from({length:30},(_,i)=>`// line ${i}`).join('\n');await wait();const large=measure();
  editor.value='function square(x) { return x * 10; }';await wait();const shrunk=measure();
  await el.applySource();return {small,large,shrunk};
 });
 assert.ok(heights.large>heights.small+100,JSON.stringify(heights));
 assert.ok(heights.shrunk<heights.large-100,JSON.stringify(heights));
 assert.match(await run('square(7)'),/70\n$/);
 await page.evaluate(()=>document.querySelector('[data-test-interpreter]').reset());
 await checkEngine();
 assert.match(await run('square(7)'),/49\n$/);
 await page.setViewportSize({width:360,height:700});
 assert.ok(await page.locator('[data-test-interpreter]').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
 console.log(language+' interpreter: lexical persistence, errors, await, console, clear/reset, source editing, height growth/shrink and narrow layout passed.');
} finally { await browser.close(); }
