import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from '@playwright/test';
const browser = await ({ chromium, firefox, webkit }[process.env.BROWSER ?? 'chromium']).launch();
const entries = [['^','note'], ['@','biblio'], ['%','glossary'], ['!','index'], ['=','equanum']];
const source = entries.map(([prefix,tag]) => `<p class="citation" title="Citation ${tag}"><tp-ref id="citation-${tag}" href="${prefix}entry-${tag}"></tp-ref></p><tp-${tag} ref="entry-${tag}" number="1">Definition of ${tag}</tp-${tag}>`).join('') + '<tp-ref href="!entry-index" silent></tp-ref><div style="height:1200px"></div><tp-listof selector=".citation"></tp-listof><tp-listof selector="tp-index"></tp-listof><div style="height:800px"></div>';
try {
 for (const mode of ['standalone', 'html', 'markdown', 'embedded']) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 750 } });
  await page.route('**/__ref-history', route => route.fulfill({ contentType:'text/html', body:'<!doctype html><body></body>' }));
  await page.route('**/__ref-guide/**', route => {
   const path = new URL(route.request().url()).pathname;
   const body = path.includes('sidebar') ? (mode === 'markdown' ? '- [Cover](cover.md)\n- [Chapter](first.html)' : '<ul><li><a href="cover.html">Cover</a></li><li><a href="first.html">Chapter</a></li></ul>') : path.includes('first') ? '<h1>Chapter</h1><h2 id="destination">Chapter destination</h2>' : source;
   return route.fulfill({contentType:'text/plain',body});
  });
  await page.goto(`http://127.0.0.1:4174/__ref-history${mode==='embedded'?'#/outer.md':''}`);
  await page.evaluate(async ({mode,source}) => {
   await import('/src/components/ref/ref.ts');
   await import('/src/components/listof/listof.ts');
   if(mode==='standalone') {document.body.innerHTML=source;return;}
   const language=mode==='markdown'?'markdown':'html';
   await import(`/src/components/${language}-multi-pages/${language}-multi-pages.ts`);
   const host=document.createElement(`tp-${language}-multi-pages`);
   host.setAttribute('repository','/__ref-guide');host.style.cssText='display:block;height:650px;position:relative';
   const wrapper=document.createElement('div');if(mode==='embedded')wrapper.className='tp-markdown-multi-pages-host';
   wrapper.append(host);document.body.append(wrapper);
  },{mode,source});
  for (const [prefix,tag] of entries) {
   const ref=page.locator(`tp-ref[href="${prefix}entry-${tag}"]`).first();
   await ref.locator('button').waitFor();
   const before=await page.evaluate(()=>history.length);
   await ref.locator('button').click();
   assert.equal(await page.evaluate(()=>history.length),before,'Opening a tooltip must not add history');
   await page.keyboard.press('Escape');
  }
  for (const link of await page.locator('tp-listof a').all()) {
   await link.scrollIntoViewIfNeeded();
   await link.evaluate(link=>link.addEventListener('click',()=>{window.savedRefScroll=document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content')?.scrollTop??scrollY;},{capture:true,once:true}));
   await link.click();
   await page.waitForFunction(()=>(document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content')?.scrollTop??scrollY)<800);
   await page.goBack();
   await page.waitForFunction(()=>Math.abs((document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content')?.scrollTop??scrollY)-window.savedRefScroll)<3);
   await page.goForward();
   await page.waitForFunction(()=>(document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content')?.scrollTop??scrollY)<800);
   await page.goBack();
   await page.waitForFunction(()=>Math.abs((document.querySelector('.tp-markup-multi-pages-content,.tp-markdown-multi-pages-content')?.scrollTop??scrollY)-window.savedRefScroll)<3);
  }
  assert.equal(await page.locator('tp-listof a').count(),7);
  if(mode==='embedded')assert.equal(new URL(page.url()).hash,'#/outer.md');
  console.log(`${mode}: all five reference kinds preserve Back/Forward navigation.`);
  await page.close();
 }
} finally { await browser.close(); }
