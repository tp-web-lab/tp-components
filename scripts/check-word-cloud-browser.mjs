import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1000,height:800}});
 const errors=[];
 page.on('pageerror',error=>{ errors.push(error.message); console.error(error.message); });
 await page.goto(`${process.env.TP_WORD_CLOUD_TEST_URL ?? 'http://127.0.0.1:4197'}/docs/components/word-cloud/examples/introduction.html`);
 await page.evaluate(() => import('/src/components/word-cloud/word-cloud.ts'));
 await page.waitForSelector('tp-word-cloud[data-cloud-ready]');
 await page.waitForSelector('svg[data-word-cloud] [data-word-cloud-icon] tp-icon svg');
 const iconBox=await page.locator('svg[data-word-cloud] [data-word-cloud-icon] tp-icon').boundingBox();
 assert.ok(iconBox.width>0 && iconBox.height>0);
 // The icon must stay inside its foreignObject even with surrounding typography.
 for (const width of [320, 800]) {
  await page.locator('tp-word-cloud').evaluate((el,w)=>{ el.style.width=`${w}px`; el.style.fontSize='48px'; el.style.lineHeight='3'; },width);
  for (const scale of ['0.5','2']) {
   for (const rotation of ['0','45','90']) {
    await page.locator('tp-word-cloud').evaluate((el,options)=>{
     el.setAttribute('scale',options.scale); el.setAttribute('rotate',options.rotation);
     el.querySelector('ol').innerHTML='<li>Word, <tp-icon name="logo-tp"></tp-icon></li>';
    },{scale,rotation});
    await page.waitForTimeout(100);
    await page.waitForSelector('svg[data-word-cloud] tp-icon svg');
    const aligned=await page.locator('svg[data-word-cloud] foreignObject').evaluate(el=>{
     const cell=el.getBoundingClientRect(), icon=el.querySelector('tp-icon svg').getBoundingClientRect();
     return ['x','y','width','height'].every(key=>Math.abs(cell[key]-icon[key])<1);
    });
    assert.ok(aligned,`Icon clipped at width=${width}, scale=${scale}, rotation=${rotation}`);
   }
  }
 }
 await page.locator('tp-word-cloud').evaluate(el=>{el.style.fontSize='';el.style.lineHeight='';el.setAttribute('scale','1');});
 const geometry=await page.evaluate(async()=> {
  const {insideCloud,fitsCloud}=await import('/src/components/word-cloud/word-cloud.ts');
  const cloud=document.querySelector('tp-word-cloud');
  const wait=()=>new Promise(resolve=>setTimeout(resolve,100));
  const checks=[];
  cloud.style.width='600px';
  cloud.querySelector('ol').innerHTML='<li>Explore, Discover</li><li>Learn, Create, Share</li><li>Ideas, Science, Nature, Art, Design, Research, Knowledge, People, Planet, Future</li>';
  for(const shape of ['circle','triangle','square','pentagon','hexagon','cloud','heart','puzzle']) {
   cloud.setAttribute('shape',shape); cloud.setAttribute('rotate','35'); cloud.setAttribute('bg-color','blue');
   await wait();
   const svg=cloud.querySelector('svg');
   const boxes=[...svg.querySelectorAll('text')].map(node=> {
    const b=node.getBBox(), m=node.transform.baseVal.consolidate().matrix;
    const corners=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));
    return {inside:corners.every(p=>insideCloud(p.x,p.y,shape)),left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))};
   });
   const background=svg.querySelector('[data-word-cloud-background]');
   const expectedTag=shape==='circle'?'circle':shape==='square'?'rect':'polygon';
   if(background?.localName!==expectedTag || svg.firstElementChild!==background) throw Error('Incorrect background: '+shape);
   if(['triangle','pentagon','hexagon'].includes(shape) && background.points.numberOfItems!==({triangle:3,pentagon:5,hexagon:6}[shape])) throw Error('Incorrect polygon');
   checks.push({shape,count:boxes.length,inside:boxes.every(b=>b.inside),overlap:boxes.some((a,i)=>boxes.slice(i+1).some(b=>a.left<b.right && a.right>b.left && a.top<b.bottom && a.bottom>b.top))});
  }
    // A rectangle can have all corners inside the heart while crossing its top notch.
  if(![-1,1].every(dx=>[-1,1].every(dy=>insideCloud(dx*65,-105+dy*12,'heart')))) throw Error('Invalid notch fixture');
  if(fitsCloud(0,-105,130,24,'heart')) throw Error('Heart notch crossed');
  return checks;
 });
 for(const result of geometry) { assert.equal(result.count,15); assert.equal(result.inside,true,result.shape); assert.equal(result.overlap,false,result.shape); }
 await page.setViewportSize({width:420,height:700});
 await page.locator('tp-word-cloud').evaluate(el=>el.style.width='100%');
 await page.waitForTimeout(100);
 const bounds=await page.locator('tp-word-cloud svg').boundingBox();
 assert.ok(bounds.width<=420 && Math.abs(bounds.width-bounds.height)<1);
 const lifecycle=await page.evaluate(async()=> {
  const cloud=document.querySelector('tp-word-cloud');
  const wait=()=>new Promise(resolve=>setTimeout(resolve,100));
  cloud.setAttribute('shape','square'); cloud.setAttribute('rotate','0'); cloud.setAttribute('scale','0.5');
  cloud.querySelector('ol').innerHTML='<li>One, Two</li><li>Three</li>';
  await wait();
  const texts=()=>[...cloud.querySelectorAll('text')];
  const sizes=texts().map(n=>Number(n.getAttribute('font-size')));
  cloud.setAttribute('scale','1'); cloud.setAttribute('color','purple'); await wait();
  const doubled=Number(texts()[0].getAttribute('font-size'))===sizes[0]*2;
  const fills=texts().map(n=>getComputedStyle(n).fill);
  const palette=cloud.querySelector('svg').classList.contains('tp-purple');
  cloud.querySelector('li').firstChild.data='Changed, Two'; await wait();
  const changed=texts()[0].textContent==='Changed';
  const markup=cloud.querySelector('svg').outerHTML;
  cloud.remove(); document.body.append(cloud); await wait();
  const reconnect=cloud.querySelectorAll('svg').length===1 && cloud.querySelector('svg').outerHTML===markup;
  cloud.setAttribute('scale','NaN'); cloud.setAttribute('rotate','Infinity'); await wait();
  const valid=!cloud.querySelector('svg').outerHTML.match(/NaN|Infinity/);
  cloud.querySelector('ol').innerHTML='<li>'+Array(501).fill('Word').join(',')+'</li>'; await wait();
  const fallback=!cloud.hasAttribute('data-cloud-ready') && !cloud.querySelector('svg');
  cloud.querySelector('ol').innerHTML='<li>Restored</li>'; await wait();
  const restored=cloud.hasAttribute('data-cloud-ready');
  return {sizes,doubled,palette,fills,changed,reconnect,valid,fallback,restored};
 });
 assert.equal(lifecycle.sizes[0],lifecycle.sizes[1]); assert.ok(lifecycle.sizes[1]>lifecycle.sizes[2]);
 for(const key of ['doubled','palette','changed','reconnect','valid','fallback','restored']) assert.equal(lifecycle[key],true,key);
 assert.ok(new Set(lifecycle.fills).size>1);
 const emptyRanks = await page.evaluate(async()=> {
  const cloud=document.querySelector('tp-word-cloud');
  const wait=()=>new Promise(resolve=>setTimeout(resolve,100));
  cloud.setAttribute('scale','0.5'); cloud.setAttribute('rotate','0');
  cloud.querySelector('ol').innerHTML='<li>First</li><li>Second, Peer</li><li>Last</li>';
  await wait();
  const sizes=()=>[...cloud.querySelectorAll('text')].map(node=>Number(node.getAttribute('font-size')));
  const before=sizes();
  const empty=document.createElement('li'); empty.textContent='   ';
  cloud.querySelector('ol').insertBefore(empty,cloud.querySelectorAll('li')[1]);
  await wait(); const after=sizes();
  empty.remove(); await wait();
  return {before,after,restored:sizes(), count:cloud.querySelectorAll('text').length};
 });
 assert.equal(emptyRanks.count,4);
 assert.equal(emptyRanks.before[0],emptyRanks.after[0]);
 assert.equal(emptyRanks.after[1],emptyRanks.after[2]);
 assert.ok(emptyRanks.after[1]<emptyRanks.before[1]);
 assert.ok(emptyRanks.after[3]<emptyRanks.before[3]);
 assert.deepEqual(emptyRanks.restored,emptyRanks.before);
 const backgrounds = await page.evaluate(async()=> {
  const cloud=document.querySelector('tp-word-cloud');
  const wait=()=>new Promise(resolve=>setTimeout(resolve,100));
  const bg=()=>cloud.querySelector('[data-word-cloud-background]');
  cloud.setAttribute('bg-color','blue'); await wait();
  const blue=getComputedStyle(bg()).fill;
  const wordFill=getComputedStyle(cloud.querySelector('text')).fill;
  cloud.setAttribute('bg-color','rose'); await wait();
  const independent=blue!==getComputedStyle(bg()).fill && wordFill===getComputedStyle(cloud.querySelector('text')).fill;
  cloud.setAttribute('bg-color',''); await wait();
  const transparent=!bg();
  const defaults=[];
  for(const value of [null,'invalid']) {
   for(const attribute of ['bg-color','color']) {
    if(value===null) cloud.removeAttribute(attribute); else cloud.setAttribute(attribute,value);
   }
   await wait();
   defaults.push(bg()?.classList.contains('tp-glaz') && cloud.querySelector('svg').classList.contains('tp-glaz'));
  }
  cloud.setAttribute('bg-color','teal');
  const englishOnly=[];
  for(const value of ['cercle','carré','carre','pentagone','hexagone']) {
   cloud.setAttribute('shape',value); await wait(); englishOnly.push(bg()?.localName==='circle');
  }
  return {independent,transparent,defaults,englishOnly};
 });
 assert.equal(backgrounds.independent,true);
 assert.equal(backgrounds.transparent,true);
 assert.ok(backgrounds.defaults.every(Boolean));
 assert.ok(backgrounds.englishOnly.every(Boolean));
 const icons = await page.evaluate(async()=> {
  const cloud=document.querySelector('tp-word-cloud');
  const wait=()=>new Promise(resolve=>setTimeout(resolve,200));
  cloud.setAttribute('rotate','90');
  cloud.querySelector('ol').innerHTML='<li>Alpha, <tp-icon name="logo-tp" aria-label="tp logo"></tp-icon>, Beta</li><li></li><li><tp-icon name="logo-tp"></tp-icon>, Gamma</li>';
  await wait();
  const rendered=()=>cloud.querySelector('svg[data-word-cloud]');
  const groups=[...rendered().querySelectorAll('[data-word-cloud-icon]')];
  const text=[...rendered().querySelectorAll(':scope > text')].map(n=>n.textContent);
  const sizes=groups.map(n=>Number(n.querySelector('foreignObject').getAttribute('width')));
  const sameSize=sizes[0]===Number(rendered().querySelector(':scope > text').getAttribute('font-size'));
  const loaded=groups.every(n=>n.querySelector('tp-icon svg'));
  const vertical=groups[0].getAttribute('transform').includes('rotate(90)');
  const boxes=[...rendered().children].filter(n=>n.matches('text, [data-word-cloud-icon]')).map(n=>n.getBoundingClientRect());
  const noOverlap=!boxes.some((a,i)=>boxes.slice(i+1).some(b=>a.left<b.right && a.right>b.left && a.top<b.bottom && a.bottom>b.top));
  const first=cloud.querySelector('ol tp-icon');
  first.setAttribute('name','heart'); await wait();
  const changed=rendered().querySelector('tp-icon').getAttribute('name')==='heart';
  first.setAttribute('name','missing-test-icon'); first.setAttribute('fallback','?'); await wait();
  const fallback=rendered().querySelector('tp-icon [data-tp-icon-fallback]')?.textContent==='?';
  first.remove(); await wait();
  const removed=rendered().querySelectorAll('[data-word-cloud-icon]').length===1;
  return {text,sizes,sameSize,loaded,vertical,noOverlap,changed,fallback,removed};
 });
 assert.deepEqual(icons.text,['Alpha','Beta','Gamma']);
 assert.ok(icons.sizes[0]>icons.sizes[1]);
 for(const key of ['sameSize','loaded','vertical','noOverlap','changed','fallback','removed']) assert.equal(icons[key],true,key);
 assert.deepEqual(errors,[]);
 console.log('Passed: eight silhouettes, no overlaps, equal/decreasing sizes, palette levels, scale, rotation, source mutations, reconnect, invalid values and overflow recovery.');
} finally { await browser.close(); }
