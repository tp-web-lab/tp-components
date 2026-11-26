import assert from "node:assert/strict";
import { chromium, firefox } from "@playwright/test";
const name=process.env.BROWSER||"chrome", base=process.env.BASE_URL||"http://127.0.0.1:4386";
const module=process.env.TRACE_MODULE||"/src/components/scheme-tracer/scheme-tracer.ts";
const browser=await(name==="firefox"?firefox:chromium).launch(name==="chrome"?{channel:"chrome"}:{});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.route("**/__scheme-tracer.html",r=>r.fulfill({contentType:"text/html",body:`<tp-scheme-tracer></tp-scheme-tracer><script type="module" src="${module}"></script>`}));
 await page.goto(base+"/__scheme-tracer.html");
 await page.waitForFunction(()=>customElements.get("tp-scheme-tracer"));
 const host=page.locator("tp-scheme-tracer");
 const cases=[['recursion','120\n'],['tail-recursion','1275\n'],['closures','1\n2\n11\n'],['shared-pairs','((changed b) changed b)\n((a b) (a b))\n#t\n'],['cyclic-pair','#t\nchanged\n'],['vectors','#(10 99 30)\n#t\n'],['higher-order','(1 4 9 16)\n(3 6 9)\n'],['error','']];
 for(const [file,output] of cases) {
  await host.evaluate(async(e,file)=>{e.removeAttribute('trace');e.src='/docs/components/scheme-tracer/examples/'+file+'.scm';await e.refresh();e.record();},file);
  await page.waitForFunction(()=>{const node=document.querySelector('[data-role=status]');return node?.textContent?.startsWith('Step ')||node?.classList.contains('trace-error');},null,{timeout:90000});
  const status=await host.locator('[data-role=status]').innerText();
  assert.ok(status.startsWith('Step '),status);
  const data=JSON.parse(await host.evaluate(e=>e.getCode()));
  assert.equal(data.language,'scheme');assert.equal(data.trace.at(-1).stdout,output);
  await host.evaluate(e=>e.goTo(9999));
  assert.equal(await host.locator('[data-role=stdout]').innerText(),output);
  if(file==='error') {assert.equal(data.trace.at(-1).line,2);assert.ok(await host.locator('.trace-error').count());}
  else assert.ok(!data.trace.at(-1).exception_msg,data.trace.at(-1).exception_msg);
  if(file==='recursion')assert.equal(Math.max(...data.trace.map(s=>s.stack_to_render?.filter(f=>!f.is_parent).length||0)),5);
  if(file==='tail-recursion')assert.equal(Math.max(...data.trace.map(s=>s.stack_to_render?.filter(f=>!f.is_parent).length||0)),1);
  if(file==='closures')assert.equal(data.trace.at(-1).stack_to_render.filter(f=>f.is_parent).length,2);
  if(file==='cyclic-pair') {assert.equal(await host.locator('[data-object]').count(),1);assert.ok(await host.locator('[data-reference]').count()>=2);}
  if(file==='vectors')assert.equal(await host.locator('.sequence').count(),1);
  if(['shared-pairs','closures','error'].includes(file))await page.screenshot({path:`/tmp/scheme-tracer-${name}-${file}.png`,fullPage:true});
  // Replay must not construct a Worker or bootstrap LIPS again.
  await page.evaluate(()=>{window.savedWorker=window.Worker;window.Worker=class{constructor(){throw Error('Unexpected execution during replay');}};});
  await host.evaluate(async(e,data)=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'}));e.trace=url;await e.refresh();e.goTo(9999);URL.revokeObjectURL(url);},data);
  assert.deepEqual(JSON.parse(await host.evaluate(e=>e.getCode())),data);
  assert.equal(await host.locator('[data-role=stdout]').innerText(),output);
  await page.evaluate(()=>{window.Worker=window.savedWorker;});
  console.log(name,file,data.trace.length,'snapshots, output and replay passed');
 }
 for(const width of [760,340]) {
  await page.setViewportSize({width,height:1000});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
 }
 await page.evaluate(()=>{window.showSaveFilePicker=undefined;});
 page.once('dialog',d=>d.accept('scheme-lesson.json'));
 const download=page.waitForEvent('download');await host.locator('[data-role=save]').click();
 assert.equal((await download).suggestedFilename(),'scheme-lesson.json');
 assert.deepEqual(errors,[]);
} finally { await browser.close(); }
