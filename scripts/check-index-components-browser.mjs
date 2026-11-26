import {chromium} from '@playwright/test';
const browser=await chromium.launch();try{
 const page=await browser.newPage();await page.goto((process.env.TP_TEST_BASE_URL||'http://127.0.0.1:4173')+'/scripts/fixtures/converter-presentation-next-audit.html');
 await page.evaluate(async()=>{await import('/src/components/index/index.ts');await import('/src/components/ref/ref.ts');await import('/src/components/listof/listof.ts');const host=document.createElement('main');host.id='index-check';host.innerHTML=await fetch('/docs/components/index/examples/introduction.html').then(r=>r.text());document.body.append(host);});
 await page.waitForFunction(()=>document.querySelectorAll('#index-check tp-listof a').length===2);
 const first=await page.evaluate(()=>{const host=document.querySelector('#index-check');const silent=host.querySelector('tp-ref[silent]');return {light:[...host.querySelectorAll('tp-index,tp-ref,tp-listof')].every(e=>!e.shadowRoot),hidden:getComputedStyle(host.querySelector('tp-index')).display==='none',silent:getComputedStyle(silent.querySelector('tp-button')).display==='none',label:host.querySelector('tp-ref:not([silent]) button').textContent,links:[...host.querySelectorAll('tp-listof a')].every(a=>document.getElementById(decodeURIComponent(a.hash.slice(1)))?.localName==='tp-ref')};});
 await page.locator('#index-check tp-ref:not([silent]) button').hover();await page.waitForFunction(()=>!!document.querySelector('#index-check tp-tooltip[open]'));
 await page.evaluate(()=>document.querySelector('#index-check tp-ref[silent]').removeAttribute('silent'));
 await page.waitForFunction(()=>document.querySelectorAll('#index-check tp-ref > tp-button:not([hidden])').length===2);
 await page.locator('#index-check tp-listof a').nth(1).click();
 const navigation=await page.evaluate(()=>decodeURIComponent(location.hash.slice(1))===document.querySelectorAll('#index-check tp-ref')[1].id);
 const checks={...first,tooltip:true,resume:true,navigation};console.log(checks);if(Object.values(checks).some(v=>v===false)||first.label!=='matrix')process.exitCode=1;
}finally{await browser.close();}
