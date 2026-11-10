/** Insert the programmed Basic usage counterpart after Basic usage in every example language. */
import {existsSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {javascriptExample} from './component-javascript-examples.mjs';
import {exampleFile, namedExamples, viewerSource, markupExample} from './component-basic-examples.mjs';
import {latexMarkup} from '../src/utilities/latex-markup.js';
export function syncJavascriptExamples(check=false) {
 const root=resolve(import.meta.dirname,'..');
 const components=join(root,'src/components');
 const modules=new Map();
 for(const name of readdirSync(components)) {
  const path=join(components,name,`${name}.json`);
  if(existsSync(path)) {const api=JSON.parse(readFileSync(path,'utf8'));if(api.tagname)modules.set(api.tagname,name);}
 }
 let count=0;
 const save=(path,text)=>{if(readFileSync(path,'utf8')===text)return;if(check)throw Error(`Stale Javascript API example: ${path}`);writeFileSync(path,text);};
 for(const name of readdirSync(join(root,'public/docs/components')).sort()) {
  const folder=join(root,'public/docs/components',name,'examples');
  if(!existsSync(join(folder,'examples.html')))continue;
  const html=namedExamples('html',viewerSource('html',readFileSync(join(folder,'examples.html'),'utf8')));
  if(html[0]?.label!=='Basic usage')throw Error(`Missing Basic usage: ${name}`);
  const source=javascriptExample(html[0].source,modules);
  for(const extension of ['html','md','adoc','rst']) {
   const path=join(folder,`examples.${extension}`);
   const examples=namedExamples(extension,viewerSource(extension,readFileSync(path,'utf8'))).filter(e=>e.label!=='Javascript API');
   examples.splice(1,0,{label:'Javascript API',source:extension==='html'?source:markupExample(extension,source)});
   save(path,exampleFile(extension,`tp-${name}`,examples));
  }
  // Preserve manually authored LaTeX demonstrations, including their package declarations.
  const texPath=join(folder,'examples.tex');
  const blocks=readFileSync(texPath,'utf8').split(/(?=^% !tp-example )/m).filter(s=>s.trim()).filter(s=>!s.startsWith('% !tp-example Javascript API\n'));
  blocks.splice(1,0,`% !tp-example Javascript API\n\\documentclass{article}\n${name === "carousel" ? "\\usepackage{graphicx}\n" : ""}\\begin{document}\n${latexMarkup(source)}\n\\end{document}\n\n`);
  save(texPath,blocks.map(block=>block.trim()).join('\n\n')+'\n');
  count++;
 }
 console.log(`${check?'Checked':'Synchronized'} Javascript API examples for ${count} components.`);
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href)syncJavascriptExamples(process.argv.includes('--check'));
