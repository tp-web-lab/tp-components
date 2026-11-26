import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 for(const [language,folder,count] of [['html','guide',4],['markdown','markdown-guide',6],['asciidoc','asciidoc-guide',6],['latex','latex-guide',6],['restructuredtext','rst-guide',6],['markup','mixed-guide',15]]) {
 const page=await browser.newPage();
 await page.route('**/__global-list-test',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body></body></html>'}));
 await page.goto('http://127.0.0.1:4174/__global-list-test');
 await page.evaluate(async ({language,folder})=>{
 await import('/src/components/ref/ref.ts');await import('/src/components/note/note.ts');
 await import(`/src/components/${language}-multi-pages/${language}-multi-pages.ts`);
 const host=document.createElement(`tp-${language}-multi-pages`);if(language==='html')host.setAttribute('menu','');host.setAttribute('repository',`/docs/components/global-listof/examples/${folder}`);document.body.append(host);
 },{language,folder});
 if(language==='html') await page.locator('[data-role=sidebar] a').filter({hasText:'List of figures'}).click();
 await page.waitForFunction(count=>document.querySelectorAll('tp-global-listof a').length===count,count,{timeout:90000});
 for(const heading of await page.locator('tp-global-listof tp-accordion dt').all()) await heading.click();
 const links=await page.locator('tp-global-listof a').evaluateAll(items=>items.map(a=>({href:a.getAttribute('href'),text:a.textContent})));
 assert.equal(links.length,count);
 assert.ok(links[0].href.endsWith('#diagram'));
 assert.ok(links[1].href.includes('tp-global-target-'));
 await page.locator('tp-global-listof a').nth(1).click();
 await page.waitForFunction(()=>!!document.querySelector('[data-tp-global-anchor]'),null,{timeout:30000});
 const target=await page.locator('[data-tp-global-anchor]').evaluate(el=>({caption:el.nextElementSibling?.querySelector('figcaption')?.textContent,top:el.getBoundingClientRect().top}));
 assert.ok(target.caption.includes('without an authored ID'));
 // Each chapter's note retains its local first-citation number.
 await page.waitForFunction(()=>document.querySelector('tp-ref')?.textContent.includes('1'),null,{timeout:15000});
 const last=links.at(-1);
 await page.evaluate(href=>{window.location.hash=href;},last.href);
 await page.waitForFunction(()=>!!document.querySelector('[data-tp-global-anchor]') && document.querySelector('tp-ref')?.textContent.includes('1'),null,{timeout:30000});
 assert.ok(page.url().endsWith(last.href));
 const current=page.url();await page.reload();
 // A standalone fixture has no startup script after reload; restore the shell at the same deep link.
 await page.evaluate(async ({language,folder})=>{await import('/src/components/ref/ref.ts');await import('/src/components/note/note.ts');await import(`/src/components/${language}-multi-pages/${language}-multi-pages.ts`);const host=document.createElement(`tp-${language}-multi-pages`);if(language==='html')host.setAttribute('menu','');host.setAttribute('repository',`/docs/components/global-listof/examples/${folder}`);document.body.append(host);},{language,folder});
 await page.waitForFunction(()=>!!document.querySelector('[data-tp-global-anchor]'),null,{timeout:30000});
 assert.equal(page.url(),current);
 console.log(`${language}: ${count} entries, page/anchor navigation and deep-link reload passed`);
 await page.close();
 }
}finally{await browser.close();}
