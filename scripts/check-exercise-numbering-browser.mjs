import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('**/__exercise_numbering',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4188/__exercise_numbering');
 const result=await page.evaluate(async()=>{
 const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
 const source=await(await fetch('/docs/components/markup-converter/examples/exercises-examples-numbering.md')).text();
 const pivot=await markupToHtml(source,'markdown',document.baseURI);
 const languages=['html','markdown','asciidoc','latex','restructuredtext'];
 const sources=Object.fromEntries(languages.map(lang=>[lang,htmlToMarkup(pivot,lang)]));
 const checks=[];
 for(const from of languages)for(const to of languages){
 const input=await markupToHtml(sources[from],from,document.baseURI);
 const code=htmlToMarkup(input,to);
 const output=await markupToHtml(code,to,document.baseURI);
 const root=new DOMParser().parseFromString(output,'text/html');
 const labels=[...root.querySelectorAll('[data-object-number]')].map(e=>e.textContent.trim());
 const backCode=htmlToMarkup(output,from);
 const back=await markupToHtml(backCode,from,document.baseURI);
 const backRoot=new DOMParser().parseFromString(back,'text/html');
 checks.push({from,to,labels,back:[...backRoot.querySelectorAll('[data-object-number]')].map(e=>e.textContent.trim()),ids:['exercise-a','example-a','exercise-b'].every(id=>root.getElementById(id)),rules:!!root.querySelector('template[data-tp-numbering]')});
 }
 return {sources,checks};
 });
 
 for(const c of result.checks){assert.deepEqual(c.labels,['Exercise 2.7.','Example 1.','Exercise 2.8.'],JSON.stringify(c));assert.deepEqual(c.back,c.labels,JSON.stringify(c));assert.ok(c.ids&&c.rules);}
 writeFileSync('scripts/exercise-numbering-browser-results.json',JSON.stringify({date:new Date().toISOString(),...result},null,2)+'\n');
 console.log('25 conversions and their returns preserve exercise/example counters and IDs.');
}finally{await browser.close();}
