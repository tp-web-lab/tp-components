import assert from 'node:assert/strict';
import { chromium, firefox } from '@playwright/test';
const name = process.env.BROWSER || 'chrome';
const browser = await (name === 'firefox' ? firefox.launch() : chromium.launch({channel:'chrome'}));
const base = process.env.BASE_URL || 'http://127.0.0.1:4386';
const cases = [
 ['javascript','function square(n) { return n*n + 1; }','console.log(square(7))'],
 ['typescript','function square(n: number): number { return n*n + 1; }','console.log(square(7))'],
 ['python','def square(n):\n    return n*n + 1','print(square(7))'],
 ['scheme','(define (square n) (+ (* n n) 1))','(square 7)'],
];
try {
 for (const [language, source, query] of cases) {
  const page = await browser.newPage();
  page.on("pageerror", error => console.error(language, error.message));
  await page.route('**/__optional-tracer.html', route => route.fulfill({contentType:'text/html',body:`<!doctype html><html><body><script type="module" src="/src/components/${language}/${language}.ts"></script></body></html>`}));
  await page.goto(`${base}/__optional-tracer.html`);
  
  await page.evaluate(async ({language, source, query}) => {
   await Promise.race([customElements.whenDefined(`tp-${language}`), new Promise((_, reject) => setTimeout(() => reject(new Error('component not defined')), 15000))]);
   const host = document.createElement(`tp-${language}`);
   host.setAttribute('mode','simple'); host.setAttribute('query',query);
   const script = document.createElement('script'); script.type = `tp/${language}`; script.textContent = source; host.append(script);
   document.body.append(host); window.interpreter = host;
  },{language,source,query});
  await page.waitForFunction(() => window.interpreter.querySelector('tp-code-editor')?.getValue?.().length);
  await page.evaluate(async () => { window.interpreter.setAttribute('mode','default'); await window.interpreter.openTrace(); });
  assert.equal(await page.locator('[data-command=trace]').count(),0);
  assert.equal(await page.locator('tp-drawer').count(),0);
  await page.evaluate(() => {window.interpreter.tracer = true;});
  assert.equal(await page.locator('[data-command=trace]').count(),1);
  await page.locator('[data-command=trace]').click();
  await page.waitForFunction(language => {
   const t = window.interpreter.querySelector(`tp-${language}-tracer`);
   if (t?.querySelector('[data-role=status]')?.classList.contains('trace-error')) throw new Error(t.querySelector('[data-role=status]').textContent);
   return t?.getCode?.() && JSON.parse(t.getCode()).trace.length > 0;
  },language,{timeout:60000}).catch(async error => { console.error(await page.locator('body').innerText()); throw error; });
  const result = await page.evaluate(language => {
   const t = window.interpreter.querySelector(`tp-${language}-tracer`);
   t.goTo(100000);
   return {output:t.querySelector('[data-role=stdout]').textContent, width:window.interpreter.querySelector('tp-drawer').getAttribute('width')};
  },language);
  assert.equal(result.output.trim(),'50'); assert.equal(result.width,'75%');
  await page.evaluate(() => {window.interpreter.tracer = false;});
  assert.equal(await page.locator('tp-drawer').count(),0);
  assert.equal(await page.locator('[data-command=trace]').count(),0);
  console.log(`${name}: ${language}: absent = no trace; enabled = result 50; disabled = drawer removed`);
  await page.close();
 }
} finally {await browser.close();}
