import assert from 'node:assert/strict';
import {chromium, firefox, webkit} from '@playwright/test';
const browserType = {chromium, firefox, webkit}[process.env.BROWSER ?? 'chromium'];
const browser=await browserType.launch();
try {
 for(const language of ['html','markdown']) for(const nested of [false,true]) {
  const page=await browser.newPage({viewport:{width:1100,height:750}});
  page.on('pageerror',error=>console.error(error.message));
  const ext=language==='html'?'html':'md';
  const cover='<h1>Guide</h1><tp-toc label="On this page" open expand-all></tp-toc><h2 id="start">Start</h2><div style="height:800px"></div><h2 id="end">End</h2><tp-global-listof selector="figure"></tp-global-listof><div style="height:500px"></div>';
  const first='<h1>Chapter</h1><div style="height:800px"></div><figure id="target"><p>Figure body</p><figcaption>Diagram</figcaption></figure><div style="height:500px"></div>';
  await page.route('**/__history/**',route=>{
   const file=new URL(route.request().url()).pathname.split('/').at(-1);
   const sidebar=language==='html'?`<ul><li><a href="cover.${ext}">Guide</a></li><li><a href="first.${ext}">Chapter</a></li></ul>`:`- [Guide](cover.${ext})\n- [Chapter](first.${ext})`;
   const source=file===`sidebar.${ext}`?sidebar:file===`cover.${ext}`?cover:file===`first.${ext}`?first:null;
   return route.fulfill({status:source===null?404:200,contentType:'text/plain',body:source??''});
  });
  await page.route('**/__history-test',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
  await page.goto(`http://127.0.0.1:4174/__history-test${nested?'#/outer.md':''}`);
  await page.evaluate(async ({language,nested})=>{
   await import('/src/components/toc/toc.ts');await import('/src/components/global-listof/global-listof.ts');
   await import(`/src/components/${language}-multi-pages/${language}-multi-pages.ts`);
   const host=document.createElement(`tp-${language}-multi-pages`);host.setAttribute('repository','/__history');host.setAttribute('menu','');host.style.cssText='display:block;height:650px;position:relative';
   const parent=document.createElement('div');if(nested)parent.className='tp-markdown-multi-pages-host';parent.append(host);document.body.append(parent);
  },{language,nested});
  await page.waitForFunction(()=>document.querySelector('tp-global-listof tp-accordion dt')).catch(async error=>{console.error(await page.locator('body').innerText());throw error;});
  const root=page.locator(`tp-${language}-multi-pages`).first();
  const content=root.locator(`.tp-${language==='html'?'markup':'markdown'}-multi-pages-content`).first();
  await root.locator('tp-global-listof tp-accordion dt').click();
  const link=root.locator('tp-global-listof a[data-tp-global-origin]');
  await link.evaluate(link=>link.addEventListener('click',()=>{const content=link.closest('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content');window.historyTestScroll=content.scrollTop;},{capture:true}));
  await link.click();
  await page.waitForFunction(()=>document.querySelector('figure#target'));
  if(nested)assert.equal(new URL(page.url()).hash,'#/outer.md');
  await page.goBack();
  await page.waitForFunction(()=>document.querySelector('tp-global-listof tp-accordion dt')?.getAttribute('aria-expanded')==='true');
  await page.waitForFunction(()=>{const content=document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content');return Math.abs(content.scrollTop-window.historyTestScroll)<3;});
  await page.goForward();await page.waitForFunction(()=>document.querySelector('figure#target'));
  await page.goBack();await page.waitForFunction(()=>document.querySelector('tp-global-listof tp-accordion dt')).catch(async error=>{console.error(await page.locator('body').innerText());throw error;});
  await content.evaluate(el=>{el.scrollTop=0;});
  const toc=root.locator('tp-toc a').filter({hasText:'End'}).first();
  await toc.evaluate(link=>link.addEventListener('click',()=>{window.historyTocScroll=link.closest('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content').scrollTop;},{capture:true}));
  await toc.click();
  await page.waitForFunction(()=>document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content').scrollTop>500);
  await page.goBack();
  await page.waitForFunction(()=>Math.abs(document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content').scrollTop-window.historyTocScroll)<3);
  await page.goForward();
  await page.waitForFunction(()=>document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content').scrollTop>500);
  if(nested)assert.equal(new URL(page.url()).hash,'#/outer.md');
  console.log(language,nested?'embedded':'standalone','Back/Forward restore source page, expanded panel, scroll and TOC anchors.');
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1100,height:750}});
  page.on('pageerror',error=>console.error(error.message));
 await page.route('**/__toc-history',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body><tp-toc open expand-all></tp-toc><h2 id="start">Start</h2><div style="height:1000px"></div><h2 id="end">End</h2><div style="height:800px"></div></body>'}));
 await page.goto('http://127.0.0.1:4174/__toc-history');
 await page.evaluate(()=>import('/src/components/toc/toc.ts'));
 await page.locator('tp-toc a').filter({hasText:'End'}).first().click();
 await page.waitForFunction(()=>scrollY>500);
 await page.goBack();await page.waitForFunction(()=>scrollY===0);
 await page.goForward();await page.waitForFunction(()=>scrollY>500);
 console.log('Standalone TOC: Back/Forward restore the original scroll position and target.');
 await page.close();
}finally{await browser.close();}
