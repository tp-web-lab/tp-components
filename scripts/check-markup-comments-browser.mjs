import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();try {
 const page=await browser.newPage();page.on('console',m=>{if(m.text().startsWith('comment-check:'))console.log(m.text());});
 await page.route('**/__comment-matrix',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><body></body>'}));
 await page.goto('http://127.0.0.1:4174/__comment-matrix');
 const results=await page.evaluate(async()=>{
  const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
  const samples={html:'<!-- before --><p>Alpha</p><!-- multiline one\nmultiline two --><p>Omega</p><!-- after -->',markdown:'<!-- before -->\n\nAlpha\n\n<!-- multiline one\nmultiline two -->\n\nOmega\n\n<!-- after -->',asciidoc:'// before\n\nAlpha\n\n////\nmultiline one\nmultiline two\n////\n\nOmega\n\n// after',latex:'% before\n\nAlpha\n\n% multiline one\n% multiline two\n\nOmega\n\n% after',restructuredtext:'.. before\n\nAlpha\n\n..\n   multiline one\n   multiline two\n\nOmega\n\n.. after'};
  const comments=html=>{const t=document.createElement('template');t.innerHTML=html;const w=document.createTreeWalker(t.content,NodeFilter.SHOW_COMMENT);const result=[];while(w.nextNode())result.push(w.currentNode.textContent.trim());return result.join(' ').replace(/\s+/g,' ');};
  const visible=html=>{const t=document.createElement('template');t.innerHTML=html;return t.content.textContent.replace(/[\s\u200b]+/g,'');};
  const results=[];
  for(const [from,source] of Object.entries(samples)) {
   const html=await markupToHtml(source,from,location.href);
   for(const to of Object.keys(samples)) {
    console.log('comment-check:',from,to);
    const code=htmlToMarkup(html,to);const back=await markupToHtml(code,to,location.href);
    const returned=await markupToHtml(htmlToMarkup(back,from),from,location.href);
    results.push({from,to,code,comments:comments(back),returned:comments(returned),visible:visible(back),html:back});
   }
  }
  const inline = '<p>Alpha<!-- inline -->Omega</p>';
  for(const language of Object.keys(samples)) {
   const back=await markupToHtml(htmlToMarkup(inline,language),language,location.href);
   if(visible(back)!=='AlphaOmega'||comments(back)!=='inline')throw Error(`Inline ${language}: ${back}`);
  }
  const prose = html => {const t=document.createElement('template');t.innerHTML=html;return t.content.textContent.replace(/\u200b/g,'').replace(/\s+/g,' ').trim();};
  for (const body of ['Alpha<!-- note --> Omega','Alpha <!-- note -->Omega','Alpha<!-- note -->Omega','Alpha<!-- note -->\nOmega','Alpha<!-- note --><!-- second --> Omega','Alpha<!-- note --> <em>Omega</em>']) {
   const source=`<p>${body}</p>`;
   const latex=htmlToMarkup(source,'latex');
   const back=await markupToHtml(latex,'latex',location.href);
   if(prose(back)!==prose(source)||!comments(back).includes('note'))throw Error(`HTML spacing: ${latex} → ${back}`);
   const again=await markupToHtml(htmlToMarkup(back,'latex'),'latex',location.href);
   if(prose(again)!==prose(source))throw Error(`Repeated spacing: ${again}`);
  }
  for (const [source, expected] of [
   ['Alpha% note\n Omega','AlphaOmega'],
   ['Alpha% note\n\\ Omega','Alpha Omega'],
   ['Alpha % note\nOmega','Alpha Omega']
  ]) {
   const html=await markupToHtml(source,'latex',location.href);
   const back=await markupToHtml(htmlToMarkup(html,'latex'),'latex',location.href);
   if(prose(html)!==expected||prose(back)!==expected||!comments(back).includes('note'))throw Error(`LaTeX spacing: ${source} → ${back}`);
  }
  const literalSamples = {
   markdown:'```html\n<!-- literal -->\n```\n\n<!-- real -->',
   asciidoc:'[source,javascript]\n----\n// literal\n----\n\n// real',
   latex:String.raw`\begin{lstlisting}
% literal
\end{lstlisting}
% real`,
   restructuredtext:'.. code-block:: text\n\n   .. literal\n\n.. real'
  };
  for(const [language,code] of Object.entries(literalSamples)) {
   const html=await markupToHtml(code,language,location.href);
   if(comments(html)!=='real'||!html.includes('literal'))throw Error(`Literal ${language}: ${html}`);
  }
  for(const source of [String.raw`% preamble
\usepackage{amsmath}
\begin{equation}x=1 % math comment
\end{equation}`,String.raw`\documentclass{article}
% preamble
\usepackage{amsmath}
\begin{document}
\section{A% argument comment
B}
Text.
\end{document}`]) {
   const html=await markupToHtml(source,'latex',location.href);
   if(!comments(html).includes('preamble'))throw Error(`Preamble: ${html}`);
   if(source.includes('math comment')&&!comments(html).includes('math comment'))throw Error(`Math: ${html}`);
   if(source.includes('argument comment')&&!comments(html).includes('argument comment'))throw Error(`Argument: ${html}`);
  }
  const structured=String.raw`\begin{itemize}
% list comment
\item First
\item Second
\end{itemize}
\begin{tabular}{ll}
A & B \\ % table comment
C & D
\end{tabular}`;
  const structuredHtml=await markupToHtml(structured,'latex',location.href);
  if(!comments(structuredHtml).includes('list comment')||!comments(structuredHtml).includes('table comment'))throw Error(structuredHtml);
  const structuredRoot=document.createElement('template');structuredRoot.innerHTML=structuredHtml;
  if(structuredRoot.content.querySelectorAll('li').length!==2||structuredRoot.content.querySelectorAll('td').length!==4)throw Error(structuredHtml);
  return results;
 });
 for(const r of results) {
  assert.equal(r.comments,'before multiline one multiline two after',JSON.stringify(r));
  assert.equal(r.returned,'before multiline one multiline two after',JSON.stringify(r));
  assert.equal(r.visible,'AlphaOmega',JSON.stringify(r));
  assert.ok(!r.code.includes('tp-conversion-comment'),JSON.stringify(r));
 }
 console.log('25 comment conversions and reverse conversions, inline comments, literal blocks, LaTeX preamble, arguments and mathematics passed.');
}finally{await browser.close();}
