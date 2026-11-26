import assert from 'node:assert/strict';
import {chromium,firefox,webkit,expect} from '@playwright/test';
const browser=await ({chromium,firefox,webkit}[process.env.BROWSER??'chromium']).launch();
try {
 const page=await browser.newPage();
 page.setDefaultTimeout(120000);
 page.on('pageerror',error=>console.error(error));
 await page.route('**/__python-interpreter',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__python-interpreter');
 await page.evaluate(async()=>{
  await import('/src/components/python/python.ts');
  document.body.innerHTML='<tp-python query="square(7)"><script type="tp/python">\n  def square(x):\n      return x*x\n</script></tp-python>';
 });
 const host=page.locator('tp-python');
 await expect(host).toHaveAttribute('aria-busy','false',{timeout:120000});
 await expect(host.locator('[role=log]')).toContainText(/Engine: Python \d+\.\d+\.\d+ · Pyodide \d+\.\d+\.\d+/);
 const run=code=>host.evaluate(async(el,code)=>{await el.run(code);return el.querySelector('[role=log]').textContent;},code);
 assert.match(await run('square(7)'),/49\n$/);
 assert.match(await run('count = 2\ncount'),/2\n$/);
 assert.match(await run('count += 3\ncount'),/5\n$/);
 assert.match(await run('[1, 2, 3]'),/\[1, 2, 3\]\n$/);
 assert.match(await run('True'),/True\n$/);
 assert.match(await run('12 / 3'),/4\.0\n$/);
 assert.match(await run('9007199254740993'),/9007199254740993\n$/);
 assert.match(await run('print("Hello Python")'),/Hello Python\nNone\n$/);
 assert.match(await run('1 / 0'),/ZeroDivisionError/);
 assert.match(await run('def broken('),/SyntaxError/);
 assert.match(await run('square(3)'),/9\n$/);
 assert.match(await run('import asyncio\nawait asyncio.sleep(0)\n42'),/42\n$/);
 await host.evaluate(el=>el.clear());
 assert.match(await run('count'),/5\n$/);
 // A second interpreter must not reuse the first one's namespace or streams.
 await page.evaluate(()=>{const second=document.createElement('tp-python');second.id='second';document.body.append(second);});
 await expect(page.locator('#second')).toHaveAttribute('aria-busy','false',{timeout:120000});
 const isolated=await page.locator('#second').evaluate(async el=>{await el.run("'count' in globals()");return el.querySelector('[role=log]').textContent;});
 assert.match(isolated,/False\n$/);
 await page.locator('#second').evaluate(el=>el.remove());
 await host.evaluate(el=>el.toggleSource());
 const sizes=await host.evaluate(async el=>{
  const editor=el.querySelector('tp-code-editor');
  const wait=()=>new Promise(r=>setTimeout(r,400));
  await wait();const small=el.getBoundingClientRect().height;
  editor.value=Array.from({length:30},(_,i)=>`# line ${i}`).join('\n');await wait();const large=el.getBoundingClientRect().height;
  editor.value='def square(x):\n    return x*10';await wait();const shrunk=el.getBoundingClientRect().height;
  await el.applySource();return {small,large,shrunk};
 });
 assert.ok(sizes.large>sizes.small+100 && sizes.shrunk<sizes.large-100,JSON.stringify(sizes));
 assert.match(await run('square(7)'),/70\n$/);
 await host.evaluate(el=>el.reset());
 await expect(host.locator('[role=log]')).toContainText(/Engine: Python \d+\.\d+\.\d+ · Pyodide/);
 assert.match(await run('square(7)'),/49\n$/);
 assert.match(await run("'count' in globals()"),/False\n$/);
 await page.setViewportSize({width:360,height:700});
 assert.ok(await host.evaluate(el=>el.scrollWidth<=el.clientWidth+1));
 console.log('Python: actual engine version, persistence, repr, print, errors, await, isolation, clear/reset, editing and responsive layout passed.');
} finally {await browser.close();}
