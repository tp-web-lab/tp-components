import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.route('**/__table_audio',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4188/__table_audio');
 const checks=await page.evaluate(async()=>{
 const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
 const cases={direct:'<audio controls src="sound.wav"></audio>',source:'<audio controls><source src="sound.wav" type="audio/wav"></audio>',alternatives:'<audio controls loop><source src="sound.ogg" type="audio/ogg"><source src="sound.wav" type="audio/wav"></audio>'};
 const languages=['html','markdown','asciidoc','latex','restructuredtext'];
 const inspect=html=>{
 const root=new DOMParser().parseFromString(html,'text/html');const audio=root.querySelector('td audio');
 const path=value=>value?new URL(value,document.baseURI).pathname:null;
 return {tables:root.querySelectorAll('table').length,audio:root.querySelectorAll('audio').length,src:path(audio?.getAttribute('src')),controls:audio?.hasAttribute('controls'),loop:audio?.hasAttribute('loop'),sources:[...audio?.querySelectorAll(':scope > source')??[]].map(s=>({src:path(s.getAttribute('src')),type:s.getAttribute('type')})),errors:root.querySelectorAll('.system-message,[data-mml-node="merror"]').length};
 };
 const checks=[];
 let phase="", lastCode="";
 try {
 for(const [name,audio] of Object.entries(cases)){
 const original=`<table><tbody><tr><td>${audio}</td></tr></tbody></table>`;
 const expected=inspect(original);
 for(const from of languages){
 phase=`${name}: import ${from}`; const source=htmlToMarkup(original,from); lastCode=source;
 const pivot=await markupToHtml(source,from,document.baseURI);
 for(const to of languages){
 phase=`${name}: ${from} -> ${to}`; const code=htmlToMarkup(pivot,to); lastCode=code;const html=await markupToHtml(code,to,document.baseURI);
 phase=`${name}: ${from} -> ${to} -> ${from}`; lastCode=htmlToMarkup(html,from); const back=await markupToHtml(lastCode,from,document.baseURI);
 checks.push({name,from,to,expected,forward:inspect(html),back:inspect(back),nativeLatex:to!=='latex'||(code.includes('\\sound[')&&!code.includes('\\wcAudio'))});
 }
 }
 }
 } catch(error) { return {phase,lastCode,error:String(error),message:error?.message,stack:error?.stack}; }
 return checks;
 });
 writeFileSync('scripts/table-audio-browser-results.json',JSON.stringify({date:new Date().toISOString(),checks},null,2)+'\n');
 assert.ok(Array.isArray(checks),JSON.stringify(checks));
 for(const check of checks){assert.deepEqual(check.forward,check.expected,`${check.name}: ${check.from} -> ${check.to}`);assert.deepEqual(check.back,check.expected,`${check.name}: ${check.from} -> ${check.to} -> ${check.from}`);assert.ok(check.nativeLatex);}
 console.log('75 source/target conversions and 75 returns preserve audio sources, MIME types, order and controls inside table cells.');
}finally{await browser.close();}
