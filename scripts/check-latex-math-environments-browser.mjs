/** Verify native math conversions and actual MathJax SVG output. */
import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.goto((process.env.TP_TEST_BASE_URL || 'http://127.0.0.1:4173')+'/scripts/fixtures/converter-presentation-next-audit.html');
 const results=await page.evaluate(async()=>{
  const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
  const {TpMath}=await import('/src/components/math/math.ts');
  const cases={
   math:String.raw`Inline \begin{math}x^2+1\end{math} expression.`,
   displaymath:String.raw`\begin{displaymath}\begin{pmatrix}1&2\\3&4\end{pmatrix}\end{displaymath}`,
   eqnarray:String.raw`\begin{eqnarray}a&=&b\label{a}\\c&=&d\nonumber\\e&=&f\label{e}\end{eqnarray}See \eqref{a} and \ref{e}.`,
   'eqnarray*':String.raw`\begin{eqnarray*}a&=&b\\c&=&d\end{eqnarray*}`,
  };
  cases.documentation=await fetch('/docs/components/markup-converter/examples/comparison-core-math-environments.tex').then(response=>{if(!response.ok)throw Error('Missing documentation source');return response.text();});
  const signature=html=>{const host=document.createElement('div');host.innerHTML=html;return {links:[...host.querySelectorAll('a[href^="#"]')].map(n=>[n.textContent,Boolean(host.querySelector(`[id="${n.getAttribute('href').slice(1)}"]`))]),math:[...host.querySelectorAll('tp-math')].map(n=>[n.hasAttribute('displaystyle'),(n.getAttribute('value')||n.textContent).replace(/\s+/g,'')])};};
  const render=async html=>{const host=document.createElement('div');host.innerHTML=html;await TpMath.prepare(host);const formulas=[...host.querySelectorAll('tp-math')];return {pass:formulas.length>0&&formulas.every(n=>n.querySelector('svg')&&!n.querySelector('[data-mml-node="merror"],merror,tp-callout')),html:host.innerHTML};};
  const results=[];
  for(const [name,source] of Object.entries(cases)) {
   const original=await markupToHtml(source,'latex',location.href),expected=signature(original);
   const rendered=await render(original);
   results.push({name,stage:'MathJax source',pass:rendered.pass,...rendered.pass?{}:{html:rendered.html}});
   for(const language of ['html','markdown','asciidoc','restructuredtext']) {
    let code='',backCode='';
    try {
     code=htmlToMarkup(original,language);
     const html=await markupToHtml(code,language,location.href);
     backCode=htmlToMarkup(html,'latex');
     const back=await markupToHtml(backCode,'latex',location.href);
     const a=await render(html),b=await render(back);
     const pass=JSON.stringify(signature(html))===JSON.stringify(expected)&&JSON.stringify(signature(back))===JSON.stringify(expected)&&a.pass&&b.pass;
     results.push({name,language,pass,code,backCode,...pass?{}:{original,html,back,rendered:a,backRendered:b}});
    }catch(e){results.push({name,language,pass:false,error:String(e),code,backCode});}
   }
  }
  return results;
 });
 if(process.env.TP_MATH_ENVIRONMENT_REPORT)writeFileSync(process.env.TP_MATH_ENVIRONMENT_REPORT,JSON.stringify(results,null,2));
 console.log(`${results.filter(r=>r.pass).length}/${results.length} checks passed`);
 console.log(results.filter(r=>!r.pass).map(({name,language,stage,error})=>({name,language,stage,error})));
 process.exitCode=results.some(r=>!r.pass)?1:0;
}finally{await browser.close();}
