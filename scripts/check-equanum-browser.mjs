import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();try {
 const page=await browser.newPage({viewport:{width:1200,height:900}});page.setDefaultTimeout(60000);
 await page.route('**/__equanum',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto(`${process.env.TP_COMPONENTS_URL || 'http://127.0.0.1:4173'}/__equanum`);
 const results=await page.evaluate(async()=>{
  await import('/src/components/ref/ref.ts');
  await import('/src/components/math/math.ts');
  const {htmlToMarkup,markupToHtml}=await import('/src/utilities/markup-conversion.ts');
  const source=String.raw`\usepackage{amsmath}\begin{equation}E=mc^2\label{energy}\end{equation}\begin{align}x&=1\label{a}\\y&=2\label{b}\end{align}See \eqref{energy} and \ref{b}.`;
  const html=await markupToHtml(source,'latex',location.href);
  const results=[];
  for(const language of ['html','markdown','asciidoc','restructuredtext','latex']) {
   const code=htmlToMarkup(html,language);const back=await markupToHtml(code,language,location.href);
   const root=document.createElement('template');root.innerHTML=back;
   const latex=htmlToMarkup(back,'latex');
   const preview=decodeURIComponent(root.content.querySelector('tp-equanum[ref="b"]').getAttribute('data-latex-equation-preview'));
   if(!preview.includes('y&=2')||preview.includes('x&=1')) throw Error(language+': incorrect row preview');
   results.push({back,latex,language,equations:root.content.querySelectorAll('tp-equanum').length,math:root.content.querySelectorAll('tp-math').length,refs:[...root.content.querySelectorAll('tp-ref')].map(e=>e.getAttribute('href')),native:latex.includes('\\label{energy}')&&latex.includes('\\label{b}')&&!latex.includes('wcTpRef'),code});
  }
  document.body.innerHTML='<div data-tp-reference-scope>'+html+'</div>';
  return results;
 });
 for(const result of results){assert.equal(result.equations,3,result.language+"\n"+result.code+"\n"+result.back);assert.equal(result.math,2,result.language);assert.deepEqual(result.refs,['=energy','=b'],result.language);assert.ok(result.native,result.language+': '+result.back+'\nLATEX:\n'+result.latex);}
 await page.waitForFunction(()=>document.querySelector('tp-math svg'));
 const button=page.locator('tp-ref[href="=energy"] button');await button.hover();
 await page.waitForFunction(()=>document.querySelector('tp-ref[href="=energy"] tp-tooltip:popover-open tp-math svg'));
 assert.equal(await page.locator('tp-ref[href="=energy"] tp-tooltip [data-tp-equanum-generated]').count(),0);
 const rowButton=page.locator('tp-ref[href="=b"] button');await rowButton.hover();
 await page.waitForFunction(()=>document.querySelector('tp-ref[href="=b"] tp-tooltip:popover-open tp-math svg'));
 const rowValue=await page.locator('tp-ref[href="=b"] tp-tooltip tp-math').getAttribute('value');
 assert.ok(rowValue.includes('y&=2'));assert.ok(!rowValue.includes('x&=1'));
 assert.equal(await page.locator('[data-mml-node="merror"]').count(),0);
 await page.screenshot({path:'/tmp/equanum-preview.png'});
 console.log(results.map(({code,back,latex,...result})=>result));console.log('Rendered equation preview and five-language roundtrips passed.');
}finally{await browser.close();}
