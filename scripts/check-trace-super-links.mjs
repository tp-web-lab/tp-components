import assert from 'node:assert/strict';
import {chromium,firefox} from '@playwright/test';
const name=process.env.BROWSER || 'chrome';
const browser=await (name==='firefox'?firefox:chromium).launch(name==='chrome'?{channel:'chrome'}:{});
try {
 const page=await browser.newPage({viewport:{width:1200,height:600}});
 for(const language of ['python','javascript']) {
  await page.route(`**/__super-${language}.json`,r=>r.fulfill({contentType:'application/json',body:JSON.stringify({version:1,language,code:'',trace:[{event:'return',globals:{Child:['REF',1]},heap:{1:['CLASS','Child',['Base'],...Array.from({length:40},(_,i)=>['field'+i,i])],2:['CLASS','Base',[],['value',1]]}}]})}));
  await page.route(`**/__super-${language}.html`,r=>r.fulfill({contentType:'text/html',body:`<tp-${language}-trace trace="/__super-${language}.json"></tp-${language}-trace><script type="module" src="/src/components/${language}-trace/${language}-trace.ts"></script>`}));
  await page.goto(`http://127.0.0.1:4386/__super-${language}.html`);
  const link=page.locator('.super-link');
  await link.waitFor();
  const base=page.locator('[data-object="2"]');
  const id=await base.getAttribute('id');
  assert.equal(await link.getAttribute('href'),'#'+id);
  await link.hover();assert.ok(await base.evaluate(e=>e.classList.contains('referenced')));
  await link.click();await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>location.hash),'#'+id);
  assert.ok(await base.evaluate(e=>e.getBoundingClientRect().top<innerHeight));
  await page.evaluate(()=>scrollTo(0,0));await link.focus();
  assert.ok(await base.evaluate(e=>e.classList.contains('referenced')));
  await page.keyboard.press('Enter');await page.waitForTimeout(150);
  assert.ok(await base.evaluate(e=>e.getBoundingClientRect().top<innerHeight));
  console.log(name,language,'base-class links: hover, click, focus, Enter passed');
 }
}finally{await browser.close();}
