import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try{
 const page=await browser.newPage();
 await page.route('**/__numbering_audit',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto((process.env.TP_TEST_BASE_URL||'http://127.0.0.1:4188')+'/__numbering_audit');
 const results=await page.evaluate(async()=>{
  const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
  const source=await(await fetch('/docs/components/markup-converter/examples/automatic-numbering.md')).text();
  const pivot=await markupToHtml(source,'markdown',document.baseURI);
  const labels=['2.3 Results','2.3.1 Detail','Figure 2.7. An illustration','Table 1. Measurements','Code 1. Calculation'];
  const inspect=html=>{
   const d=new DOMParser().parseFromString(html,'text/html');
   const text=d.body.textContent.normalize('NFKC').replace(/\s+/g,' ');
   return {missing:labels.filter(l=>!text.includes(l)),automatic:!!d.querySelector('template[data-tp-numbering]'),errors:d.querySelectorAll('.system-message,[data-mml-node="merror"]').length,anchor:!!d.getElementById('results')};
  };
  const additions={
 html:'<h2>Added section</h2><figure><img src="extra.svg"><figcaption>Added image</figcaption></figure>',
 markdown:'\n\n## Added section\n\n![Extra](extra.svg)\n[Added image]',
 asciidoc:'\n\n== Added section\n\n.Added image\n[caption=""]\nimage::extra.svg[Extra]',
 latex:'\n\n\\section{Added section}\n\\begin{figure}\\includegraphics{extra.svg}\\caption{Added image}\\end{figure}',
 restructuredtext:'\n\nAdded section\n-------------\n\n.. figure:: extra.svg\n\n   Added image\n',
 };
 const results=[];
  for(const language of ['html','markdown','asciidoc','latex','restructuredtext']){
   const code=htmlToMarkup(pivot,language);
   const html=await markupToHtml(code,language,document.baseURI);
   const backCode=htmlToMarkup(html,'markdown');
   const back=await markupToHtml(backCode,'markdown',document.baseURI);
   const changed=await markupToHtml(code+additions[language],language,document.baseURI);
   const changedBack=await markupToHtml(htmlToMarkup(changed,'markdown'),'markdown',document.baseURI);
   const checkMutation=value=>{const root=new DOMParser().parseFromString(value,'text/html');const text=root.body.textContent.normalize('NFKC').replace(/\s+/g,' ');return text.includes('2.4 Added section')&&text.includes('Figure 2.8. Added image');};
   results.push({language,code,forward:inspect(html),back:inspect(back),mutation:checkMutation(changed),mutationBack:checkMutation(changedBack)});
  }
  return results;
 });
 writeFileSync('scripts/markup-numbering-browser-results.json',JSON.stringify({date:new Date().toISOString(),results},null,2)+'\n');
 for(const r of results){assert.equal(r.mutation,true,r.language+' mutation');assert.equal(r.mutationBack,true,r.language+' mutation return');}
 for(const r of results)for(const direction of ['forward','back']){
  assert.deepEqual(r[direction],{missing:[],automatic:true,errors:0,anchor:true},r.language+' '+direction);
 }
 const standalone=await page.evaluate(async html=>{
  const frame=document.createElement('iframe');document.body.append(frame);
  await new Promise(resolve=>{frame.onload=resolve;frame.srcdoc='<html><body>'+html+'</body></html>';});
  frame.contentDocument.body.insertAdjacentHTML('beforeend','<h2>Live addition</h2><figure><img src="extra.svg"><figcaption>Live image</figcaption></figure>');
  await new Promise(resolve=>setTimeout(resolve,100));
  const text=frame.contentDocument.body.textContent;return text.includes('2.4 Live addition')&&text.includes('Figure 2.8. Live image');
 },results.find(r=>r.language==='html').code);
 assert.equal(standalone,true,'standalone HTML renumbering');
 console.log('All five languages retain automatic numbering and heading anchors in both directions.');
}finally{await browser.close();}
