import {chromium,firefox} from '@playwright/test';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync} from 'node:fs';
import {extname,resolve} from 'node:path';
const name=process.env.BROWSER||'chrome';
const root=resolve('dist');
const server=createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(path==='/fixture'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><body></body>');return;}
 const file=resolve(root,'.'+path);
 if(!file.startsWith(root+'/')){res.writeHead(403).end();return;}
 try{res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.json':'application/json','.wasm':'application/wasm','.css':'text/css','.svg':'image/svg+xml'})[extname(file)]||'text/plain');res.end(readFileSync(file));}catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
const driver=process.env.SAFARI_DRIVER_URL||'http://127.0.0.1:4445';
async function command(path,data,method='POST'){
 const r=await fetch(driver+path,{method,headers:{'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(180000)});const j=await r.json();if(j.value?.error)throw Error(JSON.stringify(j.value));return j.value;
}
let browser,page,session,version;
async function evaluate(fn,arg){
 if(page)return page.evaluate(fn,arg);
 const r=await command('/session/'+session+'/execute/async',{script:`const done=arguments[arguments.length-1];Promise.resolve((${fn.toString()})(arguments[0])).then(result=>done({result}),e=>done({error:String(e.stack||e)}));`,args:[arg]});if(r.error)throw Error(r.error);return r.result;
}
const report={browser:name,checkedAt:new Date().toISOString(),checks:[]};
const samples=Object.fromEntries(Object.entries({python:'py',javascript:'js',typescript:'ts',scheme:'scm',ocaml:'ml'}).map(([language,extension])=>{
 const folder=`public/docs/components/${language}-tracer/examples`;
 const source=readFileSync(`${folder}/nested-calls.${extension}`,'utf8').trimEnd();
 const html=readFileSync(`${folder}/examples.html`,'utf8');
 const query=html.match(/nested-calls\.[^" ]+" query="([^"]+)"/)[1];
 return [language,[source,query]];
}));
try{
 if(name==='safari'){const r=await command('/session',{capabilities:{alwaysMatch:{browserName:'safari'}}});session=r.sessionId;version=r.capabilities.browserVersion;await command('/session/'+session+'/timeouts',{script:120000,pageLoad:60000});}
 else{browser=await(name==='firefox'?firefox:chromium).launch(name==='chrome'?{channel:'chrome'}:{});version=browser.version();page=await browser.newPage({viewport:{width:1440,height:1000}});}
 report.version=version;
 for(const [language,[source,query]] of Object.entries(samples)){
  const begin=performance.now();let row={language};
  try{
   if(page)await page.goto(base+'/fixture');else await command('/session/'+session+'/url',{url:base+'/fixture'});
   Object.assign(row,await evaluate(async ({language,source,query})=>{
    const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
    const until=async f=>{const end=Date.now()+90000;while(!f()){if(Date.now()>end)throw Error('Timeout');await new Promise(r=>setTimeout(r,50));}};
    await import(`/components/${language}-tracer/${language}-tracer.js`);
    const t=document.createElement(`tp-${language}-tracer`);t.src=`/docs/components/${language}-tracer/examples/nested-calls.${({python:'py',javascript:'js',typescript:'ts',scheme:'scm',ocaml:'ml'})[language]}`;t.query=query;document.body.append(t);await t.refresh();t.record();
    await until(()=>JSON.parse(t.getCode()).trace.length>0);
    const saved=t.getCode(),data=JSON.parse(saved),steps=data.trace;
    assert(steps.at(-1).stdout.trim()==='24','Wrong result '+steps.at(-1).stdout);
    assert(!steps.some(s=>s.exception_msg),'Recorder error');
    const frames=s=>(s.stack_to_render||[]).filter(f=>!f.is_zombie&&f.frame_id!==undefined&&!/^(scope-|closure-)/.test(String(f.frame_id)));
    const active=s=>frames(s).find(f=>f.is_highlighted)||frames(s).at(-1);
    const pos=()=>Number(t.querySelector('[data-role=status]').textContent.match(/Step (\d+)/)[1])-1;
    const call=steps.findIndex(s=>s.event==='call'&&frames(s).length>=2);
    assert(call>=0,'Missing recursive call');
    const id=active(steps[call]).frame_id;
    for(const [method,role] of [['stepOver','over'],['stepOut','out']]){
     t.goTo(call);t[method]();const destination=pos();
     assert(destination>call+1,'No semantic jump');
     assert(!frames(steps[destination]).some(f=>f.frame_id===id),'Did not return to caller');
     t.goTo(call);t.querySelector(`[data-role=${role}]`).click();assert(pos()===destination,'Button/method mismatch');
     t.previousStep();assert(pos()===destination-1,'Skipped step lost');
    }
    t.firstStep();t.startQuery();const queryIndex=pos(),offset=source.trimEnd().length+2;
    assert(queryIndex>0 && (steps[queryIndex].source_range?.start>=offset || steps[queryIndex].line>=source.split('\n').length+2),'Wrong query boundary');
    t.firstStep();t.querySelector('[data-role=query]').click();assert(pos()===queryIndex,'Query button mismatch');
    t.previousStep();assert(pos()===queryIndex-1,'Initialization lost');
    assert(t.getCode()===saved,'Navigation modified recording');
    let tailContinuation;
    if(language==='scheme'){
     const tail=document.createElement('tp-scheme-tracer');tail.value='(define (walk n total) (if (= n 0) total (walk (- n 1) (+ total n))))';tail.query='(display (walk 4 0))';document.body.append(tail);await tail.refresh();tail.record();
     await until(()=>JSON.parse(tail.getCode()).trace.length>0);
     const recording=tail.getCode(),a=JSON.parse(recording).trace;
     const begin=a.findIndex(s=>s.event==='call'&&active(s));
     const group=active(a[begin]).continuation_id;
     const next=a.findIndex((s,i)=>i>begin&&s.event==='call'&&active(s)?.continuation_id===group&&active(s)?.frame_id!==active(a[begin]).frame_id);
     assert(next>begin,'Missing tail-call continuation');tail.goTo(begin);tail.stepOut();
     const destination=Number(tail.querySelector('[data-role=status]').textContent.match(/Step (\d+)/)[1])-1;
     assert(destination>next&&!frames(a[destination]).some(f=>f.continuation_id===group),'Stopped inside tail continuation');
     assert(a.at(-1).stdout.trim()==='10'&&tail.getCode()===recording,'Tail trace changed');tail.remove();tailContinuation=true;
    }
    // Replaying must never construct a Worker, and must retain query navigation.
    window.Worker=class {constructor(){throw Error('Replay started a Worker');}};
    const url=URL.createObjectURL(new Blob([saved],{type:'application/json'}));t.trace=url;await t.refresh();t.startQuery();assert(pos()===queryIndex,'Replay query mismatch');assert(t.getCode()===saved,'Replay changed recording');URL.revokeObjectURL(url);
    for(const theme of ['light','dark']){
     t.setAttribute('theme',theme);t.goTo(call);
     for(const role of ['over','out','query']){const b=t.querySelector(`[data-role=${role}]`);assert(b.getBoundingClientRect().width>0,'Invisible '+role);await until(()=>b.querySelector('svg'));}
    }
    return {passed:true,...(tailContinuation?{tailContinuation:true}:{}),steps:steps.length,recursiveCall:call,queryIndex,buttons:true,replay:true,unchanged:true,lightDark:true};
   },{language,source,query}));
  }catch(e){row.passed=false;row.error=String(e.stack||e);}
  row.milliseconds=Math.round(performance.now()-begin);report.checks.push(row);console.log(language,row);
  writeFileSync(`config/tracer-semantic-navigation-${name}.json`,JSON.stringify(report,null,2)+'\n');
 }
}finally{if(browser)await browser.close();if(session)await command('/session/'+session,undefined,'DELETE').catch(()=>{});server.closeAllConnections();server.close();}
if(report.checks.some(r=>!r.passed))process.exitCode=1;
