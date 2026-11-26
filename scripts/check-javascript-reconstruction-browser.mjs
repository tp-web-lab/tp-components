/** Parse all five Javascript API variants, then compare exact programs and reconstructed DOMs
 * in Chromium, Firefox and WebKit. Requires the Vite documentation server (TP_EXAMPLES_URL).
 * Imports are checked separately by component-javascript-examples.test.ts; executing them
 * here would upgrade the elements and obscure the author DOM being compared.
 */
import{readFileSync,readdirSync,existsSync}from'node:fs';
import{chromium,firefox,webkit}from'@playwright/test';
import{namedExamples,viewerSource}from'./component-basic-examples.mjs';
const root=new URL('../',import.meta.url).pathname;
const base=process.env.TP_EXAMPLES_URL ?? 'http://127.0.0.1:4173';
const latexUrl='/@fs'+new URL(import.meta.resolve('@tp/tp-latex')).pathname;const fixtures=[];
for(const name of readdirSync(root+'public/docs/components')){const d=root+`public/docs/components/${name}/examples/`;if(!existsSync(d+'introduction.html'))continue;const intro=readFileSync(d+'introduction.html','utf8').trim();for(const lang of ['html','md','adoc','rst','tex']){const file=readFileSync(d+`examples.${lang}`,'utf8');const source=lang==='tex'?file.split(/^% !tp-example /m).find(s=>s.startsWith('Javascript API\n')).split('\n').slice(1).join('\n').trim():namedExamples(lang,viewerSource(lang,file)).find(e=>e.label==='Javascript API').source;fixtures.push({name,lang,source,intro});}}
const rendered=[];
for(const [name,engine]of Object.entries({chromium,firefox,webkit})){
 const b=await engine.launch();const p=await b.newPage();await p.route('**/__js_audit',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));await p.goto(new URL('/__js_audit',base).href);
 if(name==='chromium'){
  await p.evaluate(async latexUrl=>{const md=await import('/src/utilities/markdown-source.ts');const adoc=await import('/src/components/asciidoc/asciidoc.ts');const rst=await import('/src/components/restructuredtext/restructuredtext.ts');const latex=await import(latexUrl);window.renders={html:source=>source,md:md.renderMarkdownToHtml,adoc:adoc.renderAsciidocToHtml,rst:rst.renderRestructuredTextToHtml,tex:source=>{const div=document.createElement('div');div.append(latex.renderLatexToFragment(source));return div.innerHTML;}}},latexUrl);
  for(const lang of ['html','md','adoc','rst','tex']){
   for(const f of fixtures.filter(f=>f.lang===lang)){
    const result=await p.evaluate(async f=>{try{const html=await window.renders[f.lang](f.source);const d=new DOMParser().parseFromString(html,'text/html');const scripts=[...d.querySelectorAll('script[type="module"]')];if(scripts.length!==1)throw Error(`Expected one module, found ${scripts.length}: ${html.slice(0,300)}`);return {program:scripts[0].textContent};}catch(e){return {error:String(e)}}},f);
    if(result.error)throw Error(`${f.name}/${lang}: ${result.error}`);
    rendered.push({...f,program:result.program});
   }
   console.log(`${lang}: parsed 212 Javascript API examples`);
  }
 }
 const errors=await p.evaluate(rows=>{const errors=[];const htmlSources=new Map(rows.filter(r=>r.lang==='html').map(r=>[r.name,r.program]));for(const f of rows){if(f.program.trim()!==htmlSources.get(f.name).trim()){errors.push(`${f.name}/${f.lang}: program whitespace changed`);continue;}const actual=document.implementation.createHTMLDocument();try{new Function('document',f.program.replace(/^import .*;$/gm,''))(actual);const expected=document.createElement('template');expected.innerHTML=f.intro;const target=document.createElement('div');target.append(expected.content.cloneNode(true));if(actual.body.innerHTML!==target.innerHTML)errors.push(`${f.name}/${f.lang}: reconstruction differs`);}catch(e){errors.push(`${f.name}/${f.lang}: ${String(e)}`);}}return errors;},rendered);
 console.log(`${name}: executed ${rendered.length} reconstructions; ${errors.length} differences`);if(errors.length)throw Error(JSON.stringify(errors));await b.close();
}
