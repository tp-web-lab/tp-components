import {chromium} from '@playwright/test';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch();try{
const page=await browser.newPage();await page.goto((process.env.TP_TEST_BASE_URL||'http://127.0.0.1:4173')+'/scripts/fixtures/converter-presentation-next-audit.html');
const results=await page.evaluate(async()=>{
 const {markupToHtml,htmlToMarkup}=await import('/src/utilities/markup-conversion.ts');
 const {indexSignature}=await import('/src/utilities/markup-index-checks.ts');
 const response=await fetch('/docs/components/markup-converter/examples/comparison-imakeidx.tex');if(!response.ok)throw Error('Missing index demo');
 const cases={documentation:await response.text(),empty:String.raw`\usepackage{imakeidx}\makeindex\printindex`,forward:String.raw`\usepackage{imakeidx}\makeindex[intoc]\tableofcontents\printindex A\index{a}. B\index{b|see{a}}.`};
 cases.components={language:"html",source:await fetch("/docs/components/index/examples/introduction.html").then(r=>r.text())};
 const results=[];
 for(const [name,source] of Object.entries(cases)){
  const before=await markupToHtml(typeof source === 'string' ? source : source.source,typeof source === 'string' ? 'latex' : source.language,location.href),signature=indexSignature(before);
  for(const language of ['html','markdown','asciidoc','restructuredtext']){let code='',backCode='';try{
   code=htmlToMarkup(before,language);const html=await markupToHtml(code,language,location.href);
   backCode=htmlToMarkup(html,'latex');const back=await markupToHtml(backCode,'latex',location.href);
   const actual=indexSignature(html),returned=indexSignature(back);
   const pass=JSON.stringify(signature)===JSON.stringify(actual)&&JSON.stringify(signature)===JSON.stringify(returned)&&!html.includes('system-message')&&!/\\wc(?:Section|Ul|Li)/.test(backCode);
   results.push({name,language,pass,...pass?{}:{signature,actual,returned,code,backCode}});
  }catch(e){results.push({name,language,pass:false,error:String(e),code,backCode});}}
 }
 return results;
});if(process.env.TP_INDEX_REPORT)writeFileSync(process.env.TP_INDEX_REPORT,JSON.stringify(results,null,2));console.log(`${results.filter(r=>r.pass).length}/${results.length} index round trips passed`);console.log(results.filter(r=>!r.pass));process.exitCode=results.some(r=>!r.pass)?1:0;
}finally{await browser.close();}
