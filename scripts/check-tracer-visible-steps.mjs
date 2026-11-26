import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {chromium,firefox} from '@playwright/test';
import {compactTraceSteps} from '../src/components/trace/visible-steps.js';
const name=process.env.BROWSER||'chrome';
const browser=await(name==='firefox'?firefox:chromium).launch(name==='chrome'?{channel:'chrome'}:{});
const report={browser:name,checks:[]};
try {
const page=await browser.newPage({viewport:{width:1500,height:1000}});
for(const language of ['javascript','typescript','python']) {
 await page.route(`**/__steps-${language}.html`,r=>r.fulfill({contentType:'text/html',body:`<tp-${language}-tracer></tp-${language}-tracer><script type="module" src="/src/components/${language}-tracer/${language}-tracer.ts"></script>`}));
 await page.goto(`http://127.0.0.1:4386/__steps-${language}.html`);
 await page.waitForFunction(lang=>customElements.get(`tp-${lang}-tracer`),language);
 const host=page.locator(`tp-${language}-tracer`);
 const code=language==='python'?'emoji = "😀"; x = 2\ny = (x + 3) * 4\nprint(y)':`const emoji = "😀"; const x${language==='typescript'?': number':''} = 2;\nconst y = (x + 3) * 4; console.log(y);`;
 await host.evaluate(async(e,code)=>{e.setAttribute('value',code);await e.refresh();e.record();},code);
 await page.waitForFunction(lang=>JSON.parse(document.querySelector(`tp-${lang}-tracer`).getCode() || "{}").trace?.length > 0,language,{timeout:90000});
 const data=JSON.parse(await host.evaluate(e=>e.getCode()));
 assert.equal(data.trace.at(-1).stdout,'20\n');
 assert.deepEqual(compactTraceSteps(data.trace),data.trace);
 assert.ok(data.trace.some(s=>s.source_range&&code.slice(s.source_range.start,s.source_range.end)==='x + 3'));
 for(let i=0;i<data.trace.length;i++) {
  await host.evaluate((e,i)=>e.goTo(i),i);
  const step=data.trace[i];
  if(step.source_range) assert.equal(await host.locator('[data-role=recorded] mark').allTextContents().then(a=>a.join('\n')),code.slice(step.source_range.start,step.source_range.end));
 }
 await page.screenshot({path:`/tmp/${language}-steps-${name}.png`});
 await page.evaluate(()=>{window.Worker=class{constructor(){throw Error('Replay started a Worker')}}});
 await host.locator('[data-role=file]').setInputFiles({name:'steps.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});
 await host.locator('[data-role=last]').click();
 assert.equal(await host.locator('[data-role=stdout]').innerText(),'20\n');
 report.checks.push({language,steps:data.trace.length,expressions:true,replay:true});
}
 await writeFile(`/tmp/tracer-visible-steps-${name}.json`,JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
}finally{await browser.close()}
