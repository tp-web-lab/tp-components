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
 const stale=[];
 const save=(path,text)=>{if(readFileSync(path,'utf8')===text)return;stale.push(path);if(!check)writeFileSync(path,text);};
 for(const name of readdirSync(join(root,'public/docs/components')).sort()) {
  const folder=join(root,'public/docs/components',name,'examples');
  if(!existsSync(join(folder,'examples.html')))continue;
  const html=namedExamples('html',viewerSource('html',readFileSync(join(folder,'examples.html'),'utf8')));
  if(html[0]?.label!=='Basic usage')throw Error(`Missing Basic usage: ${name}`);
  const introduction=readFileSync(join(folder,'introduction.html'),'utf8').trim();
  const source=javascriptExample(introduction,modules);
  for(const extension of ['html','md','adoc','rst']) {
   const path=join(folder,`examples.${extension}`);
   const current=namedExamples(extension,viewerSource(extension,readFileSync(path,'utf8')));
   const expected=extension==='html'?source:markupExample(extension,source);
   // Compare source, not the viewer's incidental attribute order or formatting.
   if(current.find(e=>e.label==='Javascript API')?.source===expected && current.filter(e=>e.label==='Javascript API').length===1) continue;
   const index=current.findIndex(e=>e.label==='Javascript API');
   const examples=current.filter(e=>e.label!=='Javascript API');
   examples.splice(index < 0 ? 1 : index,0,{label:'Javascript API',source:expected});
   save(path,exampleFile(extension,`tp-${name}`,examples));
  }
  // Preserve manually authored LaTeX demonstrations, including their package declarations.
  const texPath=join(folder,'examples.tex');
  const tex=readFileSync(texPath,'utf8');
  const currentBlocks=tex.split(/(?=^% !tp-example )/m).filter(s=>s.trim());
  const expected=`% !tp-example Javascript API\n\\documentclass{article}\n${name === "carousel" ? "\\usepackage{graphicx}\n" : ""}\\begin{document}\n${latexMarkup(source)}\n\\end{document}`;
  if(currentBlocks.find(s=>s.startsWith('% !tp-example Javascript API\n'))?.trim()!==expected || currentBlocks.filter(s=>s.startsWith('% !tp-example Javascript API\n')).length!==1) {
   const index=currentBlocks.findIndex(s=>s.startsWith('% !tp-example Javascript API\n'));
   const blocks=currentBlocks.filter(s=>!s.startsWith('% !tp-example Javascript API\n'));
   blocks.splice(index < 0 ? 1 : index,0,expected+'\n\n');
   save(texPath,blocks.map(block=>block.trim()).join('\n\n')+'\n');
  }
  count++;
 }
 if(!count)throw Error('No Javascript API examples found');
 console.log(`${check?'Checked':'Synchronized'} ${count * 5} Javascript API examples for ${count} components.`);
 if(check && stale.length)throw Error(`Stale Javascript API examples:\n${stale.join('\n')}`);
 return {count,stale};
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href)syncJavascriptExamples(process.argv.includes('--check'));
